import { GetStaticPaths, GetStaticProps } from 'next'
import React, { Fragment, useState } from 'react'
import {
  completeRecipe,
  completeRecipeIngredient,
  getRecipeForId,
  getRecipeForSlug,
  Step,
} from '../../utils/prisma/recipe'
import Image from 'next/legacy/image'
import Head from 'next/head'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { RecipeSource } from '../edit/[id]'
import { ParsedUrlQuery } from 'querystring'

function calulateImagePath(img: string) {
  return `https://res.cloudinary.com/ddqdrc3ak/image/upload/${img}`
}

function IngredientList(props: { ingredients: completeRecipeIngredient[] }) {
  const [amount, setAmount] = useState(1)
  return (
    <div className="mx-3">

      <div className="flex items-center mb-5">
        <span className="mr-3">Für {amount} Mal</span>
        <input
          type="number"
          step={0.5}
          min="0.00"
          value={amount}
          onChange={(e) => setAmount(parseFloat(e.target.value))}
          className="ml-auto w-12 text-center"
        ></input>
      </div>

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
                  {i.amount * amount} {i.unit.short_name}{' '}
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
  const title = `${data.name} - Recipe Drawer`
  return (
    <div className="container mx-auto my-12 max-w-4xl">
      <Head>
        <title>{title}</title>
      </Head>

      {/* TITLE IMAGE */}
      <div className="bg-slate-600 h-96 relative">
        {data.image && (
          <Image
            src={calulateImagePath(data.image)}
            layout="fill"
            objectFit="cover"
            alt="alt text"
          />
        )}
      </div>

      {/* NAME AND DESCRPITION */}
      <div className="my-16 flex flex-col sm:flex-row justify-between items-baseline">
        <div>
          <h1 className="text-4xl mx-3">{data.name} </h1>
          <p className="text-gray-600 mx-3"> {data.description}</p>
        </div>
        <div className="mt-6 sm:mt-0 ">
          <div className="flex flex-nowrap">
            <span className="mx-3 whitespace-nowrap">
              {data.portions} Portionen
            </span>
            <span className="mx-3 whitespace-nowrap"> {data.diet}</span>
          </div>
          {sourceLink(data.source as RecipeSource)}
        </div>
      </div>

      {/* INREDIENTS AND STEPS */}
      <div className="flex flex-col sm:flex-row gap-20">
        <div className="sm:basis-1/3">
          <IngredientList ingredients={data.recipe_ingredient} />
        </div>
        <div className="sm:basis-2/3 mx-3 sm:mx-0">
          <StepList steps={data.steps as Step[]} />
        </div>
      </div>

      {/* EDIT BUTTON */}
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

function sourceLink(source: RecipeSource) {
  if (source && source.name) {
    if (source.link) {
      return (
        <div className="mx-3 ">
          Quelle:{' '}
          <Link href={source.link} className="hover:underline" target="_blank">
            {source.name}
          </Link>
        </div>
      )
    } else {
      return <div className="mx-3 ">Quelle: {source.name}</div>
    }
  } else {
    return <></>
  }
}

export default RecipePage

interface Params extends ParsedUrlQuery {
  id: string
}

export const getStaticPaths: GetStaticPaths<Params> = async () => {
  return {
    paths: new Array<{ params: Params }>(),
    fallback: 'blocking',
  }
}

export const getStaticProps: GetStaticProps = async (context) => {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const { id: queryIdString } = context.params!

  if (queryIdString && typeof queryIdString === 'string') {
    const id = parseInt(queryIdString)

    if (!Number.isNaN(id)) {
      const recipe = await getRecipeForId(id)

      if (recipe) {
        return { props: recipe }
      }
    } else {
      const recipe = await getRecipeForSlug(queryIdString)

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
