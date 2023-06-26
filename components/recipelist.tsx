/* eslint-disable @typescript-eslint/no-explicit-any */
import Link from 'next/link'
import Image from 'next/legacy/image'
import { ChangeEvent, useEffect, useState } from 'react'
import { useSupabaseClient } from '@supabase/auth-helpers-react'
import StandardInput from './lib/styledcomponents'

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
  const [initalRecipeData, setInitalRecipeData] = useState<any[]>([])
  const [searchRecipeData, setSearchRecipeData] = useState<any[] | undefined>(
    undefined
  )
  const supabaseClient = useSupabaseClient()

  useEffect(() => {
    const fetchRecipes = async () => {
      const { data: recipes, error } = await supabaseClient
        .from('recipe')
        .select('id, name, description, image, slug, diet')

      if (error) console.log(JSON.stringify(error))
      if (recipes)
        setInitalRecipeData(recipes.sort((a, b) => (a.id > b.id ? -1 : 1)))
    }
    fetchRecipes()
  }, [supabaseClient])

  const [search, setSearch] = useState<string>('')

  const keyDownHandler = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.code === 'Enter') {
      const trimmedSearch = search.trim()
      if (trimmedSearch != '') {
        console.log(search)

        const { data: recipes, error } = await supabaseClient
          .from('search_index')
          .select('id, name, description, image, slug, diet')
          .textSearch('vector', `${trimmedSearch}`, {
            config: 'german',
          })

        if (error) console.log(JSON.stringify(error))
        if (recipes)
          setSearchRecipeData(recipes.sort((a, b) => (a.id > b.id ? -1 : 1)))
      } else {
        setSearchRecipeData(undefined)
        setSearch('')
      }
    }
  }

  return (
    <div className="container mx-auto mb-12 max-w-5xl">
      <div className="mb-12">
        <StandardInput
          placeholder="Suche nach Rezept"
          value={search}
          onKeyDown={keyDownHandler}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setSearch(e.target.value)
          }
        />
      </div>
      <h1 className="text-4xl mx-3">
        {searchRecipeData ? `Suche: ${search}` : 'neuste Rezepte'}{' '}
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  -mx-3 overflow-hidden">
        {(searchRecipeData ?? initalRecipeData).map((recipe) => (
          <RecipeCard recipe={recipe} key={recipe.id} />
        ))}
      </div>
    </div>
  )
}

export default RecipeList
