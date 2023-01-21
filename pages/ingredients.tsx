import { useSupabaseClient } from '@supabase/auth-helpers-react'
import { NextPage } from 'next'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import CreateIngredient from '../components/edit/createingredient'
import { Database } from '../supabasetypes'

type ingredient = {
  id: number
  name: string
  recipe_id: number | null
  diet: string
}

const IngredientsPage: NextPage = () => {
  const supabaseTyped = useSupabaseClient<Database>()
  const [ingredients, setIngredients] = useState<Array<ingredient>>([])

  const [dialogOpen, setDialogOpen] = useState(false)

  useEffect(() => {
    const fetchIngredients = async () => {
      const { data, error } = await supabaseTyped.from('ingredient').select('*')

      if (error) console.log(JSON.stringify(error))
      if (data) setIngredients(data)
    }

    fetchIngredients()
  }, [supabaseTyped])

  return (
    <div className="container mx-auto my-12 max-w-4xl">
      <div className="flex justify-between">
        <h1 className="text-2xl my-2">Ingredients</h1>
        <button
          className="hover:bg-teal-800 focus:bg-teal-800 bg-teal-700 text-white py-3 px-12"
          onClick={() => setDialogOpen(true)}
        >
          Neue Zutat
        </button>
      </div>
      <ul>
        {ingredients.map((i) => {
          return (
            <li key={i.id}>
              <Link href={`/ingredient/${i.id}`}>
                {i.name} - {i.diet}
              </Link>
            </li>
          )
        })}
      </ul>

      <CreateIngredient
        isOpen={dialogOpen}
        input={''}
        close={() => setDialogOpen(false)}
        created={(i: ingredient) => {
          setIngredients((ings) => [i, ...ings])
          setDialogOpen(false)
        }}
      />
    </div>
  )
}

export default IngredientsPage
