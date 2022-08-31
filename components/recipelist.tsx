import Link from 'next/link'
import { useEffect, useState } from 'react'
import { supabase } from '../utils/supabaseClient'

function RecipeCard(props: any) {
  const recipe = props.recipe

  return (
    <li>
      <Link href={`/recipe/${recipe.id}`}>
        <a>
          {recipe.id} - {recipe.name}
        </a>
      </Link>
    </li>
  )
}

function RecipeList() {
  const [data, setData] = useState<any[]>([])

  const testRecipe = async () => {
    const { data: recipes, error } = await supabase
      .from('recipe')
      .select('id, name, description')

    if (error) console.log(JSON.stringify(error))
    if (recipes) setData(recipes.sort((a, b) => (a.id > b.id ? 1 : 0)))
  }

  useEffect(() => {
    testRecipe()
  }, [])

  return (
    <ul>
      {data.map((recipe) => (
        <RecipeCard recipe={recipe} key={recipe.id} />
      ))}
    </ul>
  )
}

export default RecipeList
