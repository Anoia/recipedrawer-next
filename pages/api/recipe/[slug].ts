import { NextApiRequest, NextApiResponse } from 'next'
import { getRecipeForId, getRecipeForSlug } from '../../../utils/prisma/recipe'

export default async function handler(req:NextApiRequest, res:NextApiResponse<any>){
  const { slug:querySlug } = req.query


  if(querySlug && typeof querySlug === 'string'){
    const id = parseInt(querySlug)

    if (!Number.isNaN(id)) {
      const recipe = await getRecipeForId(id)

      if (recipe) {
        res.status(200).json(recipe)
      }else{
        res.status(404).json({ error: `recipe with id  ${id} not found` })
      }
    } else {
      const recipe = await getRecipeForSlug(querySlug)

      if (recipe) {
        res.status(200).json(recipe)
      }else {
        res.status(404).json({ error: `recipe with slug  ${querySlug} not found` })
      }
    }


  }else {
    console.log('unexpected query')
    res.status(401).json({ error: 'unknown query' })
  }

}
