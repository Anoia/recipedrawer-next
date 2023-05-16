import { ingredient } from '@prisma/client'
import prismaClientGlobal from './client'

export type miniRecipe = {
  id: number
  name: string
  image: string | null
  slug: string | null
}

export type ingredientRecipe = {
  recipe: miniRecipe | null
  recipe_ingredient: Array<{ recipe: miniRecipe }>
}

export type ingredientWithRecipe = ingredient & ingredientRecipe

export async function getIngredientForId(
  id: number
): Promise<ingredientWithRecipe | null> {
  return prismaClientGlobal.ingredient.findUnique({
    where: {
      id: id,
    },
    include: {
      recipe: {
        select: {
          name: true,
          id: true,
          image: true,
          slug: true,
        },
      },
      recipe_ingredient: {
        select: {
          recipe: {
            select: {
              name: true,
              id: true,
              image: true,
              slug: true,
            },
          },
        },
      },
    },
  })
}
