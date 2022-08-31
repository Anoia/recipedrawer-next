import { ChangeEvent, useEffect } from 'react'
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
      id: `${idx + 1}`,
      content: e.target.value,
    }
    props.onStepsChanged(newSteps)
  }

  return (
    <div>
      <p className="text-2xl pb-3">Zubereitung</p>
      <ul>
        {props.steps?.map((s, idx) => (
          <li key={idx}>
            <div className="flex items-start my-5">
              <span className="text-3xl mr-5">{s.id}</span>
              <textarea
                ref={(t) => {
                  if (t) textAreaRefs[idx] = t
                }}
                className="overflow-hidden resize-none grow border-2 border-white focus:border-slate-400 hover:focus:border-solid focus:ring-0 hover:border-dashed hover:border-slate-400"
                value={s.content}
                onChange={(e) => textChangedHandler(e, idx)}
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default StepList
