import { EnhancedPermissionGuard } from '@/components/guards/enhanced-permission-guard'
import { RecipesList } from './components'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Recipe Management | SPPG Dashboard',
  description: 'Manage cooking recipes for school feeding programs with comprehensive recipe management system.',
  keywords: ['recipe', 'cooking', 'menu', 'ingredients', 'instructions', 'nutrition', 'school'],
}

export default function RecipesPage() {
  return (
    <EnhancedPermissionGuard permission="recipes.view">
      <RecipesList />
    </EnhancedPermissionGuard>
  )
}
