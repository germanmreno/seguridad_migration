import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { toast } from 'sonner';
import { searchVisitor } from '../services/visitorService.js';

export const ExistingVisitorStep = ({ onNext, onBack }) => {
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async () => {
    const searchDni = document.querySelector('input[name="searchDni"]').value;
    if (!searchDni) {
      toast.error("Por favor, ingrese un DNI para buscar.");
      return;
    }

    setIsSearching(true);
    try {
      const response = await searchVisitor(searchDni);

      if (response.exists) {
        const { visitor } = response;
        onNext(visitor);
        toast.success(`Visitante encontrado: ${visitor.fullName}`);
      } else {
        toast.error("No se encontró ningún visitante con ese DNI.");
      }
    } catch (error) {
      console.error("Error searching for visitor:", error);
      toast.error(error.details || "Hubo un problema al buscar el visitante. Por favor, intente de nuevo.");
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold primary-text">Buscar Visitante Existente</h2>
      <span className="text-sm text-muted-foreground">
        Ingrese el DNI del visitante para buscar sus datos.
      </span>

      <div className="space-y-4">
        <div className="flex gap-2">
          <Input
            name="searchDni"
            placeholder="Ingrese el DNI (Ej: V-12345678)"
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
            onClick={handleSearch}
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