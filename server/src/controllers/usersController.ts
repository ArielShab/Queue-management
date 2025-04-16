import { Request, Response } from 'express';
import { UserFields } from '../types/UserFields.ts';
import { WorkingDay } from '../types/WorkingDay.ts';
import {
  addUserDayOfWorkService,
  createUserService,
  deleteUserWorkingDayService,
  getUserPersonalDataService,
  getUserWorkingDaysService,
  loginUserService,
  sendCodeToClientService,
  updateUserDataService,
  updateUserWorkingDaysService,
  verifyLoginCodeService,
} from '../services/usersService.ts';
import { Client, User } from '@prisma/client';

export const createUser = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const fieldsValues: UserFields = { ...req.body.fieldsValues };
  const workingDays: WorkingDay[] = req.body.workingDays;

  try {
    const user: User | null = await createUserService(
      fieldsValues,
      workingDays,
    );

    if (!user) {
      res.status(401).json({
        success: false,
        message: "Couldn't create user",
      });
      return;
    }

    res.status(201).json({ success: true, data: user.email });
  } catch (error: unknown) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

export const loginUser = async (req: Request, res: Response): Promise<void> => {
  const { email, isClient } = req.body;

  try {
    const response: User | Client | null = await (isClient
      ? sendCodeToClientService(email)
      : loginUserService(email));

    if (!response) {
      res.status(401).json({ success: false, message: 'Invalid email' });
      return;
    }

    res.status(201).json({
      success: true,
      data: 'Verification code sent to your email',
    });
  } catch (error: unknown) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

export const verifyLoginCode = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { email, code, isClient } = req.body;

  try {
    const token: string | null = await verifyLoginCodeService(
      email,
      code,
      isClient,
    );

    if (!token) {
      res.status(401).json({
        success: false,
        message: 'Invalid email or code',
      });
      return;
    }

    if (token === 'expired') {
      res.status(401).json({
        success: false,
        message: 'Code has expired',
      });
      return;
    }

    // Return the token and user data
    res.status(200).json({ success: true, data: token });
  } catch (error: unknown) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

export const getUserPersonalData = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { id } = req.query;

  try {
    // check if user id valid
    if (!id) {
      res.status(401).json({
        success: false,
        message: 'Invalid user id',
      });
      return;
    }

    const user: UserFields | null = await getUserPersonalDataService(
      Number(id),
    );

    if (!user) {
      res.status(401).json({
        success: false,
        message: 'Invalid user id',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error: unknown) {
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

export const getUserWorkingDays = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { id } = req.query;

  try {
    // check if user id valid
    if (!id) {
      res.status(401).json({
        success: false,
        message: 'Invalid user id',
      });
      return;
    }

    const workingDays: WorkingDay[] | null = await getUserWorkingDaysService(
      Number(id),
    );

    if (!workingDays) {
      res.status(401).json({
        success: false,
        message: "Couldn't get working days",
      });
      return;
    }

    res.status(200).json({ success: true, data: workingDays });
  } catch (error: unknown) {
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

export const updateUserData = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { id } = req.body;

  try {
    // check if user id valid
    if (!id) {
      res.status(401).json({
        success: false,
        message: 'Invalid user id',
      });
      return;
    }

    const user: UserFields | null = await updateUserDataService(
      Number(id),
      req.body,
    );

    if (!user) {
      res.status(401).json({
        success: false,
        message: "Couldn't update user",
      });
      return;
    }

    res.status(201).json({
      success: true,
      data: user,
    });
  } catch (error: unknown) {
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

export const updateUserWorkingDays = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { id, opening, closing } = req.body;

  try {
    // update user working days by working day id
    const workingDay: WorkingDay | null = await updateUserWorkingDaysService(
      Number(id),
      opening,
      closing,
    );

    if (!workingDay) {
      res.status(401).json({
        success: false,
        message: 'Could not update working day',
      });
      return;
    }

    res.status(201).json({ success: true, data: workingDay });
  } catch (error: unknown) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

export const deleteUserWorkingDay = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { id } = req.query;

  try {
    // check if user id valid
    if (!id) {
      res.status(401).json({
        success: false,
        message: 'Invalid user id',
      });
      return;
    }

    // delete user working day by working day id
    const response: string | null = await deleteUserWorkingDayService(
      Number(id),
    );

    if (!response) {
      res.status(401).json({
        success: false,
        message: 'Could not delete working day',
      });
      return;
    }

    res.status(200).json({ success: true, data: response });
  } catch (error: unknown) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

export const addUserDayOfWork = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    // add user working day
    const workingDay: WorkingDay | null = await addUserDayOfWorkService(
      req.body,
    );

    if (!workingDay) {
      res.status(401).json({
        success: false,
        message: 'Could not add working day',
      });
      return;
    }

    res.status(201).json({ success: true, data: 'Day was added !' });
  } catch (error: unknown) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};
