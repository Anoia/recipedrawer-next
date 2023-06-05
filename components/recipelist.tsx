/* eslint-disable @typescript-eslint/no-explicit-any */
import Link from 'next/link'
import Image from 'next/legacy/image'
import { useEffect, useState } from 'react'
import { useSupabaseClient } from '@supabase/auth-helpers-react'

function calulateImagePath(img: string) {
  return `https://res.cloudinary.com/ddqdrc3ak/image/upload/${img}`
}

const styleForDiet = new Map([
  ['vegan', 'text-green-600'],
  ['vegetarian', 'text-lime-500'],
  ['fish', 'text-blue-500'],
  ['meat', 'text-red-500'],
])

function RecipeCard(props: any) {
  const recipe = props.recipe

  const dietStyle = styleForDiet.get(recipe.diet) || 'text-gray-500'

  return (
    <div className=" py-6 px-6">
      <Link href={`/recipe/${recipe.slug || recipe.id}`}>
        <div className=" max-w-sm h-80 flex flex-col">
          <div className="bg-slate-600 flex-1 relative">
            {recipe.image && (
              <Image
                className=" "
                src={calulateImagePath(recipe.image)}
                layout="fill"
                objectFit="cover"
                // width="100%"
                // height="100%"
                alt="alt text"
              />
            )}
          </div>
          <div className="p-2 text-left">
            <p className={`float-right  text-base ${dietStyle}`}>
              {recipe.diet}
            </p>
            <h5 className="text-gray-900 text-xl font-medium ">
              {recipe.name}
            </h5>
          </div>
        </div>
      </Link>
    </div>
  )
}

function RecipeList() {
  const [data, setData] = useState<any[]>([])
  const supabaseClient = useSupabaseClient()

  useEffect(() => {
    const fetchRecipes = async () => {
      const { data: recipes, error } = await supabaseClient
        .from('recipe')
        .select('id, name, description, image, slug, diet')

      if (error) console.log(JSON.stringify(error))
      if (recipes) setData(recipes.sort((a, b) => (a.id > b.id ? -1 : 1)))
    }
    fetchRecipes()
  }, [supabaseClient])

  return (
    <div className="container mx-auto my-12 max-w-5xl">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  -mx-3 overflow-hidden">
        {data.map((recipe) => (
          <RecipeCard recipe={recipe} key={recipe.id} />
        ))}
      </div>
    </div>
  )
}

export default RecipeList
