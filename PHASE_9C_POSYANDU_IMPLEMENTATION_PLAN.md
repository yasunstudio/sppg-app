# PHASE 9C: POSYANDU MANAGEMENT SYSTEM - IMPLEMENTATION PLAN

## Overview
**Phase Goal:** Implement Posyandu (Integrated Health Post) Management System  
**Target:** Increase database utilization from 60% to 75% (+15%)  
**Focus:** Pregnant women, lactating mothers, and toddler nutrition management  
**Integration:** Connect with existing Recipe and Production systems for specialized nutrition

## 🎯 Objectives

### 1. Posyandu Program Management
- **Posyandu Registration System** - Manage health posts across regions
- **Program Scheduling** - Monthly health check schedules
- **Volunteer Management** - Cadre (volunteer) assignment and tracking
- **Resource Allocation** - Equipment and supply management

### 2. Maternal & Child Health Tracking
- **Pregnant Women Registry** - Prenatal nutrition tracking
- **Lactating Mothers Program** - Postpartum nutrition support
- **Toddler Growth Monitoring** - Height, weight, nutritional status
- **Health Assessments** - Regular check-up records

### 3. Specialized Nutrition Programs
- **Maternal Nutrition Recipes** - Iron, folate, calcium-rich menus
- **Lactation Support Meals** - Galactagogue foods and balanced nutrition
- **Toddler Nutrition Plans** - Age-appropriate complementary feeding
- **Therapeutic Nutrition** - For malnourished children

### 4. Posyandu Analytics & Reporting
- **Growth Curve Analysis** - Individual and population trends
- **Nutrition Status Reports** - Stunting, wasting, underweight indicators
- **Program Effectiveness** - Intervention outcome tracking
- **Resource Utilization** - Cost-per-beneficiary analysis

## 📊 Database Models to Implement

### Core Posyandu Models
```prisma
Posyandu {
  id: String @id @default(cuid())
  name: String
  code: String @unique
  address: String
  village: String
  subDistrict: String
  district: String
  province: String
  coordinates: Json? // lat, lng
  establishedDate: DateTime
  status: PosyanduStatus
  cadreCount: Int
  monthlyTarget: Int
  
  // Relationships
  programs: PosyanduProgram[]
  participants: PosyanduParticipant[]
  activities: PosyanduActivity[]
  volunteers: PosyanduVolunteer[]
  
  createdAt: DateTime @default(now())
  updatedAt: DateTime @updatedAt
}

PosyanduProgram {
  id: String @id @default(cuid())
  posyanduId: String
  name: String
  description: String?
  programType: ProgramType
  targetBeneficiaries: Int
  startDate: DateTime
  endDate: DateTime?
  status: ProgramStatus
  budget: Decimal?
  
  // Relationships
  posyandu: Posyandu @relation(fields: [posyanduId], references: [id])
  participants: PosyanduParticipant[]
  activities: PosyanduActivity[]
  nutritionPlans: NutritionPlan[]
  
  createdAt: DateTime @default(now())
  updatedAt: DateTime @updatedAt
}

PosyanduParticipant {
  id: String @id @default(cuid())
  posyanduId: String
  programId: String?
  
  // Personal Info
  name: String
  nik: String? @unique
  dateOfBirth: DateTime
  gender: Gender
  address: String
  phoneNumber: String?
  
  // Participant Type
  participantType: ParticipantType // PREGNANT, LACTATING, TODDLER
  
  // Health Status
  currentWeight: Decimal?
  currentHeight: Decimal?
  nutritionStatus: NutritionStatus?
  healthCondition: String?
  allergies: String?
  
  // Relationships
  posyandu: Posyandu @relation(fields: [posyanduId], references: [id])
  program: PosyanduProgram? @relation(fields: [programId], references: [id])
  healthRecords: HealthRecord[]
  nutritionPlans: NutritionPlan[]
  
  createdAt: DateTime @default(now())
  updatedAt: DateTime @updatedAt
}

HealthRecord {
  id: String @id @default(cuid())
  participantId: String
  recordDate: DateTime
  
  // Measurements
  weight: Decimal?
  height: Decimal?
  headCircumference: Decimal? // For toddlers
  armCircumference: Decimal? // MUAC
  
  // Health Indicators
  bloodPressure: String?
  hemoglobin: Decimal?
  temperature: Decimal?
  
  // Growth Assessment
  weightForAge: String? // Z-score category
  heightForAge: String? // Z-score category
  weightForHeight: String? // Z-score category
  
  // Clinical Notes
  symptoms: String?
  diagnosis: String?
  treatment: String?
  notes: String?
  
  // Relationships
  participant: PosyanduParticipant @relation(fields: [participantId], references: [id])
  
  createdAt: DateTime @default(now())
  updatedAt: DateTime @updatedAt
}

NutritionPlan {
  id: String @id @default(cuid())
  participantId: String
  programId: String?
  
  planName: String
  description: String?
  targetCalories: Int?
  targetProtein: Decimal?
  targetFat: Decimal?
  targetCarbs: Decimal?
  
  // Special Requirements
  dietaryRestrictions: String?
  supplementation: String?
  
  startDate: DateTime
  endDate: DateTime?
  status: PlanStatus
  
  // Relationships
  participant: PosyanduParticipant @relation(fields: [participantId], references: [id])
  program: PosyanduProgram? @relation(fields: [programId], references: [id])
  recipes: NutritionPlanRecipe[]
  
  createdAt: DateTime @default(now())
  updatedAt: DateTime @updatedAt
}

NutritionPlanRecipe {
  id: String @id @default(cuid())
  nutritionPlanId: String
  recipeId: String
  
  frequency: String // Daily, Weekly, etc.
  portionSize: Decimal
  mealTime: MealTime
  notes: String?
  
  // Relationships
  nutritionPlan: NutritionPlan @relation(fields: [nutritionPlanId], references: [id])
  recipe: Recipe @relation(fields: [recipeId], references: [id])
  
  createdAt: DateTime @default(now())
  updatedAt: DateTime @updatedAt
}

PosyanduActivity {
  id: String @id @default(cuid())
  posyanduId: String
  programId: String?
  
  activityName: String
  activityType: ActivityType
  description: String?
  scheduledDate: DateTime
  actualDate: DateTime?
  duration: Int? // minutes
  
  participantCount: Int?
  targetParticipants: Int?
  
  status: ActivityStatus
  notes: String?
  
  // Relationships
  posyandu: Posyandu @relation(fields: [posyanduId], references: [id])
  program: PosyanduProgram? @relation(fields: [programId], references: [id])
  
  createdAt: DateTime @default(now())
  updatedAt: DateTime @updatedAt
}

PosyanduVolunteer {
  id: String @id @default(cuid())
  posyanduId: String
  userId: String?
  
  name: String
  phone: String?
  email: String?
  address: String
  
  role: VolunteerRole
  specialization: String?
  trainingStatus: TrainingStatus
  activeStatus: Boolean @default(true)
  
  joinDate: DateTime
  
  // Relationships
  posyandu: Posyandu @relation(fields: [posyanduId], references: [id])
  user: User? @relation(fields: [userId], references: [id])
  
  createdAt: DateTime @default(now())
  updatedAt: DateTime @updatedAt
}

// Enums
enum PosyanduStatus {
  ACTIVE
  INACTIVE
  UNDER_RENOVATION
  SUSPENDED
}

enum ProgramType {
  MATERNAL_HEALTH
  CHILD_NUTRITION
  IMMUNIZATION
  FAMILY_PLANNING
  HEALTH_EDUCATION
}

enum ParticipantType {
  PREGNANT
  LACTATING
  TODDLER
  ELDERLY
}

enum NutritionStatus {
  NORMAL
  UNDERWEIGHT
  OVERWEIGHT
  STUNTED
  WASTED
  SEVERE_MALNUTRITION
}

enum ActivityType {
  HEALTH_CHECK
  NUTRITION_COUNSELING
  COOKING_DEMONSTRATION
  HEALTH_EDUCATION
  IMMUNIZATION
  GROWTH_MONITORING
}

enum VolunteerRole {
  CADRE_COORDINATOR
  HEALTH_CADRE
  NUTRITION_CADRE
  DATA_RECORDER
  COMMUNITY_MOBILIZER
}

enum MealTime {
  BREAKFAST
  LUNCH
  DINNER
  SNACK_MORNING
  SNACK_AFTERNOON
}
```

## 🔧 API Endpoints to Develop

### Posyandu Management
- `GET /api/posyandu` - List all posyandu with filtering
- `POST /api/posyandu` - Create new posyandu
- `GET /api/posyandu/[id]` - Get posyandu details
- `PUT /api/posyandu/[id]` - Update posyandu
- `DELETE /api/posyandu/[id]` - Delete posyandu

### Participant Management
- `GET /api/posyandu/[id]/participants` - List participants
- `POST /api/posyandu/[id]/participants` - Register new participant
- `GET /api/participants/[id]` - Get participant details
- `PUT /api/participants/[id]` - Update participant info
- `GET /api/participants/[id]/health-records` - Get health history

### Health Records
- `POST /api/participants/[id]/health-records` - Add health record
- `GET /api/health-records/[id]` - Get specific record
- `PUT /api/health-records/[id]` - Update health record

### Nutrition Plans
- `GET /api/participants/[id]/nutrition-plans` - Get nutrition plans
- `POST /api/participants/[id]/nutrition-plans` - Create nutrition plan
- `GET /api/nutrition-plans/[id]` - Get plan details
- `PUT /api/nutrition-plans/[id]` - Update nutrition plan

### Program Management
- `GET /api/posyandu/[id]/programs` - List programs
- `POST /api/posyandu/[id]/programs` - Create new program
- `GET /api/programs/[id]` - Get program details
- `PUT /api/programs/[id]` - Update program

### Analytics & Reporting
- `GET /api/posyandu/[id]/analytics` - Posyandu performance metrics
- `GET /api/analytics/nutrition-status` - Population nutrition analysis
- `GET /api/analytics/growth-trends` - Growth curve analysis
- `GET /api/reports/program-effectiveness` - Program outcome reports

## 🎨 Frontend Pages to Build

### Posyandu Dashboard
- `/dashboard/posyandu` - Main posyandu overview
- `/dashboard/posyandu/[id]` - Individual posyandu management
- `/dashboard/posyandu/new` - Create new posyandu

### Participant Management
- `/dashboard/posyandu/[id]/participants` - Participant list
- `/dashboard/participants/[id]` - Individual participant profile
- `/dashboard/participants/[id]/health` - Health record timeline
- `/dashboard/participants/new` - Register new participant

### Nutrition Planning
- `/dashboard/nutrition-plans` - Nutrition plan overview
- `/dashboard/nutrition-plans/[id]` - Plan details and recipes
- `/dashboard/nutrition-plans/new` - Create nutrition plan

### Health Monitoring
- `/dashboard/health-records` - Health record management
- `/dashboard/health-records/new` - Add health check
- `/dashboard/analytics/growth` - Growth monitoring dashboard

### Program Management
- `/dashboard/programs` - Program overview
- `/dashboard/programs/[id]` - Program details and participants
- `/dashboard/programs/new` - Create new program

## 🔄 Integration Points

### Recipe System Integration
- Connect specialized nutrition recipes for maternal health
- Link toddler-appropriate recipes with nutrition plans
- Integrate therapeutic recipes for malnourished children
- Recipe filtering by age group, dietary requirements, and health conditions

### Production System Integration
- Schedule specialized nutrition meal production for posyandu programs
- Batch planning for maternal and child nutrition requirements
- Cost calculation for posyandu meal programs
- Inventory management for specialized ingredients

### User Management Integration
- Role-based access for posyandu volunteers and health workers
- Permission management for sensitive health data
- Multi-level access (district, posyandu, volunteer levels)
- Data privacy compliance for health records

## 📈 Expected Database Utilization Increase

### Current: 60%
- User Management, School Management, Recipe Management
- Distribution System, Quality Management, Financial Reporting
- Monitoring & Analytics, Production Enhancement

### Target: 75% (+15%)
**New Models:**
- Posyandu (6 core models)
- Health Records & Nutrition Plans (4 models)
- Program & Activity Management (3 models)
- Volunteer Management (2 models)
- **Total:** 15 new models with comprehensive relationships

## 🚀 Implementation Phases

### Phase 9C.1: Core Posyandu Models (Week 1)
- Database schema implementation
- Basic CRUD APIs for posyandu management
- Participant registration system

### Phase 9C.2: Health Monitoring (Week 2)
- Health record management
- Growth tracking calculations
- Nutrition status assessment

### Phase 9C.3: Nutrition Integration (Week 3)
- Nutrition plan creation
- Recipe integration for specialized diets
- Production system connection

### Phase 9C.4: Analytics & Reporting (Week 4)
- Dashboard development
- Growth curve analysis
- Program effectiveness metrics

---

**Ready to begin Phase 9C implementation?** 🚀
