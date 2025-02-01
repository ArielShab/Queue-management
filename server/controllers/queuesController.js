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

  try {
    // fetch queue duration from db by user id
    const { queueDuration } = await prisma.user.findUnique({
      where: {
        id: +userId,
      },
      select: {
        queueDuration: true,
      },
    });

    // fetch working times of a specific day from db by user id
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

    // fetch all booked queues of specific date from db
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

    // Calculate minutes between opening and closing and return all the queues time
    let [startHour, startMinute] = opening.trim().split(":").map(Number);
    let [endHour, endMinute] = closing.trim().split(":").map(Number);

    let startInMinutes = startHour * 60 + startMinute;
    let endInMinutes = endHour * 60 + endMinute;

    const availableQueues = [];

    // separate all queues by user queue duration
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
        console.error("Salt generation error:", err);
        return res
          .status(500)
          .json({ success: false, message: "Internal server error" });
      }

      bcrypt.hash(randomCode, salt, async (err, hash) => {
        if (err) {
          console.error("Hashing error:", err);
          return res.status(500).json({
            success: false,
            message: "Internal server error",
          });
        }

        // send random code to client mail using sendgrid
        const msg = {
          to: clientEmail,
          from: "aariall73@gmail.com",
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
          // create new client
          client = await prisma.client.create({
            data: {
              clientName: req.body.clientName,
              clientEmail: req.body.clientEmail,
              verificationCode: hash,
              codeExpiration: expiresAt,
            },
          });
        } else {
          // update client queues by client id
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

        // get queue from db by time
        let queue = await prisma.queue.findFirst({
          where: {
            queueTime: modifiedTime,
            userId: req.body.userId,
          },
        });

        // check if queue exists and update it
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
          // create new queue if doesnt exist
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
    // Fetch user queue by user id
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

    // update queue is code is valid
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

  // get booked queues by user id
  try {
    const queues = await prisma.queue.findMany({
      where: {
        AND: [{ userId: +id }, { queueApproved: true }],
      },
    });

    if (!queues) {
      return res.status(401).json({
        success: false,
        message: "Could not get booked queues",
      });
    }

    // get queue's client data
    const queueDetails = await Promise.all(
      queues.map(async (queue) => {
        // get queue client data
        const client = await prisma.client.findUnique({
          where: { id: queue.clientId },
        });

        if (!client) {
          return res.status(401).json({
            success: false,
            message: "Could not get client data",
          });
        }

        // get queue service name
        const service = await prisma.service.findUnique({
          where: { id: queue.serviceId },
        });

        if (!service) {
          return res.status(401).json({
            success: false,
            message: "Could not get service data",
          });
        }

        return {
          queueTime: queue.queueTime,
          clientName: client.clientName,
          clientEmail: client.clientEmail,
          serviceName: service.serviceName,
        };
      })
    );

    const pastQueues = queueDetails.filter((queue) =>
      dayjs(queue.queueTime).isBefore(dayjs())
    );
    const futureQueues = queueDetails.filter((queue) =>
      dayjs(queue.queueTime).isAfter(dayjs())
    );

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

  // delete queue by queue id
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

export const getClientBookedQueues = async (req, res) => {
  const { id } = req.query;

  // get client queueus by client id
  try {
    const queues = await prisma.queue.findMany({
      where: {
        AND: [{ clientId: +id }, { queueApproved: true }],
      },
    });

    if (!queues) {
      return res.status(401).json({
        success: false,
        message: "Could not get booked queues",
      });
    }

    // get all queue's data
    const queueDetails = await Promise.all(
      queues.map(async (queue) => {
        // get queue user data
        const user = await prisma.user.findUnique({
          where: { id: queue.userId },
        });

        if (!user) {
          return res.status(401).json({
            success: false,
            message: "Could not get user data",
          });
        }

        // get queue service name
        const service = await prisma.service.findUnique({
          where: { id: queue.serviceId },
        });

        if (!service) {
          return res.status(401).json({
            success: false,
            message: "Could not get service data",
          });
        }

        return {
          id: queue.id,
          queueTime: queue.queueTime,
          userName: `${user.firstName} ${user.lastName}`,
          userEmail: user.email,
          serviceName: service.serviceName,
        };
      })
    );

    const pastQueues = queueDetails.filter((queue) =>
      dayjs(queue.queueTime).isBefore(dayjs())
    );
    const futureQueues = queueDetails.filter((queue) =>
      dayjs(queue.queueTime).isAfter(dayjs())
    );

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
