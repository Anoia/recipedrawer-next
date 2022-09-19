/* eslint-disable @typescript-eslint/no-explicit-any */
import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { supabase } from '../utils/supabaseClient'

function calulateImagePath(img: string) {
  return `https://res.cloudinary.com/ddqdrc3ak/image/upload/${img}`
}

function RecipeCard(props: any) {
  const recipe = props.recipe

  return (
    <div className=" py-6 px-6 w-1/3 ">
      <Link href={`/recipe/${recipe.id}`}>
        <a>
          <div className="rounded-lg shadow-lg  max-w-sm  h-80 flex flex-col">
            <div className=" rounded-t-lg bg-slate-600 flex-1  relative">
              {recipe.image && (
                <Image
                  className="rounded-t-lg "
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
              {/* <button
            type="button"
            className=" inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
          >
            Button
          </button> */}
            </div>
          </div>
        </a>
      </Link>
    </div>

    // <li>
    //   <Link href={`/recipe/${recipe.id}`}>
    //     <a>
    //       {recipe.id} - {recipe.name}
    //     </a>
    //   </Link>
    // </li>
  )
}

function RecipeList() {
  const [data, setData] = useState<any[]>([])

  const testRecipe = async () => {
    const { data: recipes, error } = await supabase
      .from('recipe')
      .select('id, name, description, image')

    if (error) console.log(JSON.stringify(error))
    if (recipes) setData(recipes.sort((a, b) => (a.id > b.id ? 1 : 0)))
  }

  useEffect(() => {
    testRecipe()
  }, [])

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
