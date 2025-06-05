export default class HttpError extends Error {
  constructor(public statusCode: number, message: string) {
    super(message);
    this.name = this.constructor.name;
    //Error.captureStackTrace(this, this.constructor);
  }
}
