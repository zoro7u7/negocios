import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type CartItem = {
  id: number
  type: 'product' | 'service'
  name: string
  price: number // USD
  quantity: number
  stock?: number // Sólo para productos
  collaboratorId?: number
  referralId?: number
}

interface CartState {
  items: CartItem[]
  clientId: number | null
  clientName: string | null
  bcvRate: number
  ivaEnabled: boolean
  ivaRate: number
  
  // Acciones
  addItem: (item: Omit<CartItem, 'quantity'>) => void
  removeItem: (id: number, type: 'product' | 'service') => void
  updateQuantity: (id: number, type: 'product' | 'service', quantity: number) => void
  assignCollaborator: (id: number, type: 'product' | 'service', collabId: number) => void
  assignReferral: (id: number, type: 'product' | 'service', referralId: number) => void
  setClient: (id: number | null, name: string | null) => void
  setBcvRate: (rate: number) => void
  toggleIva: () => void
  clearCart: () => void
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      clientId: null,
      clientName: "Cliente General",
      bcvRate: 1, // Se actualizará desde el server
      ivaEnabled: true,
      ivaRate: 16,

      addItem: (newItem) => set((state) => {
        const existingItem = state.items.find(
          (i) => i.id === newItem.id && i.type === newItem.type
        )

        if (existingItem) {
          // Validar stock si es producto
          if (newItem.type === 'product' && newItem.stock !== undefined) {
            if (existingItem.quantity + 1 > newItem.stock) return state
          }
          return {
            items: state.items.map((i) =>
              i.id === newItem.id && i.type === newItem.type
                ? { ...i, quantity: i.quantity + 1 }
                : i
            ),
          }
        }

        return { items: [...state.items, { ...newItem, quantity: 1 }] }
      }),

      removeItem: (id, type) => set((state) => ({
        items: state.items.filter((i) => !(i.id === id && i.type === type)),
      })),

      updateQuantity: (id, type, quantity) => set((state) => ({
        items: state.items.map((i) => {
          if (i.id === id && i.type === type) {
            // Validar stock si es producto
            if (i.type === 'product' && i.stock !== undefined) {
              if (quantity > i.stock) return i
            }
            return { ...i, quantity: Math.max(1, quantity) }
          }
          return i
        }),
      })),

      assignCollaborator: (id, type, collabId) => set((state) => ({
        items: state.items.map((i) =>
          i.id === id && i.type === type ? { ...i, collaboratorId: collabId } : i
        ),
      })),

      assignReferral: (id, type, referralId) => set((state) => ({
        items: state.items.map((i) =>
          i.id === id && i.type === type ? { ...i, referralId: referralId } : i
        ),
      })),

      setClient: (id, name) => set({ clientId: id, clientName: name }),
      
      setBcvRate: (rate) => set({ bcvRate: rate }),
      
      toggleIva: () => set((state) => ({ ivaEnabled: !state.ivaEnabled })),
      
      clearCart: () => set({ items: [], clientId: null, clientName: "Cliente General" }),
    }),
    {
      name: 'pos-cart-storage',
    }
  )
)
