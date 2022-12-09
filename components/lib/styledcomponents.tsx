import { InputProps, LabelProps } from 'react-html-props'

function StandardInput({ children, className, ...divProps }: InputProps) {
  return (
    <input
      // text-sm
      className={`bg-gray-50 border lg:border-teal-300 border-gray-300 text-gray-900 text-sm  focus:ring-teal-400 focus:ring-1 focus:border-slate-700 block w-full p-2 outline-none  ${className}`}
      {...divProps}
    >
      {children}
    </input>
  )
}

export function StandardInputLabel({
  children,
  className,
  ...labelProps
}: LabelProps) {
  return (
    <label
      className={`block mb-1 text-sm font-medium text-gray-900 ${className}`}
      {...labelProps}
    >
      {children}
    </label>
  )
}
//block mb-2 text-sm font-medium text-gray-900
//bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500
export default StandardInput
