import { ChangeEvent, useState } from 'react'
import { TypedRecipeSection } from '../../pages/edit/[id]'
import StandardInput, { StandardInputLabel } from '../lib/styledcomponents'

function SectionInput(props: { addSection: (x: TypedRecipeSection) => void }) {
  const [section, setSection] = useState('')

  const keyDownHandler = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.code === 'Enter') {
      if (section.trim() != '') {
        props.addSection({
          type: 'section',
          name: section,
        })
      }
      setSection('')
    }
  }

  return (
    <div className="">
      <StandardInputLabel className="mt-5">
        Neuen Abschnitt hinzufügen
      </StandardInputLabel>
      <StandardInput
        placeholder="Add section"
        value={section}
        onKeyDown={keyDownHandler}
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          setSection(e.target.value)
        }
      />
    </div>
  )
}

export default SectionInput
