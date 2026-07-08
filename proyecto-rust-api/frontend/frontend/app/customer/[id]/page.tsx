"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { delete_customer, get_customer } from "@/lib/api";
import { Customer } from "@/lib/types";

interface CustomerDetailPageProps {
  params: {
    id: string;
  };
}

function Field({ label, value }: { label: string; value: string | null }) {
  return (
    <div className="rounded-lg border bg-white p-3">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-1 text-sm text-slate-900">{value || "-"}</p>
    </div>
  );
}

export default function CustomerDetailPage({ params }: CustomerDetailPageProps) {
  const router = useRouter();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

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

  const handleDelete = async () => {
    const confirmed = window.confirm("¿Seguro que deseas eliminar este cliente?");
    if (!confirmed) {
      return;
    }

    setIsDeleting(true);
    setError("");

    try {
      await delete_customer(params.id);
      router.push("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo eliminar el cliente.");
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return <main className="p-6 text-sm text-slate-600">Cargando cliente...</main>;
  }

  if (error && !customer) {
    return <main className="p-6 text-sm text-red-600">{error}</main>;
  }

  if (!customer) {
    return <main className="p-6 text-sm text-slate-600">Cliente no encontrado.</main>;
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10">
      <section className="mx-auto max-w-5xl space-y-6">
        <header className="rounded-xl border bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">ID: {customer.customer_id}</p>
          <h1 className="mt-1 text-3xl font-semibold text-slate-900">{customer.company_name}</h1>
        </header>

        <section className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          <Field label="Contacto" value={customer.contact_name} />
          <Field label="Cargo" value={customer.contact_title} />
          <Field label="Dirección" value={customer.address} />
          <Field label="Ciudad" value={customer.city} />
          <Field label="Región" value={customer.region} />
          <Field label="Código Postal" value={customer.postal_code} />
          <Field label="País" value={customer.country} />
          <Field label="Teléfono" value={customer.phone} />
          <Field label="Fax" value={customer.fax} />
        </section>

        {error ? <p className="text-sm text-red-600">{error}</p> : null}

        <div className="flex flex-wrap items-center gap-3">
          <Link href={`/customer/${customer.customer_id}/edit`}>
            <Button>Editar</Button>
          </Link>
          <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
            {isDeleting ? "Eliminando..." : "Eliminar"}
          </Button>
        </div>
      </section>
    </main>
  );
}
