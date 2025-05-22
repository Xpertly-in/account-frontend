"use client";
import { Input } from "@/ui/Input.ui";

const SERVICE_OPTIONS = [
  "ITR Filing",
  "GST Registration",
  "GST Return Filing",
  "Company Incorporation",
  "Bookkeeping & Accounting",
  "Tax Planning",
  "Audit Services",
  "TDS Filing",
  "Startup Advisory",
  "Other"
];

export default function CustomerServicesForm({ formData, setFormData, errors, setErrors }: any) {
  const handleServiceToggle = (service: string) => {
    setFormData((f: any) => {
      const selected = f.services || [];
      if (selected.includes(service)) {
        return { ...f, services: selected.filter((s: string) => s !== service) };
      } else {
        return { ...f, services: [...selected, service] };
      }
    });
    setErrors((e: any) => ({ ...e, services: "" }));
  };
  return (
    <div className="flex flex-col gap-6">

      <div className="flex flex-wrap gap-2">
        {SERVICE_OPTIONS.map(service => (
          <button
            type="button"
            key={service}
            className={`px-3 py-1 rounded-full border text-sm font-medium transition-all shadow-sm ${formData.services?.includes(service) ? "bg-primary text-white" : "bg-background border-primary text-primary"}`}
            onClick={() => handleServiceToggle(service)}
          >
            {service}
          </button>
        ))}
      </div>
      {formData.services?.includes("Other") && (
        <div className="mt-2">
          <label className="block text-sm font-medium mb-1">Other (please specify)</label>
          <Input
            name="otherService"
            value={formData.otherService || ""}
            onChange={e => setFormData((f: any) => ({ ...f, otherService: e.target.value }))}
          />
        </div>
      )}
      {errors.services && <p className="text-xs text-red-500 mt-1">{errors.services}</p>}
    </div>
  );
} 