import { Request, Response, NextFunction } from 'express'
import { AnyZodObject } from 'zod'
import logger from '../utils/logger'

const validateResource =
  (schema: AnyZodObject) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      logger.debug(`Currently in validate using ${schema.shape}`)
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params
      })
      return next()
    } catch (e: any) {
      return res.status(400).send(e.errors)
    }
  }

export default validateResource
