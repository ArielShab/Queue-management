import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import bcrypt from "bcrypt";
import dayjs from "dayjs";
import sgMail from "@sendgrid/mail";

const saltRounds = 10;

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Generate random 6-digit code
const generateCode = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

export const getProviderQueuesByID = async (req, res) => {
  const { userId, day, date } = req.query;

  const [dateDay, month, year] = date.trim().split("/");
  const selectedDateStart = new Date(`${year}-${month}-${dateDay}`);
  const selectedDateEnd = new Date(selectedDateStart);
  selectedDateEnd.setHours(23, 59, 59, 999);
  // .toISOString()

  try {
    const { queueDuration } = await prisma.user.findUnique({
      where: {
        id: +userId,
      },
      select: {
        queueDuration: true,
      },
    });

    const workingTimes = await prisma.workingTimes.findFirst({
      where: {
        AND: [{ userId: +userId }, { day: day }],
      },
    });

    if (!workingTimes) {
      return res.status(404).json({
        success: false,
        message: "Not available queues at the specific date",
      });
    }

    // Get opening and closing hours for the selected day
    const { opening, closing } = workingTimes;

    const bookedQueues = await prisma.queue.findMany({
      where: {
        AND: [
          {
            queueTime: {
              gte: selectedDateStart,
              lte: selectedDateEnd,
            },
          },
          { queueApproved: true },
        ],
      },
    });

    // if (!opening || !closing) {
    // 	return res.status(401).json({
    // 		success: false,
    // 		message: 'Error getting opening or closing time',
    // 	});
    // }

    // Calculate minutes between opening and closing and return all the queues time
    let [startHour, startMinute] = opening.trim().split(":").map(Number);
    let [endHour, endMinute] = closing.trim().split(":").map(Number);

    let startInMinutes = startHour * 60 + startMinute;
    let endInMinutes = endHour * 60 + endMinute;

    const availableQueues = [];

    for (
      let currentMinutes = startInMinutes;
      currentMinutes < endInMinutes;
      currentMinutes += queueDuration
    ) {
      let hours = Math.floor(currentMinutes / 60);
      let minutes = currentMinutes % 60;

      let formattedTime = `${hours}:${minutes.toString().padStart(2, "0")}`;

      const bookedQueue = bookedQueues.find((queue) => {
        const formattedQueue = `${queue.queueTime.getHours()}:${queue.queueTime
          .getMinutes()
          .toString()
          .padStart(2, "0")}`;

        return formattedQueue === formattedTime;
      });

      if (!bookedQueue) availableQueues.push(formattedTime);
    }

    return res.status(200).json({ success: true, data: availableQueues });
  } catch (error) {
    console.error("error", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export const postClientQueueData = async (req, res) => {
  const { clientEmail } = req.body;
  try {
    // Generate a 6-digit random code
    const randomCode = generateCode();
    const expiresAt = new Date(Date.now() + 5 * 60000); // 5 minutes from now

    bcrypt.genSalt(saltRounds, async (err, salt) => {
      if (err) {
        console.log("Salt generation error:", err);
        return res
          .status(500)
          .json({ success: false, message: "Internal server error" });
      }

      bcrypt.hash(randomCode, salt, async (err, hash) => {
        if (err) {
          console.log("Hashing error:", err);
          return res.status(500).json({
            success: false,
            message: "Internal server error",
          });
        }

        const msg = {
          to: clientEmail, // Change to your recipient
          from: "aariall73@gmail.com", // Change to your verified sender
          subject: "Your verification code from Queue Manager",
          html: `<strong>Your verification code from Queue Manager is ${randomCode}.</strong>`,
        };
        sgMail
          .send(msg)
          .then(() => {
            console.log("Email sent");
          })
          .catch((error) => {
            console.error(error);
          });

        // Hashing successful, 'hash' contains the hashed password
        console.log("randomCode", randomCode);

        // check if client already exists
        let client = await prisma.client.findUnique({
          where: {
            clientEmail: clientEmail,
          },
        });

        if (!client) {
          client = await prisma.client.create({
            data: {
              clientName: req.body.clientName,
              clientEmail: req.body.clientEmail,
              verificationCode: hash,
              codeExpiration: expiresAt,
            },
          });
        } else {
          client = await prisma.client.update({
            where: {
              id: client.id,
            },
            data: {
              clientName: req.body.clientName,
              clientEmail: req.body.clientEmail,
              verificationCode: hash,
              codeExpiration: expiresAt,
            },
          });
        }

        // reset queue time seconds to check later the same time and date
        let modifiedTime = new Date(req.body.queueTime);
        modifiedTime.setSeconds(0);
        modifiedTime.setMilliseconds(0);
        modifiedTime = modifiedTime.toISOString();

        let queue = await prisma.queue.findFirst({
          where: {
            queueTime: modifiedTime,
            userId: req.body.userId,
          },
        });

        if (queue) {
          const newQueue = await prisma.queue.update({
            where: {
              id: queue.id,
            },
            data: {
              queueTime: modifiedTime,
              serviceId: req.body.serviceId,
              userId: req.body.userId,
              clientId: client.id,
            },
          });

          if (newQueue) {
            return res.status(201).json({
              success: true,
              data: "Verification code sent to your email",
            });
          }
        } else {
          queue = await prisma.queue.create({
            data: {
              queueTime: modifiedTime,
              serviceId: req.body.serviceId,
              userId: req.body.userId,
              clientId: client.id,
            },
          });

          if (queue) {
            return res.status(201).json({
              success: true,
              data: "Verification code sent to your email",
            });
          }
        }

        return res
          .status(401)
          .json({ success: false, message: "Could not save queue" });
      });
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export const verifyClientQueueCode = async (req, res) => {
  const { queueTime, userId, verificationCode } = req.body;

  // modify code to find the specific queue
  let modifiedTime = new Date(queueTime);
  modifiedTime.setSeconds(0);
  modifiedTime.setMilliseconds(0);
  modifiedTime = modifiedTime.toISOString();

  try {
    // Fetch user queue
    const queue = await prisma.queue.findFirst({
      where: { queueTime: modifiedTime, userId },
    });

    if (!queue) {
      return res.status(401).json({ success: false, message: "Invalid code" });
    }

    // get client of the queue to check if code valid
    const client = await prisma.client.findUnique({
      where: { id: queue.clientId },
    });

    const isCodeValid = await bcrypt.compare(
      verificationCode,
      client.verificationCode
    );

    if (!isCodeValid) {
      return res.status(401).json({ success: false, message: "Invalid code" });
    }

    // Check if the code is expired
    if (new Date() > client.codeExpiration) {
      return res
        .status(401)
        .json({ success: false, message: "Code has expired" });
    }

    const updatedQueue = await prisma.queue.update({
      where: { id: queue.id },
      data: {
        queueApproved: true,
      },
    });

    if (!updatedQueue) {
      return res
        .status(401)
        .json({ success: false, message: "Could not book queue" });
    }

    // Return the token and user data
    return res.status(200).json({ success: true, data: "Queue booked" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getBookedQueues = async (req, res) => {
  const { id } = req.query;

  try {
    const queues = await prisma.queue.findMany({
      where: {
        AND: [{ userId: +id }, { queueApproved: true }],
      },
      select: {
        id: true,
        clientId: true,
      },
    });

    if (!queues) {
      return res.status(401).json({
        success: false,
        message: "Could not get booked queues",
      });
    }

    const pastQueues = [];
    const futureQueues = [];

    queues.forEach((queue) => {
      if (dayjs(queue.queueTime).isAfter(dayjs())) futureQueues.push(queue);
      else pastQueues.push(queue);
    });

    return res
      .status(200)
      .json({ success: true, data: { pastQueues, futureQueues } });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const deleteQueueById = async (req, res) => {
  const { id } = req.query;

  try {
    const deletedQueue = await prisma.queue.delete({ where: { id: +id } });

    if (!deletedQueue) {
      return res
        .status(401)
        .json({ success: false, message: "Could not delete queue" });
    }

    return res.status(200).json({ success: true, data: deletedQueue });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export const verifyClientLoginCode = async (req, res) => {
  const { clientEmail, verificationCode } = req.body;

  try {
    // Fetch client
    const client = await prisma.client.findUnique({
      where: { clientEmail },
    });

    if (!client) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid email or code" });
    }

    const isCodeValid = await bcrypt.compare(
      verificationCode,
      client.verificationCode
    );

    if (!isCodeValid) {
      return res.status(401).json({ success: false, message: "Invalid code" });
    }

    // Check if the code is expired
    if (new Date() > client.codeExpiration) {
      return res
        .status(401)
        .json({ success: false, message: "Code has expired" });
    }

    // Fetch client queues
    const clientQueues = await prisma.queue.findMany({
      where: { AND: [{ clientId: client.id }, { queueApproved: true }] },
    });

    const pastQueues = [];
    const futureQueues = [];

    clientQueues.forEach((queue) => {
      if (dayjs(queue.queueTime).isAfter(dayjs())) futureQueues.push(queue);
      else pastQueues.push(queue);
    });

    return res
      .status(200)
      .json({ success: true, data: { pastQueues, futureQueues } });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
