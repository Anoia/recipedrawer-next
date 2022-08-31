import { ChangeEvent, useEffect } from 'react'
import { generateRandomId } from '../../utils/stuff'
import { ReactSortable } from 'react-sortablejs'
import { Step } from '../../utils/prisma/recipe'

function resizeTextArea(ta: HTMLTextAreaElement) {
  ta.style.height = 'auto'
  ta.style.height = `${ta.scrollHeight}px`
}

function StepList(props: {
  steps: Step[]
  onStepsChanged: (s: Step[]) => void
}) {
  const textAreaRefs: HTMLTextAreaElement[] = []

  useEffect(() => {
    for (const textAreaRef of textAreaRefs) {
      resizeTextArea(textAreaRef)
    }
  })

  const textChangedHandler = (
    e: ChangeEvent<HTMLTextAreaElement>,
    idx: number
  ) => {
    resizeTextArea(e.target)

    const newSteps = [...props.steps]
    newSteps[idx] = {
      content: e.target.value,
      id: newSteps[idx].id,
    }
    props.onStepsChanged(newSteps)
  }

  const addNewStep = () => {
    if (props.steps[props.steps.length - 1].content.trim() === '') {
      textAreaRefs[textAreaRefs.length - 1].focus()
    } else {
      const newSteps = [...props.steps]
      const idx = newSteps.length
      newSteps[idx] = {
        content: '',
        id: generateRandomId(),
      }
      props.onStepsChanged(newSteps)
    }
  }

  const removeStep = (idx: number) => {
    const newSteps = [...props.steps]
    newSteps.splice(idx, 1)
    props.onStepsChanged(newSteps)
  }

  return (
    <div>
      <p className="text-2xl pb-3">Zubereitung</p>
      <ul>
        <ReactSortable
          handle=".sort-handle"
          ghostClass="bg-gray-100"
          dragClass="bg-gray-200"
          list={props.steps}
          setList={(newList) => props.onStepsChanged(newList)}
        >
          {props.steps.map((s, idx) => (
            <li key={s.id}>
              <div className="flex items-start my-5 group ">
                <span className="sort-handle cursor-move text-3xl mr-5">
                  {idx + 1}
                </span>
                <textarea
                  ref={(t) => {
                    if (t) textAreaRefs[idx] = t
                  }}
                  className="bg-transparent focus:outline-none overflow-hidden resize-none grow  border border-transparent focus:border-gray-400 hover:focus:border-solid focus:ring-0 hover:border-dashed hover:border-gray-500"
                  value={s.content}
                  onChange={(e) => textChangedHandler(e, idx)}
                />
                <div>
                  <button
                    className="invisible group-hover:visible m-2"
                    onClick={() => removeStep(idx)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      className="bi bi-trash"
                      viewBox="0 0 16 16"
                    >
                      <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" />
                      <path
                        fillRule="evenodd"
                        d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ReactSortable>
      </ul>
      <div className="flex justify-center">
        <button className="text-4xl hover:font-bold" onClick={addNewStep}>
          +
        </button>
      </div>
    </div>
  )
}

export default StepList
