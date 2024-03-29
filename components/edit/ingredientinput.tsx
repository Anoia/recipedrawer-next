import { ingredient, unit } from '@prisma/client'
import fuzzysort from 'fuzzysort'
import { useEffect, useState } from 'react'
import { TypedRecipeIngredient } from '../../pages/edit/[id]'
import { extractRecipeMatchResult, Maybe } from '../../utils/parseIngredient'
import StandardInput, { StandardInputLabel } from '../lib/styledcomponents'
import CreateIngredient from './createingredient'

export type IngredientSelection = {
  amount: number
  unit: Maybe<unit>
  ingredientString: string
  extraInfo: Maybe<string>
}

function IngredientInput(props: {
  ingredients: Array<ingredient>
  units: Array<unit>
  elementId: string
  input: string
  selectIngredient: (i: TypedRecipeIngredient) => void
  createdNewIngredient: (i: ingredient) => void
  blur?: () => void
}) {
  const [dialogOpen, setDialogOpen] = useState(false)

  const [isInputFocused, setInputFocused] = useState(false)
  const [userInputString, setuserInputString] = useState(props.input)
  const [currentIngredientSelectionIndex, setCurrentIngredientSelectionIndex] =
    useState(0)

  const [matchResult, setMatchResult] =
    useState<Maybe<IngredientSelection>>(undefined)

  useEffect(() => {
    function findExactUnitMatch(unitName: string): Maybe<unit> {
      return props.units.find(
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
  }, [userInputString, props.units])

  function calcFuzzy(target: string, ingredients: ingredient[]) {
    const fuzzySortResult = fuzzysort
      .go(target, ingredients, {
        key: 'name',
        all: true,
        threshold: -50000,
      })
      .map((f) => f.obj)

    fuzzySortResult.push({
      id: -1,
      created_at: new Date(),
      name: 'Neue Zutat anlegen',
      recipe_id: null,
      diet: 'vegan',
    })

    return fuzzySortResult
  }

  const [fuzzyIngredients, setFuzzyIngredients] = useState<Array<ingredient>>(
    calcFuzzy('', props.ingredients)
  )

  useEffect(() => {
    setFuzzyIngredients(
      calcFuzzy(matchResult?.ingredientString ?? '', props.ingredients)
    )
  }, [props.ingredients, matchResult])

  function escapeReg(i: string) {
    return i.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  }

  function findPossibleUnits(unitName: string): unit[] {
    const regexp = new RegExp(escapeReg(unitName.trim()), 'i')
    return props.units.filter(
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
      doSelect()
    }

    if (e.key == 'Escape') {
      const inputElem = document.getElementById(`${props.elementId}-input`)
      inputElem?.blur()
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

  const defaultUnit =
    props.units.find((x) => x.long_name == 'Stück') ?? props.units[0]

  const doSelect = () => {
    if (matchResult) {
      const selected = fuzzyIngredients[currentIngredientSelectionIndex]

      if (selected.id === -1) {
        setDialogOpen(true)
      } else {
        const result: TypedRecipeIngredient = {
          type: 'ingredient',
          name: selected.name,
          id: Date.now().toString(),
          ingredient_id: selected.id,
          amount: matchResult.amount,
          unit: matchResult.unit || defaultUnit,
          diet: selected.diet,
          extraInfo: matchResult.extraInfo,
        }

        props.selectIngredient(result)
        setuserInputString(props.input)
        setCurrentIngredientSelectionIndex(0)
      }
    }
  }

  const onBlur = () => {
    if (!dialogOpen) {
      setuserInputString(props.input)
      setInputFocused(false)
      if (props.blur) {
        props.blur()
      }
    }
  }

  if (props.units.length > 0 && props.ingredients.length > 0) {
    return (
      <div className="max-w-2xl w-full">
        <div>
          {props.input == '' && (
            <StandardInputLabel>Neue Zutat hinzufügen</StandardInputLabel>
          )}
          <StandardInput
            className="text-xl"
            type="text"
            value={userInputString}
            onChange={(e) => setuserInputString(e.target.value)}
            onFocus={() => setInputFocused(true)}
            onBlur={onBlur}
            onKeyUp={handleKey}
            placeholder="100g Mehl"
            id={`${props.elementId}-input`}
          />
          {showAutocomplete() && (
            <div
              className="max-h-28 overflow-y-auto scrollbar-hide border bg-gray-50"
              id={`${props.elementId}-wrapper`}
            >
              <ul>
                {fuzzyIngredients.map((i, idx) => (
                  <li
                    id={`autocompleteingredient-${idx}`}
                    key={i.id}
                    className={
                      (currentIngredientSelectionIndex == idx
                        ? 'bg-slate-300'
                        : '') + ' last:border-t-2'
                    }
                    onMouseEnter={() => setCurrentIngredientSelectionIndex(idx)}
                    onMouseDown={doSelect}
                  >
                    {i.name}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <CreateIngredient
          isOpen={dialogOpen}
          input={matchResult?.ingredientString ?? ''}
          close={() => setDialogOpen(false)}
          created={(i: ingredient) => {
            props.createdNewIngredient(i)
            setDialogOpen(false)
          }}
        />
      </div>
    )
  } else {
    return null
  }
}

export default IngredientInput
