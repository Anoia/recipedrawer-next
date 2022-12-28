import { NextPage } from 'next'
import { useEffect, useState } from 'react'
import { supabase } from '../utils/supabaseClient'
// import IngredientInput from '../components/edit/ingredientinput'
import { TypedRecipeIngredient } from './edit/[id]'

const Test: NextPage = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [selected, setSelected] = useState(Array<TypedRecipeIngredient>())

  return DateTest()

  // return (
  //   <div className="flex flex-col justify-center mx-auto my-12 max-w-4xl">
  //     {/* <IngredientInput
  //       elementId={'autocomplete'}
  //       input={''}
  //       selectIngredient={(i: TypedRecipeIngredient) => {
  //         console.log(`adding ${i.name}`)
  //         setSelected((s) => [...s, i])
  //       }}
  //     ></IngredientInput> */}
  //     <div>
  //       <p className="mt-5">selection:</p>
  //       <div>
  //         {selected.map((i) => {
  //           return (
  //             <p key={i.ingredient_id}>
  //               {i.name} {i.amount}
  //             </p>
  //           )
  //         })}
  //       </div>
  //     </div>
  //   </div>
  // )
}

function DateTest() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [data, setData] = useState<any[]>([])

  const testRecipe = async () => {
    const { data: recipes, error } = await supabase
      .from('recipe')
      .select('id, name, description, image, cook_time, prep_time')

    if (error) console.log(JSON.stringify(error))
    if (recipes) setData(recipes.sort((a, b) => (a.id > b.id ? 1 : 0)))
  }

  useEffect(() => {
    testRecipe()
  }, [])

  return (
    <div className="container mx-auto my-12 max-w-5xl">
      <div className=" -mx-3 overflow-hidden">
        {data.map((recipe) => (
          <p key={recipe.id}>
            {recipe.name} - {recipe.cook_time} - {recipe.prep_time}
          </p>
        ))}
      </div>
    </div>
  )
}

export default Test
