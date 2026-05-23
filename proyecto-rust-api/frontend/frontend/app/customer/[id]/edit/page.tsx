"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import CustomerForm, { CustomerFormInput } from "@/components/customer-form";
import { get_customer, update_customer } from "@/lib/api";
import { Customer } from "@/lib/types";

interface EditCustomerPageProps {
  params: {
    id: string;
  };
}

export default function EditCustomerPage({ params }: EditCustomerPageProps) {
  const router = useRouter();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    let mounted = true;

    const loadCustomer = async () => {
      setIsLoading(true);
      setError("");

      try {
        const data = await get_customer(params.id);
        if (mounted) {
          setCustomer(data);
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err.message : "No se pudo cargar el cliente.");
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    loadCustomer();

    return () => {
      mounted = false;
    };
  }, [params.id]);

  const handleUpdate = async (data: CustomerFormInput): Promise<void> => {
    await update_customer(params.id, data);
    router.push(`/customer/${params.id}`);
  };

  if (isLoading) {
    return <main className="p-6 text-sm text-slate-600">Cargando cliente...</main>;
  }

  if (error) {
    return <main className="p-6 text-sm text-red-600">{error}</main>;
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10">
      <CustomerForm
        title="Editar cliente"
        submitLabel="Guardar cambios"
        initialData={customer}
        onSubmit={handleUpdate}
      />
    </main>
  );
}
