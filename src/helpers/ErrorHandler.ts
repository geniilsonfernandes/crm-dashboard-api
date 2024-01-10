import { NextFunction, Request, Response } from 'express';
import { CustomError } from './Errors';

const ErrorHandler = (
  err: CustomError,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
) => {
  const errStatus = err.statusCode || 500;
  const errMsg = err.message || 'Something went wrong';

  res.status(errStatus).json({
    status: errStatus,
    message: errMsg,
  });
};

export default ErrorHandler;
