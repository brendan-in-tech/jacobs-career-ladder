"use client";

import { usePathname } from "next/navigation";
import AppHeader from "./AppHeader";

export default function ClientHeaderWrapper() {
  const pathname = usePathname();
  const hideHeader = pathname === '/login' || pathname === '/signup' || pathname === '/reset-password';

  if (hideHeader) return null;
  return <AppHeader />;
} 