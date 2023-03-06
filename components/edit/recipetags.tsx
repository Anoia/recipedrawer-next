import { useState } from 'react'
import StandardInput, { StandardInputLabel } from '../lib/styledcomponents'

export type RecipeTagsPros = {
  tags: Tag[]
  options: string[]
  changed: (t: Tag[]) => void
}

function RecipeTags(props: RecipeTagsPros) {
  const removeTag = (i: number) => {
    const tags = [...props.tags]
    tags.splice(i, 1)
    return tags
  }

  const [input, setInput] = useState('')

  const handleKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key == 'Enter') {
      const newTag: Tag = { name: input }
      props.changed([...props.tags, newTag])
      setInput('')
    }
  }

  return (
    <div className="space-y-2">
      <div className="space-x-1">
        <StandardInputLabel>Tags:</StandardInputLabel>

        {props.tags.map((t, i) => {
          return (
            <TagEdit
              key={t.name}
              tag={t}
              index={i}
              deleted={(i: number) => props.changed(removeTag(i))}
            />
          )
        })}
      </div>
      <div>
        <StandardInputLabel>Add Tag:</StandardInputLabel>
        <StandardInput
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyUp={handleKey}
        ></StandardInput>
      </div>
    </div>
  )
}

export type Tag = {
  name: string
}

export function TagEdit(props: {
  tag: Tag
  index: number
  deleted: (i: number) => void
}) {
  return (
    <p className="inline py-1 px-3 text-sm text-white bg-emerald-600 rounded-xl">
      <span>{props.tag.name}</span>
      <button
        className="pl-1 ml-1 font-bold"
        onClick={() => props.deleted(props.index)}
      >
        x
      </button>
    </p>
  )
}

export function TagDisplay(props: Tag) {
  return (
    <p className="inline py-1 px-3 text-sm text-white bg-emerald-600 rounded-xl">
      <span>{props.name}</span>
    </p>
  )
}

export function TagsDisplay(props: { tags: Tag[] }) {
  return (
    <div className="space-x-1">
      {props.tags.map((t) => {
        return <TagDisplay key={t.name} name={t.name} />
      })}
    </div>
  )
}

export default RecipeTags
