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
    data: await DrugModel.find(query, {}, options).skip(offset).limit(limit),
    total: DrugsCollectionCount,
    pages: TotalPages,
    CurrentPage: CurrentPage
  }
}

export async function createProduct(input: drug) {
  return await DrugModel.create(input)
}

export async function findDrug(
  query: FilterQuery<drug>,
  options: QueryOptions = { lean: true }
) {
  return await DrugModel.findOne(query, {}, options)
}

export async function findAndUpdateDrug(
  query: FilterQuery<drug>,
  update: UpdateQuery<drug>,
  options: QueryOptions = { lean: true }
) {
  return DrugModel.findOneAndUpdate(query, update, options)
}

export async function getUniqueForms() {
  return DrugModel.distinct('forms.form').lean()
}

export async function deleteDrug(query: FilterQuery<drug>) {
  return DrugModel.deleteOne(query)
}
