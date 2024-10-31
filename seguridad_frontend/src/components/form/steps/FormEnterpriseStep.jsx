import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export const FormEnterpriseStep = ({ form, onNext, onBack }) => {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold primary-text">Información de la Empresa</h2>
      <span className="text-sm text-muted-foreground">
        Ingrese los datos de la empresa. Los campos con <span className="text-red-500">*</span> son obligatorios.
      </span>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="enterpriseName"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-bold primary-text">Nombre de la empresa <span className="text-red-500">*</span></FormLabel>
              <FormControl>
                <Input placeholder="Nombre de la empresa" {...field} />
              </FormControl>
              <FormDescription>
                Ingrese el nombre completo de la empresa
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="enterpriseRif"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-bold primary-text">RIF de la empresa <span className="text-red-500">*</span></FormLabel>
              <FormControl>
                <Input placeholder="J-12345678-9" {...field} />
              </FormControl>
              <FormDescription>
                Ingrese el RIF de la empresa
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
            form.trigger(['enterpriseName', 'enterpriseRif']).then(isValid => {
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
