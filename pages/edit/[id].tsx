import { unit } from '@prisma/client'
import { GetServerSidePropsContext } from 'next'
import { getRecipeForId, Step } from '../../utils/prisma/recipe'
import Image from 'next/image'
import { MouseEventHandler, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import StepList from '../../components/edit/steplist'
import { Maybe } from '../../utils/parseIngredient'
import IngredientList from '../../components/edit/ingredientlist'

function calulateImagePath(img: string) {
  return `https://res.cloudinary.com/ddqdrc3ak/image/upload/${img}`
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

  const [ingredients, setIngredients] = useState(recipe.recipe_ingredient)
  const [steps, setSteps] = useState(recipe.steps as Step[])

  const [diet, setDiet] = useState(recipe.diet)

  useEffect(() => {
    const dietOrder = ['vegan', 'vegetarian', 'fish', 'meat']

    const dietIndex = ingredients.reduce((prev, current) => {
      if (current.type === 'ingredient') {
        return Math.max(dietOrder.indexOf(current.diet), prev)
      } else {
        return prev
      }
    }, 0)
    setDiet(dietOrder[dietIndex])
  }, [ingredients])

  const router = useRouter()

  const handleSave: MouseEventHandler = async (e) => {
    e.preventDefault

    const resultingRecipe: EditableRecipe = {
      name: name,
      description: description,
      steps: steps,
      recipe_ingredient: ingredients,
      portions: recipe.portions, //todo
      diet: diet,
      image: recipe.image, //todo
    }

    const response = await fetch(`/api/edit/${id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(resultingRecipe),
    })

    if (response.status === 200) {
      router.push(`/recipe/${id}`)
    } else {
      console.log(
        `error during saving, got status ${response.status}: ${JSON.stringify(
          response.body
        )}`
      )
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
            <span className="mx-3 whitespace-nowrap"> {diet}</span>
          </div>
        </div>
      </div>
      <div className="flex gap-20">
        <div className="basis-1/3">
          <IngredientList
            ingredients={ingredients}
            onIngredientsChanged={setIngredients}
          />
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
          .sort((a, b) => (a.index < b.index ? -1 : 1))
          .reduce((prev, current) => {
            if (current.section && current.section != lastSectionName) {
              prev.push({
                type: 'section',
                name: current.section,
                id: current.section,
              })
              lastSectionName = current.section
            }

            prev.push({
              type: 'ingredient',
              id: current.id ?? Date.now().toString(),
              amount: current.amount,
              ingredient_id: current.ingredient.id,
              name: current.ingredient.name,
              unit: current.unit,
              diet: current.ingredient.diet,
              extraInfo: current.extra_info,
            })

            return prev
          }, Array<IngredientOrSection>())

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

export type IngredientOrSection = TypedRecipeIngredient | TypedRecipeSection

export type TypedRecipeSection = {
  type: 'section'
  name: string
  id: string
}

export type TypedRecipeIngredient = {
  type: 'ingredient'
  name: string
  id: number | string
  ingredient_id: number
  amount: number
  unit: unit
  diet: string
  extraInfo: Maybe<string>
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
