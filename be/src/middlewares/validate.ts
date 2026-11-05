import { Request, Response, NextFunction, RequestHandler } from 'express';

export interface ParseableSchema {
  parseAsync: (data: unknown) => Promise<unknown>;
}

export interface RequestValidationSchemas {
  body?: ParseableSchema;
  query?: ParseableSchema;
  params?: ParseableSchema;
}

export const validate = (schemas: RequestValidationSchemas): RequestHandler => {
  return async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    try {
      if (schemas.body) {
        req.body = await schemas.body.parseAsync(req.body);
      }
      if (schemas.query) {
        req.query = (await schemas.query.parseAsync(req.query)) as Request['query'];
      }
      if (schemas.params) {
        req.params = (await schemas.params.parseAsync(req.params)) as Request['params'];
      }
      next();
    } catch (error) {
      next(error);
    }
  };
};
