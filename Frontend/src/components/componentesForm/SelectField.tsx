import React from "react"
import { Label } from "@/components/Label"
import { SelectNative } from "@/components/SelectNative"

interface Option {
  value: string
  label: string
}

interface SelectFieldProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string
  options: Option[]
}

export const SelectField = ({ label, id, options, ...props }: SelectFieldProps) => (
  <div>
    <Label htmlFor={id}>{label}</Label>
    <SelectNative id={id} {...props} className={`mt-2 ${props.className || ""}`}>
      <option value="">Seleccione {label.toLowerCase()}</option>
      {options.map(opt => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </SelectNative>
  </div>
) 