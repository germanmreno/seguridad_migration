import { Button } from "@/components/ui/button";
import { Car, PersonStanding } from "lucide-react";

export const FormTypeStep = ({ onSelectType }) => {
  return (
    <div className="space-y-4 bg-gray-100/90 dark:bg-gray-950/90 p-6 rounded-lg">
      <h2 className="text-xl font-bold bg-blue-800 px-4 py-2 rounded-md text-white">
        Tipo de Registro
      </h2>
      <span className="text-sm text-gray-600 dark:text-gray-300">
        Seleccione el tipo de registro a realizar.
      </span>
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
            <p className="text-sm text-muted-foreground">
              Registro de visitantes en vehículo
            </p>
          </div>
        </Button>
        <Button
          onClick={() => onSelectType('pedestrian')}
          variant="outline"
          className="h-32"
        >
          <div className="space-y-2">
            <div className="flex items-center justify-center">
              <PersonStanding className="w-10 h-10" />
            </div>
            <h3 className="font-bold">Peatonal</h3>
            <p className="text-sm text-muted-foreground">
              Registro de visitantes peatonales
            </p>
          </div>
        </Button>
      </div>
    </div>
  );
};