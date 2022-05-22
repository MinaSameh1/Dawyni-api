import { Request, Response } from 'express'
import logger from '../../utils/logger'
import Tesseract from 'tesseract.js'
import { searchDrugsLikeName } from '../drug/drug.service'

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
      logger.debug(text.split('\n'))
      const drugs = searchDrugsLikeName(text.split('\n'))
      if (drugs) {
        return res.status(200).json(drugs)
      }
      return res.status(404).json({ message: 'No drugs with the text found' })
    } catch (err: unknown) {
      logger.error(err)
    }
  }
  return res.status(400).json({ message: 'No image found' })
}
