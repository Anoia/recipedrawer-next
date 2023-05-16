import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next'
import Link from 'next/link'
import {
  getIngredientForId,
  ingredientWithRecipe,
} from '../../utils/prisma/ingredient'

import Image from 'next/legacy/image'

function calulateImagePath(img: string) {
  return `https://res.cloudinary.com/ddqdrc3ak/image/upload/c_fill,w_150,h_150/${img}`
}

function IngredientPage(data: ingredientWithRecipe) {
  return (
    <div className="container mx-auto my-12 max-w-4xl">
      <div className="">
        <h1 className="text-2xl my-2">{data.name}</h1>
        <p>{data.diet}</p>
        {data.recipe && (
          <Link href={`/recipe/${data.recipe.slug || data.recipe.id}`}>
            <div className="flex ">
              {data.recipe.image && (
                <Image
                  src={calulateImagePath(data.recipe.image)}
                  alt="alt text"
                  width="150"
                  height="150"
                />
              )}
              <p>Link zum Rezept</p>
            </div>
          </Link>
        )}

        {data.recipe_ingredient && (
          <div>
            <h1 className="text-xl my-2">Verwendet in:</h1>
            <ul>
              {data.recipe_ingredient.map((r) => {
                return (
                  <li key={r.recipe.id}>
                    <Link href={`/recipe/${r.recipe.slug || r.recipe.id}`}>
                      {r.recipe.name}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}

export default IngredientPage

export async function getServerSideProps(
  context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<ingredientWithRecipe>> {
  try {
    const { id: queryIdString } = context.query

    console.log(`ingredient page for ${queryIdString}`)

    if (queryIdString && typeof queryIdString === 'string') {
      const id = parseInt(queryIdString)
      console.log(`parsed ${id}`)
      if (!Number.isNaN(id)) {
        console.log(`trying to get data`)
        const ingredient = await getIngredientForId(id)
        console.log(`retrieved: ${ingredient}`)

        if (ingredient) {
          return { props: ingredient }
        }
      }
    }
  } catch (e) {
    console.log(`error: ${JSON.stringify(e)}`)
    if (typeof e === 'string') {
      console.log(`errorstring ${e}`)
    } else if (e instanceof Error) {
      console.log(`error message ${e.message}`)
    }
    console.log(`trying write: ${e}`)
  }

  return {
    redirect: {
      permanent: false,
      destination: `/`,
    },
  }
}
