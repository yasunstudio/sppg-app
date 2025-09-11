/**
 * Comprehensive Permission System Seed
 * Database-driven permissions and roles for SPPG Application
 */

import { PrismaClient } from '../../src/generated/prisma'

const prisma = new PrismaClient()

// Comprehensive Permission Templates
const PERMISSION_SEEDS = [
  // User Management
  { name: 'users.create', displayName: 'Create Users', description: 'Create new user accounts', category: 'User Management', module: 'users', action: 'create' },
  { name: 'users.view', displayName: 'View Users', description: 'View user profiles and information', category: 'User Management', module: 'users', action: 'view' },
  { name: 'users.edit', displayName: 'Edit Users', description: 'Modify user profiles and settings', category: 'User Management', module: 'users', action: 'edit' },
  { name: 'users.delete', displayName: 'Delete Users', description: 'Remove user accounts from system', category: 'User Management', module: 'users', action: 'delete' },

  // School & Student Management
  { name: 'schools.view', displayName: 'View Schools', description: 'Access school information and data', category: 'Institution Management', module: 'schools', action: 'view' },
  { name: 'schools.manage', displayName: 'Manage Schools', description: 'Create, edit, and manage school data', category: 'Institution Management', module: 'schools', action: 'manage' },
  { name: 'students.view', displayName: 'View Students', description: 'Access student information and data', category: 'Institution Management', module: 'students', action: 'view' },
  { name: 'students.manage', displayName: 'Manage Students', description: 'Create, edit, and manage student data', category: 'Institution Management', module: 'students', action: 'manage' },
  { name: 'classes.view', displayName: 'View Classes', description: 'Access class information and data', category: 'Institution Management', module: 'classes', action: 'view' },
  { name: 'classes.manage', displayName: 'Manage Classes', description: 'Create, edit, and manage class data', category: 'Institution Management', module: 'classes', action: 'manage' },

  // Menu Planning & Nutrition
  { name: 'menus.create', displayName: 'Create Menus', description: 'Design and create meal menus', category: 'Menu Planning', module: 'menus', action: 'create' },
  { name: 'menus.view', displayName: 'View Menus', description: 'Access menu plans and nutritional information', category: 'Menu Planning', module: 'menus', action: 'view' },
  { name: 'menus.edit', displayName: 'Edit Menus', description: 'Modify existing menu plans', category: 'Menu Planning', module: 'menus', action: 'edit' },
  { name: 'menus.approve', displayName: 'Approve Menus', description: 'Approve menu plans for implementation', category: 'Menu Planning', module: 'menus', action: 'approve' },
  { name: 'nutrition.consult', displayName: 'Nutrition Consultation', description: 'Provide professional nutrition consultation', category: 'Menu Planning', module: 'nutrition', action: 'consult' },

  // Recipe Management
  { name: 'recipes.create', displayName: 'Create Recipes', description: 'Design and document food recipes', category: 'Recipe Management', module: 'recipes', action: 'create' },
  { name: 'recipes.view', displayName: 'View Recipes', description: 'Access recipe database and information', category: 'Recipe Management', module: 'recipes', action: 'view' },
  { name: 'recipes.edit', displayName: 'Edit Recipes', description: 'Modify existing recipes', category: 'Recipe Management', module: 'recipes', action: 'edit' },
  { name: 'recipes.delete', displayName: 'Delete Recipes', description: 'Remove recipes from database', category: 'Recipe Management', module: 'recipes', action: 'delete' },

  // Inventory & Supply Chain
  { name: 'inventory.create', displayName: 'Create Inventory', description: 'Add new items to inventory', category: 'Inventory Management', module: 'inventory', action: 'create' },
  { name: 'inventory.view', displayName: 'View Inventory', description: 'Access inventory levels and information', category: 'Inventory Management', module: 'inventory', action: 'view' },
  { name: 'inventory.edit', displayName: 'Edit Inventory', description: 'Modify inventory items and quantities', category: 'Inventory Management', module: 'inventory', action: 'edit' },
  { name: 'suppliers.view', displayName: 'View Suppliers', description: 'Access supplier information and contacts', category: 'Supply Chain', module: 'suppliers', action: 'view' },
  { name: 'suppliers.manage', displayName: 'Manage Suppliers', description: 'Create, edit, and manage supplier relationships', category: 'Supply Chain', module: 'suppliers', action: 'manage' },

  // Purchase Orders
  { name: 'purchase_orders.view', displayName: 'View Purchase Orders', description: 'Access purchase order information', category: 'Procurement', module: 'purchase_orders', action: 'view' },
  { name: 'purchase_orders.create', displayName: 'Create Purchase Orders', description: 'Create new purchase orders', category: 'Procurement', module: 'purchase_orders', action: 'create' },
  { name: 'purchase_orders.edit', displayName: 'Edit Purchase Orders', description: 'Modify existing purchase orders', category: 'Procurement', module: 'purchase_orders', action: 'edit' },
  { name: 'purchase_orders.delete', displayName: 'Delete Purchase Orders', description: 'Remove purchase orders from system', category: 'Procurement', module: 'purchase_orders', action: 'delete' },

  // Production Management
  { name: 'production.create', displayName: 'Create Production', description: 'Initialize food production processes', category: 'Production', module: 'production', action: 'create' },
  { name: 'production.view', displayName: 'View Production', description: 'Access production schedules and status', category: 'Production', module: 'production', action: 'view' },
  { name: 'production.manage', displayName: 'Manage Production', description: 'Oversee and control production processes', category: 'Production', module: 'production', action: 'manage' },

  // Quality Control
  { name: 'quality.check', displayName: 'Quality Checks', description: 'Perform quality control inspections', category: 'Quality Assurance', module: 'quality', action: 'check' },
  { name: 'quality.create', displayName: 'Create Quality Standards', description: 'Define quality control standards', category: 'Quality Assurance', module: 'quality', action: 'create' },
  { name: 'quality.edit', displayName: 'Edit Quality Standards', description: 'Modify quality control standards', category: 'Quality Assurance', module: 'quality', action: 'edit' },

  // Logistics & Distribution
  { name: 'delivery.manage', displayName: 'Manage Deliveries', description: 'Oversee food delivery operations', category: 'Logistics', module: 'delivery', action: 'manage' },
  { name: 'delivery.view', displayName: 'View Deliveries', description: 'Access delivery schedules and status', category: 'Logistics', module: 'delivery', action: 'view' },
  { name: 'logistics.plan', displayName: 'Logistics Planning', description: 'Plan delivery routes and schedules', category: 'Logistics', module: 'logistics', action: 'plan' },
  { name: 'logistics.manage', displayName: 'Manage Logistics', description: 'Oversee logistics operations', category: 'Logistics', module: 'logistics', action: 'manage' },

  // Vehicle & Driver Management
  { name: 'vehicles.create', displayName: 'Create Vehicles', description: 'Add new vehicles to fleet', category: 'Fleet Management', module: 'vehicles', action: 'create' },
  { name: 'vehicles.view', displayName: 'View Vehicles', description: 'Access vehicle information and status', category: 'Fleet Management', module: 'vehicles', action: 'view' },
  { name: 'vehicles.edit', displayName: 'Edit Vehicles', description: 'Modify vehicle information', category: 'Fleet Management', module: 'vehicles', action: 'edit' },
  { name: 'vehicles.delete', displayName: 'Delete Vehicles', description: 'Remove vehicles from fleet', category: 'Fleet Management', module: 'vehicles', action: 'delete' },
  { name: 'drivers.create', displayName: 'Create Drivers', description: 'Add new drivers to system', category: 'Fleet Management', module: 'drivers', action: 'create' },
  { name: 'drivers.view', displayName: 'View Drivers', description: 'Access driver information and status', category: 'Fleet Management', module: 'drivers', action: 'view' },
  { name: 'drivers.edit', displayName: 'Edit Drivers', description: 'Modify driver information', category: 'Fleet Management', module: 'drivers', action: 'edit' },
  { name: 'drivers.delete', displayName: 'Delete Drivers', description: 'Remove drivers from system', category: 'Fleet Management', module: 'drivers', action: 'delete' },

  // Distribution Management
  { name: 'distributions.create', displayName: 'Create Distributions', description: 'Plan food distribution to schools', category: 'Distribution', module: 'distributions', action: 'create' },
  { name: 'distributions.view', displayName: 'View Distributions', description: 'Access distribution schedules and status', category: 'Distribution', module: 'distributions', action: 'view' },
  { name: 'distributions.edit', displayName: 'Edit Distributions', description: 'Modify distribution plans', category: 'Distribution', module: 'distributions', action: 'edit' },
  { name: 'distributions.delete', displayName: 'Delete Distributions', description: 'Remove distribution plans', category: 'Distribution', module: 'distributions', action: 'delete' },
  { name: 'distributions.track', displayName: 'Track Distributions', description: 'Monitor distribution progress', category: 'Distribution', module: 'distributions', action: 'track' },

  // Financial Management
  { name: 'finance.view', displayName: 'View Finances', description: 'Access financial reports and data', category: 'Financial', module: 'finance', action: 'view' },
  { name: 'finance.manage', displayName: 'Manage Finances', description: 'Oversee financial operations', category: 'Financial', module: 'finance', action: 'manage' },
  { name: 'budget.view', displayName: 'View Budget', description: 'Access budget information', category: 'Financial', module: 'budget', action: 'view' },
  { name: 'budget.manage', displayName: 'Manage Budget', description: 'Control budget allocations', category: 'Financial', module: 'budget', action: 'manage' },

  // Waste Management
  { name: 'waste.create', displayName: 'Record Waste', description: 'Document food waste incidents', category: 'Waste Management', module: 'waste', action: 'create' },
  { name: 'waste.view', displayName: 'View Waste Records', description: 'Access waste management data', category: 'Waste Management', module: 'waste', action: 'view' },
  { name: 'waste.edit', displayName: 'Edit Waste Records', description: 'Modify waste documentation', category: 'Waste Management', module: 'waste', action: 'edit' },
  { name: 'waste.delete', displayName: 'Delete Waste Records', description: 'Remove waste records', category: 'Waste Management', module: 'waste', action: 'delete' },

  // Reporting & Analytics
  { name: 'reports.view', displayName: 'View Reports', description: 'Access system reports and analytics', category: 'Analytics', module: 'reports', action: 'view' },
  { name: 'analytics.view', displayName: 'View Analytics', description: 'Access advanced analytics and insights', category: 'Analytics', module: 'analytics', action: 'view' },

  // Feedback Management
  { name: 'feedback.view', displayName: 'View Feedback', description: 'Access user feedback and surveys', category: 'Customer Service', module: 'feedback', action: 'view' },
  { name: 'feedback.respond', displayName: 'Respond to Feedback', description: 'Respond to user feedback and concerns', category: 'Customer Service', module: 'feedback', action: 'respond' },

  // System Administration
  { name: 'system.config', displayName: 'System Configuration', description: 'Configure system settings and parameters', category: 'System Admin', module: 'system', action: 'config' },
  { name: 'audit.view', displayName: 'View Audit Logs', description: 'Access system audit trails', category: 'System Admin', module: 'audit', action: 'view' }
]

// Get all permission names for SUPER_ADMIN
const ALL_PERMISSIONS = PERMISSION_SEEDS.map(p => p.name)

// Role Definitions with Permissions
const ROLE_SEEDS = [
  {
    name: 'SUPER_ADMIN',
    description: 'Full system access and administration - Complete control over all modules',
    color: '#ef4444',
    priority: 100,
    isSystemRole: true,
    permissions: ALL_PERMISSIONS,
    metadata: {
      dashboard: '/dashboard/admin',
      features: ['full_access', 'system_config', 'user_management'],
      restrictions: []
    }
  },
  {
    name: 'ADMIN',
    description: 'System administration and user management - High-level operational control',
    color: '#3b82f6',
    priority: 90,
    isSystemRole: true,
    permissions: [
      'users.create', 'users.view', 'users.edit', 'users.delete',
      'schools.view', 'schools.manage', 'students.view', 'students.manage', 'classes.view', 'classes.manage',
      'menus.view', 'menus.approve',
      'inventory.create', 'inventory.view', 'inventory.edit',
      'suppliers.view', 'suppliers.manage',
      'purchase_orders.view', 'purchase_orders.create', 'purchase_orders.edit', 'purchase_orders.delete',
      'production.view', 'quality.create', 'quality.edit',
      'delivery.view', 'distributions.view',
      'vehicles.create', 'vehicles.view', 'vehicles.edit', 'vehicles.delete',
      'drivers.view', 'drivers.edit', 'drivers.delete',
      'finance.view', 'finance.manage', 'budget.view', 'budget.manage',
      'waste.view', 'reports.view', 'analytics.view',
      'feedback.view', 'feedback.respond',
      'system.config', 'audit.view'
    ],
    metadata: {
      dashboard: '/dashboard/admin',
      features: ['user_management', 'system_config', 'reporting'],
      restrictions: ['no_super_admin_functions']
    }
  },
  {
    name: 'CHEF',
    description: 'Food production and kitchen management - Recipe and production oversight',
    color: '#f97316',
    priority: 70,
    isSystemRole: true,
    permissions: [
      'menus.create', 'menus.view', 'menus.edit',
      'recipes.create', 'recipes.view', 'recipes.edit', 'recipes.delete',
      'inventory.create', 'inventory.view', 'inventory.edit',
      'suppliers.view',
      'purchase_orders.view', 'purchase_orders.create', 'purchase_orders.edit',
      'production.create', 'production.view', 'production.manage',
      'quality.check',
      'waste.create', 'waste.view', 'waste.edit', 'waste.delete',
      'reports.view'
    ],
    metadata: {
      dashboard: '/dashboard/production',
      features: ['recipe_management', 'production_planning', 'inventory_management'],
      restrictions: ['no_user_management', 'no_financial_access']
    }
  },
  {
    name: 'NUTRITIONIST',
    description: 'Nutrition specialist with meal planning access - Menu design and consultation',
    color: '#10b981',
    priority: 60,
    isSystemRole: true,
    permissions: [
      'students.view', // for meal planning context
      'menus.create', 'menus.view', 'menus.edit',
      'recipes.create', 'recipes.view', 'recipes.edit',
      'nutrition.consult',
      'quality.check',
      'reports.view', 'analytics.view'
    ],
    metadata: {
      dashboard: '/dashboard/nutrition',
      features: ['menu_planning', 'nutrition_consultation', 'quality_review'],
      restrictions: ['no_inventory_management', 'no_financial_access', 'no_user_management']
    }
  },
  {
    name: 'QUALITY_CONTROL',
    description: 'Quality control manager with inspection oversight - Food safety and standards',
    color: '#f59e0b',
    priority: 65,
    isSystemRole: true,
    permissions: [
      'menus.view',
      'recipes.view',
      'inventory.view', 'suppliers.view', 'purchase_orders.view',
      'production.view',
      'quality.check', 'quality.create', 'quality.edit',
      'waste.create', 'waste.view', 'waste.edit', 'waste.delete',
      'reports.view',
      'feedback.view', 'feedback.respond',
      'audit.view'
    ],
    metadata: {
      dashboard: '/dashboard/quality',
      features: ['quality_assurance', 'inspection', 'compliance'],
      restrictions: ['no_user_management', 'no_financial_management', 'no_production_control']
    }
  },
  {
    name: 'DISTRIBUTION_MANAGER',
    description: 'Distribution and logistics operations manager - Fleet and delivery oversight',
    color: '#6366f1',
    priority: 75,
    isSystemRole: true,
    permissions: [
      'schools.view',
      'delivery.manage', 'delivery.view',
      'logistics.plan', 'logistics.manage',
      'vehicles.create', 'vehicles.view', 'vehicles.edit',
      'drivers.create', 'drivers.view', 'drivers.edit', 'drivers.delete',
      'distributions.create', 'distributions.view', 'distributions.edit', 'distributions.delete', 'distributions.track',
      'reports.view'
    ],
    metadata: {
      dashboard: '/dashboard/logistics',
      features: ['distribution_planning', 'fleet_management', 'route_optimization'],
      restrictions: ['no_user_management', 'no_production_control', 'no_financial_management']
    }
  },
  {
    name: 'OPERATIONS_SUPERVISOR',
    description: 'Middle management for daily operations oversight - Coordination and monitoring',
    color: '#64748b',
    priority: 55,
    isSystemRole: true,
    permissions: [
      'schools.view', 'students.view', 'classes.view',
      'menus.view', 'recipes.view',
      'inventory.view', 'suppliers.view',
      'production.view',
      'delivery.view', 'distributions.view', 'distributions.track',
      'vehicles.view', 'drivers.view',
      'waste.create', 'waste.view', 'waste.edit',
      'finance.view', 'budget.view',
      'reports.view', 'feedback.view'
    ],
    metadata: {
      dashboard: '/dashboard/operations',
      features: ['daily_operations', 'monitoring', 'coordination'],
      restrictions: ['no_user_management', 'no_system_config', 'limited_edit_access']
    }
  },
  {
    name: 'WAREHOUSE_MANAGER',
    description: 'Warehouse and inventory operations manager - Stock and supply management',
    color: '#64748b',
    priority: 65,
    isSystemRole: true,
    permissions: [
      'inventory.create', 'inventory.view', 'inventory.edit',
      'suppliers.view', 'suppliers.manage',
      'purchase_orders.view', 'purchase_orders.create', 'purchase_orders.edit',
      'vehicles.view',
      'distributions.view',
      'waste.view', 'waste.edit',
      'reports.view'
    ],
    metadata: {
      dashboard: '/dashboard/inventory',
      features: ['inventory_management', 'supplier_relations', 'stock_control'],
      restrictions: ['no_user_management', 'no_financial_control']
    }
  },
  {
    name: 'PRODUCTION_STAFF',
    description: 'Production line staff with basic production access - Food preparation and kitchen operations',
    color: '#f97316',
    priority: 35,
    isSystemRole: true,
    permissions: [
      'production.view', 'production.create',
      'recipes.view',
      'inventory.view',
      'quality.check',
      'waste.create', 'waste.view'
    ],
    metadata: {
      dashboard: '/dashboard/production',
      features: ['food_preparation', 'basic_production', 'quality_monitoring'],
      restrictions: ['no_edit_recipes', 'no_inventory_management']
    }
  },
  {
    name: 'FINANCIAL_ANALYST',
    description: 'Financial analyst with budget and transaction oversight - Financial reporting and analysis',
    color: '#059669',
    priority: 50,
    isSystemRole: true,
    permissions: [
      'finance.view', 'finance.manage',
      'budget.view', 'budget.manage',
      'purchase_orders.view',
      'suppliers.view',
      'reports.view', 'analytics.view'
    ],
    metadata: {
      dashboard: '/dashboard/finance',
      features: ['financial_analysis', 'budget_control', 'cost_reporting'],
      restrictions: ['no_user_management', 'no_production_access']
    }
  },
  {
    name: 'DRIVER',
    description: 'Vehicle driver for food delivery operations - Delivery and transport',
    color: '#6b7280',
    priority: 25,
    isSystemRole: true,
    permissions: [
      'delivery.view',
      'distributions.view', 'distributions.track',
      'vehicles.view'
    ],
    metadata: {
      dashboard: '/dashboard/delivery',
      features: ['delivery_tracking', 'route_navigation', 'delivery_confirmation'],
      restrictions: ['delivery_only_access', 'no_administrative_access']
    }
  },
  {
    name: 'SCHOOL_ADMIN',
    description: 'School-level administrator with local management access - Student and delivery management',
    color: '#8b5cf6',
    priority: 40,
    isSystemRole: true,
    permissions: [
      'schools.view', 'students.view', 'students.manage', 'classes.view', 'classes.manage',
      'delivery.view', 'distributions.view', 'distributions.track',
      'feedback.view'
    ],
    metadata: {
      dashboard: '/dashboard/school',
      features: ['student_management', 'delivery_tracking', 'local_administration'],
      restrictions: ['school_specific_access', 'no_system_wide_access']
    }
  }
]

export default async function seedPermissions(prisma: PrismaClient) {
  console.log('🔐 Seeding permission system...')

  try {
    // Create permissions first
    console.log('📝 Creating permission definitions...')
    for (const permission of PERMISSION_SEEDS) {
      await prisma.permission.upsert({
        where: { name: permission.name },
        update: {
          displayName: permission.displayName,
          description: permission.description,
          category: permission.category,
          module: permission.module,
          action: permission.action,
          isSystemPerm: true,
          isActive: true,
          updatedAt: new Date()
        },
        create: {
          name: permission.name,
          displayName: permission.displayName,
          description: permission.description,
          category: permission.category,
          module: permission.module,
          action: permission.action,
          isSystemPerm: true,
          isActive: true
        }
      })
    }

    console.log(`✅ Created/updated ${PERMISSION_SEEDS.length} permissions`)

    // Create/update roles with permissions
    console.log('👥 Creating role definitions with permissions...')
    for (const role of ROLE_SEEDS) {
      await prisma.role.upsert({
        where: { name: role.name },
        update: {
          description: role.description,
          permissions: role.permissions,
          color: role.color,
          priority: role.priority,
          isSystemRole: role.isSystemRole,
          isActive: true,
          metadata: role.metadata as any,
          updatedAt: new Date()
        },
        create: {
          name: role.name,
          description: role.description,
          permissions: role.permissions,
          color: role.color,
          priority: role.priority,
          isSystemRole: role.isSystemRole,
          isActive: true,
          metadata: role.metadata as any
        }
      })
    }

    console.log(`✅ Created/updated ${ROLE_SEEDS.length} roles with permission assignments`)

    // Summary
    const permissionCount = await prisma.permission.count()
    const roleCount = await prisma.role.count()
    const userRoleCount = await prisma.userRole.count()

    console.log('📊 Permission System Summary:')
    console.log(`   • Permissions: ${permissionCount}`)
    console.log(`   • Roles: ${roleCount}`)
    console.log(`   • User assignments: ${userRoleCount}`)
    console.log('🔐 Permission system seeding completed successfully!')

    return {
      permissionsCreated: PERMISSION_SEEDS.length,
      rolesCreated: ROLE_SEEDS.length,
      ready: true
    }

  } catch (error) {
    console.error('❌ Error seeding permissions:', error)
    throw error
  }
}
