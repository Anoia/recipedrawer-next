import {
  ChangeEventHandler,
  MouseEventHandler,
  useEffect,
  useState,
} from 'react'
import { EditableRecipe } from '../pages/edit/[id]'
import { Step } from '../utils/prisma/recipe'
import IngredientList from './edit/ingredientlist'
import StepList from './edit/steplist'
import Image from 'next/legacy/image'

function calulateImagePath(img: string) {
  return `https://res.cloudinary.com/ddqdrc3ak/image/upload/${img}`
}

function Editorcreate(props: {
  recipe: EditableRecipe
  save: (r: EditableRecipe) => void
  cancel: () => void
}) {
  const [name, setName] = useState(props.recipe.name)
  const [description, setDescription] = useState(props.recipe.description)
  const [image, setImage] = useState(props.recipe.image)

  const [portions, setPortions] = useState(props.recipe.portions)

  const [ingredients, setIngredients] = useState(props.recipe.recipe_ingredient)
  const [steps, setSteps] = useState(props.recipe.steps as Step[])

  const [diet, setDiet] = useState(props.recipe.diet)

  useEffect(() => {
    const dietOrder = ['vegan', 'vegetarian', 'fish', 'meat']

    const dietIndex = ingredients.reduce((prev, current) => {
      if (current.type === 'ingredient') {
        return Math.max(dietOrder.indexOf(current.diet), prev)
      } else {
        return prev
      }
    }, 0)
    setDiet(dietOrder[dietIndex])
  }, [ingredients])

  const handleSave: MouseEventHandler = async (e) => {
    e.preventDefault

    const resultingRecipe: EditableRecipe = {
      name: name,
      description: description,
      steps: steps,
      recipe_ingredient: ingredients,
      portions: portions,
      diet: diet,
      image: image,
    }
    props.save(resultingRecipe)
  }

  const uploadFile: ChangeEventHandler<HTMLInputElement> = async (e) => {
    if (e.target.files) {
      const file = e.target.files[0]

      const formData = new FormData()

      formData.append('file', file)
      formData.append('upload_preset', 'cookbook_recipe')

      const response = await fetch(
        'https://api.cloudinary.com/v1_1/ddqdrc3ak/image/upload',
        {
          method: 'POST',
          body: formData,
        }
      )
      const responseJson = await response.json()
      setImage(responseJson?.public_id ?? '')
    }
  }

  return (
    <div className="container mx-auto  my-12 max-w-4xl">
      <div className="bg-slate-600 h-80 relative">
        {props.recipe.image && (
          <Image
            src={calulateImagePath(image)}
            layout="fill"
            objectFit="cover"
            alt="alt text"
          />
        )}
      </div>
      <div>
        <input type="file" onChange={uploadFile} />
      </div>
      <div className="my-16 flex justify-between items-baseline">
        <div className="">
          <input
            className="w-full text-4xl mx-3 focus:outline-none focus:ring-0 border border-white focus:border-gray-400 hover:focus:border-solid hover:border-dashed hover:border-gray-500"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Rezeptname"
          />
          {/* <h1 className="text-4xl mx-3">{data.name} </h1> */}
          <input
            className="w-full  text-gray-600 mx-3 focus:outline-none focus:ring-0 border border-white focus:border-gray-400 hover:focus:border-solid hover:border-dashed hover:border-gray-500"
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Beschreibung"
          />
        </div>
        <div className="">
          <div className="flex flex-nowrap">
            <span className="mx-3 pl-3 whitespace-nowrap"> Portionen:</span>
            <input
              className="w-full  text-gray-600 mx-3 focus:outline-none focus:ring-0 border border-white focus:border-gray-400 hover:focus:border-solid hover:border-dashed hover:border-gray-500"
              type="number"
              value={portions}
              onChange={(e) => setPortions(parseInt(e.target.value))}
            />

            <span className="mx-3 whitespace-nowrap"> {diet}</span>
          </div>
        </div>
      </div>
      <div className="flex gap-20">
        <div className="basis-1/3">
          <IngredientList
            ingredients={ingredients}
            onIngredientsChanged={setIngredients}
          />
        </div>
        <div className="basis-2/3">
          <StepList steps={steps} onStepsChanged={setSteps} />
        </div>
      </div>
      <div className="flex justify-end">
        <button
          className="my-24 mx-3 hover:bg-rose-800 focus:bg-rose-800 py-3 px-12 bg-rose-700 text-white"
          onClick={props.cancel}
        >
          Abbrechen
        </button>
        <button
          className="my-24 mx-3 hover:bg-teal-800 focus:bg-teal-800 py-3 px-12 bg-teal-700 text-white"
          onClick={handleSave}
        >
          Speichern
        </button>
      </div>
    </div>
  )
}

export default Editorcreate
