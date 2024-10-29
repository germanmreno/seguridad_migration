import { useEffect, useState, useMemo, memo } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { format } from "date-fns"
import axios from "axios"

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
import { phoneOptions } from "./options/formOptions"
import { Car, PersonStanding, Loader2, Search } from 'lucide-react';
import { Textarea } from "./components/ui/textarea"
import { toast } from 'sonner';

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
    message: "El ente debe tener al menos 2 caracteres.",
  }),
  contact: z.string({ required_error: "Campo obligatorio" }).min(2, {
    message: "El contacto debe tener al menos 2 caracteres.",
  }),
  observation: z.string().optional(),
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
  entityId: z.number().min(1, "Entidad es requerida"),
  administrativeUnitId: z.number().min(1, "Unidad Administrativa es requerida"),
  directionId: z.number().optional(),
  areaId: z.number().optional(),
})

// Memoized Entity Select Component
const EntitySelect = memo(({ field, loading, entities, onValueChange }) => (
  <FormItem>
    <FormLabel className="font-bold primary-text">Entidad <span className="text-red-500">*</span></FormLabel>
    <Select
      onValueChange={onValueChange}
      value={field.value?.toString() || ""}
      disabled={loading}
    >
      <FormControl>
        <SelectTrigger className="w-full">
          {loading ? (
            <div className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Cargando entidades...</span>
            </div>
          ) : (
            <SelectValue placeholder="Seleccione una entidad" />
          )}
        </SelectTrigger>
      </FormControl>
      <SelectContent>
        {entities.length > 0 ? (
          entities.map((entity) => (
            <SelectItem key={entity.id} value={entity.id.toString()}>
              {entity.name}
            </SelectItem>
          ))
        ) : (
          <div className="flex items-center justify-center p-4 text-sm text-muted-foreground">
            No se han encontrado entidades
          </div>
        )}
      </SelectContent>
    </Select>
    <FormDescription>
      Ingrese la entidad de la visita.
    </FormDescription>
    <FormMessage />
  </FormItem>
));

// Memoized Administrative Unit Select Component
const AdminUnitSelect = memo(({ field, loading, adminUnits, disabled, onValueChange }) => (
  <FormItem>
    <FormLabel className="font-bold primary-text">Unidad Administrativa <span className="text-red-500">*</span></FormLabel>
    <Select
      disabled={disabled || loading}
      onValueChange={onValueChange}
      value={field.value?.toString() || ""}
    >
      <FormControl>
        <SelectTrigger className="w-full">
          {loading ? (
            <div className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Cargando unidades...</span>
            </div>
          ) : (
            <SelectValue placeholder="Seleccione una unidad administrativa" />
          )}
        </SelectTrigger>
      </FormControl>
      <SelectContent>
        {adminUnits.length > 0 ? (
          adminUnits.map((unit) => (
            <SelectItem key={unit.id} value={unit.id.toString()}>
              {unit.name}
            </SelectItem>
          ))
        ) : (
          <div className="flex items-center justify-center p-4 text-sm text-muted-foreground">
            No se han encontrado unidades administrativas
          </div>
        )}
      </SelectContent>
    </Select>
    <FormDescription>
      Ingrese la unidad administrativa de la visita.
    </FormDescription>
    <FormMessage />
  </FormItem>
));

// Memoized Direction Select Component
const DirectionSelect = memo(({ field, loading, directions, disabled, onValueChange }) => (
  <FormItem>
    <FormLabel className="font-bold primary-text">Dirección</FormLabel>
    <Select
      disabled={disabled || loading}
      onValueChange={onValueChange}
      value={field.value?.toString() || ""}
    >
      <FormControl>
        <SelectTrigger className="w-full">
          {loading ? (
            <div className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Cargando direcciones...</span>
            </div>
          ) : (
            <SelectValue placeholder="Seleccione una dirección" />
          )}
        </SelectTrigger>
      </FormControl>
      <SelectContent>
        {directions.length > 0 ? (
          directions.map((direction) => (
            <SelectItem key={direction.id} value={direction.id.toString()}>
              {direction.name}
            </SelectItem>
          ))
        ) : (
          <div className="flex items-center justify-center p-4 text-sm text-muted-foreground">
            No se han encontrado direcciones
          </div>
        )}
      </SelectContent>
    </Select>
    <FormDescription>
      Ingrese la dirección de la visita.
    </FormDescription>
    <FormMessage />
  </FormItem>
));

// Memoized Area Select Component
const AreaSelect = memo(({ field, loading, areas, disabled, onValueChange }) => (
  <FormItem>
    <FormLabel className="font-bold primary-text">Área</FormLabel>
    <Select
      disabled={disabled || loading}
      onValueChange={onValueChange}
      value={field.value?.toString() || ""}
    >
      <FormControl>
        <SelectTrigger className="w-full">
          {loading ? (
            <div className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Cargando áreas...</span>
            </div>
          ) : (
            <SelectValue placeholder="Seleccione un área" />
          )}
        </SelectTrigger>
      </FormControl>
      <SelectContent>
        {areas.length > 0 ? (
          areas.map((area) => (
            <SelectItem key={area.id} value={area.id.toString()}>
              {area.name}
            </SelectItem>
          ))
        ) : (
          <div className="flex items-center justify-center p-4 text-sm text-muted-foreground">
            No se han encontrado áreas
          </div>
        )}
      </SelectContent>
    </Select>
    <FormDescription>
      Ingrese la área de la visita.
    </FormDescription>
    <FormMessage />
  </FormItem>
));

// Define all step components inside the main component
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
  );
};

const VisitorTypeStep = ({ onSelectType, onBack }) => {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold primary-text">Tipo de Visitante</h2>
      <span className="text-sm text-muted-foreground">Seleccione si es un visitante nuevo o existente.</span>
      <div className="grid grid-cols-2 gap-4">
        <Button
          onClick={() => onSelectType('new')}
          variant="outline"
          className="h-32"
        >
          <div className="space-y-2">
            <div className="flex items-center justify-center">
              <PersonStanding className="w-10 h-10" />
            </div>
            <h3 className="font-bold">Nuevo Visitante</h3>
            <p className="text-sm text-muted-foreground">Registrar un nuevo visitante</p>
          </div>
        </Button>
        <Button
          onClick={() => onSelectType('existing')}
          variant="outline"
          className="h-32"
        >
          <div className="space-y-2">
            <div className="flex items-center justify-center">
              <Search className="w-10 h-10" />
            </div>
            <h3 className="font-bold">Visitante Existente</h3>
            <p className="text-sm text-muted-foreground">Buscar un visitante registrado</p>
          </div>
        </Button>
      </div>
      <div className="flex justify-between">
        <Button onClick={onBack} variant="outline">Atrás</Button>
      </div>
    </div>
  );
};

const ExistingVisitorStep = ({ onNext, onBack }) => {
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    const searchDni = e.target.searchDni.value;
    if (!searchDni) {
      toast.error("Por favor, ingrese un DNI para buscar.");
      return;
    }

    setIsSearching(true);
    try {
      const response = await axios.get(`http://localhost:3001/api/visitors/search-visitor?dni=${searchDni}`);
      if (response.data.visitor) {
        onNext(response.data.visitor);
        toast.success(`Visitante encontrado: ${response.data.visitor.firstName} ${response.data.visitor.lastName}`);
      } else {
        toast.error("No se encontró ningún visitante con ese DNI.");
      }
    } catch (error) {
      console.error("Error searching for visitor:", error);
      toast.error("Hubo un problema al buscar el visitante. Por favor, intente de nuevo.");
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold primary-text">Buscar Visitante Existente</h2>
      <span className="text-sm text-muted-foreground">Ingrese el DNI del visitante para buscar sus datos.</span>

      <form onSubmit={handleSearch} className="space-y-4">
        <div className="flex gap-2">
          <Input
            name="searchDni"
            placeholder="Ingrese el DNI (Ej: V-12345678)"
            className="flex-1"
          />
          <Button type="submit" disabled={isSearching}>
            {isSearching ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Buscar"
            )}
          </Button>
        </div>
      </form>

      <div className="flex justify-between mt-8">
        <Button onClick={onBack} variant="outline">
          Atrás
        </Button>
      </div>
    </div>
  );
};

const VisitorPersonalInfoStep = ({ form, onNext, onBack, formType }) => {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold primary-text">Información Personal</h2>
      <span className="text-sm text-muted-foreground">
        Ingrese los datos personales del visitante. Los campos con <span className="text-red-500">*</span> son obligatorios.
      </span>

      <div className="grid grid-cols-3 gap-4">
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
              <FormLabel className="font-bold primary-text">Cédula <span className="text-red-500">*</span></FormLabel>
              <FormControl>
                <Input placeholder="Ej.: V-12345678" {...field} />
              </FormControl>
              <FormDescription>
                Ingrese la cédula del visitante (V-xxxxxxx o E-xxxxxxx).
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="flex space-x-4">
        <FormField
          control={form.control}
          name="phonePrefix"
          render={({ field }) => (
            <FormItem className="w-1/3">
              <FormLabel className="font-bold primary-text">Prefijo <span className="text-red-500">*</span></FormLabel>
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

      {formType === 'vehicle' && (
        <>
          <h2 className="text-xl font-bold primary-text mt-8">Información del Vehículo</h2>
          <div className="grid grid-cols-2 gap-4">
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
        </>
      )}

      <div className="flex justify-between mt-6">
        <Button type="button" onClick={onBack} variant="outline">
          Atrás
        </Button>
        <Button
          type="button"
          onClick={() => {
            const fieldsToValidate = [
              'firstName',
              'lastName',
              'dni',
              'phonePrefix',
              'phoneNumber'
            ];

            if (formType === 'vehicle') {
              fieldsToValidate.push(
                'vehiclePlate',
                'vehicleBrand',
                'vehicleModel',
                'vehicleColor'
              );
            }

            form.trigger(fieldsToValidate).then(isValid => {
              if (isValid) onNext();
            });
          }}
        >
          Siguiente
        </Button>
      </div>
    </div>
  );
};

const EnterpriseInfoStep = ({ form, onNext, onBack }) => {
  return (
    <form onSubmit={form.handleSubmit(onNext)} className="space-y-4">
      <h2 className="text-xl font-bold primary-text">Información Empresarial</h2>
      <span className="text-sm text-muted-foreground">
        Ingrese los datos empresariales del visitante. Los campos con <span className="text-red-500">*</span> son obligatorios.
      </span>

      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="business"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-bold primary-text">Empresa <span className="text-red-500">*</span></FormLabel>
              <FormControl>
                <Input placeholder="Empresa a la que representa el visitante" {...field} />
              </FormControl>
              <FormDescription>
                Ingrese el nombre de la empresa a la que representa el visitante.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="business"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-bold primary-text">RIF de la Empresa <span className="text-red-500">*</span></FormLabel>
              <FormControl>
                <Input placeholder="RIF de la empresa a la que representa el visitante (G-xxxxxxx o J-xxxxxxx)" {...field} />
              </FormControl>
              <FormDescription>
                Ingrese el RIF de la empresa a la que representa el visitante (G-xxxxxxx o J-xxxxxxx).
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>


      <div className="flex justify-between mt-6">
        <Button type="button" onClick={onBack} variant="outline">
          Atrás
        </Button>
        <Button onClick={() => {
          const fieldsToValidate = [
            'business',
          ];

          form.trigger(fieldsToValidate).then(isValid => {
            if (isValid) onNext();
          });
        }}>
          Siguiente
        </Button>
      </div>
    </form>
  );
};

const VisitInfoStep = ({ form, onNext, onBack, entities, adminUnits, directions, areas, loading }) => {
  // Helper functions to get names from IDs
  const getEntityName = (id) => {
    const entity = entities.find(e => e.id.toString() === id?.toString());
    return entity?.name || "";
  };

  const getAdminUnitName = (id) => {
    const unit = adminUnits.find(u => u.id.toString() === id?.toString());
    return unit?.name || "";
  };

  const getDirectionName = (id) => {
    const direction = directions.find(d => d.id.toString() === id?.toString());
    return direction?.name || "";
  };

  const getAreaName = (id) => {
    const area = areas.find(a => a.id.toString() === id?.toString());
    return area?.name || "";
  };

  // Calculate column class based on number of visible selects
  const getColSpanClass = () => {
    const visibleSelectsCount = 2 + (directions.length > 0 ? 1 : 0) + (areas.length > 0 ? 1 : 0);
    switch (visibleSelectsCount) {
      case 2: return 'col-span-2';
      case 3: return 'col-span-1';
      case 4: return 'col-span-1';
      default: return 'col-span-2';
    }
  };

  const colSpanClass = getColSpanClass();

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold primary-text">Información de la Visita</h2>
      <span className="text-sm text-muted-foreground">
        Ingrese los datos de la visita. Los campos con <span className="text-red-500">*</span> son obligatorios.
      </span>

      <div className="grid grid-cols-4 gap-4">
        <FormField
          control={form.control}
          name="entityId"
          render={({ field }) => (
            <FormItem className={colSpanClass}>
              <FormLabel className="font-bold primary-text">Gerencia <span className="text-red-500">*</span></FormLabel>
              <Select
                disabled={loading}
                onValueChange={(value) => {
                  field.onChange(value);
                  form.setValue('administrativeUnitId', '');
                  form.setValue('directionId', '');
                  form.setValue('areaId', '');
                }}
                value={field.value?.toString()}
              >
                <FormControl>
                  <SelectTrigger className="w-full">
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Cargando entes...</span>
                      </div>
                    ) : (
                      <SelectValue placeholder="Seleccione un ente">
                        {getEntityName(field.value)}
                      </SelectValue>
                    )}
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {entities.length > 0 ? (
                    entities.map((entity) => (
                      <SelectItem key={entity.id} value={entity.id.toString()}>
                        {entity.name}
                      </SelectItem>
                    ))
                  ) : (
                    <div className="flex items-center justify-center p-4 text-sm text-muted-foreground">
                      No se han encontrado gerencias
                    </div>
                  )}
                </SelectContent>
              </Select>
              <FormDescription>
                Seleccione la gerencia a visitar.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="administrativeUnitId"
          render={({ field }) => (
            <FormItem className={colSpanClass}>
              <FormLabel className="font-bold primary-text">Unidad Administrativa <span className="text-red-500">*</span></FormLabel>
              <Select
                disabled={!form.watch('entityId') || loading}
                onValueChange={(value) => {
                  field.onChange(value);
                  form.setValue('directionId', '');
                  form.setValue('areaId', '');
                }}
                value={field.value?.toString()}
              >
                <FormControl>
                  <SelectTrigger className="w-full">
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Cargando unidades...</span>
                      </div>
                    ) : (
                      <SelectValue placeholder="Seleccione una unidad administrativa">
                        {getAdminUnitName(field.value)}
                      </SelectValue>
                    )}
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {adminUnits.length > 0 ? (
                    adminUnits.map((unit) => (
                      <SelectItem key={unit.id} value={unit.id.toString()}>
                        {unit.name}
                      </SelectItem>
                    ))
                  ) : (
                    <div className="flex items-center justify-center p-4 text-sm text-muted-foreground">
                      {form.watch('entityId')
                        ? "No se han encontrado unidades administrativas"
                        : "Seleccione una gerencia primero"}
                    </div>
                  )}
                </SelectContent>
              </Select>
              <FormDescription>
                Seleccione la unidad administrativa a visitar.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {directions.length > 0 && (
          <FormField
            control={form.control}
            name="directionId"
            render={({ field }) => (
              <FormItem className={colSpanClass}>
                <FormLabel className="font-bold primary-text">Dirección</FormLabel>
                <Select
                  disabled={!form.watch('administrativeUnitId') || loading}
                  onValueChange={(value) => {
                    field.onChange(value);
                    form.setValue('areaId', '');
                  }}
                  value={field.value?.toString()}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      {loading ? (
                        <div className="flex items-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span>Cargando direcciones...</span>
                        </div>
                      ) : (
                        <SelectValue placeholder="Seleccione una dirección">
                          {getDirectionName(field.value)}
                        </SelectValue>
                      )}
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {directions.length > 0 ? (
                      directions.map((direction) => (
                        <SelectItem key={direction.id} value={direction.id.toString()}>
                          {direction.name}
                        </SelectItem>
                      ))
                    ) : (
                      <div className="flex items-center justify-center p-4 text-sm text-muted-foreground">
                        {form.watch('administrativeUnitId')
                          ? "No se han encontrado direcciones"
                          : "Seleccione una unidad administrativa primero"}
                      </div>
                    )}
                  </SelectContent>
                </Select>
                <FormDescription>
                  Seleccione la dirección a visitar (opcional).
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {areas.length > 0 && (
          <FormField
            control={form.control}
            name="areaId"
            render={({ field }) => (
              <FormItem className={colSpanClass}>
                <FormLabel className="font-bold primary-text">Área</FormLabel>
                <Select
                  disabled={!form.watch('administrativeUnitId') || loading}
                  onValueChange={field.onChange}
                  value={field.value?.toString()}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      {loading ? (
                        <div className="flex items-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span>Cargando áreas...</span>
                        </div>
                      ) : (
                        <SelectValue placeholder="Seleccione un área">
                          {getAreaName(field.value)}
                        </SelectValue>
                      )}
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {areas.length > 0 ? (
                      areas.map((area) => (
                        <SelectItem key={area.id} value={area.id.toString()}>
                          {area.name}
                        </SelectItem>
                      ))
                    ) : (
                      <div className="flex items-center justify-center p-4 text-sm text-muted-foreground">
                        {form.watch('administrativeUnitId')
                          ? "No se han encontrado áreas"
                          : "Seleccione una unidad administrativa primero"}
                      </div>
                    )}
                  </SelectContent>
                </Select>
                <FormDescription>
                  Seleccione el área a visitar (opcional).
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
      </div>

      {/* Other fields below the grid */}
      <div className="space-y-4">
        <FormField
          control={form.control}
          name="contact"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-bold primary-text">Persona a visitar <span className="text-red-500">*</span></FormLabel>
              <FormControl>
                <Input placeholder="Nombre de la persona a visitar" {...field} />
              </FormControl>
              <FormDescription>
                Ingrese el nombre de la persona que será visitada.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="observation"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-bold primary-text">Observación</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Observaciones adicionales de la visita"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Ingrese cualquier observación adicional sobre la visita.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="flex justify-between mt-6">
        <Button type="button" onClick={onBack} variant="outline">
          Atrás
        </Button>
        <Button
          type="button"
          onClick={() => {
            form.trigger([
              'entityId',
              'administrativeUnitId',
              'contact',
              'observation'
            ]).then(isValid => {
              if (isValid) onNext();
            });
          }}
        >
          Siguiente
        </Button>
      </div>
    </div>
  );
};

const FormSummaryStep = ({ formData, onBack, onConfirm }) => {
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
        <Button type="button" onClick={onBack} variant="outline">
          Atrás
        </Button>
        <Button
          onClick={onConfirm}
        >
          Confirmar Registro
        </Button>
      </div>
    </div>
  );
};

export function AddItemForm({ onSubmit }) {
  const [step, setStep] = useState(1);
  const [formType, setFormType] = useState(null);
  const [visitorType, setVisitorType] = useState(null);

  // Add state for form selections
  const [entities, setEntities] = useState([]);
  const [adminUnits, setAdminUnits] = useState([]);
  const [directions, setDirections] = useState([]);
  const [areas, setAreas] = useState([]);
  const [loading, setLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      formType: "",
      firstName: "",
      lastName: "",
      dni: "",
      date: new Date(),
      business: "",
      phonePrefix: "",
      phoneNumber: "",
      entityId: "",
      administrativeUnitId: "",
      directionId: "",
      areaId: "",
      contact: "",
      observation: "",
      vehiclePlate: "",
      vehicleModel: "",
      vehicleBrand: "",
      vehicleColor: "",
    },
  });

  const { watch } = form;
  const entityId = watch("entityId");
  const adminUnitId = watch("administrativeUnitId");
  const directionId = watch("directionId");

  // Add useEffect hooks for fetching data
  useEffect(() => {
    const fetchEntities = async () => {
      try {
        const response = await axios.get("http://localhost:3001/api/selects/entities");
        setEntities(response.data);
      } catch (error) {
        console.error("Error fetching entities:", error);
      }
    };
    fetchEntities();
  }, []);

  useEffect(() => {
    const fetchAdminUnits = async () => {
      if (!entityId) {
        setAdminUnits([]);
        return;
      }
      try {
        setLoading(true);
        const response = await axios.get(
          `http://localhost:3001/api/selects/administrative-units/${entityId}`
        );
        setAdminUnits(response.data);
      } catch (error) {
        console.error("Error fetching administrative units:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAdminUnits();
  }, [entityId]);

  useEffect(() => {
    const fetchDirections = async () => {
      if (!adminUnitId) {
        setDirections([]);
        return;
      }
      try {
        setLoading(true);
        const response = await axios.get(
          `http://localhost:3001/api/selects/directions/${adminUnitId}`
        );
        setDirections(response.data);
      } catch (error) {
        console.error("Error fetching directions:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDirections();
  }, [adminUnitId]);

  useEffect(() => {
    const fetchAreas = async () => {
      if (!adminUnitId && !directionId) {
        setAreas([]);
        return;
      }

      try {
        setLoading(true);
        let response;
        if (directionId) {
          response = await axios.get(
            `http://localhost:3001/api/selects/areas/${directionId}?type=direction`
          );
        } else {
          response = await axios.get(
            `http://localhost:3001/api/selects/areas/${adminUnitId}?type=unit`
          );
        }
        setAreas(response.data);
      } catch (error) {
        console.error("Error fetching areas:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAreas();
  }, [adminUnitId, directionId]);

  // Add handlers for select changes
  const handleEntityChange = useMemo(() =>
    (value) => {
      const numericValue = parseInt(value, 10);
      if (numericValue !== form.getValues().entityId) {
        form.setValue('entityId', numericValue);
        form.setValue('administrativeUnitId', '');
        form.setValue('directionId', '');
        form.setValue('areaId', '');
      }
    },
    [form]
  );

  const handleAdminUnitChange = useMemo(() =>
    (value) => {
      const numericValue = parseInt(value, 10);
      if (numericValue !== form.getValues().administrativeUnitId) {
        form.setValue('administrativeUnitId', numericValue);
        form.setValue('directionId', '');
        form.setValue('areaId', '');
      }
    },
    [form]
  );

  const handleDirectionChange = useMemo(() =>
    (value) => {
      const numericValue = parseInt(value, 10);
      if (numericValue !== form.getValues().directionId) {
        form.setValue('directionId', numericValue);
        form.setValue('areaId', '');
      }
    },
    [form]
  );

  const handleAreaChange = useMemo(() =>
    (value) => {
      const numericValue = parseInt(value, 10);
      if (numericValue !== form.getValues().areaId) {
        form.setValue('areaId', numericValue);
      }
    },
    [form]
  );

  const handleFormTypeSelect = (type) => {
    setFormType(type);
    form.setValue('formType', type);
    setStep(2);
  };

  const handleVisitorTypeSelect = (type) => {
    setVisitorType(type);
    if (type === 'new') {
      setStep(3);
    } else {
      setStep(2.5);
    }
  };

  const handleExistingVisitorFound = (visitorData) => {
    // ... handle existing visitor data ...
    setStep(3);
  };

  const handleFinalSubmit = async (data) => {
    try {
      // First API call - Create/Update Visitor
      const visitorResponse = await axios.post('/api/visitors', {
        firstName: data.firstName,
        lastName: data.lastName,
        dni: data.dni,
        phonePrefix: data.phonePrefix,
        phoneNumber: data.phoneNumber,
        ...(formType === 'vehicle' && {
          vehiclePlate: data.vehiclePlate,
          vehicleBrand: data.vehicleBrand,
          vehicleModel: data.vehicleModel,
          vehicleColor: data.vehicleColor,
        }),
      });

      // Second API call - Create Visit using visitor ID from first response
      await axios.post('/api/visits', {
        visitorId: visitorResponse.data.id,
        entityId: data.entityId,
        administrativeUnitId: data.administrativeUnitId,
        directionId: data.directionId,
        areaId: data.areaId,
        contact: data.contact,
        observation: data.observation,
      });

      toast.success("Registro completado exitosamente");
      // Handle successful submission (reset form, redirect, etc.)
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error("Error al procesar el registro");
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return <FormTypeStep onSelectType={handleFormTypeSelect} />;
      case 2:
        return <VisitorTypeStep onSelectType={handleVisitorTypeSelect} onBack={() => setStep(1)} />;
      case 2.5:
        return <ExistingVisitorStep onNext={handleExistingVisitorFound} onBack={() => setStep(2)} />;
      case 3:
        return <VisitorPersonalInfoStep
          form={form}
          formType={formType}
          onNext={() => setStep(4)}
          onBack={() => setStep(2)}
        />;
      case 4:
        return <VisitInfoStep
          form={form}
          entities={entities}
          adminUnits={adminUnits}
          directions={directions}
          areas={areas}
          loading={loading}
          onNext={() => setStep(5)}
          onBack={() => setStep(3)}
        />;
      case 5:
        return <FormSummaryStep
          formData={form.getValues()}
          onBack={() => setStep(4)}
          onConfirm={form.handleSubmit(handleFinalSubmit)}
        />;
      default:
        return null;
    }
  };

  return (
    <Form {...form}>
      <div className="space-y-4 max-h-[80vh] overflow-y-scroll p-2">
        {/* Progress indicator */}
        <div className="flex justify-between mb-8 sticky top-0 bg-background pt-2 pb-4 z-10">
          {[1, 2, 3, 4, 5, 6].map((stepNumber) => (
            <div
              key={stepNumber}
              className={`flex items-center ${stepNumber < 6 ? 'flex-1' : ''}`}
            >
              <div className={`rounded-full h-8 w-8 flex items-center justify-center border-2 
                ${step >= stepNumber ? 'bg-primary text-white border-primary' : 'border-gray-300'}`}
              >
                {stepNumber}
              </div>
              {stepNumber < 6 && (
                <div className={`flex-1 h-1 mx-2 ${step > stepNumber ? 'bg-primary' : 'bg-gray-300'}`} />
              )}
            </div>
          ))}
        </div>

        {renderStep()}
      </div>
    </Form>
  );
}

