import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next'
import React from 'react'
import {
  completeIngredient,
  completeRecipe,
  getRecipeForId,
} from '../../utils/prisma/recipe'
import Image from 'next/image'
import { Prisma } from '@prisma/client'

function calulateImagePath(img: string) {
  return `https://res.cloudinary.com/ddqdrc3ak/image/upload/${img}`
}

function IngredientList(props: { ingredients: completeIngredient[] }) {
  return (
    <div className="mx-3">
      <p className="text-2xl pb-3">Zutaten</p>
      <ul className="">
        {props.ingredients
          .sort((a, b) => (a.index > b.index ? 1 : 0))
          .map((i) => (
            <li key={i.id} className="py-2">
              <span>
                {i.amount} {i.unit.short_name} {i.ingredient.name}
              </span>
              <span className="ml-2 text-sm text-gray-600">{i.extra_info}</span>
            </li>
          ))}
      </ul>
    </div>
  )
}

function StepList(props: { steps: Prisma.JsonValue }) {
  return (
    <div>
      <p className="text-2xl pb-3">Zubereitung</p>
      <ul>
        {props.steps?.map((s: any) => (
          <li key={s.id}>
            <div className="flex items-start my-5">
              <span className="text-3xl mr-5">{s.id}</span>
              <span>{s.content}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

function RecipePage(data: completeRecipe) {
  return (
    <div className="container mx-auto my-24 max-w-4xl">
      <div className="bg-slate-600 h-80 relative">
        {data.image && (
          <Image
            src={calulateImagePath(data.image)}
            layout="fill"
            objectFit="cover"
            alt="alt text"
          />
        )}
      </div>
      <div className="my-16 flex justify-between items-baseline">
        <div>
          <h1 className="text-4xl mx-3">{data.name} </h1>
          <p className="text-gray-600 mx-3"> {data.description}</p>
        </div>
        <div className="">
          <div className="flex flex-nowrap">
            <span className="mx-3 whitespace-nowrap">
              {data.portions} Portionen
            </span>
            <span className="mx-3 whitespace-nowrap"> {data.diet}</span>
          </div>
        </div>
      </div>
      <div className="flex gap-20">
        <div className="basis-1/3">
          <IngredientList ingredients={data.recipe_ingredient} />
        </div>
        <div className="basis-2/3">
          <StepList steps={data.steps} />
        </div>
      </div>
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
