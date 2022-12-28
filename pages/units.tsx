import { unit } from '@prisma/client'
import { NextPage } from 'next'
import { MouseEventHandler, useEffect, useState } from 'react'
import StandardInput, {
  StandardInputLabel,
} from '../components/lib/styledcomponents'
import { supabaseTyped } from '../utils/supabaseClient'

const UnitsPage: NextPage = () => {
  const [units, setUnits] = useState<Array<unit>>([])

  useEffect(() => {
    const fetchUnits = async () => {
      const { data, error } = await supabaseTyped.from('unit').select('*')

      if (error) console.log(JSON.stringify(error))
      if (data) setUnits(data)
    }

    fetchUnits()
  }, [])

  return (
    <div className="container mx-auto my-12 max-w-4xl">
      <h1 className="text-2xl my-2">Units</h1>
      <ul>
        {units.map((u) => {
          return (
            <li key={u.id}>
              {u.short_name} - {u.long_name}
            </li>
          )
        })}
      </ul>
      <hr className="my-5" />
      <h1 className="text-lg my-2">Create new Unit</h1>
      {CreateNewUnit((s) => setUnits((units) => [s, ...units]))}
    </div>
  )
}

export default UnitsPage

function CreateNewUnit(newUnit: (u: unit) => void) {
  const [shortName, setShortName] = useState<string>('')
  const [longName, setLongName] = useState<string>('')

  const handleSave: MouseEventHandler = async (e) => {
    e.preventDefault
    const result = await supabaseTyped
      .from('unit')
      .insert({
        long_name: longName,
        short_name: shortName,
      })
      .select()

    if (result.error) console.log('Error on insert: ' + result.error)
    if (result.data) newUnit(result.data[0])
    setShortName('')
    setLongName('')
  }

  return (
    <div className="flex items-end space-x-5">
      <div>
        <StandardInputLabel>Short Name</StandardInputLabel>
        <StandardInput
          value={shortName}
          onChange={(i) => setShortName(i.target.value)}
        ></StandardInput>
      </div>

      <div>
        <StandardInputLabel>Long Name</StandardInputLabel>
        <StandardInput
          value={longName}
          onChange={(i) => setLongName(i.target.value)}
        ></StandardInput>
      </div>
      <div>
        <button
          className="hover:bg-teal-800 focus:bg-teal-800 bg-teal-700 text-white py-3 px-12"
          onClick={handleSave}
        >
          Speichern
        </button>
      </div>
    </div>
  )
}
