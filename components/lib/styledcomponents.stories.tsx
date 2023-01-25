import StandardInput, { StandardInputLabel } from './styledcomponents'

export const Label = () => (
  <StandardInputLabel>This is a Label</StandardInputLabel>
)

export const InputEmpty = () => (
  <StandardInput placeholder="the placeholder"></StandardInput>
)

export const InputFilles = () => (
  <StandardInput value="With input"></StandardInput>
)
