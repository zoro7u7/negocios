import { getProducts, deleteProduct } from "@/actions/products";
import { Search, Package, AlertTriangle, Trash2 } from "lucide-react";
import { ProductDialog } from "@/components/products/product-dialog";
import { Button } from "@/components/ui/button";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; f?: string }>;
}) {
  const query = (await searchParams).q || "";
  const filter = (await searchParams).f as any;
  const productsList = await getProducts(query, filter);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Inventario de Productos</h1>
        <ProductDialog mode="create" />
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <form action="/products" method="get">
            <input
              type="text"
              name="q"
              defaultValue={query}
              placeholder="Buscar por nombre o SKU..."
              className="block w-full rounded-lg border border-gray-300 bg-white p-2.5 pl-10 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 shadow-sm"
            />
          </form>
        </div>
        
        <div className="flex bg-white border rounded-lg p-1 shadow-sm">
          <a
            href="/products"
            className={`px-4 py-1.5 text-sm rounded-md transition-colors ${!filter ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            Todos
          </a>
          <a
            href="/products?f=low_stock"
            className={`px-4 py-1.5 text-sm rounded-md transition-colors ${filter === 'low_stock' ? 'bg-red-50 text-red-600 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            Stock Bajo
          </a>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border bg-white shadow-sm">
        <table className="w-full text-left text-sm text-gray-500">
          <thead className="bg-gray-50 text-xs uppercase text-gray-700">
            <tr>
              <th className="px-6 py-4 font-bold text-gray-900">Producto</th>
              <th className="px-6 py-4 font-bold text-gray-900">SKU</th>
              <th className="px-6 py-4 font-bold text-gray-900">Precio (USD)</th>
              <th className="px-6 py-4 font-bold text-gray-900">Stock</th>
              <th className="px-6 py-4 font-bold text-gray-900">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {productsList.map((product) => {
              const isLowStock = product.stock <= product.minStock;
              const isCritical = product.stock === 0;

              return (
                <tr key={product.id} className="hover:bg-gray-50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="h-8 w-8 rounded bg-blue-50 flex items-center justify-center text-blue-600">
                        <Package className="h-5 w-5" />
                      </div>
                      <div>
                        <span className="font-semibold text-gray-900">{product.name}</span>
                        {isLowStock && (
                          <span className={`ml-2 inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold uppercase ${isCritical ? 'bg-red-100 text-red-800' : 'bg-orange-100 text-orange-800'}`}>
                            {isCritical ? 'Agotado' : 'Stock Bajo'}
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-mono">{product.sku}</td>
                  <td className="px-6 py-4 text-gray-900 font-medium">${Number(product.price).toFixed(2)}</td>
                  <td className="px-6 py-4">
                    <span className={`font-bold ${isCritical ? 'text-red-600' : isLowStock ? 'text-orange-600' : 'text-gray-900'}`}>
                      {product.stock}
                    </span>
                  </td>
                  <td className="px-6 py-4 flex items-center gap-2">
                    <ProductDialog mode="edit" initialData={product} />
                    <form
                      action={async () => {
                        "use server"
                        if (product.id) await deleteProduct(product.id)
                      }}
                    >
                      <Button 
                        type="submit" 
                        variant="outline" 
                        size="icon" 
                        className="h-8 w-8 text-red-600 border-red-200 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </form>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {productsList.length === 0 && (
          <div className="py-12 text-center text-gray-500">
            No se encontraron productos.
          </div>
        )}
      </div>
    </div>
  );
}
