import { EnhancedPermissionGuard } from '@/components/guards/enhanced-permission-guard'
import { RecipeCreate } from '../components'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Create New Recipe | SPPG Dashboard',
  description: 'Add new recipe with complete instructions, ingredients, and nutrition information for school feeding programs.',
  keywords: ['create recipe', 'new recipe', 'add recipe', 'cooking instructions', 'recipe ingredients'],
}

export const dynamic = 'force-dynamic'

export default function NewRecipePage() {
  return (
    <EnhancedPermissionGuard permission="recipes.create">
      <RecipeCreate />
    </EnhancedPermissionGuard>
  )
}
