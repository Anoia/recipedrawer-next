import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next'
import React from 'react'
import {
  completeIngredient,
  completeRecipe,
  getRecipeForId,
} from '../../utils/prisma/recipe'

function IngredientList(props: { ingredients: completeIngredient[] }) {
  return (
    <div>
      <p>ingredients: {props.ingredients.length}</p>
      <ul>
        {props.ingredients.map((i) => (
          <li key={i.id}>
            {i.amount} {i.unit.short_name} {i.ingredient.name}
          </li>
        ))}
      </ul>
    </div>
  )
}

function RecipePage(data: completeRecipe) {
  return (
    <div>
      Recipe: {data.name} - {data.description}
      <IngredientList ingredients={data.recipe_ingredient} />
    </div>
  )
}

export default RecipePage

export async function getServerSideProps(
  context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<completeRecipe>> {
  const { id: queryIdString } = context.query

  if (queryIdString && typeof queryIdString === 'string') {
    const id = parseInt(queryIdString)

    if (!Number.isNaN(id)) {
      const recipe = await getRecipeForId(id)

      if (recipe) {
        return { props: recipe }
      }
    }
  }

  return {
    redirect: {
      permanent: false,
      destination: `/`,
    },
  }
}
