export declare type Maybe<T> = null | undefined | T

export const regexStringIngredientInput =
  /([0-9.,]{1,})([ ]*)([a-zA-ZäÄöÖüÜß]{0,})([ ]+)([a-zA-ZäÄöÖüÜß ]+)(\(\(([a-zA-ZäÄöÖüÜß ,.!-]+)\)\))*/

export type MatchResult = {
  amount: number
  unitName: Maybe<string>
  ingredientName: string
  extra_info: Maybe<string>
}

export function extractRecipeMatchResult(input: string): Maybe<MatchResult> {
  const match = regexStringIngredientInput.exec(input)

  if (!match || match.length < 6) {
    return undefined
  } else {
    return {
      amount: +match[1],
      unitName: match[3] == '' ? undefined : match[3],
      ingredientName: match[5].trim(),
      extra_info: match[7],
    }
  }
}

export type Time = {
  minutes: number | undefined
  hours: number | undefined
}

export const regexStringTime =
  /(([0-9]{0,})([ ]*)([Hh]ours|[Hh]our|[Hh]))?([ ]*)(([0-9]{0,})?([ ]*)([Mm]inutes|[Mm]inute|[Mm]))?/

export function extractTimeFromString(input: string): Maybe<Time> {
  const match = regexStringTime.exec(input)

  if (match) {
    const m = parseInt(match[7])
    const h = parseInt(match[2])

    if (Number.isInteger(m) || Number.isInteger(h)) {
      return {
        minutes: Number.isInteger(m) ? m : undefined,
        hours: Number.isInteger(h) ? h : undefined,
      }
    }
  }
  return undefined
}

export function convertTimeToInterval(time: Time): string {
  const hours: string = time.hours ? `${time.hours}h` : ''
  const minutes: string = time.minutes ? `${time.minutes}m` : ''
  return hours + minutes
}

export function inputStringToInterval(input: string | undefined) {
  if (input) {
    const time = extractTimeFromString(input)
    if (time) {
      return convertTimeToInterval(time)
    }
  }
  return undefined
}
