export class CustomError extends Error {
  statusCode: number;
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = 500;
  }
}

export class InvalidColumnNamesError extends CustomError {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
  }
}
export class DeleteFileError extends CustomError {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class ImportError extends CustomError {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = 400;
  }
}

export class NotFoundError extends CustomError {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = 404;
  }
}

export class FormatNotSupportedError extends CustomError {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = 400;
  }
}
