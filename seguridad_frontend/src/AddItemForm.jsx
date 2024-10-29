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
import { Car, PersonStanding } from 'lucide-react';
import { Textarea } from "./components/ui/textarea"
import { toast } from 'sonner';
import { useState } from "react"

const formSchema = z.object({
  formType: z.string().optional(), // Add formType to the schema
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
  // Add optional vehicle fields that are required only when formType is 'visitor'
  vehiclePlate: z.string().min(6, {
    message: "La placa del vehículo debe cumplir con el formato ABC123.",
  }).superRefine((val, ctx) => {
    const formType = ctx.parent?.formType;
    if (formType === 'vehicle' && !val) {
      console.log(val)
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Campo obligatorio para registro vehicular",

      });
    }
  }),
  vehicleBrand: z.string().min(3, {
    message: "La marca del vehículo debe tener al menos 3 caracteres",
  }).superRefine((val, ctx) => {
    const formType = ctx.parent?.formType;
    if (formType === 'vehicle' && !val) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Campo obligatorio para registro vehicular"
      });
    }
  }),
  vehicleModel: z.string().min(4, {
    message: "El modelo del vehículo debe tener al menos 4 caracteres",
  }).superRefine((val, ctx) => {
    const formType = ctx.parent?.formType;
    if (formType === 'vehicle' && !val) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Campo obligatorio para registro vehicular"
      });
    }
  }),
  vehicleColor: z.string().min(3, {
    message: "El color del vehículo debe tener al menos 3 caracteres",
  }).superRefine((val, ctx) => {
    const formType = ctx.parent?.formType;
    if (formType === 'vehicle' && !val) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Campo obligatorio para registro vehicular"
      });
    }
  }),
  date: z.date({ required_error: "Campo obligatorio" }),
})

// Add new component for form type selection
const FormTypeStep = ({ onSelectType }) => {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold primary-text">Tipo de Registro</h2>
      <span className="text-sm text-muted-foreground">Seleccione el tipo de registro a realizar.</span>
      <div className="grid grid-cols-2 gap-4">
        <Button
          onClick={() => onSelectType('vehicle')}
          variant="outline"
          className="h-32"
        >
          <div className="space-y-2">
            <div className="flex items-center justify-center">
              <Car className="w-10 h-10" />
            </div>
            <h3 className="font-bold">Vehicular</h3>
            <p className="text-sm text-muted-foreground">Registro de visitantes en vehículo</p>
          </div>
        </Button>
        <Button
          onClick={() => onSelectType('person')}
          variant="outline"
          className="h-32"
        >
          <div className="space-y-2">
            <div className="flex items-center justify-center">
              <PersonStanding className="w-10 h-10" />
            </div>
            <h3 className="font-bold">Peatonal</h3>
            <p className="text-sm text-muted-foreground">Registro de visitantes peatonales</p>
          </div>
        </Button>
      </div>
    </div>
  )
}

// Add new component for form summary
const FormSummaryStep = ({ formData, onBack, onConfirm }) => {
  console.log(formData)
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold primary-text">Resumen del registro</h2>
      <span className="text-sm text-muted-foreground">Asegúrese de que los datos sean correctos antes de confirmar el registro.</span>
      <div className="grid p-4 border rounded-lg">
        <h1 className="text-lg font-bold primary-text">Datos del visitante</h1>
        <div className="border-t-2 border-gray-300 my-2"></div>
        <div className="grid grid-cols-4 gap-4 p-4">
          <div>
            <p className="font-bold">Nombre completo:</p>
            <p>{formData.firstName} {formData.lastName}</p>
          </div>
          <div>
            <p className="font-bold">Cédula:</p>
            <p>{formData.dni}</p>
          </div>
          <div>
            <p className="font-bold">Empresa:</p>
            <p>{formData.business}</p>
          </div>
          <div>
            <p className="font-bold">Teléfono:</p>
            <p>{formData.phonePrefix} {formData.phoneNumber}</p>
          </div>
        </div>
        <h1 className="text-lg font-bold primary-text mt-6">Datos de la visita</h1>
        <div className="border-t-2 border-gray-300 my-2"></div>
        <div className="grid grid-cols-4 gap-4 p-4">
          <div>
            <p className="font-bold">Gerencia:</p>
            <p>{formData.gerency}</p>
          </div>
          <div>
            <p className="font-bold">Contacto:</p>
            <p>{formData.contact}</p>
          </div>
          <div>
            <p className="font-bold">Fecha:</p>
            <p>{format(formData.date, 'dd/MM/yyyy')}</p>
          </div>
          <div>
            <p className="font-bold">Hora:</p>
            <p>{format(formData.date, 'HH:mm')} hs</p>
          </div>
          <div className="col-span-4">
            <div>
              <p className="font-bold">Observación:</p>
              <p>{formData.observation}</p>
            </div>
          </div>

        </div>


        {formData?.formType === 'vehicle' && (
          <>
            <h1 className="text-lg font-bold primary-text mt-6">Datos del vehículo</h1>
            <div className="border-t-2 border-gray-300 my-2"></div>
            <div className="grid grid-cols-4 gap-4 p-4">
              <div>
                <p className="font-bold">Placa del vehículo:</p>
                <p>{formData.vehiclePlate}</p>
              </div>
              <div>
                <p className="font-bold">Marca del vehículo:</p>
                <p>{formData.vehicleBrand}</p>
              </div>
              <div>
                <p className="font-bold">Modelo del vehículo:</p>
                <p>{formData.vehicleModel}</p>
              </div>
              <div>
                <p className="font-bold">Color del vehículo:</p>
                <p>{formData.vehicleColor}</p>
              </div>

            </div>
          </>
        )}

      </div>
      <div className="flex justify-between">
        <Button onClick={onBack} variant="outline">Atrás</Button>
        <Button onClick={onConfirm}>Confirmar Registro</Button>
      </div>
    </div>
  )
}

export function AddItemForm({ onSubmit }) {
  const [step, setStep] = useState(1)
  const [formType, setFormType] = useState(null)
  const [isSearching, setIsSearching] = useState(false)

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      formType: "", // Asegúrate de que formType esté en los valores por defecto
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
      vehiclePlate: "",
      vehicleModel: "",
      vehicleBrand: "",
      vehicleColor: "",
    },
  })

  const phonePrefix = useWatch({ control: form.control, name: "phonePrefix" })
  console.log(phonePrefix)
  const phoneNumber = useWatch({ control: form.control, name: "phoneNumber" })
  const date = useWatch({ control: form.control, name: "date" })

  const handleFormTypeSelect = (type) => {
    setFormType(type)
    form.setValue('formType', type) // Asegúrate de que formType se establezca en el formulario
    setStep(2)
  }

  const handleNext = (data) => {
    setStep(3)
  }

  const handleBack = () => {
    setStep(step - 1)
  }

  const handleFinalSubmit = (data) => {
    // Combine phonePrefix and phoneNumber
    const fullPhoneNumber = `${data.phonePrefix}${data.phoneNumber}`
    const formattedHour = format(data.date, 'HH:mm')
    const user = JSON.parse(localStorage.getItem('user'))
    const registeredBy = `${user.firstName} ${user.lastName}`

    const visitorData = {
      ...data,
      phone: fullPhoneNumber,
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
      const response = await fetch(`http://localhost:3001/api/visitors/search-visitor?dni=${searchDni}`)
      const data = await response.json()
      const phonePrefix = data.visitor.phone.slice(0, 6)
      const phoneNumber = data.visitor.phone.slice(6)

      // Find the matching option in phoneOptions
      const matchingPrefix = phoneOptions.find(option => option.id === phonePrefix)

      if (data.visitor) {
        form.reset({
          ...form.getValues(),
          firstName: data.visitor.firstName,
          lastName: data.visitor.lastName,
          dni: data.visitor.dni,
          business: data.visitor.business,
          phonePrefix: matchingPrefix ? matchingPrefix.id : "",
          phoneNumber: phoneNumber,
        })
        toast(`Visitante encontrado: ${data.visitor.firstName} ${data.visitor.lastName}`)
      } else {
        toast("No se encontró ningún visitante con ese DNI.")
      }
    } catch (error) {
      console.error("Error searching for visitor:", error)
      toast("Hubo un problema al buscar el visitante. Por favor, intente de nuevo.")
    } finally {
      setIsSearching(false)
    }
  }

  // Render different steps
  const renderStep = () => {
    switch (step) {
      case 1:
        return <FormTypeStep onSelectType={handleFormTypeSelect} />
      case 2:
        return (
          <form onSubmit={form.handleSubmit(handleNext)} className="space-y-2">
            <h2 className="text-xl font-bold primary-text">Relleno de datos</h2>
            <span className="text-sm text-muted-foreground">Rellene los campos del nuevo registro. Recuerde que los campos con <span className="text-red-500">*</span> son obligatorios.</span>
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

            {formType === 'vehicle' && (
              <div className="grid grid-cols-4 space-x-2">
                <FormField
                  control={form.control}
                  name="vehiclePlate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-bold primary-text">Placa del vehículo <span className="text-red-500">*</span></FormLabel>
                      <FormControl>
                        <Input placeholder="Ej.: ABC123" {...field} />
                      </FormControl>
                      <FormDescription>
                        Ingrese la placa del vehículo del visitante.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="vehicleBrand"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-bold primary-text">Marca del vehículo <span className="text-red-500">*</span></FormLabel>
                      <FormControl>
                        <Input placeholder="Ej.: Toyota" {...field} />
                      </FormControl>
                      <FormDescription>
                        Ingrese la marca del vehículo del visitante.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="vehicleModel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-bold primary-text">Modelo del vehículo <span className="text-red-500">*</span></FormLabel>
                      <FormControl>
                        <Input placeholder="Ej.: Corolla" {...field} />
                      </FormControl>
                      <FormDescription>
                        Ingrese el modelo del vehículo del visitante.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="vehicleColor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-bold primary-text">Color del vehículo <span className="text-red-500">*</span></FormLabel>
                      <FormControl>
                        <Input placeholder="Ej.: Azul" {...field} />
                      </FormControl>
                      <FormDescription>
                        Ingrese el color del vehículo del visitante.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            <div className="grid grid-cols-3 space-x-2">
              <div className="flex space-x-2">
                <FormField
                  control={form.control}
                  name="phonePrefix"
                  render={({ field }) => (
                    <FormItem className="col-span-1">
                      <FormLabel className="font-bold primary-text">Prefijo  <span className="text-red-500">*</span></FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        defaultValue={field.value}
                      >
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

            <div className="flex justify-between">
              <Button type="button" onClick={handleBack} variant="outline">
                Atrás
              </Button>
              <Button type="submit">
                Siguiente
              </Button>
            </div>
          </form>
        )
      case 3:
        return (
          <FormSummaryStep
            formData={form.getValues()}
            onBack={handleBack}
            onConfirm={form.handleSubmit(handleFinalSubmit)}
          />
        )
      default:
        return null
    }
  }

  return (
    <Form {...form}>
      <div className="space-y-4 max-h-[80vh] overflow-y-scroll p-2">
        {/* Progress indicator */}
        <div className="flex justify-between mb-8 sticky top-0 bg-background pt-2 pb-4 z-10">
          {[1, 2, 3].map((stepNumber) => (
            <div
              key={stepNumber}
              className={`flex items-center ${stepNumber < 3 ? 'flex-1' : ''}`}
            >
              <div className={`rounded-full h-8 w-8 flex items-center justify-center border-2 
                ${step >= stepNumber ? 'bg-primary text-white border-primary' : 'border-gray-300'}`}
              >
                {stepNumber}
              </div>
              {stepNumber < 3 && (
                <div className={`flex-1 h-1 mx-2 ${step > stepNumber ? 'bg-primary' : 'bg-gray-300'}`} />
              )}
            </div>
          ))}
        </div>

        {renderStep()}
      </div>
    </Form>
  )
}
