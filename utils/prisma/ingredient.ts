import { ingredient } from '@prisma/client'

export type miniRecipe = {
  id: number
  name: string
  image: string
}

export type ingredientRecipe = {
  recipe: miniRecipe
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
        },
      },
      recipe_ingredient: {
        select: {
          recipe: {
            select: {
              name: true,
              id: true,
              image: true,
            },
          },
        },
      },
    },
  })
}
