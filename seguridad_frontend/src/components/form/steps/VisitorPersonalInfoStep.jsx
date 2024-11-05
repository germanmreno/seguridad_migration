import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PHONE_OPTIONS, DNI_TYPES } from "../constants";

export const VisitorPersonalInfoStep = ({ form, onNext, onBack, formType }) => {
  const handleNext = async () => {
    const fieldsToValidate = [
      'firstName',
      'lastName',
      'dniType',
      'dniNumber',
      'contactNumberPrefixId',
      'phoneNumber'
    ];

    const fieldsToValidateErrors = form.formState.errors;
    console.log(fieldsToValidateErrors);

    if (formType === 'vehicle') {
      fieldsToValidate.push(
        'vehiclePlate',
        'vehicleBrand',
        'vehicleModel',
        'vehicleColor'
      );
    }

    const isValid = await form.trigger(fieldsToValidate);
    console.log("isValid", isValid);
    if (isValid) onNext();
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold primary-text">Información Personal</h2>
      <span className="text-sm text-muted-foreground">
        Ingrese los datos personales del visitante. Los campos con <span className="text-red-500">*</span> son obligatorios.
      </span>

      <div className="flex flex-col gap-4">
        <PersonalInfoFields form={form} />
        {formType === 'vehicle' && <VehicleInfoFields form={form} />}
      </div>

      <div className="flex justify-between mt-6">
        <Button type="button" onClick={onBack} variant="outline">
          Atrás
        </Button>
        <Button type="button" onClick={handleNext}>
          Siguiente
        </Button>
      </div>
    </div>
  );
};

const PersonalInfoFields = ({ form }) => (
  <div className="grid grid-cols-4 gap-4">
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
      name="dniType"
      render={({ field }) => (
        <FormItem className="flex-1">
          <FormLabel className="font-bold primary-text">Tipo de Cédula <span className="text-red-500">*</span></FormLabel>
          <Select
            onValueChange={field.onChange}
            value={field.value}
            defaultValue={field.value}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="V- o E-" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {DNI_TYPES.map((option) => (
                <SelectItem key={option.id} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormDescription>
            Tipo de cédula.
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />

    <FormField
      control={form.control}
      name="dniNumber"
      render={({ field }) => (
        <FormItem className="flex-1">
          <FormLabel className="font-bold primary-text">Número de Cédula <span className="text-red-500">*</span></FormLabel>
          <FormControl>
            <Input placeholder="Ej.: 12345678" {...field} />
          </FormControl>
          <FormDescription>
            Ingrese solo los números de la cédula.
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />

    <FormField
      control={form.control}
      name="contactNumberPrefixId"
      render={({ field }) => (
        <FormItem className="flex-1">
          <FormLabel className="font-bold primary-text">Prefijo <span className="text-red-500">*</span></FormLabel>
          <Select
            onValueChange={field.onChange}
            value={field.value}
            defaultValue={field.value}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="+58(4..)" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {PHONE_OPTIONS.map((option) => (
                <SelectItem key={option.id} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormDescription>
            Prefijo telefónico.
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />

    <FormField
      control={form.control}
      name="phoneNumber"
      render={({ field }) => (
        <FormItem className="flex-1">
          <FormLabel className="font-bold primary-text">Número de teléfono <span className="text-red-500">*</span></FormLabel>
          <FormControl>
            <Input placeholder="Ej.: 1234567" {...field} />
          </FormControl>
          <FormDescription>
            Escriba el número de teléfono del visitante.
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  </div>
);

const VehicleInfoFields = ({ form }) => (
  <div className="grid grid-cols-4 gap-4">
    <div className="col-span-4">
      <h2 className="text-xl font-bold primary-text">Información del Vehículo</h2>
      <span className="text-sm text-muted-foreground">
        Ingrese los datos del vehículo del visitante. Los campos con <span className="text-red-500">*</span> son obligatorios.
      </span>
    </div>


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
); 