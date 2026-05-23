"use client";

import { useRouter } from "next/navigation";

import CustomerForm, { CustomerFormInput } from "@/components/customer-form";
import { create_customer } from "@/lib/api";

export default function AddCustomerPage() {
  const router = useRouter();

  const handleCreate = async (data: CustomerFormInput): Promise<void> => {
    const created = await create_customer(data);
    router.push(`/customer/${created.customer_id}`);
  };

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10">
      <CustomerForm title="Nuevo cliente" submitLabel="Crear cliente" onSubmit={handleCreate} />
    </main>
  );
}
