import { NextPage } from 'next'
import { useState } from 'react'
import IngredientInput from '../components/edit/ingredientinput'
import { TypedRecipeIngredient } from './edit/[id]'

const Test: NextPage = () => {
  const [selected, setSelected] = useState(Array<TypedRecipeIngredient>())

  return (
    <div className="flex flex-col justify-center mx-auto my-12 max-w-4xl">
      <IngredientInput
        elementId={'autocomplete'}
        input={''}
        selectIngredient={(i: TypedRecipeIngredient) => {
          console.log(`adding ${i.name}`)
          setSelected((s) => [...s, i])
        }}
      ></IngredientInput>
      <div>
        <p className="mt-5">selection:</p>
        <div>
          {selected.map((i) => {
            return (
              <p key={i.ingredient_id}>
                {i.name} {i.amount}
              </p>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default Test
