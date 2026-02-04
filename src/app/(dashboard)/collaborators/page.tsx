import { getCollaborators, deleteCollaborator } from "@/actions/collaborators";
import { Search, UserCircle, BadgePercent, Trash2 } from "lucide-react";
import { CollaboratorDialog } from "@/components/collaborators/collaborator-dialog";
import { Button } from "@/components/ui/button";

export default async function CollaboratorsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const query = (await searchParams).q || "";
  const collaboratorsList = await getCollaborators(query);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Personal y Colaboradores</h1>
        <CollaboratorDialog mode="create" />
      </div>

      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <form action="/collaborators" method="get">
          <input
            type="text"
            name="q"
            defaultValue={query}
            placeholder="Buscar por nombre de colaborador..."
            className="block w-full rounded-lg border border-gray-300 bg-white p-2.5 pl-10 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 shadow-sm"
          />
        </form>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {collaboratorsList.map((collab) => (
          <div
            key={collab.id}
            className="flex flex-col rounded-xl border bg-white p-6 shadow-sm hover:shadow-md transition-shadow group"
          >
            <div className="flex items-center space-x-4">
              <div className="h-12 w-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                <UserCircle className="h-7 w-7" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-bold text-gray-900 truncate">{collab.name}</h3>
                <p className="text-sm text-gray-500 truncate">{collab.area || "Sin área asignada"}</p>
              </div>
              <span className={`h-2.5 w-2.5 rounded-full ${collab.active ? 'bg-green-500' : 'bg-gray-300'} shadow-sm`} title={collab.active ? 'Activo' : 'Inactivo'}></span>
            </div>
            
            <div className="mt-6 flex items-center justify-between border-t pt-4">
              <div className="flex items-center space-x-2 text-gray-600">
                <BadgePercent className="h-5 w-5" />
                <span className="text-sm font-medium">Comisión:</span>
              </div>
              <span className="text-lg font-bold text-blue-600">
                {Number(collab.commissionPercentage)}%
              </span>
            </div>

            <div className="mt-4 flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <CollaboratorDialog mode="edit" initialData={collab} />
              <form
                action={async () => {
                  "use server"
                  if (collab.id) await deleteCollaborator(collab.id)
                }}
              >
                <Button 
                  type="submit" 
                  variant="outline" 
                  size="icon" 
                  className="h-8 w-8 text-red-600 border-red-200 hover:bg-red-50"
                  title="Eliminar Colaborador"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </div>
        ))}
        {collaboratorsList.length === 0 && (
          <div className="col-span-full py-12 text-center text-gray-500 bg-white rounded-xl border border-dashed">
            No se encontraron colaboradores.
          </div>
        )}
      </div>
    </div>
  );
}
