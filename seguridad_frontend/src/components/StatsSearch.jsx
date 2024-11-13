import React, { useRef, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Layout } from "../layout/Layout"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { AlertCircle, Printer } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { searchVisitorStats } from "./form/services/visitorService";
import { useReactToPrint } from 'react-to-print';

const formSchema = z.object({
  dni: z.string().min(1, "DNI es requerido").refine(
    (value) => /^[VE]-?\d+$/i.test(value),
    {
      message: "Formato de cédula inválido. Use V-12345678 o E-12345678",
    }
  ),
})

const PrintableReport = ({ data }) => (
  <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
    <style>
      {`
        @page {
          size: landscape;
        }
        @media print {
          body {
            width: 100%;
            height: 100%;
            margin: 0;
            padding: 15mm;
          }
          table {
            page-break-inside: auto;
          }
          tr {
            page-break-inside: avoid;
            page-break-after: auto;
          }
        }
      `}
    </style>
    <h1 style={{ textAlign: "center", color: "#24387d", marginBottom: "20px" }}>
      Informe de Visitante
    </h1>

    <h2>Información Personal</h2>
    <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "20px" }}>
      <tbody>
        <tr>
          <th style={{ border: "1px solid #ddd", padding: "8px", textAlign: "left" }}>Cédula</th>
          <td style={{ border: "1px solid #ddd", padding: "8px" }}>{data.visitor.dniType.abbreviation}-{data.visitor.dniNumber}</td>
        </tr>
        <tr>
          <th style={{ border: "1px solid #ddd", padding: "8px", textAlign: "left" }}>Nombre Completo</th>
          <td style={{ border: "1px solid #ddd", padding: "8px" }}>{data.visitor.fullName}</td>
        </tr>
        <tr>
          <th style={{ border: "1px solid #ddd", padding: "8px", textAlign: "left" }}>Teléfono</th>
          <td style={{ border: "1px solid #ddd", padding: "8px" }}>{data.visitor.contactInfo.fullNumber}</td>
        </tr>
        {data.visitor.company && (
          <>
            <tr>
              <th style={{ border: "1px solid #ddd", padding: "8px", textAlign: "left" }}>Empresa</th>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>{data.visitor.company.name}</td>
            </tr>
          </>
        )}
      </tbody>
    </table>

    <h2>Historial de Visitas</h2>
    <table style={{ width: "100%", borderCollapse: "collapse" }}>
      <thead>
        <tr>
          <th style={{ border: "1px solid #ddd", padding: "8px", backgroundColor: "#f2f2f2", whiteSpace: "nowrap" }}>Fecha</th>
          <th style={{ border: "1px solid #ddd", padding: "8px", backgroundColor: "#f2f2f2", whiteSpace: "nowrap" }}>Hora</th>
          <th style={{ border: "1px solid #ddd", padding: "8px", backgroundColor: "#f2f2f2", whiteSpace: "nowrap" }}>Tipo</th>
          <th style={{ border: "1px solid #ddd", padding: "8px", backgroundColor: "#f2f2f2" }}>Ubicación</th>
          <th style={{ border: "1px solid #ddd", padding: "8px", backgroundColor: "#f2f2f2" }}>Motivo</th>
          {data.visitor.recentVisits.some(visit => visit.vehicle) && (
            <th style={{ border: "1px solid #ddd", padding: "8px", backgroundColor: "#f2f2f2" }}>Vehículo</th>
          )}
          <th style={{ border: "1px solid #ddd", padding: "8px", backgroundColor: "#f2f2f2", whiteSpace: "nowrap" }}>Fecha de Salida</th>
        </tr>
      </thead>
      <tbody>
        {data.visitor.recentVisits.map((visit) => (
          <tr key={visit.id}>
            <td style={{ border: "1px solid #ddd", padding: "8px", whiteSpace: "nowrap" }}>
              {format(new Date(visit.date), "dd/MM/yyyy")}
            </td>
            <td style={{ border: "1px solid #ddd", padding: "8px", whiteSpace: "nowrap" }}>
              {format(new Date(visit.date), "HH:mm")}
            </td>
            <td style={{ border: "1px solid #ddd", padding: "8px", whiteSpace: "nowrap" }}>
              {visit.type === 'Pedestrian' ? 'Peatonal' : visit.type}
            </td>
            <td style={{ border: "1px solid #ddd", padding: "8px" }}>
              {visit.location.entity}, {visit.location.administrativeUnit}
            </td>
            <td style={{ border: "1px solid #ddd", padding: "8px" }}>
              {visit.reason}
              {visit.visitedPerson && (
                <div style={{ marginTop: "4px", fontSize: "0.9em", color: "#666" }}>
                  Contacto: {visit.visitedPerson}
                </div>
              )}
            </td>
            {data.visitor.recentVisits.some(visit => visit.vehicle) && (
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                {visit.vehicle ?
                  `${visit.vehicle.brand} ${visit.vehicle.model} - ${visit.vehicle.plate}`
                  : 'N/A'}
              </td>
            )}
            <td style={{ border: "1px solid #ddd", padding: "8px", whiteSpace: "nowrap" }}>
              {visit.exitDate ?
                format(new Date(visit.exitDate), "dd/MM/yyyy HH:mm")
                : 'En curso'}
            </td>
          </tr>
        ))}
      </tbody>
    </table>

    <div style={{ marginTop: "20px", fontSize: "12px", color: "#666" }}>
      <p>Informe generado el {format(new Date(), "dd/MM/yyyy 'a las' HH:mm", { locale: es })}</p>
      <p>Sistema de Control de Visitas</p>
    </div>
  </div>
);

export function StatsSearch({ user }) {
  const [searchResult, setSearchResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const componentRef = useRef(null);

  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: `Informe_Visitante_${searchResult?.visitor?.dniNumber}`,
    removeAfterPrint: true,
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      dni: "",
    },
  })

  const onSubmit = async (values) => {
    setLoading(true);
    setError(null);
    try {
      const dniMatch = values.dni.match(/^([VE])-?(\d+)$/i);
      if (!dniMatch) {
        throw new Error("Formato de cédula inválido. Use V-12345678 o E-12345678");
      }

      const [, dniType, dniNumber] = dniMatch;
      const data = await searchVisitorStats(parseInt(dniNumber));

      if (data.exists && data.visitor) {
        data.visitor.dniType = {
          ...data.visitor.dniType,
          abbreviation: dniType.toUpperCase()
        };
      }

      setSearchResult(data);
    } catch (error) {
      setError(error.message);
      setSearchResult(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto p-6 max-w-7xl">
        {/* Header */}
        <div className="bg-[#24387d] text-white rounded-t-lg shadow-sm">
          <div className="h-12 flex items-center px-4">
            <h1 className="text-lg font-semibold tracking-wide">BUSCAR ESTADÍSTICAS</h1>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white border border-gray-200 rounded-b-lg shadow-sm">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col items-center py-6 px-4">
              <div className="text-center mb-4">
                <h2 className="text-xl text-[#24387d]">Búsqueda de Visitante</h2>
                <p className="text-sm text-gray-500">Ingrese el número de cédula para buscar las estadísticas</p>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-4 w-full max-w-md">
                <FormField
                  control={form.control}
                  name="dni"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormControl>
                        <Input
                          placeholder="Ingrese número de cédula (Ej: V-12345678)"
                          className="h-12 text-lg px-4 border-gray-300"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  disabled={loading}
                  className="h-12 px-8 bg-[#24387d] text-white hover:bg-[#24387d]/90"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <span className="animate-spin">⏳</span> Buscando...
                    </span>
                  ) : (
                    "Buscar"
                  )}
                </Button>
              </div>
            </form>
          </Form>

          {/* Alerts and Results */}
          <div className="px-4 pb-6">
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {searchResult && searchResult.exists && (
              <>
                <div className="mb-4 flex justify-end">
                  <Button
                    onClick={handlePrint}
                    className="flex items-center gap-2 bg-[#24387d] text-white hover:bg-[#24387d]/90"
                  >
                    <Printer className="h-4 w-4" />
                    Imprimir Informe
                  </Button>
                </div>

                <div style={{ display: 'none' }}>
                  <div ref={componentRef}>
                    <PrintableReport data={searchResult} />
                  </div>
                </div>

                <div className="space-y-6">
                  {/* Visitor Info Card */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-xl text-[#24387d]">Información del Visitante</CardTitle>
                      <CardDescription>
                        {searchResult.visitor.dniType.abbreviation} {searchResult.visitor.dniNumber}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h3 className="font-semibold">Datos Personales</h3>
                          <p>Nombre: {searchResult.visitor.fullName}</p>
                          <p>Teléfono: {searchResult.visitor.contactInfo.fullNumber}</p>
                        </div>
                        {searchResult.visitor.company && (
                          <div>
                            <h3 className="font-semibold">Empresa</h3>
                            <p>Nombre: {searchResult.visitor.company.name}</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Recent Visits */}
                  {searchResult.visitor.recentVisits.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-xl text-[#24387d]">Visitas Recientes</CardTitle>
                        <CardDescription>
                          Últimas {searchResult.visitor.recentVisits.length} visitas
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {searchResult.visitor.recentVisits.map((visit) => (
                          <Card key={visit.id} className="bg-gray-50">
                            <CardHeader>
                              <CardTitle className="text-lg">
                                {format(new Date(visit.date), "PPP", { locale: es })}
                              </CardTitle>
                              <CardDescription>
                                <span>Fecha: {format(new Date(visit.date), "dd/MM/yyyy")}</span>
                                <span className="mx-2">|</span>
                                <span>Hora: {format(new Date(visit.date), "HH:mm")}</span>
                                <span className="mx-2">|</span>
                                <span>Tipo: {visit.type === 'Pedestrian' ? 'Peatonal' : visit.type}</span>
                              </CardDescription>
                            </CardHeader>
                            <CardContent>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <h4 className="font-semibold">Dirección</h4>
                                  <p>Entidad: {visit.location.entity}</p>
                                  <p>Unidad: {visit.location.administrativeUnit}</p>
                                  {visit.visitedPerson && (
                                    <>
                                      <h4 className="font-semibold mt-4">Persona Visitada</h4>
                                      <p>{visit.visitedPerson}</p>
                                    </>
                                  )}
                                </div>
                                {visit.vehicle && (
                                  <div>
                                    <h4 className="font-semibold">Vehículo</h4>
                                    <p>Placa: {visit.vehicle.plate}</p>
                                    <p>Modelo: {visit.vehicle.model}</p>
                                    <p>Marca: {visit.vehicle.brand}</p>
                                    <p>Color: {visit.vehicle.color}</p>
                                  </div>
                                )}
                              </div>
                              <div className="mt-4">
                                <h4 className="font-semibold">Motivo de la visita</h4>
                                <p>{visit.reason}</p>
                              </div>
                              {visit.exitDate && (
                                <div className="mt-4 text-green-600">
                                  Salida: {format(new Date(visit.exitDate), "PPP HH:mm", { locale: es })}
                                </div>
                              )}
                            </CardContent>
                          </Card>
                        ))}
                      </CardContent>
                    </Card>
                  )}
                </div>
              </>
            )}

            {searchResult && !searchResult.exists && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>No encontrado</AlertTitle>
                <AlertDescription>
                  No se encontró ningún visitante con ese número de cédula.
                </AlertDescription>
              </Alert>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
} 