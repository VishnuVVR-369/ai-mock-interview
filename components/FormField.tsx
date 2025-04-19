import { FormItem, FormControl, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Control, Controller, FieldPath, FieldValues } from "react-hook-form";

interface FormFieldProps<T extends FieldValues> {
  name: FieldPath<T>
  control: Control<T>
  label: string
  placeholder?: string
  type?: 'text' | 'email' | 'password'
}

const FormField = <T extends FieldValues>( { name, control, label, placeholder, type="text" }: FormFieldProps<T> ) => (
  <Controller name={name} control={control} render={({ field }) => (
    <FormItem>
        <FormLabel className="label">{label}</FormLabel>
        <FormControl>
          <Input className="input" placeholder={placeholder} type={type} {...field} />
        </FormControl>
        <FormMessage />
      </FormItem>
  )} />
)
export default FormField;