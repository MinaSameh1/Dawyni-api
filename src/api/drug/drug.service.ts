import { FilterQuery, UpdateQuery, QueryOptions } from 'mongoose'
import DrugModel, { drug } from './drug.model'

export async function getDrugs(
  query: FilterQuery<drug>,
  offset: number,
  limit: number,
  options: QueryOptions = { lean: true }
) {
  const DrugsCollectionCount = await DrugModel.count(query)
  const TotalPages = Math.ceil(DrugsCollectionCount / limit)
  const CurrentPage = Math.ceil(offset / limit)
  return {
    data: await DrugModel.find(query, {}, options)
      .skip(offset)
      .limit(limit)
      .sort({ _id: -1 }),
    total: DrugsCollectionCount,
    pages: TotalPages,
    CurrentPage: CurrentPage
  }
}

export async function createDrug(input: drug) {
  return DrugModel.create(input)
}

export async function findDrug(
  query: FilterQuery<drug>,
  options: QueryOptions = { lean: true }
) {
  // To handle _id being buffer
  const result = await DrugModel.findOne(query, {}, options)
  if (result) {
    result._id = result._id.toString()
    return result
  }
  return null
}

export async function findAndUpdateDrug(
  query: FilterQuery<drug>,
  update: UpdateQuery<drug>,
  options: QueryOptions = { lean: true, new: true }
) {
  return DrugModel.findOneAndUpdate(query, update, options)
}

export async function getUniqueForms() {
  return DrugModel.distinct('forms.form').lean()
}

export async function findAndDeleteDrug(query: FilterQuery<drug>) {
  return DrugModel.deleteOne(query)
}
