import { Button } from "@/components/ui/button";
import { PersonStanding, Search } from "lucide-react";

export const VisitorTypeStep = ({ onSelectType, onBack }) => {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold primary-text">Tipo de Visitante</h2>
      <span className="text-sm text-muted-foreground">
        Seleccione si es un visitante nuevo o existente.
      </span>
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
            <p className="text-sm text-muted-foreground">
              Registrar un nuevo visitante
            </p>
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
            <p className="text-sm text-muted-foreground">
              Buscar un visitante registrado
            </p>
          </div>
        </Button>
      </div>
      <div className="flex justify-between">
        <Button onClick={onBack} variant="outline">
          Atrás
        </Button>
      </div>
    </div>
  );
};