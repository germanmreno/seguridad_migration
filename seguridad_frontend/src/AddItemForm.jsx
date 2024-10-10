import { useForm, useWatch } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { format } from "date-fns"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { gerencyOptions, phoneOptions } from "./options/formOptions"
import { Textarea } from "./components/ui/textarea"
import { toast } from 'sonner';
import { useState } from "react"

const formSchema = z.object({
  firstName: z.string({ required_error: "Campo obligatorio" }).min(2, {
    message: "El nombre debe tener al menos 2 caracteres.",
  }),
  lastName: z.string({ required_error: "Campo obligatorio" }).min(2, {
    message: "El apellido debe tener al menos 2 caracteres.",
  }),
  dni: z.string({ required_error: "Campo obligatorio" }).regex(/^[VE]-\d{2,}$/, {
    message: "La cédula debe comenzar con V- o E- seguido de al menos 2 números.",
  }),
  business: z.string({ required_error: "Campo obligatorio" }).min(2, {
    message: "La empresa debe tener al menos 2 caracteres.",
  }),
  phonePrefix: z.string({ required_error: "Campo obligatorio" }),
  phoneNumber: z.string({ required_error: "Campo obligatorio" }).regex(/^\d+$/, {
    message: "Ingrese solo números",
  }).min(7, {
    message: "El número debe tener al menos 7 dígitos",
  }),
  gerency: z.string({ required_error: "Campo obligatorio" }).min(2, {
    message: "La gerencia debe tener al menos 2 caracteres.",
  }),
  contact: z.string({ required_error: "Campo obligatorio" }).min(2, {
    message: "El contacto debe tener al menos 2 caracteres.",
  }),
  observation: z.string({ required_error: "Campo obligatorio" }).min(2, {
    message: "La observación debe tener al menos 2 caracteres.",
  }),
  date: z.date({ required_error: "Campo obligatorio" }),
  // Add other fields as needed
})

export function AddItemForm({ onSubmit }) {
  const [isSearching, setIsSearching] = useState(false)


  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      dni: "",
      date: new Date(),
      business: "",
      phonePrefix: "",
      phoneNumber: "",
      gerency: "",
      contact: "",
      observation: "",
    },
  })

  const phonePrefix = useWatch({ control: form.control, name: "phonePrefix" })
  const phoneNumber = useWatch({ control: form.control, name: "phoneNumber" })
  const date = useWatch({ control: form.control, name: "date" })

  const handleSubmit = (data) => {
    // Combine phonePrefix and phoneNumber
    const fullPhoneNumber = `${data.phonePrefix}${data.phoneNumber}`
    const formattedDate = format(data.date, 'dd/MM/yyyy')
    const formattedHour = format(data.date, 'HH:mm')
    const user = JSON.parse(localStorage.getItem('user'))
    const registeredBy = `${user.firstName} ${user.lastName}`

    const visitorData = {
      ...data,
      phone: fullPhoneNumber,
      date: formattedDate,
      hour: formattedHour,
      registered_by: registeredBy
    }

    onSubmit(visitorData)
  }

  const handleDniSearch = async (e) => {
    e.preventDefault()
    const searchDni = e.target.searchDni.value
    if (!searchDni) {
      toast({
        title: "Error",
        description: "Por favor, ingrese un DNI para buscar.",
        variant: "destructive",
      })
      return
    }

    setIsSearching(true)
    try {
      const response = await fetch(`/api/search-visitor?dni=${searchDni}`)
      const data = await response.json()

      if (data.visitor) {
        form.reset({
          ...form.getValues(),
          firstName: data.visitor.firstName,
          lastName: data.visitor.lastName,
          dni: data.visitor.dni,
          business: data.visitor.business,
          phonePrefix: data.visitor.phonePrefix,
          phoneNumber: data.visitor.phoneNumber,
        })
        toast({
          title: "Visitante encontrado",
          description: "Los campos han sido pre-llenados con la información existente.",
        })
      } else {
        toast({
          title: "Visitante no encontrado",
          description: "No se encontró ningún visitante con ese DNI.",
        })
      }
    } catch (error) {
      console.error("Error searching for visitor:", error)
      toast({
        title: "Error",
        description: "Hubo un problema al buscar el visitante. Por favor, intente de nuevo.",
        variant: "destructive",
      })
    } finally {
      setIsSearching(false)
    }
  }

  return (

    <Form {...form}>

      <form onSubmit={handleDniSearch} className="mb-4">
        <div className="flex space-x-2">
          <Input
            name="searchDni"
            placeholder="Buscar por C.I. (Ej.: V-12345678)"
            className="flex-grow"
          />
          <Button type="submit" disabled={isSearching}>
            {isSearching ? "Buscando..." : "Buscar"}
          </Button>
        </div>
      </form>

      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-2">
        <div className="grid grid-cols-3 space-x-2">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-bold primary-text">Nombres <span className="text-red-500">*</span></FormLabel>
                <FormControl>
                  <Input placeholder="Nombres de la persona" {...field} />
                </FormControl>
                <FormDescription>
                  Ingrese el nombre del visitante.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-bold primary-text">Apellidos <span className="text-red-500">*</span></FormLabel>
                <FormControl>
                  <Input placeholder="Apellidos de la persona" {...field} />
                </FormControl>
                <FormDescription>
                  Ingrese los apellidos del visitante.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="dni"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-bold primary-text">Cédula del visitante <span className="text-red-500">*</span></FormLabel>
                <FormControl>
                  <Input placeholder="Ej.: V-12345678" {...field} />
                </FormControl>
                <FormDescription>
                  Ingrese la cédula del visitante. Recuerde que la cédula debe ser V-xxxxxxx o E-xxxxxxx.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-3 space-x-2">
          <div className="flex space-x-2">
            <FormField
              control={form.control}
              name="phonePrefix"
              render={({ field }) => (
                <FormItem className="col-span-1">
                  <FormLabel className="font-bold primary-text">Prefijo  <span className="text-red-500">*</span></FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="(+58)" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {phoneOptions.map((option) => (
                        <SelectItem key={option.id} value={option.id}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                  <FormDescription>
                    Prefijo telefónico.
                  </FormDescription>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel className="font-bold primary-text">Número de teléfono <span className="text-red-500">*</span></FormLabel>
                  <FormControl>
                    <Input placeholder="Ej.: 1234567" {...field} />
                  </FormControl>
                  <FormMessage />
                  <FormDescription>
                    Escriba el número de teléfono del visitante.
                  </FormDescription>
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="business"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel className="font-bold primary-text">Empresa <span className="text-red-500">*</span></FormLabel>
                <FormControl>
                  <Input placeholder="Empresa a la que representa el visitante." {...field} />
                </FormControl>
                <FormDescription>
                  Ingrese el nombre de la empresa a la que representa el visitante.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

        </div>

        <div className="grid grid-cols-2 space-x-2">
          <FormField
            control={form.control}
            name="gerency"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-bold primary-text">Gerencia u Oficina <span className="text-red-500">*</span></FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="SELECCIONE LA GERENCIA U OFICINA A LA QUE ACUDE EL VISITANTE" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {gerencyOptions.map((option) => (
                      <SelectItem key={option.id} value={option.id}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>
                  Seleccione la gerencia u oficina a la que acude el visitante.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="contact"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-bold primary-text">Contacto <span className="text-red-500">*</span></FormLabel>
                <FormControl>
                  <Input placeholder="Contacto del visitante" {...field} />
                </FormControl>
                <FormDescription>
                  Ingrese el contacto del visitante dentro de la Corporación.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="observation"
          render={({ field }) => (
            <FormItem className="col-span-2">
              <FormLabel className="primary-text font-bold">Observación <span className="text-red-500">*</span></FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Observaciones acerca del visitante..."
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Añada las observaciones acerca del visitante.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Registrar</Button>
      </form>
    </Form>
  )
}
