/* eslint-disable @typescript-eslint/no-explicit-any */
import Link from 'next/link'
import Image from 'next/legacy/image'
import { useEffect, useState } from 'react'
import { useSupabaseClient } from '@supabase/auth-helpers-react'

function calulateImagePath(img: string) {
  return `https://res.cloudinary.com/ddqdrc3ak/image/upload/${img}`
}

function RecipeCard(props: any) {
  const recipe = props.recipe

  return (
    <div className=" py-6 px-6 w-1/3 ">
      <Link href={`/recipe/${recipe.id}`}>
        <div className=" border shadow-md border-gray-300 max-w-sm h-80 flex flex-col">
          <div className="min-w-[80px] bg-slate-600 flex-1 relative">
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
          <div className="p-5 text-left">
            <h5 className="text-gray-900 text-xl font-medium ">
              {recipe.name}
            </h5>
            {/* <p className="text-gray-700 text-base mb-4">
              {recipe.description}
            </p> */}
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
        .select('id, name, description, image')

      if (error) console.log(JSON.stringify(error))
      if (recipes) setData(recipes.sort((a, b) => (a.id > b.id ? 0 : 1)))
    }
    fetchRecipes()
  }, [supabaseClient])

  return (
    <div className="container mx-auto my-12 max-w-5xl">
      <div className="flex flex-wrap -mx-3 overflow-hidden">
        {data.map((recipe) => (
          <RecipeCard recipe={recipe} key={recipe.id} />
        ))}
      </div>
    </div>
  )
}

export default RecipeList
