import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { NextApiRequest, NextApiResponse } from 'next'
import { Database } from '../../supabasetypes'
import { createRecipe } from '../../utils/prisma/recipe'
import { EditableRecipe } from '../edit/[id]'

export type CreateResponseData =
  | { id: number; name: string }
  | { error: string }

// TODO AUTH!
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<CreateResponseData>
) {
  const supabaseServerClient = createServerSupabaseClient<Database>({
    req,
    res,
  })

  const {
    data: { user },
  } = await supabaseServerClient.auth.getUser()

  if (user) {
    const input = req.body as EditableRecipe

    const result = await createRecipe(input)
    res.status(200).json({ id: result.id, name: result.name })
  } else {
    res.status(401).json({ error: 'not authorized' })
  }
}
