import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { searchVisitor } from "../services/visitorService";

export const VisitorSearchStep = ({ onNext, onBack }) => {
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async (e) => {
    if (e) e.preventDefault();

    const searchDniInput = document.querySelector('input[name="searchDni"]').value;
    if (!searchDniInput) {
      toast.error("Por favor, ingrese un número de cédula para continuar.");
      return;
    }

    const dniMatch = searchDniInput.match(/^([VE])-?(\d+)$/i);
    if (!dniMatch) {
      toast.error("Formato de cédula inválido. Use V-12345678 o E-12345678");
      return;
    }

    const [, inputDniType, dniNumber] = dniMatch;
    setIsSearching(true);

    try {
      const response = await searchVisitor(parseInt(dniNumber));
      console.log('Search response:', response);

      if (response.exists && response.visitor) {
        const visitor = {
          ...response.visitor,
          dniType: response.visitor.dniType?.abbreviation || inputDniType.toUpperCase(),
          dniNumber: parseInt(dniNumber),
          isNewVisitor: false,
          contactInfo: response.visitor.contactInfo || null,
          company: response.visitor.company || null
        };
        console.log('Passing visitor data:', visitor);
        onNext(visitor);
        toast.success("Datos del visitante cargados");
      } else {
        const newVisitor = {
          dniType: inputDniType.toUpperCase(),
          dniNumber: parseInt(dniNumber),
          isNewVisitor: true,
          firstName: "",
          lastName: "",
          contactInfo: null,
          company: null,
          vehicle: null
        };
        console.log('Passing new visitor data:', newVisitor);
        onNext(newVisitor);
        toast.info("Visitante no encontrado. Complete el formulario para nuevo registro.");
      }
    } catch (error) {
      console.error('Search error:', error);
      const newVisitor = {
        dniType: inputDniType.toUpperCase(),
        dniNumber: parseInt(dniNumber),
        isNewVisitor: true,
        firstName: "",
        lastName: "",
        contactInfo: null,
        company: null,
        vehicle: null
      };
      onNext(newVisitor);
      toast.info("Iniciando registro de nuevo visitante");
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="space-y-4 p-6">
      <h2 className="text-xl font-bold bg-blue-800 px-4 py-2 rounded-md text-white mb-2">
        Registro de Visitante
      </h2>
      <span className="text-sm text-gray-600 dark:text-gray-300 mb-2">
        Ingrese el número de cédula del visitante para continuar.
      </span>

      <div className="space-y-4">
        <div className="flex gap-2">
          <Input
            name="searchDni"
            placeholder="Ingrese el número de cédula (Ej: V-12345678)"
            className="flex-1"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleSearch();
              }
            }}
          />
          <Button
            type="button"
            onClick={(e) => handleSearch(e)}
            disabled={isSearching}
          >
            {isSearching ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Continuar"
            )}
          </Button>
        </div>

        <div className="flex justify-between mt-8">
          <Button
            type="button"
            onClick={onBack}
            variant="outline"
          >
            Atrás
          </Button>
        </div>
      </div>
    </div>
  );
}; 