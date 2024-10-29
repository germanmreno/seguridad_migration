import { Button } from "@/components/ui/button";
import { format } from "date-fns";

export const FormSummaryStep = ({ formData, onBack, onConfirm }) => {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold primary-text">Resumen del registro</h2>
      <span className="text-sm text-muted-foreground">
        Asegúrese de que los datos sean correctos antes de confirmar el registro.
      </span>

      <div className="grid p-4 border rounded-lg">
        <SummarySection
          title="Datos del visitante"
          data={[
            { label: "Nombre completo", value: `${formData.firstName} ${formData.lastName}` },
            { label: "Cédula", value: formData.dni },
            { label: "Empresa", value: formData.business },
            { label: "Teléfono", value: `${formData.phonePrefix} ${formData.phoneNumber}` },
          ]}
        />

        <SummarySection
          title="Datos de la visita"
          className="mt-6"
          data={[
            { label: "Gerencia", value: formData.gerency },
            { label: "Contacto", value: formData.contact },
            { label: "Fecha", value: format(formData.date, 'dd/MM/yyyy') },
            { label: "Hora", value: format(formData.date, 'HH:mm') },
            {
              label: "Observación",
              value: formData.observation,
              fullWidth: true
            },
          ]}
        />

        {formData?.formType === 'vehicle' && (
          <SummarySection
            title="Datos del vehículo"
            className="mt-6"
            data={[
              { label: "Placa del vehículo", value: formData.vehiclePlate },
              { label: "Marca del vehículo", value: formData.vehicleBrand },
              { label: "Modelo del vehículo", value: formData.vehicleModel },
              { label: "Color del vehículo", value: formData.vehicleColor },
            ]}
          />
        )}
      </div>

      <div className="flex justify-between">
        <Button type="button" onClick={onBack} variant="outline">
          Atrás
        </Button>
        <Button onClick={onConfirm}>
          Confirmar Registro
        </Button>
      </div>
    </div>
  );
};

const SummarySection = ({ title, data, className = "" }) => (
  <>
    <h1 className={`text-lg font-bold primary-text ${className}`}>{title}</h1>
    <div className="border-t-2 border-gray-300 my-2" />
    <div className="grid grid-cols-4 gap-4 p-4">
      {data.map(({ label, value, fullWidth }, index) => (
        <div key={index} className={fullWidth ? "col-span-4" : ""}>
          <p className="font-bold">{label}:</p>
          <p>{value}</p>
        </div>
      ))}
    </div>
  </>
);