import { ingredient, unit } from '@prisma/client'
import { useEffect, useState } from 'react'
import {
  IngredientOrSection,
  TypedRecipeIngredient,
  TypedRecipeSection,
} from '../../pages/edit/[id]'
import { supabase } from '../../utils/supabaseClient'
import IngredientInput from './ingredientinput'
import SectionInput from './sectioninput'
import { ReactSortable } from 'react-sortablejs'

function IngredientList(props: {
  ingredients: Array<IngredientOrSection>

  onIngredientsChanged: (i: Array<IngredientOrSection>) => void
}) {
  const [currentlyEditingIngredient, setCurrentlyEditingIngredient] =
    useState(-1)

  const [currentlyReorganizing, setCurrentlyReorganizing] = useState(false)

  const [ingredients, setIngredients] = useState<Array<ingredient>>([])
  const [units, setUnits] = useState<Array<unit>>([])

  useEffect(() => {
    const fetchIngredients = async () => {
      const { data, error } = await supabase
        .from<ingredient>('ingredient')
        .select('*')

      if (error) console.log(JSON.stringify(error))
      if (data) setIngredients(data)
    }

    const fetchUnits = async () => {
      const { data, error } = await supabase.from<unit>('unit').select('*')

      if (error) console.log(JSON.stringify(error))
      if (data) setUnits(data)
    }

    fetchIngredients()
    fetchUnits()
  }, [])

  useEffect(() => {
    if (currentlyEditingIngredient > -1) {
      document
        .getElementById(
          `autocomplete-${props.ingredients[currentlyEditingIngredient].name}-${currentlyEditingIngredient}-input`
        )
        ?.focus()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentlyEditingIngredient])

  const deleteButton = (idx: number) => (
    <button
      className="px-1 bg-red-800 text-white"
      onClick={() => {
        const ings = [...props.ingredients]
        ings.splice(idx, 1)
        props.onIngredientsChanged(ings)
      }}
    >
      X
    </button>
  )

  const sectionDisplay = (s: TypedRecipeSection, idx: number) => (
    <>
      <span className="pt-3 font-extrabold">{s.name}</span>
      {currentlyReorganizing && deleteButton(idx)}
    </>
  )

  const ingredientDisplay = (i: TypedRecipeIngredient, idx: number) => (
    <div
      className="py-1"
      onClick={() =>
        currentlyReorganizing
          ? setCurrentlyEditingIngredient(-1)
          : setCurrentlyEditingIngredient(idx)
      }
    >
      <span className="">
        {i.amount} {i.unit.short_name}{' '}
      </span>
      <span>{i.name}</span>
      <span className="ml-2 text-sm text-gray-600">{i.extraInfo} </span>
      {currentlyReorganizing && deleteButton(idx)}
    </div>
  )

  const ingredientEditing = (i: TypedRecipeIngredient, idx: number) => (
    <div className="py-1">
      <IngredientInput
        ingredients={ingredients}
        units={units}
        elementId={`autocomplete-${i.name}-${idx}`}
        input={
          `${i.amount} ${i.unit.short_name} ${i.name}` +
          (i.extraInfo ? `((${i.extraInfo}))` : '')
        }
        selectIngredient={(newI: TypedRecipeIngredient) => {
          const ings = [...props.ingredients]
          ings[idx] = { ...newI, id: i.id }
          props.onIngredientsChanged(ings)
          setCurrentlyEditingIngredient(-1)
        }}
        createdNewIngredient={(i) => setIngredients((old) => [...old, i])}
        blur={() => setCurrentlyEditingIngredient(-1)}
      />
    </div>
  )

  const ingredientComponents = props.ingredients.map((i, idx) => {
    return (
      <li key={`${i.name}-${idx}`}>
        {i.type === 'ingredient'
          ? currentlyEditingIngredient === idx && !currentlyReorganizing
            ? ingredientEditing(i, idx)
            : ingredientDisplay(i, idx)
          : sectionDisplay(i, idx)}
      </li>
    )
  })

  return (
    <div className="mx-3">
      <button
        className={` font-bold float-right ${
          currentlyReorganizing ? 'text-rose-700' : 'text-teal-700'
        }`}
        onClick={() => setCurrentlyReorganizing((c) => !c)}
      >
        {currentlyReorganizing ? 'zurück' : 'umsortieren'}
      </button>
      <p className="text-2xl pb-3">Zutaten</p>
      <ul className="">
        <ReactSortable
          ghostClass="bg-gray-100"
          dragClass="bg-gray-200"
          list={props.ingredients}
          disabled={!currentlyReorganizing}
          setList={(newList) => props.onIngredientsChanged(newList)}
        >
          {ingredientComponents}
        </ReactSortable>
      </ul>
      <p className="mt-12" />
      {!currentlyReorganizing && (
        <>
          <IngredientInput
            ingredients={ingredients}
            units={units}
            elementId="autocomplete"
            input=""
            selectIngredient={(i: TypedRecipeIngredient) => {
              console.log(`adding ${i.name}`)
              props.onIngredientsChanged([...props.ingredients, i])
            }}
            createdNewIngredient={(i) => setIngredients((old) => [...old, i])}
          />
          <SectionInput
            addSection={(s: TypedRecipeSection) =>
              props.onIngredientsChanged([...props.ingredients, s])
            }
          />
        </>
      )}
    </div>
  )
}

export default IngredientList
