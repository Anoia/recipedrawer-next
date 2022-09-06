import { ingredient, unit } from '@prisma/client'
import fuzzysort from 'fuzzysort'
import { useEffect, useState } from 'react'
import { TypedRecipeIngredient } from '../../pages/edit/[id]'
import { extractRecipeMatchResult, Maybe } from '../../utils/parseIngredient'
import { supabase } from '../../utils/supabaseClient'

export type IngredientSelection = {
  amount: number
  unit: Maybe<unit>
  ingredientString: string
  extraInfo: Maybe<string>
}

function IngredientInput(props: {
  elementId: string
  input: string
  selectIngredient: (i: TypedRecipeIngredient) => void
}) {
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
  }, [props])

  const [isInputFocused, setInputFocused] = useState(false)
  const [userInputString, setuserInputString] = useState(props.input)
  const [currentIngredientSelectionIndex, setCurrentIngredientSelectionIndex] =
    useState(0)

  const [matchResult, setMatchResult] =
    useState<Maybe<IngredientSelection>>(undefined)

  useEffect(() => {
    function findExactUnitMatch(unitName: string): Maybe<unit> {
      return units.find(
        (u) =>
          u.long_name.toLowerCase() === unitName.toLowerCase() ||
          u.short_name.toLowerCase() === unitName.toLowerCase()
      )
    }

    const match = extractRecipeMatchResult(userInputString)

    if (match) {
      const possibleUnit = match.unitName
        ? findExactUnitMatch(match.unitName)
        : undefined

      const rawIngredientString = match.ingredientName.trim()
      const ingredientString =
        match.unitName != undefined &&
        possibleUnit == undefined &&
        rawIngredientString
          ? `${match.unitName} ${rawIngredientString}`
          : rawIngredientString

      const result: IngredientSelection = {
        amount: match.amount,
        unit: possibleUnit,
        ingredientString: ingredientString,
        extraInfo: match.extra_info,
      }

      setMatchResult(result)
    } else {
      setMatchResult(undefined)
    }
  }, [userInputString, units])

  function calcFuzzy(target: string, ingredients: ingredient[]) {
    return fuzzysort.go(target, ingredients, {
      key: 'name',
      all: true,
      threshold: -50000,
    })
  }

  const [fuzzyIngredients, setFuzzyIngredients] = useState<
    Fuzzysort.KeyResults<ingredient>
  >(calcFuzzy('', ingredients))

  useEffect(() => {
    setFuzzyIngredients(
      calcFuzzy(matchResult?.ingredientString ?? '', ingredients)
    )
  }, [ingredients, matchResult])

  function escapeReg(i: string) {
    return i.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  }

  function findPossibleUnits(unitName: string): unit[] {
    const regexp = new RegExp(escapeReg(unitName.trim()), 'i')
    return units.filter(
      (u) => u.long_name.match(regexp) || u.short_name.match(regexp)
    )
  }

  function showAutocomplete(): boolean {
    const unsureAboutInput =
      matchResult?.unit == undefined &&
      matchResult?.ingredientString != undefined &&
      findPossibleUnits(matchResult.ingredientString).length > 0
    return (
      isInputFocused &&
      !unsureAboutInput &&
      matchResult?.ingredientString != undefined &&
      matchResult?.ingredientString?.length >= 2
    )
  }

  const handleKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key == 'ArrowDown') {
      e.preventDefault
      if (
        showAutocomplete() &&
        currentIngredientSelectionIndex < fuzzyIngredients.length - 1
      ) {
        setCurrentIngredientSelectionIndex((i) => i + 1)
      }
    }
    if (e.key == 'ArrowUp') {
      e.preventDefault
      if (showAutocomplete() && currentIngredientSelectionIndex > 0) {
        setCurrentIngredientSelectionIndex((i) => i - 1)
        scrollSelectionToView()
      }
    }

    if (e.key == 'Enter') {
      select()
    }
  }

  useEffect(() => {
    if (showAutocomplete()) scrollSelectionToView()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIngredientSelectionIndex])

  function scrollSelectionToView() {
    const wrapper = document.getElementById(`${props.elementId}-wrapper`)
    const selectedItem = document.getElementById(
      `autocompleteingredient-${currentIngredientSelectionIndex}`
    )

    if (showAutocomplete() && wrapper && selectedItem) {
      const heightOfWrapper = wrapper.offsetHeight

      const selectedItemPositionInList =
        selectedItem.offsetTop - wrapper.offsetTop
      const selectedItemScrollPosition =
        selectedItemPositionInList - wrapper.scrollTop

      if (selectedItemScrollPosition < 0) {
        wrapper.scrollTo(0, selectedItemPositionInList)
      } else if (
        selectedItemScrollPosition + selectedItem.scrollHeight >
        heightOfWrapper
      ) {
        wrapper.scrollTo(
          0,
          selectedItemPositionInList -
            heightOfWrapper +
            selectedItem.scrollHeight
        )
      }
    }
  }

  const select = () => {
    if (matchResult) {
      const selected = fuzzyIngredients[currentIngredientSelectionIndex]?.obj

      const result: TypedRecipeIngredient = {
        type: 'ingredient',
        name: selected.name,
        id: undefined,
        ingredient_id: selected.id,
        amount: matchResult.amount,
        unit: matchResult.unit || units[0],
        diet: selected.diet,
        extraInfo: matchResult.extraInfo,
      }

      props.selectIngredient(result)
      setuserInputString(props.input)
      setCurrentIngredientSelectionIndex(0)
      blur()
    }
  }

  if (units.length > 0 && ingredients.length > 0) {
    return (
      <div className="max-w-2xl w-full">
        <div>
          <p>
            <span>Selection {currentIngredientSelectionIndex}: </span>
            <span>
              {fuzzyIngredients[currentIngredientSelectionIndex]?.obj.name}
            </span>
          </p>
          <p>{JSON.stringify(matchResult)}</p>
          <input
            className="border text-xl mt-5 w-full"
            type="text"
            value={userInputString}
            onChange={(e) => setuserInputString(e.target.value)}
            onFocus={() => setInputFocused(true)}
            onBlur={() => setInputFocused(false)}
            onKeyDown={handleKey}
            placeholder="100g Mehl"
          />
          {showAutocomplete() && (
            <div
              className="max-h-28 overflow-y-auto scrollbar-hide"
              id={`${props.elementId}-wrapper`}
            >
              <ul>
                {fuzzyIngredients.map((i, idx) => (
                  <li
                    id={`autocompleteingredient-${idx}`}
                    key={i.obj.id}
                    className={
                      currentIngredientSelectionIndex == idx
                        ? 'bg-slate-300'
                        : ''
                    }
                    onMouseEnter={() => setCurrentIngredientSelectionIndex(idx)}
                    onMouseDown={select}
                  >
                    {i.obj.name}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    )
  } else {
    return null
  }
}

export default IngredientInput
