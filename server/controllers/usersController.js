import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import sgMail from "@sendgrid/mail";

const prisma = new PrismaClient();
const saltRounds = 10;

// set sendgrid api key
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Generate random 6-digit code
const generateCode = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

export const createUser = async (req, res) => {
  const fieldsValues = { ...req.body.fieldsValues };
  const workingDays = req.body.workingDays;

  try {
    // Generate a 6-digit random code
    const randomCode = generateCode();
    const expiresAt = new Date(Date.now() + 5 * 60000);

    // Generate salt and hash the code using async/await for better flow
    const salt = await bcrypt.genSalt(saltRounds);
    const hash = await bcrypt.hash(randomCode, salt);

    const msg = {
      to: fieldsValues.email,
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

    console.log("randomCode", randomCode);

    fieldsValues.verificationCode = hash;
    fieldsValues.codeExpiration = expiresAt;

    // Create a new user in the database
    const user = await prisma.user.create({
      data: fieldsValues,
    });

    if (user) {
      const finalWorkingDays = [];
      workingDays.forEach((dayObj) => {
        finalWorkingDays.push({ userId: user.id, ...dayObj });
      });

      // create user working days
      const workingTimes = await prisma.workingTimes.createMany({
        data: finalWorkingDays,
      });

      if (workingTimes)
        return res.status(201).json({ success: true, data: user.email });
    }

    return res
      .status(401)
      .json({ success: false, message: "Couldn't create user" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const loginUser = async (req, res) => {
  const { email } = req.body;

  // Check if the user exists
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    return res.status(401).json({ success: false, message: "Invalid email" });
  }

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
          to: email,
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
        const user = await prisma.user.update({
          where: { email },
          data: {
            verificationCode: hash,
            codeExpiration: expiresAt,
          },
        });

        if (user) {
          return res.status(201).json({
            success: true,
            data: "Verification code sent to your email",
          });
        }
      });
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const verifyLoginCode = async (req, res) => {
  const { email, code } = req.body;

  try {
    // Fetch user by email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid email or code" });
    }

    // check if code is valid
    const isCodeValid = await bcrypt.compare(code, user.verificationCode);

    if (!isCodeValid) {
      return res.status(401).json({ success: false, message: "Invalid code" });
    }

    // Check if the code is expired
    if (new Date() > user.codeExpiration) {
      return res
        .status(401)
        .json({ success: false, message: "Code has expired" });
    }

    // Generate a JWT token after successful verification
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "12h" }
    );

    // Return the token and user data
    return res.status(200).json({ success: true, data: token });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getUserPersonalData = async (req, res) => {
  const { id } = req.query;

  try {
    // get user personal data by user id
    const user = await prisma.user.findUnique({ where: { id: +id } });

    if (!user)
      return res
        .status(401)
        .json({ success: false, message: "Invalid user id" });

    return res.status(200).json({
      success: true,
      data: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        queueDuration: user.queueDuration,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getUserWorkingDays = async (req, res) => {
  const { id } = req.query;

  try {
    // get user working days by user id
    const workingDays = await prisma.workingTimes.findMany({
      where: { userId: +id },
    });

    if (!workingDays)
      return res
        .status(401)
        .json({ success: false, message: "Couldn't get working days" });

    return res.status(200).json({ success: true, data: workingDays });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const updateUserData = async (req, res) => {
  const { id } = req.body;
  let keyLabel = "";

  Object.keys(req.body).forEach((key) => {
    if (key !== "id") keyLabel = key;
  });

  // update user data by user id
  try {
    const user = await prisma.user.update({
      where: { id: +id },
      data: {
        [keyLabel]: req.body[keyLabel],
      },
    });

    if (user) {
      return res.status(201).json({
        success: true,
        data: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone,
          queueDuration: user.queueDuration,
        },
      });
    }

    return res
      .status(401)
      .json({ success: false, message: "Couldn't update user" });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const updateUserWorkingDays = async (req, res) => {
  const { id, opening, closing } = req.body;

  // update user working days by working day id
  try {
    const workingDay = await prisma.workingTimes.update({
      where: {
        id,
      },
      data: {
        opening,
        closing,
      },
    });

    if (workingDay)
      return res.status(201).json({ success: true, data: workingDay });

    return res
      .status(401)
      .json({ success: false, message: "Could not update working day" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const deleteUserWorkingDay = async (req, res) => {
  const { id } = req.query;

  // delete user working day by working day id
  try {
    const response = await prisma.workingTimes.delete({
      where: {
        id: +id,
      },
    });

    if (response)
      return res.status(200).json({ success: true, data: "Day was deleted !" });

    return res
      .status(401)
      .json({ success: false, message: "Could not delete working day" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const addUserDayOfWork = async (req, res) => {
  // add user working day
  try {
    const response = await prisma.workingTimes.create({
      data: req.body,
    });

    if (response)
      return res.status(201).json({ success: true, data: "Day was added !" });

    return res
      .status(401)
      .json({ success: false, message: "Could not add working day" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const sendCodeToClient = async (req, res) => {
  const { email } = req.body;

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
          to: email,
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
        const client = await prisma.client.update({
          where: { clientEmail: email },
          data: {
            verificationCode: hash,
            codeExpiration: expiresAt,
          },
        });

        if (client) {
          return res.status(201).json({
            success: true,
            data: "Verification code sent to your email",
          });
        }
      });
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const verifyClientLoginCode = async (req, res) => {
  const { clientEmail, verificationCode } = req.body;

  try {
    // Fetch client by client id
    const client = await prisma.client.findUnique({
      where: { clientEmail },
    });

    if (!client) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid email or code" });
    }

    // check if code is valid
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

    // Generate a JWT token after successful verification
    const token = jwt.sign(
      { id: client.id, email: clientEmail },
      process.env.JWT_SECRET,
      { expiresIn: "12h" }
    );

    return res.status(200).json({ success: true, data: token });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
