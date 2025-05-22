"use client";
import { Check } from "@phosphor-icons/react";

const COMM_OPTIONS = ["CALL", "WHATSAPP", "EMAIL"];

export default function CustomerCommunicationForm({ formData, setFormData, errors, setErrors }: any) {
  return (
    <div className="flex flex-col gap-6">
  
      <div className="flex flex-wrap gap-2">
        {COMM_OPTIONS.map(opt => (
          <button
            type="button"
            key={opt}
            className={`relative px-3 py-1 rounded-full border text-sm font-medium transition-all shadow-sm flex items-center gap-2 ${formData.communication === opt ? "bg-primary text-white border-primary" : "bg-background border-primary text-primary"}`}
            onClick={() => setFormData((f: any) => ({ ...f, communication: opt }))}
          >
            {formData.communication === opt && <Check size={16} className="mr-1" />}
            {opt}
          </button>
        ))}
      </div>
      {errors.communication && <p className="text-xs text-red-500 mt-1">{errors.communication}</p>}
    </div>
  );
} 