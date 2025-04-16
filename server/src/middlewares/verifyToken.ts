import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

interface AuthRequest extends Request {
  user?: string | JwtPayload;
}

function verifyToken(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): void {
  const authorization: string | undefined = req.headers['authorization'];

  if (!authorization) {
    res.status(403).send('Access denied. No token provided.');
    return;
  }

  // Remove 'Bearer ' prefix from the token
  const token: string = authorization.split(' ')[1];

  // Verify the token using the secret key
  jwt.verify(token, String(process.env.JWT_SECRET), (err, decoded) => {
    if (err) {
      return res.status(400).send('Invalid token.');
    }

    // Save decoded user data in request for later use
    req.user = decoded;

    next();
  });
}

export default verifyToken;
