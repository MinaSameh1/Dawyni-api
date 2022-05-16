import { Request, Response } from 'express'
import logger from '../../utils/logger'
import Tesseract from 'tesseract.js'
import { findDrug } from '../drug/drug.service'

/**
 * scannerPostHandler
 *
 * @param req:Request, res: Response
 */
export async function scannerPostHandler(req: Request, res: Response) {
  logger.info(req.file?.filename)
  if (req.file) {
    try {
      const { buffer } = req.file
      const {
        data: { text }
      } = await Tesseract.recognize(buffer, 'eng', {
        logger: m => logger.info(m)
      })
      // split the text and search for drugs
      const drugs = []
      logger.info(text.split('\n'))
      for (const item of text.split('\n')) {
        const drug = await findDrug({
          drug_name: { $regex: item, $options: 'i' }
        })
        if (drug) drugs.push(drug)
      }
      return res.status(200).json(drugs)
    } catch (err: unknown) {
      logger.error(err)
    }
  }
  return res.status(400).json({ message: 'No image found' })
}
