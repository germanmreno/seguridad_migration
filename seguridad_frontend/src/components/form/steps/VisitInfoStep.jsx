import { useCallback, useEffect } from "react";
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { TimePicker12Demo } from "@/components/ui/time-picker-12-h-demo";
import { DateTimePicker } from "@/components/ui/date-time-picker";

export const VisitInfoStep = ({
  form,
  onNext,
  onBack,
  entities,
  adminUnits,
  directions,
  areas,
  loading,
  loadEntities,
  loadAdminUnits,
  loadDirections,
  loadAreas
}) => {
  const colSpanClass = "col-span-4 sm:col-span-2 lg:col-span-1";

  return (
    <div className="flex flex-col h-full max-h-[calc(100vh-100px)]">
      <div className="flex-1 overflow-y-auto">
        <div className="space-y-4 p-4">
          <h2 className="text-xl font-bold bg-blue-800 px-4 py-2 rounded-md text-white sticky top-0 z-10">
            Información de la Visita
          </h2>
          <span className="text-sm text-gray-600 dark:text-gray-300">
            Indique la información de la visita actual.
          </span>

          <div className="grid grid-cols-4 gap-4">
            <SelectFields
              form={form}
              loading={loading}
              entities={entities}
              adminUnits={adminUnits}
              directions={directions}
              areas={areas}
              colSpanClass={colSpanClass}
              loadEntities={loadEntities}
              loadAdminUnits={loadAdminUnits}
              loadDirections={loadDirections}
              loadAreas={loadAreas}
            />
          </div>

          <AdditionalFields form={form} />
        </div>
      </div>

      <div className="sticky bottom-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 p-4 border-t mt-auto">
        <div className="flex justify-between">
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
    </div>
  );
};

const SelectFields = ({
  form,
  loading,
  entities,
  adminUnits,
  directions,
  areas,
  colSpanClass,
  loadEntities,
  loadAdminUnits,
  loadDirections,
  loadAreas
}) => {
  // Add safety check to getName function
  const getName = (array, id) => {
    if (!Array.isArray(array)) return "";
    return array.find(item => item.id?.toString() === id?.toString())?.name || "";
  };

  // Load initial entities if needed
  useEffect(() => {
    if (!Array.isArray(entities) || entities.length === 0) {
      loadEntities();
    }
  }, [entities, loadEntities]);

  return (
    <>
      <FormField
        control={form.control}
        name="entityId"
        render={({ field }) => (
          <FormItem className={colSpanClass}>
            <FormLabel className="font-bold primary-text">Ente <span className="text-red-500">*</span></FormLabel>
            <Select
              disabled={loading}
              onValueChange={(value) => {
                const selectedEntity = entities.find(e => e.id.toString() === value);
                field.onChange(value ? Number(value) : null);
                // Store the name in a separate field
                form.setValue('entityName', selectedEntity?.name || '');

                // Clear dependent fields
                form.setValue('administrativeUnitId', null);
                form.setValue('administrativeUnitName', '');
                form.setValue('directionId', null);
                form.setValue('directionName', '');
                form.setValue('areaId', null);
                form.setValue('areaName', '');

                loadAdminUnits(value);
              }}
              value={field.value?.toString() || ""}
            >
              <FormControl>
                <SelectTrigger className="w-full bg-white dark:bg-gray-800">
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Cargando entes...</span>
                    </div>
                  ) : (
                    <SelectValue placeholder="Seleccione una gerencia">
                      {getName(entities, field.value)}
                    </SelectValue>
                  )}
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {Array.isArray(entities) && entities.length > 0 ? (
                  entities.map((entity) => (
                    <SelectItem key={entity.id} value={entity.id.toString()}>
                      {entity.name}
                    </SelectItem>
                  ))
                ) : (
                  <div className="flex items-center justify-center p-4 text-sm text-muted-foreground">
                    No se han encontrado entes
                  </div>
                )}
              </SelectContent>
            </Select>
            <FormDescription>
              Seleccione el ente a visitar.
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
                const selectedUnit = adminUnits.find(u => u.id.toString() === value);
                field.onChange(value ? Number(value) : null);
                // Store the name in a separate field
                form.setValue('administrativeUnitName', selectedUnit?.name || '');

                // Clear dependent fields
                form.setValue('directionId', null);
                form.setValue('directionName', '');
                form.setValue('areaId', null);
                form.setValue('areaName', '');

                loadDirections(value);
                loadAreas(value);
              }}
              value={field.value?.toString() || ""}
            >
              <FormControl>
                <SelectTrigger className="w-full bg-white dark:bg-gray-800">
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Cargando unidades...</span>
                    </div>
                  ) : (
                    <SelectValue placeholder="Seleccione una unidad administrativa">
                      {getName(adminUnits, field.value)}
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
                  const selectedDirection = directions.find(d => d.id.toString() === value);
                  field.onChange(value ? Number(value) : null);
                  // Make sure we're setting the name even if it's an empty string
                  form.setValue('directionName', selectedDirection?.name || '');
                }}
                value={field.value?.toString() || ""}
              >
                <FormControl>
                  <SelectTrigger className="w-full bg-white dark:bg-gray-800">
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Cargando direcciones...</span>
                      </div>
                    ) : (
                      <SelectValue placeholder="Seleccione una dirección">
                        {getName(directions, field.value)}
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
                onValueChange={(value) => {
                  const selectedArea = areas.find(a => a.id.toString() === value);
                  field.onChange(value ? Number(value) : null);
                  // Make sure we're setting the name even if it's an empty string
                  form.setValue('areaName', selectedArea?.name || '');
                }}
                value={field.value?.toString() || ""}
              >
                <FormControl>
                  <SelectTrigger className="w-full bg-white dark:bg-gray-800">
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Cargando áreas...</span>
                      </div>
                    ) : (
                      <SelectValue placeholder="Seleccione un área">
                        {getName(areas, field.value)}
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
    </>
  );
};

const AdditionalFields = ({ form }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 justify-center items-center">
    <FormField
      control={form.control}
      name="contact"
      render={({ field }) => (
        <FormItem className="col-span-2">
          <FormLabel className="font-bold primary-text">Persona a visitar <span className="text-red-500">*</span></FormLabel>
          <FormControl>
            <Input
              className="bg-white dark:bg-gray-800"
              placeholder="Nombre de la persona a visitar"
              {...field}
            />
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
      name="dateVisit"
      render={({ field }) => {
        return (
          <FormItem>
            <FormLabel className="font-bold primary-text">Día de la visita <span className="text-red-500">*</span></FormLabel>
            <FormControl>
              <DateTimePicker
                date={field.value}
                setDate={(newDate) => {
                  if (!newDate) return;
                  console.log('New date selected:', newDate);
                  field.onChange(newDate);
                }}
              />
            </FormControl>
            <FormDescription>
              Ingrese la fecha de la visita.
            </FormDescription>
            <FormMessage />
          </FormItem>
        );
      }}
    />

    <FormField
      control={form.control}
      name="dateHourVisit"
      render={({ field }) => {
        return (
          <FormItem>
            <FormLabel className="font-bold primary-text">Hora de la visita <span className="text-red-500">*</span></FormLabel>
            <FormControl>
              <TimePicker12Demo
                date={field.value}
                setDate={(newTime) => {
                  if (!newTime) return;

                  // Create a new date object with the current date and new time
                  const selectedDate = new Date(field.value);
                  selectedDate.setHours(newTime.getHours());
                  selectedDate.setMinutes(newTime.getMinutes());

                  // Update dateHourVisit with the new time
                  field.onChange(selectedDate);
                }}
                period={field.value.getHours() >= 12 ? 'PM' : 'AM'}
              />
            </FormControl>
            <FormDescription>
              Ingrese la hora de la visita.
            </FormDescription>
            <FormMessage />
          </FormItem>
        );
      }}
    />

    <FormField
      control={form.control}
      name="observation"
      render={({ field }) => (
        <FormItem className="col-span-2" >
          <FormLabel className="font-bold primary-text">Observación</FormLabel>
          <FormControl>
            <Textarea
              className="bg-white dark:bg-gray-800"
              placeholder="Ingrese una observación..."
              {...field}
            />
          </FormControl>
          <FormDescription>
            Ingrese una observación (opcional).
          </FormDescription>
        </FormItem>
      )}
    />
  </div>
);
