import { NextPage } from 'next'
import IngredientInput from '../components/edit/ingredientinput'

const Test: NextPage = () => {
  return (
    <div className="flex justify-center mx-auto my-12 max-w-4xl">
      <IngredientInput elementId={'autocomplete'} input={''}></IngredientInput>
    </div>
  )
}

export default Test
