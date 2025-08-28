"use client"

import { useQuery } from "@tanstack/react-query"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, FileText, Download, CheckCircle, AlertTriangle, Thermometer, Eye, Utensils } from "lucide-react"
import Link from "next/link"

async function fetchQualityStandards() {
  const response = await fetch("/api/production/quality-standards?isActive=true")
  if (!response.ok) throw new Error("Failed to fetch quality standards")
  const result = await response.json()
  return result.data || []
}

const sopSections = [
  {
    id: "temperature",
    title: "Temperature Control",
    icon: Thermometer,
    guidelines: [
      "Maintain cold storage at 4°C or below for perishable items",
      "Ensure hot food service temperature above 65°C",
      "Monitor temperature every 2 hours during production",
      "Record temperature readings in quality logs",
      "Take immediate corrective action if temperature deviates"
    ]
  },
  {
    id: "visual",
    title: "Visual Inspection",
    icon: Eye,
    guidelines: [
      "Check food appearance for color, texture, and freshness",
      "Inspect for any signs of contamination or foreign objects",
      "Verify proper food presentation and portioning",
      "Document any visual defects or abnormalities",
      "Take photos for quality documentation when needed"
    ]
  },
  {
    id: "hygiene",
    title: "Hygiene Standards",
    icon: CheckCircle,
    guidelines: [
      "All staff must wash hands before handling food",
      "Use proper protective equipment (gloves, hairnets, aprons)",
      "Clean and sanitize work surfaces every 2 hours",
      "Follow proper food storage and handling procedures",
      "Maintain personal hygiene standards at all times"
    ]
  },
  {
    id: "portion",
    title: "Portion Control",
    icon: Utensils,
    guidelines: [
      "Use standardized measuring tools and scales",
      "Weigh random samples to verify portion accuracy",
      "Target portion size: 250g per student serving",
      "Allow ±5% variance from target portion size",
      "Record portion weights in quality control logs"
    ]
  }
]

export default function SOPGuidelinesPage() {
  const { data: qualityStandards = [], isLoading } = useQuery({
    queryKey: ["quality-standards"],
    queryFn: fetchQualityStandards
  })

  const getCategoryStandards = (category: string) => {
    return qualityStandards.filter((standard: any) => standard.category === category)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Link href="/dashboard/production/quality">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Quality Control
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-bold tracking-tight">SOP Guidelines</h1>
          <p className="text-muted-foreground">
            Standard Operating Procedures for Food Quality Control
          </p>
        </div>
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Download PDF
        </Button>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="temperature">Temperature</TabsTrigger>
          <TabsTrigger value="visual">Visual</TabsTrigger>
          <TabsTrigger value="hygiene">Hygiene</TabsTrigger>
          <TabsTrigger value="portion">Portion</TabsTrigger>
          <TabsTrigger value="safety">Safety</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Quality Control Overview</CardTitle>
              <CardDescription>
                Comprehensive guide to food quality management in school nutrition programs
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                {sopSections.map((section) => {
                  const Icon = section.icon
                  return (
                    <Card key={section.id}>
                      <CardHeader className="pb-3">
                        <div className="flex items-center space-x-2">
                          <Icon className="h-5 w-5 text-primary" />
                          <CardTitle className="text-lg">{section.title}</CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-1 text-sm">
                          {section.guidelines.slice(0, 3).map((guideline, index) => (
                            <li key={index} className="flex items-start space-x-2">
                              <CheckCircle className="h-3 w-3 text-green-500 mt-0.5 flex-shrink-0" />
                              <span className="text-muted-foreground">{guideline}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Current Quality Standards</CardTitle>
              <CardDescription>
                Active quality standards and their current compliance levels
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-8">Loading quality standards...</div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {qualityStandards.map((standard: any) => {
                    const compliance = (standard.currentValue / standard.targetValue) * 100
                    return (
                      <Card key={standard.id}>
                        <CardContent className="pt-6">
                          <div className="space-y-2">
                            <h4 className="font-semibold text-sm">{standard.name}</h4>
                            <p className="text-xs text-muted-foreground">{standard.description}</p>
                            <div className="flex items-center justify-between">
                              <span className="text-sm">
                                {standard.currentValue}{standard.unit} / {standard.targetValue}{standard.unit}
                              </span>
                              <Badge variant={compliance >= 95 ? "default" : compliance >= 90 ? "secondary" : "destructive"}>
                                {compliance.toFixed(1)}%
                              </Badge>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {sopSections.map((section) => (
          <TabsContent key={section.id} value={section.id} className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <section.icon className="h-6 w-6 text-primary" />
                  <CardTitle>{section.title} SOP</CardTitle>
                </div>
                <CardDescription>
                  Detailed standard operating procedures for {section.title.toLowerCase()}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Guidelines</h3>
                  <ul className="space-y-3">
                    {section.guidelines.map((guideline, index) => (
                      <li key={index} className="flex items-start space-x-3">
                        <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>{guideline}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Related Quality Standards</h3>
                  <div className="grid gap-3">
                    {getCategoryStandards(section.id.toUpperCase() + "_CONTROL").map((standard: any) => (
                      <Card key={standard.id}>
                        <CardContent className="pt-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium">{standard.name}</h4>
                              <p className="text-sm text-muted-foreground">{standard.description}</p>
                            </div>
                            <div className="text-right">
                              <div className="font-medium">
                                {standard.currentValue}{standard.unit} / {standard.targetValue}{standard.unit}
                              </div>
                              <Badge variant="outline">
                                {((standard.currentValue / standard.targetValue) * 100).toFixed(1)}% compliance
                              </Badge>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <AlertTriangle className="h-5 w-5 text-blue-500 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-blue-900">Important Note</h4>
                      <p className="text-sm text-blue-700 mt-1">
                        All quality checkpoints must be documented immediately. Any deviations from SOP must be reported and corrective actions taken within 15 minutes.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}

        <TabsContent value="safety" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Food Safety Protocols</CardTitle>
              <CardDescription>
                Critical safety procedures and HACCP compliance
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">HACCP Critical Control Points</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Receiving and storage of raw materials</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Cooking temperatures and times</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Hot holding and service temperatures</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Cross-contamination prevention</span>
                    </li>
                  </ul>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Emergency Procedures</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start space-x-3">
                      <AlertTriangle className="h-5 w-5 text-orange-500 mt-0.5 flex-shrink-0" />
                      <span>Immediate isolation of contaminated products</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <AlertTriangle className="h-5 w-5 text-orange-500 mt-0.5 flex-shrink-0" />
                      <span>Notification of supervisor within 5 minutes</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <AlertTriangle className="h-5 w-5 text-orange-500 mt-0.5 flex-shrink-0" />
                      <span>Documentation of incident and corrective actions</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <AlertTriangle className="h-5 w-5 text-orange-500 mt-0.5 flex-shrink-0" />
                      <span>Review and update procedures if needed</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Safety Standards Compliance</h3>
                <div className="grid gap-3">
                  {getCategoryStandards("SAFETY_STANDARDS").map((standard: any) => (
                    <Card key={standard.id}>
                      <CardContent className="pt-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">{standard.name}</h4>
                            <p className="text-sm text-muted-foreground">{standard.description}</p>
                          </div>
                          <div className="text-right">
                            <div className="font-medium">
                              {standard.currentValue}{standard.unit} / {standard.targetValue}{standard.unit}
                            </div>
                            <Badge variant={standard.currentValue >= standard.targetValue * 0.95 ? "default" : "destructive"}>
                              {((standard.currentValue / standard.targetValue) * 100).toFixed(1)}% compliance
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
