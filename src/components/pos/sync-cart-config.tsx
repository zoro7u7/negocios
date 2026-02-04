"use client"

import { useCartStore } from "@/store/useCartStore"
import { useEffect } from "react"

interface SyncCartConfigProps {
  bcvRate: number
  ivaRate: number
}

export function SyncCartConfig({ bcvRate, ivaRate }: SyncCartConfigProps) {
  const setBcvRate = useCartStore((state) => state.setBcvRate)
  
  // Sincronizar tasa BCV del servidor al store de cliente
  useEffect(() => {
    setBcvRate(bcvRate)
  }, [bcvRate, setBcvRate])

  return null
}
