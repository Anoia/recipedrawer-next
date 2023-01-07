import { useSupabaseClient } from '@supabase/auth-helpers-react'
import { NextPage } from 'next'
import { useEffect, useState } from 'react'

const Test: NextPage = () => {
  const supabaseClient = useSupabaseClient()

  function DateTest() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [data, setData] = useState<any[]>([])

    const testRecipe = async () => {
      const { data: recipes, error } = await supabaseClient
        .from('recipe')
        .select('id, name, description, image, cook_time, prep_time')

      if (error) console.log(JSON.stringify(error))
      if (recipes) setData(recipes.sort((a, b) => (a.id > b.id ? 1 : 0)))
    }

    useEffect(() => {
      testRecipe()
    }, [])

    return (
      <div className="container mx-auto my-12 max-w-5xl">
        <div className=" -mx-3 overflow-hidden">
          {data.map((recipe) => (
            <p key={recipe.id}>
              {recipe.name} - {recipe.cook_time} - {recipe.prep_time}
            </p>
          ))}
        </div>
      </div>
    )
  }

  return DateTest()
}

export default Test
