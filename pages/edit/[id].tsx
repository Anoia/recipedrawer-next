import { unit } from '@prisma/client'
import { GetServerSidePropsContext } from 'next'
import { getRecipeForId, Step } from '../../utils/prisma/recipe'
import Image from 'next/image'
import { MouseEventHandler, useState } from 'react'
import { supabase } from '../../utils/supabaseClient'
import { useRouter } from 'next/router'
import StepList from '../../components/edit/steplist'

function calulateImagePath(img: string) {
  return `https://res.cloudinary.com/ddqdrc3ak/image/upload/${img}`
}

function IngredientList(props: {
  ingredients: Array<TypedRecipeIngredient | TypedRecipeSection>
}) {
  const ingredientComponents = props.ingredients.map((i, idx) => {
    if (i.type === 'ingredient') {
      return (
        <li className="py-1" key={`${i.name}-${idx}`}>
          <span>
            {i.amount} {i.unit.short_name} {i.name}
          </span>
          <span className="ml-2 text-sm text-gray-600">{i.extraInfo}</span>
        </li>
      )
    } else {
      return (
        <li className="pt-3" key={`${i.name}-${idx}`}>
          <span className="font-extrabold">{i.name}</span>
        </li>
      )
    }
  })

  return (
    <div className="mx-3">
      <p className="text-2xl pb-3">Zutaten</p>
      <ul className="">{ingredientComponents}</ul>
    </div>
  )
}

function EditRecipePage({
  recipe,
  id,
}: {
  recipe: EditableRecipe
  id: number
}) {
  const [name, setName] = useState(recipe.name)
  const [description, setDescription] = useState(recipe.description)

  const [steps, setSteps] = useState(recipe.steps as Step[])

  const router = useRouter()

  const handleSave: MouseEventHandler = async (e) => {
    e.preventDefault
    console.log('saving recipe')
    const { data, error } = await supabase
      .from('recipe')
      .update({
        name: name,
        description: description,
        steps: steps,
      })
      .match({ id: id })

    if (error) {
      console.log(error)
    } else {
      console.log(data)
      router.push(`/edit/${id}`)
    }
  }

  return (
    <div className="container mx-auto  my-12 max-w-4xl">
      <div className="bg-slate-600 h-80 relative">
        {recipe.image && (
          <Image
            src={calulateImagePath(recipe.image)}
            layout="fill"
            objectFit="cover"
            alt="alt text"
          />
        )}
      </div>
      <div className="my-16 flex justify-between items-baseline">
        <div className="">
          <input
            className="w-full text-4xl mx-3 focus:outline-none focus:ring-0 border border-white focus:border-gray-400 hover:focus:border-solid hover:border-dashed hover:border-gray-500"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Rezeptname"
          />
          {/* <h1 className="text-4xl mx-3">{data.name} </h1> */}
          <input
            className="w-full  text-gray-600 mx-3 focus:outline-none focus:ring-0 border border-white focus:border-gray-400 hover:focus:border-solid hover:border-dashed hover:border-gray-500"
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Beschreibung"
          />
        </div>
        <div className="">
          <div className="flex flex-nowrap">
            <span className="mx-3 whitespace-nowrap">
              {recipe.portions} Portionen
            </span>
            <span className="mx-3 whitespace-nowrap"> {recipe.diet}</span>
          </div>
        </div>
      </div>
      <div className="flex gap-20">
        <div className="basis-1/3">
          <IngredientList ingredients={recipe.recipe_ingredient} />
        </div>
        <div className="basis-2/3">
          <StepList steps={steps} onStepsChanged={setSteps} />
        </div>
      </div>
      <div className="flex justify-end">
        <button
          className="my-24 mx-3 hover:bg-rose-800 focus:bg-rose-800 py-3 px-12 bg-rose-700 text-white"
          onClick={() => router.push(`/recipe/${id}`)}
        >
          Abbrechen
        </button>
        <button
          className="my-24 mx-3 hover:bg-teal-800 focus:bg-teal-800 py-3 px-12 bg-teal-700 text-white"
          onClick={handleSave}
        >
          Speichern
        </button>
      </div>
    </div>
  )
}

export default EditRecipePage

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { id: queryIdString } = context.query

  if (queryIdString && typeof queryIdString === 'string') {
    const id = parseInt(queryIdString)

    if (!Number.isNaN(id)) {
      const recipe = await getRecipeForId(id)

      if (recipe) {
        let lastSectionName: string | undefined = undefined

        const ingredients = recipe.recipe_ingredient
          .sort((a, b) => (a.index > b.index ? 1 : 0))
          .reduce((prev, current) => {
            if (current.section && current.section != lastSectionName) {
              prev.push({
                type: 'section',
                name: current.section,
              })
              lastSectionName = current.section
            }

            prev.push({
              type: 'ingredient',
              id: current.id,
              amount: current.amount,
              ingredient_id: current.ingredient.id,
              name: current.ingredient.name,
              unit: current.unit,
              diet: current.ingredient.diet,
              extraInfo: current.extra_info,
            })

            return prev
          }, Array<TypedRecipeIngredient | TypedRecipeSection>())

        const editable: EditableRecipe = {
          name: recipe.name,
          description: recipe.description ?? '',
          image: recipe.image ?? '',
          portions: recipe.portions,
          diet: recipe.diet ?? 'vegan',
          recipe_ingredient: ingredients,
          steps: recipe.steps as Step[],
        }

        return {
          props: {
            recipe: editable,
            id: recipe ? id : -1,
          },
        }
      }
    }
  }

  return {
    props: {
      ...EmptyRecipe,
    },
  }
}

export type TypedRecipeSection = {
  type: 'section'
  name: string
}

export type TypedRecipeIngredient = {
  type: 'ingredient'
  name: string
  id: number | undefined
  ingredient_id: number
  amount: number
  unit: unit
  diet: string
  extraInfo: string | null
}

export type EditableRecipe = {
  name: string
  description: string
  image: string
  steps: Step[]
  recipe_ingredient: Array<TypedRecipeIngredient | TypedRecipeSection>
  portions: number
  //   cookingTime: string | undefined
  //   prepTime: string | undefined
  diet: string
}

const EmptyRecipe: EditableRecipe = {
  name: '',
  description: '',
  image: '',
  steps: [],
  recipe_ingredient: [],
  portions: 2,
  //   cookingTime: undefined,
  //   prepTime: undefined,
  diet: 'vegan',
}
