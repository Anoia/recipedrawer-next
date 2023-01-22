import { ingredient, recipe, recipe_ingredient, unit } from '@prisma/client'
import {
  EditableRecipe,
  TypedRecipeIngredient,
  TypedRecipeSection,
} from '../../pages/edit/[id]'
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

export type new_recipe_ingredient = {
  ingredient_id: number
  amount: number
  unit_id: number
  index: number
  section: string | null
  extra_info: string | null
}

export type updated_recipe_ingredient = new_recipe_ingredient & { id: number }

export type create_update_ingredients = {
  new: Array<new_recipe_ingredient>
  updated: Array<updated_recipe_ingredient>
}

function getEmptyCreateUpdateIngredients(): create_update_ingredients {
  return {
    new: Array<new_recipe_ingredient>(),
    updated: Array<updated_recipe_ingredient>(),
  }
}

function transformSectionsAndIngredients(
  recipe_ingredient: Array<TypedRecipeIngredient | TypedRecipeSection>
): create_update_ingredients {
  let currentSectionName: string | undefined = undefined

  return recipe_ingredient.reduce((createUpdateResult, current, index) => {
    if (current.type === 'ingredient') {
      const newR: new_recipe_ingredient = {
        ingredient_id: current.ingredient_id,
        unit_id: current.unit.id,
        amount: current.amount,
        extra_info: current.extraInfo ?? null,
        index: index,
        section: currentSectionName ?? null,
      }

      if (typeof current.id === 'number') {
        const up: updated_recipe_ingredient = {
          id: current.id,
          ...newR,
        }
        createUpdateResult.updated.push(up)
        return createUpdateResult
      } else {
        createUpdateResult.new.push(newR)
        return createUpdateResult
      }
    } else {
      currentSectionName = current.name
      return createUpdateResult
    }
  }, getEmptyCreateUpdateIngredients())
}

export async function saveRecipe(
  id: number,
  recipe: EditableRecipe
): Promise<recipe> {
  const recipeIngredients = transformSectionsAndIngredients(
    recipe.recipe_ingredient
  )

  const deleteNotIn: number[] = recipeIngredients.updated.map((i) => i.id)

  const result = await prismaClientGlobal.recipe.update({
    where: { id: id },
    data: {
      name: recipe.name,
      description: recipe.description,
      diet: recipe.diet,
      portions: recipe.portions,
      image: recipe.image,
      steps: recipe.steps,
      source: recipe.source,
      recipe_ingredient: {
        deleteMany: [
          {
            id: { notIn: deleteNotIn },
          },
        ],
        create: recipeIngredients.new,
        update: recipeIngredients.updated.map((i) => {
          return {
            where: { id: i.id },
            data: i,
          }
        }),
      },
    },
  })
  return result
}

export async function createRecipe(recipe: EditableRecipe): Promise<recipe> {
  const recipeIngredients = transformSectionsAndIngredients(
    recipe.recipe_ingredient
  )

  const result = await prismaClientGlobal.recipe.create({
    data: {
      name: recipe.name,
      description: recipe.description,
      diet: recipe.diet,
      portions: recipe.portions,
      image: recipe.image,
      steps: recipe.steps,
      source: recipe.source,
      recipe_ingredient: {
        create: recipeIngredients.new,
      },
    },
  })
  return result
}
