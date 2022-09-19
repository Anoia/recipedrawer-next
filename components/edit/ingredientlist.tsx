import { ingredient, unit } from '@prisma/client'
import { useEffect, useState } from 'react'
import {
  TypedRecipeIngredient,
  TypedRecipeSection,
} from '../../pages/edit/[id]'
import { supabase } from '../../utils/supabaseClient'
import IngredientInput from './ingredientinput'
import SectionInput from './sectioninput'

function IngredientList(props: {
  ingredients: Array<TypedRecipeIngredient | TypedRecipeSection>

  onIngredientsChanged: (
    i: Array<TypedRecipeIngredient | TypedRecipeSection>
  ) => void
}) {
  const [currentlyEditing, setCurrentlyEditing] = useState(-1)

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
    if (currentlyEditing > -1) {
      document
        .getElementById(
          `autocomplete-${props.ingredients[currentlyEditing].name}-${currentlyEditing}-input`
        )
        ?.focus()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentlyEditing])

  const ingredientComponents = props.ingredients.map((i, idx) => {
    if (i.type === 'ingredient') {
      if (currentlyEditing === idx) {
        return (
          <li className="py-1" key={`${i.name}-${idx}`}>
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
                setCurrentlyEditing(-1)
              }}
              createdNewIngredient={(i) => setIngredients((old) => [...old, i])}
              blur={() => setCurrentlyEditing(-1)}
            />
          </li>
        )
      } else {
        return (
          <li
            className="py-1"
            key={`${i.name}-${idx}`}
            onClick={() => setCurrentlyEditing(idx)}
          >
            <span className="">
              {i.amount} {i.unit.short_name}{' '}
            </span>
            <span>{i.name}</span>
            <span className="ml-2 text-sm text-gray-600">{i.extraInfo}</span>
          </li>
        )
      }
    } else {
      return (
        <li className="pt-3" key={`${i.name}-${idx}`}>
          <span className="font-extrabold">{i.name}</span>
        </li>
      )
    }
  })

  return (
    <div className="mx-3">
      <p className="text-2xl pb-3">Zutaten</p>
      <ul className="">{ingredientComponents}</ul>
      <p className="mt-12" />
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
    </div>
  )
}

export default IngredientList
