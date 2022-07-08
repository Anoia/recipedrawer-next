import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { supabase } from '../../utils/supabaseClient'

function RecipePage({ data }: any) {
  return <div>Recipe: {data.name}</div>
}

export default RecipePage

export async function getServerSideProps(context: any) {
  //const router = useRouter()
  const { id } = context.query

  const { data: recipe, error } = await supabase
    .from('recipe')
    .select('id, name, description')
    .eq('id', id)

  const data = recipe && recipe.length == 1 ? recipe[0] : { name: 'error' }

  // Pass data to the page via props
  return { props: { data } }
}
