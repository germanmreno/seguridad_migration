import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { toast } from 'sonner';
import { searchVisitor } from '../services/visitorService.js';

export const ExistingVisitorStep = ({ onNext, onBack }) => {
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
      const visitor = await searchVisitor(searchDni);
      if (visitor) {
        onNext(visitor);
        toast.success(`Visitante encontrado: ${visitor.firstName} ${visitor.lastName}`);
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
      <span className="text-sm text-muted-foreground">
        Ingrese el DNI del visitante para buscar sus datos.
      </span>

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