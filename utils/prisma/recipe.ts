import { ingredient, recipe, recipe_ingredient, unit } from '@prisma/client'
import { EditableRecipe } from '../../pages/edit/[id]'
import prismaClientGlobal from './client'

export type completeRecipeIngredient = recipe_ingredient & {
  ingredient: ingredient
  unit: unit
}

export type completeRecipe = recipe & {
  recipe_ingredient: completeRecipeIngredient[]
}

export type Step = {
  content: string
  id: string
}

export async function getRecipeForId(
  id: number
): Promise<completeRecipe | null> {
  return prismaClientGlobal.recipe.findUnique({
    where: {
      id: id,
    },
    include: {
      recipe_ingredient: {
        include: {
          ingredient: true,
          unit: true,
        },
      },
    },
  })
}

export async function saveRecipe(
  id: number,
  recipe: EditableRecipe
): Promise<recipe> {
  let currentSectionName: string | undefined = undefined

  const recipeIngredients = recipe.recipe_ingredient.reduce(
    (prev, current, index) => {
      if (current.type === 'ingredient') {
        const newIngredient: recipe_ingredient = {
          id: current.id,
          ingredient_id: current.ingredient_id,
          recipe_id: id,
          unit_id: current.unit.id,
          amount: current.amount,
          extra_info: current.extraInfo ?? null,
          index: index,
          section: currentSectionName ?? null,
        }
        prev.push(newIngredient)
        return prev
      } else {
        currentSectionName = current.name
        return prev
      }
    },
    Array<recipe_ingredient>()
  )

  const deleteNotIn: number[] = []

  recipeIngredients.forEach((i) => {
    if (i.id) {
      deleteNotIn.push(i.id)
    }
  })

  const result = await prismaClientGlobal.recipe.update({
    where: { id: id },
    data: {
      name: recipe.name,
      description: recipe.description,
      diet: recipe.diet,
      portions: recipe.portions,
      image: recipe.image,
      recipe_ingredient: {
        create: recipeIngredients
          .filter((i) => i.id == undefined)
          .map((i) => {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { recipe_id, ...rest } = i
            return rest
          }),
        update: recipeIngredients
          .filter((i) => i.id != undefined)
          .map((i) => {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { recipe_id, ...rest } = i
            return {
              where: { id: i.id },
              data: rest,
            }
          }),
        deleteMany: [
          {
            id: { notIn: deleteNotIn },
          },
        ],
      },
    },
  })
  return result
}
