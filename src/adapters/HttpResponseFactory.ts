import type { HttpError, HttpSucess } from "./IHttp.js";

export class HttpResponseFactory {
  static created<T>(data: T): HttpSucess {
    return {
      statusCode: 201,
      body: data,
    };
  }

  static ok<T>(data: T): HttpSucess {
    return {
      statusCode: 200,
      body: data,
    };
  }

  static notFound(message: string): HttpError {
    return {
      statusCode: 404,
      error: message,
    };
  }

  static badRequest<T>(message: string, details?: T): HttpError {
    return {
      statusCode: 400,
      error: message,
      details,
    };
  }

  static unauthorized(message: string): HttpError {
    return {
      statusCode: 401,
      error: message,
    };
  }

  static internalError<T>(message: string, details?: T): HttpError {
    return {
      statusCode: 500,
      error: message,
      details,
    };
  }

  static noContent(): HttpSucess {
    return {
      statusCode: 204,
    };
  }
}
