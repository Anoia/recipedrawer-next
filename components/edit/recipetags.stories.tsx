import { action } from '@ladle/react'
import RecipeTags, { TagsDisplay } from './recipetags'

export const recipeTagsEdit = () => (
  <RecipeTags
    options={['one', 'two']}
    tags={[{ name: 'The Tag' }, { name: 'Other' }, { name: 'Something' }]}
    changed={action('tags changed')}
  />
)

export const tagsDisplay = () => (
  <TagsDisplay tags={[{ name: 'tag one' }, { name: 'something' }]} />
)
