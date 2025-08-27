import { z } from "zod"

// User Schema
export const userSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  name: z.string().min(2, "Name must be at least 2 characters"),
  username: z.string().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  avatar: z.string().optional(),
})

// School Schema
export const schoolSchema = z.object({
  name: z.string().min(2, "School name must be at least 2 characters"),
  principalName: z.string().min(2, "Principal name must be at least 2 characters"),
  principalPhone: z.string().min(10, "Invalid phone number"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  totalStudents: z.number().min(0),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  notes: z.string().optional(),
})

// Student Schema
export const studentSchema = z.object({
  nisn: z.string().min(10, "NISN must be at least 10 characters"),
  name: z.string().min(2, "Name must be at least 2 characters"),
  age: z.number().min(5, "Age must be at least 5"),
  gender: z.enum(["MALE", "FEMALE"]),
  grade: z.string(),
  parentName: z.string().min(2, "Parent name must be at least 2 characters"),
  schoolId: z.string(),
  notes: z.string().optional(),
})

// Menu Schema
export const menuSchema = z.object({
  name: z.string().min(2, "Menu name must be at least 2 characters"),
  description: z.string().optional(),
  menuDate: z.date(),
  mealType: z.enum(["BREAKFAST", "LUNCH", "DINNER", "SNACK"]),
  targetGroup: z.enum(["STUDENT", "PREGNANT_WOMAN", "LACTATING_MOTHER", "TODDLER", "ELDERLY"]),
  isActive: z.boolean(),
})

// Raw Material Schema
export const rawMaterialSchema = z.object({
  name: z.string().min(2, "Material name must be at least 2 characters"),
  category: z.enum([
    "PROTEIN",
    "VEGETABLE",
    "FRUIT",
    "GRAIN",
    "DAIRY",
    "SPICE",
    "OIL",
    "BEVERAGE",
    "OTHER"
  ]),
  unit: z.string(),
  description: z.string().optional(),
  caloriesPer100g: z.number().optional(),
  proteinPer100g: z.number().optional(),
  fatPer100g: z.number().optional(),
  carbsPer100g: z.number().optional(),
  fiberPer100g: z.number().optional(),
})
