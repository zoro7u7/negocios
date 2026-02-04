import { getConfig } from "@/actions/config";
import { ConfigForm } from "@/components/settings/config-form";

export default async function SettingsPage() {
  const config = await getConfig();

  return (
    <div className="max-w-4xl mx-auto space-y-6 text-gray-900">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-black text-gray-900 uppercase tracking-tight">Configuración del Sistema</h1>
      </div>

      <div className="grid gap-6">
        <ConfigForm initialData={config} />

        <section className="bg-white rounded-xl border shadow-sm p-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-gray-900 border-l-4 border-l-blue-600">
          <div>
            <h2 className="text-lg font-bold text-gray-800">Usuarios y Permisos</h2>
            <p className="text-sm text-gray-500">Agrega o modifica los accesos del personal al sistema.</p>
          </div>
          <a 
            href="/settings/users" 
            className="px-6 py-2 bg-white border border-blue-600 text-blue-600 rounded-lg text-sm font-bold hover:bg-blue-50 transition-colors"
          >
            Gestionar Usuarios
          </a>
        </section>

        <section className="bg-white rounded-xl border shadow-sm p-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-gray-900">
          <div>
            <h2 className="text-lg font-bold text-gray-800">Mantenimiento</h2>
            <p className="text-sm text-gray-500">Gestiona los respaldos de la base de datos y exporta tus datos.</p>
          </div>
          <div className="flex gap-3">
            <button className="px-4 py-2 border rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
              Respaldar DB
            </button>
            <button className="px-4 py-2 border rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
              Exportar CSV
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
