import {
  ingredient,
  PrismaClient,
  recipe,
  recipe_ingredient,
  unit,
} from '@prisma/client'

export type completeRecipeIngredient = recipe_ingredient & {
  ingredient: ingredient
  unit: unit
}

export type completeRecipe = recipe & {
  recipe_ingredient: completeRecipeIngredient[]
}

export async function getRecipeForId(
  id: number
): Promise<completeRecipe | null> {
  const prisma = new PrismaClient()
  return prisma.recipe.findUnique({
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
