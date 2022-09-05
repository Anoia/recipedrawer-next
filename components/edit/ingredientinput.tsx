import { ingredient, unit } from '@prisma/client'
import { useEffect, useState } from 'react'
import { supabase } from '../../utils/supabaseClient'

function IngredientInput(props: { elementId: string; input: string }) {
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

  function showAutocomplete(): boolean {
    return userInputString.length > 3 && isInputFocused
  }

  const handleKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key == 'ArrowDown') {
      e.preventDefault
      if (
        showAutocomplete() &&
        currentIngredientSelectionIndex < ingredients.length - 1
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

  if (units.length > 0 && ingredients.length > 0) {
    return (
      <div className="max-w-2xl w-full">
        <div>
          <p>
            <span>Selection {currentIngredientSelectionIndex}: </span>
            <span>{ingredients[currentIngredientSelectionIndex].name}</span>
          </p>
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
                {ingredients.map((i, idx) => (
                  <li
                    id={`autocompleteingredient-${idx}`}
                    key={i.id}
                    className={
                      currentIngredientSelectionIndex == idx
                        ? 'bg-slate-300'
                        : ''
                    }
                    onMouseEnter={() => setCurrentIngredientSelectionIndex(idx)}
                  >
                    {i.name}
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
