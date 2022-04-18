import { Request, Response } from 'express'
import { parseInt } from 'lodash'
import logger from '../../utils/logger'
import mongoose from 'mongoose'
import {
  getDrugs,
  getUniqueForms,
  findAndUpdateDrug,
  findAndDeleteDrug,
  findDrug
} from './drug.service'

// exported getDrugsHandler
export async function getDrugsHandler(req: Request, res: Response) {
  const limit = parseInt(
    typeof req.query.limit === 'string' ? req.query.limit : '20'
  )
  const offset = parseInt(
    typeof req.query.offset === 'string' ? req.query.offset : '20'
  )
  const page = parseInt(
    typeof req.query.page === 'string' ? req.query.page : '0'
  )

  try {
    const query: Record<string, unknown> = {}

    if (typeof req.query.form === 'string') {
      query['forms.form'] = req.query.form
    }

    if (typeof req.params.drugId === 'string') {
      if (!mongoose.Types.ObjectId.isValid(req.params.drugId)) {
        return res.status(401).json({ message: 'Bad ObjectID' })
      }
      query['_id'] = req.params.drugId
    }

    const result = await getDrugs(query, offset * page, limit)

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
    if (e == 'CastError') {
      return res.status(404).json({ message: 'object not found!' })
    }

    logger.error('Error in getDrugs' + e)
    return res.status(500).json({
      message: 'something went wrong'
    })
  }
}

export async function getFormsHandler(_: Request, res: Response) {
  const result = await getUniqueForms()
  return res.status(200).json({
    data: result
  })
}

export async function putDrugHandler(req: Request, res: Response) {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.drugId)) {
      return res.status(401).json({ message: 'Bad ObjectID' })
    }
    if (req.body === null) {
      return res.status(401).json({ message: 'nothing to update!' })
    }
    const drugId = req.params.drugId
    if (!(await findDrug({ drugId }))) {
      return res.status(404).json({ message: "Drug doesn't exist!" })
    }

    const result = findAndUpdateDrug({ drugId }, req.body)

    return res.status(200).json({
      result: result
    })
  } catch (e) {
    logger.error('Error in updateDrugHandler: ' + e)

    if (e === 'CastError') {
      return res.status(404).json({ message: 'object not found!' })
    }

    logger.error('Error in putDrugsHandler:' + e)
    return res.status(500).json({
      message: 'something went wrong serverside'
    })
  }
}

export async function patchDrugHandler(req: Request, res: Response) {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.drugId)) {
      return res.status(401).json({ message: 'Bad ObjectID' })
    }

    if (req.body === null) {
      return res.status(401).json({ message: 'No data to update with!' })
    }

    const drugId = req.params.drugId

    if (!(await findDrug({ drugId }))) {
      return res.status(404).json({ message: "Drug doesn't exist!" })
    }

    const result = await findAndUpdateDrug({ drugId }, req.body)

    return res.status(200).json({
      result: result
    })
  } catch (e) {
    logger.error('Error in updateDrugHandler: ' + e)

    if (e === 'CastError') {
      return res.status(404).json({ message: 'Drug not found!' })
    }

    logger.error('Error in updateDrugsHandler:' + e)
    return res.status(500).json({
      message: 'something went wrong serverside'
    })
  }
}

export async function deleteDrugHandler(req: Request, res: Response) {
  const drugId = req.params.drugId

  if (!(await findDrug({ drugId }))) {
    return res.status(404).json({ message: "Drug doesn't exist!" })
  }

  try {
    await findAndDeleteDrug({ drugId })
    return res.status(200).json({ message: 'Successfully deleted.' })
  } catch (e) {
    logger.error('Error in deleteDrugsHandler:' + e)

    return res.status(500).json({
      message: 'something went wrong serverside'
    })
  }
}
