import {
  TypedRecipeIngredient,
  TypedRecipeSection,
} from '../../pages/edit/[id]'
import IngredientInput from './ingredientinput'
import SectionInput from './sectioninput'

function IngredientList(props: {
  ingredients: Array<TypedRecipeIngredient | TypedRecipeSection>

  onIngredientsChanged: (
    i: Array<TypedRecipeIngredient | TypedRecipeSection>
  ) => void
}) {
  const ingredientComponents = props.ingredients.map((i, idx) => {
    if (i.type === 'ingredient') {
      return (
        <li className="py-1" key={`${i.name}-${idx}`}>
          <span>
            {i.amount} {i.unit.short_name} {i.name}
          </span>
          <span className="ml-2 text-sm text-gray-600">{i.extraInfo}</span>
        </li>
      )
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
      <IngredientInput
        elementId="autocomplete"
        input=""
        selectIngredient={(i: TypedRecipeIngredient) => {
          console.log(`adding ${i.name}`)
          props.onIngredientsChanged([...props.ingredients, i])
        }}
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
