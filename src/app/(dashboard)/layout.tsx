import { auth, signOut } from "@/auth";
import Link from "next/link";
import { redirect } from "next/navigation";
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Users, 
  Package, 
  Briefcase, 
  UserCircle, 
  Settings,
  LogOut,
  FileBarChart
} from "lucide-react";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  const menuItems = [
    { name: "Dashboard", href: "/", icon: LayoutDashboard },
    { name: "Punto de Venta", href: "/pos", icon: ShoppingCart },
    { name: "Clientes", href: "/clients", icon: Users },
    { name: "Productos", href: "/products", icon: Package },
    { name: "Servicios", href: "/services", icon: Briefcase },
    { name: "Colaboradores", href: "/collaborators", icon: UserCircle },
  ];

  if (session.user?.role === "admin") {
    menuItems.push({ name: "Reportes", href: "/reports", icon: FileBarChart });
    menuItems.push({ name: "Configuración", href: "/settings", icon: Settings });
  }

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-900">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 border-r bg-white shadow-sm z-50">
        <div className="flex h-16 items-center border-b px-6">
          <span className="text-xl font-bold text-blue-600">POS Negocios</span>
        </div>
        <nav className="mt-6 space-y-1 px-4">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="flex items-center space-x-3 rounded-lg px-3 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
            >
              <item.icon className="h-5 w-5" />
              <span className="font-medium text-sm">{item.name}</span>
            </Link>
          ))}
        </nav>
        <div className="absolute bottom-0 w-full border-t p-4 bg-white">
          <div className="mb-4 flex items-center space-x-3 px-2">
            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
              {session.user?.name?.[0].toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-medium text-gray-900 truncate">{session.user?.name}</p>
              <p className="text-xs text-gray-500 capitalize">{session.user?.role}</p>
            </div>
          </div>
          <form
            action={async () => {
              "use server";
              await signOut();
            }}
          >
            <button className="flex w-full items-center space-x-3 rounded-lg px-3 py-2 text-red-600 hover:bg-red-50 transition-colors">
              <LogOut className="h-5 w-5" />
              <span className="font-medium text-sm">Cerrar Sesión</span>
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <main className="pl-64 flex-1 w-full min-h-screen">
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
