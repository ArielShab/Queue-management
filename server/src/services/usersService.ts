import { Client, PrismaClient, User } from '@prisma/client';
import { UserFields } from '../types/UserFields.ts';
import { WorkingDay } from '../types/WorkingDay.ts';
import { generateCode } from '../utils/generateCode.ts';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { sgSendEmail } from '../utils/sgSendEmail.ts';

const prisma = new PrismaClient();

export const createUserService = async (
  fieldsValues: UserFields,
  workingDays: WorkingDay[],
): Promise<User | null> => {
  // Create a new user in the database and save the 1 time code
  const user = await prisma.user.create({
    data: fieldsValues,
  });

  if (user) {
    // Generate a 6-digit random code
    const randomCode: string = generateCode();
    const expiresAt: Date = new Date(Date.now() + 5 * 60000);

    // Generate salt and hash the code using async/await for better flow
    const salt: string = await bcrypt.genSalt(Number(process.env.SALT_ROUNDS));
    const hash: string = await bcrypt.hash(randomCode, salt);

    fieldsValues.verificationCode = hash;
    fieldsValues.codeExpiration = expiresAt;

    // send random code to client mail using sendgrid only after create user
    await sgSendEmail(fieldsValues.email, randomCode);

    // update user table with new client code and code expiration
    const updatedUser = await prisma.user.update({
      where: { email: fieldsValues.email },
      data: {
        verificationCode: hash,
        codeExpiration: expiresAt,
      },
    });

    if (updatedUser) {
      console.log('randomCode', randomCode);

      const finalWorkingDays: WorkingDay[] = workingDays.map(
        (dayObj: WorkingDay) => ({
          ...dayObj,
          userId: user.id,
        }),
      );

      // create user working days
      const workingTimes = await prisma.workingTimes.createMany({
        data: finalWorkingDays,
      });

      if (workingTimes) {
        return user;
      }
    }
  }

  return null;
};

export const loginUserService = async (email: string): Promise<User | null> => {
  // Check if the user exists
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) return null;

  // Generate a 6-digit random code
  const randomCode: string = generateCode();
  const expiresAt: Date = new Date(Date.now() + 5 * 60000);

  // Generate salt and hash the code using async/await for better flow
  const salt: string = await bcrypt.genSalt(Number(process.env.SALT_ROUNDS));
  const hash: string = await bcrypt.hash(randomCode, salt);

  // update user table with new client code and code expiration
  const updatedUser = await prisma.user.update({
    where: { email },
    data: {
      verificationCode: hash,
      codeExpiration: expiresAt,
    },
  });

  if (!updatedUser) {
    return null;
  }

  // send random code to client mail using sendgrid
  await sgSendEmail(email, randomCode);

  // Hashing successful, 'hash' contains the hashed password
  console.log('randomCode', randomCode);

  return updatedUser;
};

export const verifyLoginCodeService = async (
  email: string,
  code: string,
  client = false,
): Promise<string | null> => {
  if (client) {
    // Fetch client by client id
    const client = await prisma.client.findUnique({
      where: { clientEmail: email },
    });

    if (!client) return null;

    if (!client.verificationCode) return null;

    // check if code from client is valid
    const isCodeValid: boolean = await bcrypt.compare(
      code,
      client.verificationCode,
    );

    if (!isCodeValid) return null;

    if (!client.codeExpiration || new Date() > client.codeExpiration)
      return 'expired';

    // Generate a JWT token after successful verification
    const token: string = jwt.sign(
      { id: client.id, email: client.clientEmail },
      String(process.env.JWT_SECRET),
      {
        expiresIn: '12h',
      },
    );

    return token;
  } else {
    // Fetch user by email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) return null;

    if (!user.verificationCode) return null;

    // check if code from client is valid
    const isCodeValid: boolean = await bcrypt.compare(
      code,
      user.verificationCode,
    );

    if (!isCodeValid) return null;

    if (!user.codeExpiration || new Date() > user.codeExpiration)
      return 'expired';

    // Generate a JWT token after successful verification
    const token: string = jwt.sign(
      { id: user.id, email: user.email },
      String(process.env.JWT_SECRET),
      {
        expiresIn: '12h',
      },
    );

    return token;
  }
};

export const getUserPersonalDataService = async (
  id: number,
): Promise<UserFields | null> => {
  // get user personal data by user id
  const user = await prisma.user.findUnique({ where: { id } });

  if (!user) return null;

  return {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    phone: user.phone,
    queueDuration: user.queueDuration,
  };
};

export const getUserWorkingDaysService = async (
  id: number,
): Promise<WorkingDay[] | null> => {
  // get user working days by user id
  const workingDays = await prisma.workingTimes.findMany({
    where: { userId: id },
  });

  if (!workingDays) return null;

  return workingDays;
};

export const updateUserDataService = async (
  id: number,
  body: any,
): Promise<UserFields | null> => {
  let keyLabel: string = '';

  Object.keys(body).forEach((key) => {
    if (key !== 'id') keyLabel = key;
  });

  const user = await prisma.user.update({
    where: { id },
    data: {
      [keyLabel]: body[keyLabel],
    },
  });

  if (!user) return null;

  return {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    phone: user.phone,
    queueDuration: user.queueDuration,
  };
};

export const updateUserWorkingDaysService = async (
  id: number,
  opening: string,
  closing: string,
): Promise<WorkingDay | null> => {
  const workingDay = await prisma.workingTimes.update({
    where: {
      id,
    },
    data: {
      opening,
      closing,
    },
  });

  if (!workingDay) return null;

  return workingDay;
};

export const deleteUserWorkingDayService = async (
  id: number,
): Promise<string | null> => {
  const response = await prisma.workingTimes.delete({
    where: {
      id,
    },
  });

  if (!response) return null;

  return 'Day was deleted !';
};

export const addUserDayOfWorkService = async (
  body: WorkingDay,
): Promise<WorkingDay | null> => {
  const workingTime = await prisma.workingTimes.create({
    data: body,
  });

  if (!workingTime) return null;

  return workingTime;
};

export const sendCodeToClientService = async (
  clientEmail: string,
): Promise<Client | null> => {
  // Check if the user exists
  const client = await prisma.client.findUnique({
    where: { clientEmail },
  });

  if (!client) return null;

  // Generate a 6-digit random code
  const randomCode: string = generateCode();
  const expiresAt: Date = new Date(Date.now() + 5 * 60000);

  // Generate salt and hash the code using async/await for better flow
  const salt: string = await bcrypt.genSalt(Number(process.env.SALT_ROUNDS));
  const hash: string = await bcrypt.hash(randomCode, salt);

  // update client table with new client code and code expiration
  const updatedClient = await prisma.client.update({
    where: { clientEmail },
    data: {
      verificationCode: hash,
      codeExpiration: expiresAt,
    },
  });

  if (!updatedClient) {
    return null;
  }

  // send random code to client mail using sendgrid
  await sgSendEmail(clientEmail, randomCode);

  // Hashing successful, 'hash' contains the hashed password
  console.log('randomCode', randomCode);

  return updatedClient;
};
