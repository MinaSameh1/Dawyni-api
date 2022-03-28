import { Request, Response } from 'express'
import logger from '../../utils/logger'
import { getDrugs } from './drug.service'

// exported getDrugsHandler
const getDrugsHandler = async (req: Request, res: Response) => {
  const limit = parseInt(
    typeof req.query.limit === 'string' ? req.query.limit : '15'
  )
  const offset = parseInt(
    typeof req.query.offset === 'string' ? req.query.offset : '0'
  )

  try {
    const result = await getDrugs({}, offset, limit)
    if (result.CurrentPage > result.pages) {
      return res.status(401).json({ message: 'No More Pages!' })
    }
    return res.status(200).json({
      data: result.data,
      paging: {
        total: result.total,
        page: result.CurrentPage,
        pages: result.pages
      }
    })
  } catch (e) {
    logger.error('Error in getDrugs' + e)
    return res.status(500).json({
      message: 'something went wrong'
    })
  }
}

export { getDrugsHandler }
