import { EnhancedPermissionGuard } from '@/components/guards/enhanced-permission-guard'
import { RecipeDetails } from '../components'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Recipe Details | SPPG Dashboard',
  description: 'View complete recipe details including ingredients, instructions, and nutrition information.',
  keywords: ['recipe details', 'cooking recipe', 'recipe ingredients', 'instructions', 'nutrition'],
}

interface RecipePageProps {
  params: Promise<{ id: string }>
}

export default async function RecipePage({ params }: RecipePageProps) {
  const { id } = await params
  
  return (
    <EnhancedPermissionGuard permission="recipes.view">
      <RecipeDetails recipeId={id} />
    </EnhancedPermissionGuard>
  )
}
