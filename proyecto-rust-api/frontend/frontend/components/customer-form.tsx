"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Customer } from "@/lib/types";

export type CustomerFormInput = Omit<Customer, "customer_id">;

interface CustomerFormProps {
  title: string;
  submitLabel?: string;
  onSubmit: (data: CustomerFormInput) => Promise<void>;
  initialData?: Customer | null;
}

const EMPTY_FORM: CustomerFormInput = {
  company_name: "",
  contact_name: "",
  contact_title: "",
  address: "",
  city: "",
  region: "",
  postal_code: "",
  country: "",
  phone: "",
  fax: "",
};

function toFormState(data?: Customer | null): CustomerFormInput {
  if (!data) {
    return { ...EMPTY_FORM };
  }

  return {
    company_name: data.company_name,
    contact_name: data.contact_name ?? "",
    contact_title: data.contact_title ?? "",
    address: data.address ?? "",
    city: data.city ?? "",
    region: data.region ?? "",
    postal_code: data.postal_code ?? "",
    country: data.country ?? "",
    phone: data.phone ?? "",
    fax: data.fax ?? "",
  };
}

export default function CustomerForm({
  title,
  submitLabel = "Guardar",
  onSubmit,
  initialData = null,
}: CustomerFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState<CustomerFormInput>(toFormState(initialData));
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    setFormData(toFormState(initialData));
  }, [initialData]);

  const handleInputChange = (key: keyof CustomerFormInput, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setIsSaving(true);

    try {
      await onSubmit(formData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo guardar el cliente.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <section className="mx-auto w-full max-w-3xl space-y-6 rounded-xl border bg-white p-6 shadow-sm">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold">{title}</h1>
        <p className="text-sm text-slate-600">Completa los datos del cliente y guarda los cambios.</p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid gap-4 md:grid-cols-2">
          <label className="space-y-1 md:col-span-2">
            <span className="text-sm font-medium">Empresa *</span>
            <input
              value={formData.company_name}
              onChange={(e) => handleInputChange("company_name", e.target.value)}
              required
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
            />
          </label>

          <label className="space-y-1">
            <span className="text-sm font-medium">Contacto</span>
            <input
              value={formData.contact_name ?? ""}
              onChange={(e) => handleInputChange("contact_name", e.target.value)}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
            />
          </label>

          <label className="space-y-1">
            <span className="text-sm font-medium">Cargo</span>
            <input
              value={formData.contact_title ?? ""}
              onChange={(e) => handleInputChange("contact_title", e.target.value)}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
            />
          </label>

          <label className="space-y-1 md:col-span-2">
            <span className="text-sm font-medium">Dirección</span>
            <input
              value={formData.address ?? ""}
              onChange={(e) => handleInputChange("address", e.target.value)}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
            />
          </label>

          <label className="space-y-1">
            <span className="text-sm font-medium">Ciudad</span>
            <input
              value={formData.city ?? ""}
              onChange={(e) => handleInputChange("city", e.target.value)}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
            />
          </label>

          <label className="space-y-1">
            <span className="text-sm font-medium">Región</span>
            <input
              value={formData.region ?? ""}
              onChange={(e) => handleInputChange("region", e.target.value)}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
            />
          </label>

          <label className="space-y-1">
            <span className="text-sm font-medium">Código Postal</span>
            <input
              value={formData.postal_code ?? ""}
              onChange={(e) => handleInputChange("postal_code", e.target.value)}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
            />
          </label>

          <label className="space-y-1">
            <span className="text-sm font-medium">País</span>
            <input
              value={formData.country ?? ""}
              onChange={(e) => handleInputChange("country", e.target.value)}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
            />
          </label>

          <label className="space-y-1">
            <span className="text-sm font-medium">Teléfono</span>
            <input
              value={formData.phone ?? ""}
              onChange={(e) => handleInputChange("phone", e.target.value)}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
            />
          </label>

          <label className="space-y-1">
            <span className="text-sm font-medium">Fax</span>
            <input
              value={formData.fax ?? ""}
              onChange={(e) => handleInputChange("fax", e.target.value)}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
            />
          </label>
        </div>

        {error ? <p className="text-sm text-red-600">{error}</p> : null}

        <div className="flex items-center gap-3">
          <Button type="submit" disabled={isSaving}>
            {isSaving ? "Guardando..." : submitLabel}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancelar
          </Button>
        </div>
      </form>
    </section>
  );
}
