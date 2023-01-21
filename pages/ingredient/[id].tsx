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
          <Link href={`/recipe/${data.recipe.id}`}>
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
      </div>
    </div>
  )
}

export default IngredientPage

export async function getServerSideProps(
  context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<ingredientWithRecipe>> {
  const { id: queryIdString } = context.query

  if (queryIdString && typeof queryIdString === 'string') {
    const id = parseInt(queryIdString)

    if (!Number.isNaN(id)) {
      const recipe = await getIngredientForId(id)

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
