import { Request } from 'express';
import multer from 'multer';

type DestinationCallback = (error: Error | null, destination: string) => void;
type FileNameCallback = (error: Error | null, filename: string) => void;

const storage = multer.diskStorage({
  destination: function (
    req: Request,
    file: Express.Multer.File,
    cb: DestinationCallback
  ) {
    cb(null, 'temp/');
  },
  filename: function (
    req: Request,
    file: Express.Multer.File,
    cb: FileNameCallback
  ) {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ storage: storage });

export default upload;
