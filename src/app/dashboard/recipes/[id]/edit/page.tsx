import { PermissionGuard } from '@/components/guards/permission-guard'
import { RecipeEdit } from '../../components'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Edit Recipe | SPPG Dashboard',
  description: 'Edit and update recipe by modifying ingredients, instructions, and nutrition information.',
  keywords: ['edit recipe', 'update recipe', 'modify recipe', 'recipe modification'],
}

interface RecipeEditPageProps {
  params: Promise<{ id: string }>
}

export default async function RecipeEditPage({ params }: RecipeEditPageProps) {
  const { id } = await params
  
  return (
    <PermissionGuard permission="recipes.edit">
      <RecipeEdit recipeId={id} />
    </PermissionGuard>
  )
}
