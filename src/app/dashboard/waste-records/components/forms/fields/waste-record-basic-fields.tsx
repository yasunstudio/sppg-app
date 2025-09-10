"use client"

import { UseFormReturn } from "react-hook-form"
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { WasteRecordCreateInput, WasteRecordUpdateInput, wasteTypeOptions, wasteSourceOptions } from "../../utils"

interface WasteRecordBasicFieldsProps {
  form: any
}

export function WasteRecordBasicFields({ form }: WasteRecordBasicFieldsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Record Date */}
      <FormField
        control={form.control}
        name="recordDate"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Tanggal Pencatatan</FormLabel>
            <FormControl>
              <Input 
                type="date" 
                {...field}
                className="w-full"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Weight */}
      <FormField
        control={form.control}
        name="weight"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Berat Limbah (kg)</FormLabel>
            <FormControl>
              <Input 
                type="number"
                step="0.1"
                min="0"
                placeholder="Masukkan berat limbah"
                {...field}
                onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                className="w-full"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Waste Type */}
      <FormField
        control={form.control}
        name="wasteType"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Jenis Limbah</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih jenis limbah" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {wasteTypeOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Waste Source */}
      <FormField
        control={form.control}
        name="source"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Sumber Limbah</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih sumber limbah" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {wasteSourceOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Notes */}
      <div className="md:col-span-2">
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Catatan (Opsional)</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Tambahkan catatan mengenai pencatatan limbah..."
                  className="min-h-[80px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  )
}
