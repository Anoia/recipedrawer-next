import { PrismaClient, recipe, recipe_ingredient } from '@prisma/client'
import { GetServerSidePropsContext } from 'next'

type completeRecipe = recipe & {
  recipe_ingredient: recipe_ingredient[]
}

function RecipePage(data: completeRecipe) {
  return (
    <div>
      Recipe: {data.name ?? 'undefined'}
      <p>{JSON.stringify(data)}</p>
    </div>
  )
}

export default RecipePage

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { id: queryIdString } = context.query
  const prisma = new PrismaClient()

  if (queryIdString && typeof queryIdString === 'string') {
    const id = parseInt(queryIdString)

    if (!Number.isNaN(id)) {
      const recipe = await prisma.recipe.findUnique({
        where: {
          id: id,
        },
        include: {
          recipe_ingredient: true,
        },
      })

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
