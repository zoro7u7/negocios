import { ShoppingCart } from "lucide-react";

export default function PosPlaceholderPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4">
      <div className="bg-blue-50 p-6 rounded-full text-blue-600">
        <ShoppingCart className="h-16 w-16" />
      </div>
      <h1 className="text-3xl font-bold text-gray-900">Módulo POS (Fase 2)</h1>
      <p className="max-w-md text-gray-500">
        Estamos trabajando en la interfaz de ventas. Muy pronto podrás procesar tus facturas aquí.
      </p>
      <div className="flex gap-2">
        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold uppercase tracking-wider">
          Próximamente
        </span>
      </div>
    </div>
  );
}
