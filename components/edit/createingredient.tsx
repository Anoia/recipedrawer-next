import { ingredient } from '@prisma/client'
import { useEffect, useRef, useState } from 'react'
import { supabase } from '../../utils/supabaseClient'

function CreateIngredient(props: {
  isOpen: boolean
  input: string
  close: () => void
  created: (i: ingredient) => void
}) {
  const [newIngredientName, setNewIngredientName] = useState(props.input)

  const [diet, setDiet] = useState('vegan')

  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
    setDiet('vegan')
    setNewIngredientName(props.input)
  }, [props.isOpen, props.input])

  const handleKey = (e: React.KeyboardEvent<HTMLElement>) => {
    if (e.key == 'Escape') {
      e.preventDefault
      props.close()
    }
    if (e.key == 'Enter') {
      e.preventDefault
      create()
    }
  }

  const create = async () => {
    if (newIngredientName.trim() != '') {
      const { data, error } = await supabase
        .from('ingredient')
        .insert({
          name: newIngredientName,
          diet: diet,
        })
        .select()

      if (error) {
        console.log(error)
      } else {
        props.created(data[0])
      }
    }
  }

  return (
    <dialog
      open={props.isOpen}
      className="fixed inset-x-0 top-48 z-10 overflow-y-auto p-0 w-1/4 min-w-fit"
      onKeyUp={(e) => handleKey(e)}
      tabIndex={-1}
    >
      <div>
        <div
          className="fixed inset-0 bg-black opacity-30"
          onClick={() => props.close()}
        />
        <div className="relative w-full mx-auto bg-white rounded p-10 flex flex-col">
          <h1 className="mb-5 text-4xl">Create new Ingredient</h1>
          <p className="my-1">Please enter the ingredient name:</p>
          <input
            className="mb-5 border p-2"
            type="text"
            ref={inputRef}
            value={newIngredientName}
            onChange={(e) => setNewIngredientName(e.target.value)}
          ></input>

          <div>
            <div className="flex justify-between">
              <div className="flex items-center  mx-2 ">
                <input
                  type="radio"
                  id="vegan"
                  name="diet"
                  value="vegan"
                  checked={diet === 'vegan'}
                  onChange={(e) => setDiet(e.target.value)}
                  className="w-4 h-4 text-teal-600 bg-gray-100 border-gray-300 focus:ring-teal-500 focus:ring-1"
                />
                <label htmlFor="vegan" className="ml-2 text-teal-600">
                  vegan
                </label>
              </div>

              <div className="flex items-center  mx-2">
                <input
                  type="radio"
                  id="vegetarian"
                  name="diet"
                  value="vegetarian"
                  checked={diet === 'vegetarian'}
                  onChange={(e) => setDiet(e.target.value)}
                  className="w-4 h-4 text-teal-600 bg-gray-100 border-gray-300 focus:ring-teal-500 focus:ring-1"
                />
                <label htmlFor="vegetarian" className="ml-2  text-teal-600">
                  vegetarian
                </label>
              </div>

              <div className="flex items-center  mx-2">
                <input
                  type="radio"
                  id="fish"
                  name="diet"
                  value="fish"
                  checked={diet === 'fish'}
                  onChange={(e) => setDiet(e.target.value)}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 focus:ring-1"
                />
                <label htmlFor="fish" className="ml-2  text-blue-600">
                  fish
                </label>
              </div>

              <div className="flex items-center mx-2">
                <input
                  type="radio"
                  id="meat"
                  name="diet"
                  value="meat"
                  checked={diet === 'meat'}
                  onChange={(e) => setDiet(e.target.value)}
                  className="w-4 h-4 text-red-600 bg-gray-100 border-gray-300 focus:ring-red-500 focus:ring-1"
                />
                <label htmlFor="meat" className="ml-2  text-red-600">
                  meat
                </label>
              </div>
            </div>
          </div>
          <div className="flex flex-row-reverse mt-12 space-x-5 space-x-reverse">
            <button
              className="text-white bg-slate-500 hover:bg-slate-600 p-3 basis-1/2"
              onClick={() => create()}
            >
              Create
            </button>
            <button
              className="text-white bg-slate-300 hover:bg-slate-400 p-3 basis-1/2"
              onClick={() => props.close()}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </dialog>
  )
}

export default CreateIngredient
