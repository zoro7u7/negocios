import { getClients, deleteClient } from "@/actions/clients";
import { Search, User, Trash2 } from "lucide-react";
import { ClientDialog } from "@/components/clients/client-dialog";
import { Button } from "@/components/ui/button";
import { revalidatePath } from "next/cache";

export default async function ClientsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const query = (await searchParams).q || "";
  const clientsList = await getClients(query);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Gestión de Clientes</h1>
        <ClientDialog mode="create" />
      </div>

      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <form action="/clients" method="get">
          <input
            type="text"
            name="q"
            defaultValue={query}
            placeholder="Buscar por nombre o teléfono (mín. 2 caracteres)..."
            className="block w-full rounded-lg border border-gray-300 bg-white p-2.5 pl-10 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 shadow-sm"
          />
        </form>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {clientsList.map((client) => (
          <div
            key={client.id}
            className="flex flex-col rounded-xl border bg-white p-4 shadow-sm hover:shadow-md transition-shadow group"
          >
            <div className="flex items-center space-x-4 mb-4">
              <div className="flex-shrink-0">
                <div className="h-12 w-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                  <User className="h-6 w-6" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {client.name}
                </p>
                <p className="text-sm text-gray-500 truncate">
                  {client.phone || "Sin teléfono"}
                </p>
              </div>
            </div>
            
            <div className="mt-auto pt-4 border-t flex justify-end items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <ClientDialog mode="edit" initialData={client} />
              
              <form
                action={async () => {
                  "use server"
                  if (client.id) {
                    await deleteClient(client.id)
                  }
                }}
              >
                <Button 
                  type="submit" 
                  variant="outline" 
                  size="icon" 
                  className="h-8 w-8 text-red-600 border-red-200 hover:bg-red-50"
                  title="Eliminar Cliente"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </div>
        ))}
        {clientsList.length === 0 && (
          <div className="col-span-full py-12 text-center text-gray-500 bg-white rounded-xl border border-dashed">
            No se encontraron clientes.
          </div>
        )}
      </div>
    </div>
  );
}
