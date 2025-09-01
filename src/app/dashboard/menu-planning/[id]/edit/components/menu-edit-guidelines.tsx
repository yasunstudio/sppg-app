'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Lightbulb, Target, CheckCircle2 } from 'lucide-react'

export function MenuEditGuidelines() {
  const guidelines = [
    {
      icon: Lightbulb,
      title: 'Edit Information',
      description: 'Update menu name, description, and food type according to school children nutrition targets'
    },
    {
      icon: Target,
      title: 'Nutrition Targets',
      description: 'Adjust calories, protein, carbohydrates, and other nutrients based on Indonesian RDA'
    },
    {
      icon: CheckCircle2,
      title: 'Recipe Validation',
      description: 'Ensure updated recipes and ingredients meet SPPG safety and nutrition standards'
    }
  ]

  const tips = [
    'Review existing menu data before making changes',
    'Maintain nutritional balance when editing ingredients',
    'Consider cost implications of ingredient changes',
    'Save changes frequently during editing process'
  ]

  return (
    <div className="space-y-6">
      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        {guidelines.map((guideline, index) => (
          <Card key={index} className="border border-border bg-card/90 backdrop-blur-sm hover:shadow-lg transition-all duration-200">
            <CardContent className="p-4 md:p-6">
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-muted rounded-lg">
                  <guideline.icon className="w-5 h-5 text-primary" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-semibold text-foreground">{guideline.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {guideline.description}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tips Section */}
      <Card className="border-border bg-muted/50">
        <CardContent className="p-6 md:p-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Lightbulb className="w-5 h-5 text-primary" />
            </div>
            <h3 className="font-semibold text-lg text-foreground">Menu Editing Tips</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div className="space-y-3">
              {tips.slice(0, 2).map((tip, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 shrink-0"></div>
                  <p className="text-muted-foreground">{tip}</p>
                </div>
              ))}
            </div>
            <div className="space-y-3">
              {tips.slice(2).map((tip, index) => (
                <div key={index + 2} className="flex items-start space-x-3">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 shrink-0"></div>
                  <p className="text-muted-foreground">{tip}</p>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
