import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { PHONE_OPTIONS } from "../constants";

export const FormSummaryStep = ({ formData, onBack, onConfirm }) => {
  const formattedPrefixId = PHONE_OPTIONS.find(option => option.value === formData.contactNumberPrefixId)?.value || 'Error';

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 px-4 pt-2">
        <h2 className="text-base font-bold bg-blue-800 px-3 py-1.5 rounded text-white">
          Resumen del registro
        </h2>
        <span className="text-xs text-gray-600 dark:text-gray-300 block mt-1 mb-2">
          Asegúrese de que los datos sean correctos antes de confirmar el registro.
        </span>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 py-2">
        <div className="space-y-3">
          <SummarySection
            title="Datos de la empresa"
            data={[
              { label: "Nombre de la empresa", value: formData.enterpriseName },
            ]}
          />

          <SummarySection
            title="Datos del visitante"
            data={[
              { label: "Nombre completo", value: `${formData.firstName} ${formData.lastName}` },
              { label: "Cédula", value: `${formData.dniType === "1" ? 'V-' : 'E-'} ${formData.dniNumber}` },
              { label: "Empresa", value: formData.enterpriseName },
              { label: "Teléfono", value: `${formattedPrefixId} ${formData.phoneNumber}` },
            ]}
          />

          <SummarySection
            title="Datos de la visita"
            data={[
              { label: "Ente", value: formData.entityName || 'No especificado' },
              { label: "Unidad Administrativa", value: formData.administrativeUnitName || 'No especificado' },
              ...(formData.directionId ? [{
                label: "Dirección",
                value: formData.directionName || 'No especificado'
              }] : []),
              ...(formData.areaId ? [{
                label: "Área",
                value: formData.areaName || 'No especificado'
              }] : []),
              { label: "Contacto", value: formData.contact },
              { label: "Fecha", value: format(formData.dateVisit, 'dd/MM/yyyy') },
              { label: "Hora", value: format(formData.dateHourVisit, 'HH:mm') },
              { label: "Observación", value: formData.observation || 'Sin observaciones' },
            ]}
          />

          {formData?.formType === 'vehicle' && (
            <SummarySection
              title="Datos del vehículo"
              data={[
                { label: "Placa del vehículo", value: formData.vehiclePlate },
                { label: "Marca del vehículo", value: formData.vehicleBrand },
                { label: "Modelo del vehículo", value: formData.vehicleModel },
                { label: "Color del vehículo", value: formData.vehicleColor },
              ]}
            />
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="bg-white dark:bg-gray-800 px-4 py-3 border-t mt-2">
        <div className="flex justify-between">
          <Button type="button" onClick={onBack} variant="outline" size="sm">
            Atrás
          </Button>
          <Button type="button" onClick={onConfirm} size="sm">
            Confirmar Registro
          </Button>
        </div>
      </div>
    </div>
  );
};

const SummarySection = ({ title, data }) => (
  <div className="space-y-2 bg-white dark:bg-gray-800 rounded border">
    <h3 className="text-sm font-semibold bg-blue-800 px-3 py-1 rounded-t text-white">
      {title}
    </h3>
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 p-3">
      {data.map(({ label, value }, index) => (
        <div key={index} className="space-y-0.5">
          <p className="text-xs font-medium text-gray-700 dark:text-gray-300">{label}:</p>
          <p className="text-xs text-gray-600 dark:text-gray-400">{value}</p>
        </div>
      ))}
    </div>
  </div>
);
