import { getServices, deleteService } from "@/actions/services";
import { Search, Briefcase, Trash2 } from "lucide-react";
import { ServiceDialog } from "@/components/services/service-dialog";
import { Button } from "@/components/ui/button";

export default async function ServicesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const query = (await searchParams).q || "";
  const servicesList = await getServices(query);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Catálogo de Servicios</h1>
        <ServiceDialog mode="create" />
      </div>

      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <form action="/services" method="get">
          <input
            type="text"
            name="q"
            defaultValue={query}
            placeholder="Buscar por nombre de servicio..."
            className="block w-full rounded-lg border border-gray-300 bg-white p-2.5 pl-10 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 shadow-sm"
          />
        </form>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {servicesList.map((service) => (
          <div
            key={service.id}
            className="flex flex-col rounded-xl border bg-white p-6 shadow-sm hover:shadow-md transition-shadow group"
          >
            <div className="flex items-start justify-between">
              <div className="h-12 w-12 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                <Briefcase className="h-6 w-6" />
              </div>
              <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${service.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                {service.status === 'active' ? 'Activo' : 'Inactivo'}
              </span>
            </div>
            <div className="mt-4">
              <h3 className="text-lg font-bold text-gray-900">{service.name}</h3>
              <p className="mt-1 text-2xl font-semibold text-blue-600">
                ${Number(service.price).toFixed(2)}
              </p>
            </div>
            
            <div className="mt-6 flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <ServiceDialog mode="edit" initialData={service} />
              <form
                action={async () => {
                  "use server"
                  if (service.id) await deleteService(service.id)
                }}
              >
                <Button 
                  type="submit" 
                  variant="outline" 
                  size="icon" 
                  className="h-8 w-8 text-red-600 border-red-200 hover:bg-red-50"
                  title="Eliminar Servicio"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </div>
        ))}
        {servicesList.length === 0 && (
          <div className="col-span-full py-12 text-center text-gray-500 bg-white rounded-xl border border-dashed">
            No se encontraron servicios.
          </div>
        )}
      </div>
    </div>
  );
}
