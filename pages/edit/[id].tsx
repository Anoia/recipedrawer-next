import { unit } from '@prisma/client'
import { GetServerSidePropsContext } from 'next'
import { getRecipeForId, Step } from '../../utils/prisma/recipe'
import { useRouter } from 'next/router'
import { Maybe } from '../../utils/parseIngredient'
import Editorcreate from '../../components/editorcreate'

function EditRecipePage({
  recipe,
  id,
}: {
  recipe: EditableRecipe
  id: number
}) {
  const router = useRouter()

  const handleSave = async (recipe: EditableRecipe) => {
    const response = await fetch(`/api/edit/${id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(recipe),
    })

    if (response.status === 200) {
      router.push(`/recipe/${id}`, undefined, {
        unstable_skipClientCache: true,
        shallow: false,
      })
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
      <Editorcreate
        recipe={recipe}
        save={handleSave}
        cancel={() => router.push(`/recipe/${id}`)}
      />
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
          source: recipe.source as RecipeSource,
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

export type RecipeSource = {
  name: string
  link: string
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
  source: RecipeSource | undefined
}

export const EmptyRecipe: EditableRecipe = {
  name: '',
  description: '',
  image: '',
  steps: [],
  recipe_ingredient: [],
  portions: 2,
  //   cookingTime: undefined,
  //   prepTime: undefined,
  diet: 'vegan',
  source: undefined,
}
