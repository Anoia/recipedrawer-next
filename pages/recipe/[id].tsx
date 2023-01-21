import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next'
import React, { Fragment } from 'react'
import {
  completeRecipeIngredient,
  completeRecipe,
  getRecipeForId,
  Step,
} from '../../utils/prisma/recipe'
import Image from 'next/legacy/image'
import Head from 'next/head'
import { useRouter } from 'next/router'
import Link from 'next/link'

function calulateImagePath(img: string) {
  return `https://res.cloudinary.com/ddqdrc3ak/image/upload/${img}`
}

function IngredientList(props: { ingredients: completeRecipeIngredient[] }) {
  return (
    <div className="mx-3">
      <p className="text-2xl pb-3">Zutaten</p>
      <ul className="">
        {props.ingredients
          .sort((a, b) => (a.index < b.index ? -1 : 1))
          .map((i, idx) => (
            <Fragment key={i.id}>
              {i.section &&
                (idx === 0 ||
                  props.ingredients[idx - 1].section != i.section) && (
                  <li className="pt-3">
                    <span className="font-extrabold">{i.section}</span>
                  </li>
                )}
              <li className="py-1">
                <span>
                  {i.amount} {i.unit.short_name}{' '}
                  <Link href={`/ingredient/${i.ingredient_id}`}>
                    {i.ingredient.name}
                  </Link>
                </span>
                <span className="ml-2 text-sm text-gray-600">
                  {i.extra_info}
                </span>
              </li>
            </Fragment>
          ))}
      </ul>
    </div>
  )
}

function StepList(props: { steps: Step[] }) {
  return (
    <div>
      <p className="text-2xl pb-3">Zubereitung</p>
      <ul>
        {props.steps?.map((s, idx) => (
          <li key={idx}>
            <div className="flex items-start my-5">
              <span className="text-3xl mr-5">{idx + 1}</span>
              <span>{s.content}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

function RecipePage(data: completeRecipe) {
  const router = useRouter()
  return (
    <div className="container mx-auto my-12 max-w-4xl">
      <Head>
        <title>{data.name} - Recipe Drawer</title>
      </Head>
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
          <StepList steps={data.steps as Step[]} />
        </div>
      </div>
      <div className="flex justify-end">
        <button
          className="my-24 mx-3 hover:bg-slate-800 focus:bg-slate-800 py-3 px-12 bg-slate-700 text-white"
          onClick={() => router.push(`/edit/${data.id}`)}
        >
          Bearbeiten
        </button>
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
