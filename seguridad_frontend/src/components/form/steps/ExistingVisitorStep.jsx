import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { searchVisitor } from "../services/visitorService";

export const ExistingVisitorStep = ({ onNext, onBack }) => {
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async (e) => {
    if (e) e.preventDefault();

    const searchDniInput = document.querySelector('input[name="searchDni"]').value;
    if (!searchDniInput) {
      toast.error("Por favor, ingrese un número de cédula para buscar.");
      return;
    }

    // Extract only the numbers from the DNI input
    const dniNumber = searchDniInput.replace(/\D/g, '');
    if (!dniNumber) {
      toast.error("Por favor, ingrese un número de cédula válido.");
      return;
    }

    setIsSearching(true);
    try {
      console.log('Searching for DNI:', dniNumber);
      const response = await searchVisitor(parseInt(dniNumber));
      console.log('Search response:', response);

      if (response.exists) {
        const { visitor } = response;
        console.log('Found visitor:', visitor);
        onNext(visitor);
        toast.success(`Visitante encontrado: ${visitor.fullName}`);
      } else {
        toast.error("No se encontró ningún visitante con ese número de cédula.");
      }
    } catch (error) {
      console.error("Error searching for visitor:", error);
      toast.error(error.details || "Hubo un problema al buscar el visitante. Por favor, intente de nuevo.");
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="space-y-4 bg-gray-100/90 dark:bg-gray-950/90 p-6 rounded-lg">
      <h2 className="text-xl font-bold bg-blue-800 px-4 py-2 rounded-md text-white mb-2">
        Buscar visitante existente
      </h2>
      <span className="text-sm text-gray-600 dark:text-gray-300 mb-2">
        Ingrese el número de cédula del visitante para buscar sus datos.
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
              "Buscar"
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
