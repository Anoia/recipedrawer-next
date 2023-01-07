import { useRouter } from 'next/router'
import Editorcreate from '../components/editorcreate'
import { CreateResponseData } from './api/create'
import { EditableRecipe, EmptyRecipe } from './edit/[id]'

function CreateRecipePage() {
  const router = useRouter()

  const handleSave = async (recipe: EditableRecipe) => {
    const response = await fetch(`/api/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(recipe),
    })

    if (response.status === 200) {
      const resp = (await response.json()) as CreateResponseData
      if ('id' in resp) {
        router.push(`/recipe/${resp.id}`)
      }
    } else {
      console.log(
        `error during saving, got status ${response.status}: ${JSON.stringify(
          response.body
        )}`
      )
    }
  }

  return (
    <div className="container mx-auto  my-12 max-w-4xl">
      <Editorcreate
        recipe={{ ...EmptyRecipe }}
        save={handleSave}
        cancel={() => router.push(`/`)}
      />
    </div>
  )
}

export default CreateRecipePage
