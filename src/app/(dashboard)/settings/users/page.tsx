import { getUsers, deleteUser } from "@/actions/users"
import { UserDialog } from "@/components/users/user-dialog"
import { Trash2, Shield, User as UserIcon } from "lucide-react"
import { Button } from "@/components/ui/button"

export default async function UsersPage() {
  const usersList = await getUsers()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between bg-white p-6 rounded-xl border shadow-sm">
        <div>
          <h1 className="text-3xl font-black text-gray-900 uppercase tracking-tight">Gestión de Usuarios</h1>
          <p className="text-gray-500">Administra quiénes tienen acceso al sistema y sus permisos.</p>
        </div>
        <UserDialog />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {usersList.map((user) => (
          <div key={user.id} className="bg-white p-6 rounded-xl border shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className={`absolute top-0 left-0 w-1 h-full ${user.role === 'admin' ? 'bg-orange-500' : 'bg-blue-500'}`} />
            
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-full ${user.role === 'admin' ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'}`}>
                {user.role === 'admin' ? <Shield className="h-6 w-6" /> : <UserIcon className="h-6 w-6" />}
              </div>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <UserDialog mode="edit" initialData={user} />
                <form action={async () => {
                  "use server"
                  await deleteUser(user.id)
                }}>
                  <Button variant="outline" size="icon" className="h-8 w-8 text-red-600 border-red-100 hover:bg-red-50">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </form>
              </div>
            </div>

            <div className="space-y-1">
              <h3 className="font-black text-gray-900 text-lg uppercase leading-tight">{user.name}</h3>
              <p className="text-sm font-bold text-blue-600">@{user.username}</p>
              <p className="text-xs text-gray-500 truncate">{user.email}</p>
            </div>

            <div className="mt-6 pt-4 border-t flex justify-between items-center">
              <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${user.role === 'admin' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'}`}>
                {user.role}
              </span>
              <span className="text-[10px] text-gray-400 font-bold">
                Miembo desde {new Date(user.createdAt!).toLocaleDateString()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
