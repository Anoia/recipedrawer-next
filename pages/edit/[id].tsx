import { unit } from '@prisma/client'
import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next'
import { getRecipeForId, Step } from '../../utils/prisma/recipe'
import Image from 'next/image'
import { useState } from 'react'

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

function StepList(props: { steps: Step[] }) {
  return (
    <div>
      <p className="text-2xl pb-3">Zubereitung</p>
      <ul>
        {props.steps?.map((s) => (
          <li key={s.id}>
            <div className="flex items-start my-5">
              <span className="text-3xl mr-5">{s.id}</span>
              <span>{s.content}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

function EditRecipePage(initialData: EditableRecipe) {
  const [name, setName] = useState(initialData.name)
  const [description, setDescription] = useState(initialData.description)

  return (
    <div className="container mx-auto my-24 max-w-4xl">
      <div className="bg-slate-600 h-80 relative">
        {initialData.image && (
          <Image
            src={calulateImagePath(initialData.image)}
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
              {initialData.portions} Portionen
            </span>
            <span className="mx-3 whitespace-nowrap"> {initialData.diet}</span>
          </div>
        </div>
      </div>
      <div className="flex gap-20">
        <div className="basis-1/3">
          <IngredientList ingredients={initialData.recipe_ingredient} />
        </div>
        <div className="basis-2/3">
          <StepList steps={initialData.steps as Step[]} />
        </div>
      </div>
    </div>
  )
}

export default EditRecipePage

export async function getServerSideProps(
  context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<EditableRecipe>> {
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

        return { props: editable }
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
