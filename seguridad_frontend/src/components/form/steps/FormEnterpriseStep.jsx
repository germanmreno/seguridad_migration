import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export const FormEnterpriseStep = ({ form, onNext, onBack }) => {
  return (
    <div className="space-y-4 bg-gray-100/90 dark:bg-gray-950/90 p-6 rounded-lg">
      <h2 className="text-xl font-bold bg-blue-800 px-4 py-2 rounded-md text-white">
        Información de la Empresa
      </h2>
      <span className="text-sm text-gray-600 dark:text-gray-300">
        Ingrese los datos de la empresa. Los campos con <span className="text-red-500">*</span> son obligatorios.
      </span>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white/50 dark:bg-gray-900/50 p-4 rounded-lg">
        <FormField
          control={form.control}
          name="enterpriseName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre de la empresa <span className="text-red-500">*</span></FormLabel>
              <FormControl>
                <Input className="bg-white dark:bg-gray-800" placeholder="Nombre de la empresa" {...field} />
              </FormControl>
              <FormDescription>
                Ingrese el nombre completo de la empresa
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
