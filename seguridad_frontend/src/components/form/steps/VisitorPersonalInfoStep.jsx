import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PHONE_OPTIONS, DNI_TYPES } from "../constants";
import { WebcamCapture } from "@/components/ui/webcam-capture";
import { useEffect } from "react";

export const VisitorPersonalInfoStep = ({ form, onNext, onBack, formType }) => {
  useEffect(() => {
    console.log('VisitorPersonalInfoStep mounted with form values:', {
      dniType: form.getValues('dniType'),
      dniNumber: form.getValues('dniNumber')
    });
  }, [form]);

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
    <div className="space-y-4 bg-gray-100/90 dark:bg-gray-950/90 p-6 rounded-lg">
      <h2 className="text-xl font-bold bg-blue-800 px-4 py-2 rounded-md text-white">
        Información Personal
      </h2>
      <span className="text-sm text-gray-600 dark:text-gray-300">
        Ingrese los datos personales del visitante. Los campos con <span className="text-red-500">*</span> son obligatorios.
      </span>

      <div className="flex flex-col gap-6">
        <div className="bg-white/50 dark:bg-gray-900/50 p-4 rounded-lg">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
              Foto del Visitante
            </h3>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Tome una foto del visitante. <span className="text-red-500">*</span>
            </span>
          </div>

          <FormField
            control={form.control}
            name="visitorPhoto"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <WebcamCapture
                    onPhotoCapture={(photoData) => {
                      field.onChange(photoData);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="bg-white/50 dark:bg-gray-900/50 p-4 rounded-lg">
          <PersonalInfoFields form={form} />
        </div>

        {formType === 'vehicle' && (
          <div className="bg-white/50 dark:bg-gray-900/50 p-4 rounded-lg">
            <VehicleInfoFields form={form} />
          </div>
        )}
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
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
      render={({ field }) => {
        console.log('DNI Type field value:', field.value);
        return (
          <FormItem className="flex-1">
            <FormLabel className="font-bold primary-text">
              Tipo de Cédula <span className="text-red-500">*</span>
            </FormLabel>
            <Select
              onValueChange={(value) => {
                console.log('Selected DNI Type:', value);
                field.onChange(value);
              }}
              value={field.value || ""}
              defaultValue={field.value || ""}
            >
              <FormControl>
                <SelectTrigger className="bg-white dark:bg-gray-800">
                  <SelectValue placeholder="V- o E-">
                    {field.value ? DNI_TYPES.find(type => type.value === field.value)?.label : "V- o E-"}
                  </SelectValue>
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
        );
      }}
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
            value={field.value || ""}
            defaultValue={field.value || ""}
          >
            <FormControl>
              <SelectTrigger className="bg-white dark:bg-gray-800">
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
  <>
    <div className="mb-4">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
        Información del Vehículo
      </h3>
      <span className="text-sm text-gray-600 dark:text-gray-400">
        Ingrese los datos del vehículo del visitante. Los campos con <span className="text-red-500">*</span> son obligatorios.
      </span>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <FormField
        control={form.control}
        name="vehiclePlate"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="font-bold primary-text">Placa del vehículo <span className="text-red-500">*</span></FormLabel>
            <FormControl>
              <Input className="bg-white dark:bg-gray-800" placeholder="Ej.: ABC123" {...field} />
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
              <Input className="bg-white dark:bg-gray-800" placeholder="Ej.: Toyota" {...field} />
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
              <Input className="bg-white dark:bg-gray-800" placeholder="Ej.: Corolla" {...field} />
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
  </>
);