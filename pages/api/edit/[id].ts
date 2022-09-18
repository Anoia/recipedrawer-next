// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { saveRecipe } from '../../../utils/prisma/recipe'
import { EditableRecipe } from '../../edit/[id]'

type Data = { id: number; name: string }

// TODO AUTH!
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { id: queryIdString } = req.query

  if (queryIdString && typeof queryIdString === 'string') {
    const id = parseInt(queryIdString)

    const input = req.body as EditableRecipe

    const result = await saveRecipe(id as number, input)
    res.status(200).json({ id: result.id, name: result.name })
  } else {
    console.log('unexpected query')
  }
}
