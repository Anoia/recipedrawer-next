// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'
import type { NextApiRequest, NextApiResponse } from 'next'
import { Database } from '../../../supabasetypes'
import { saveRecipe } from '../../../utils/prisma/recipe'
import { EditableRecipe } from '../../edit/[id]'

type Data = { id: number; name: string } | { error: string }

// TODO AUTH!
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const supabaseServerClient = createServerSupabaseClient<Database>({
    req,
    res,
  })

  const {
    data: { user },
  } = await supabaseServerClient.auth.getUser()

  const { id: queryIdString } = req.query

  if (user && queryIdString && typeof queryIdString === 'string') {
    const id = parseInt(queryIdString)

    const input = req.body as EditableRecipe

    const result = await saveRecipe(id as number, input)
    await res.revalidate(`/recipe/${queryIdString}`)
    res.status(200).json({ id: result.id, name: result.name })
  } else {
    console.log('unexpected query or user')
    res.status(401).json({ error: 'unknown user or query' })
  }
}
