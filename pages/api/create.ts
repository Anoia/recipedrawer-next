import { NextApiRequest, NextApiResponse } from 'next'
import { createRecipe } from '../../utils/prisma/recipe'
import { EditableRecipe } from '../edit/[id]'

export type CreateResponseData = { id: number; name: string }

// TODO AUTH!
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<CreateResponseData>
) {
  const input = req.body as EditableRecipe

  const result = await createRecipe(input)
  res.status(200).json({ id: result.id, name: result.name })
}
