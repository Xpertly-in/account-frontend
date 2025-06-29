import { useState } from "react";
import { Card } from "@/ui/Card.ui";
import { Button } from "@/ui/Button.ui";
import { Input } from "@/ui/Input.ui";
import { Textarea } from "@/ui/Textarea.ui";
import { Plus, PencilSimple, Trash, X, Sparkle } from "@phosphor-icons/react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/store/context/Auth.provider";
import { servicesConfig, FormField } from "@/constants/form-sections.config";
import { validateService } from "@/helper/form.helper";
import { Service } from "@/types/onboarding.type";
import { ServiceSelect } from "./ServiceSelect.component";
import { getServiceLabels } from "@/constants/services.constants";

interface ServicesFormProps {
  services: Service[];
  onServicesChange: (services: Service[]) => void;
  servicesLoading: boolean;
}

export function ServicesForm({ services, onServicesChange, servicesLoading }: ServicesFormProps) {
  const { auth } = useAuth();
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);
  const [newServiceName, setNewServiceName] = useState("");
  const [suggestedServices, setSuggestedServices] = useState<string[]>([...getServiceLabels()]);
  const [validationErrors, setValidationErrors] = useState<Record<string, any>>({});

  const handleAddService = () => {
    if (editingServiceId || !newServiceName.trim()) return;

    const newId = `temp-${Date.now()}`;
    onServicesChange([
      ...services,
      {
        service_id: newId,
        ca_id: auth.user?.id || "",
        service_name: newServiceName.trim(),
        is_active: true,
      },
    ]);
    setNewServiceName("");
    setEditingServiceId(newId);
  };

  const handleCancelEdit = () => {
    if (editingServiceId?.startsWith("temp-")) {
      onServicesChange(services.filter(service => service.service_id !== editingServiceId));
    }
    setEditingServiceId(null);
    setValidationErrors({});
  };

  const handleSaveService = async (id: string, service: Service) => {
    if (!auth.user || !service.service_name.trim()) return;

    try {
      if (id.startsWith("temp-")) {
        const { data, error } = await supabase
          .from("services")
          .insert([
            {
              ca_id: auth.user.id,
              service_name: service.service_name,
              is_active: true,
            },
          ])
          .select()
          .single();

        if (error) throw error;

        onServicesChange(
          services.map(s => (s.service_id === id ? { ...service, service_id: data.service_id } : s))
        );
        toast.success("Service added successfully");
      } else {
        const { error } = await supabase
          .from("services")
          .update({
            service_name: service.service_name,
          })
          .eq("service_id", service.service_id);

        if (error) throw error;

        onServicesChange(
          services.map(s => (s.service_id === id ? { ...service, service_id: id } : s))
        );
        toast.success("Service updated successfully");
      }

      setEditingServiceId(null);
    } catch (error) {
      console.error("Error saving service:", error);
      toast.error("Failed to save service");
    }
  };

  const handleRemoveService = async (id: string) => {
    if (!auth.user) return;

    try {
      if (id.startsWith("temp-")) {
        onServicesChange(services.filter(s => s.service_id !== id));
      } else {
        const { error } = await supabase
          .from("services")
          .update({ is_active: false })
          .eq("service_id", id);

        if (error) throw error;

        onServicesChange(services.filter(s => s.service_id !== id));
        toast.success("Service removed successfully");
      }
    } catch (error) {
      console.error("Error removing service:", error);
      toast.error("Failed to remove service");
    }
  };

  const handleServiceNameChange = (value: string) => {
    setNewServiceName(value);
    // Filter suggested services based on input
    const filtered = [...getServiceLabels()].filter(service =>
      service.toLowerCase().includes(value.toLowerCase())
    );
    setSuggestedServices(filtered);
  };

  const renderField = (field: FormField, service: Service, index: number) => {
    const error = validationErrors[field.id];
    const value = service[field.id as keyof Service];

    switch (field.type) {
      case "text":
        return (
          <div key={field.id}>
            <label className="text-sm font-medium mb-2 block">
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </label>
            <Input
              type={field.type}
              placeholder={field.placeholder}
              value={value as string}
              onChange={e => {
                const updatedService = {
                  ...service,
                  [field.id]: e.target.value,
                };
                onServicesChange(
                  services.map(s => (s.service_id === service.service_id ? updatedService : s))
                );
              }}
              required={field.required}
              className={error ? "border-red-500" : ""}
            />
            {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
          </div>
        );

      case "textarea":
        return (
          <div key={field.id} className="sm:col-span-2">
            <label className="text-sm font-medium mb-2 block">
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </label>
            <Textarea
              placeholder={field.placeholder}
              value={value as string}
              onChange={e => {
                const updatedService = {
                  ...service,
                  [field.id]: e.target.value,
                };
                onServicesChange(
                  services.map(s => (s.service_id === service.service_id ? updatedService : s))
                );
              }}
              required={field.required}
              className={`min-h-[80px] ${error ? "border-red-500" : ""}`}
            />
            {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Card className="mb-8 p-6 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-primary/5 to-secondary/5 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />

      <div className="relative">
        <div className="mb-8">
          <h2 className="text-xl font-semibold">Services</h2>
          <p className="text-sm text-muted-foreground">
            {" "}
            Showcase your expertise by adding the services you offer
          </p>
        </div>

        {/* Add New Service Input */}
        <div className="mb-8">
          <div className="flex gap-3">
            <div className="flex-1">
              <ServiceSelect disabled={!!editingServiceId} />
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
} 