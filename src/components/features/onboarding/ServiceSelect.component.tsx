import { useState, useEffect, useRef } from "react";
import { Plus, X, Check, SpinnerGap } from "@phosphor-icons/react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/ui/Button.ui";
import { Input } from "@/ui/Input.ui";
import { useAuth } from "@/store/context/Auth.provider";

interface ServiceSelectProps {
  value?: string[]; // Not used, but for compatibility
  onChange?: (value: string[]) => void; // Not used, but for compatibility
  error?: string;
  disabled?: boolean;
}

const DEFAULT_SERVICES = [
  "Income Tax Filing",
  "GST Filing",
  "Company Incorporation",
  "Accounting Services",
  "Audit Services",
  "Compliance Services",
  "Financial Consulting",
];

export function ServiceSelect({ error, disabled }: ServiceSelectProps) {
  const { auth } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [availableServices, setAvailableServices] = useState<string[]>([]);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [customService, setCustomService] = useState("");
  const [showCustomInput, setShowCustomInput] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Fetch all available services (deduped)
  useEffect(() => {
    const loadServices = async () => {
      setIsLoading(true);
      try {
        const { data } = await supabase
          .from("ca_services")
          .select("service_name")
          .eq("is_active", true);
        let all = [...DEFAULT_SERVICES];
        if (data) {
          all = [...all, ...data.map(service => service.service_name)];
        }
        setAvailableServices(Array.from(new Set(all)));
      } catch (error) {
        setAvailableServices([...DEFAULT_SERVICES]);
        console.error("Error loading services:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadServices();
  }, []);

  // Fetch user's selected services
  useEffect(() => {
    const fetchUserServices = async () => {
      if (!auth.user) return;
      setIsLoading(true);
      try {
        const { data } = await supabase
          .from("ca_services")
          .select("service_name")
          .eq("ca_id", auth.user.id)
          .eq("is_active", true);
        if (data) {
          setSelectedServices(data.map(s => s.service_name));
        }
      } catch (error) {
        setSelectedServices([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUserServices();
  }, [auth.user]);

  // Autofocus custom input
  useEffect(() => {
    if (showCustomInput && inputRef.current) {
      inputRef.current.focus();
    }
  }, [showCustomInput]);

  // Handle chip click (toggle)
  const handleChipClick = async (service: string) => {
    if (!auth.user || isLoading) return;
    setIsLoading(true);
    if (selectedServices.includes(service)) {
      // Remove from DB
      const { error } = await supabase
        .from("ca_services")
        .update({ is_active: false })
        .eq("ca_id", auth.user.id)
        .eq("service_name", service);
      if (!error) {
        setSelectedServices(prev => prev.filter(s => s !== service));
      }
    } else {
      // Insert into DB
      const { error } = await supabase
        .from("ca_services")
        .insert({
          ca_id: auth.user.id,
          service_name: service,
          is_active: true,
        });
      if (!error) {
        setSelectedServices(prev => [...prev, service]);
      }
    }
    setIsLoading(false);
  };

  // Handle custom service add
  const handleCustomServiceAdd = async () => {
    if (!auth.user || !customService.trim() || isLoading) return;
    setIsLoading(true);
    const service = customService.trim();
    // Insert into DB
    const { error } = await supabase
      .from("ca_services")
      .insert({
        ca_id: auth.user.id,
        service_name: service,
        is_active: true,
      });
    if (!error) {
      setAvailableServices(prev => Array.from(new Set([...prev, service])));
      setSelectedServices(prev => [...prev, service]);
      setShowCustomInput(false);
      setCustomService("");
    }
    setIsLoading(false);
  };

  return (
    <div className="w-full space-y-3">
      <div className="flex flex-wrap gap-2 min-h-[48px] items-center relative">
        {isLoading && (
          <span className="absolute left-2 top-1/2 -translate-y-1/2 animate-spin text-primary">
            <SpinnerGap size={20} />
          </span>
        )}
        {!isLoading && availableServices.length === 0 && (
          <span className="text-muted-foreground text-sm">No services available.</span>
        )}
        {availableServices.map((service) => {
          const isActive = selectedServices.includes(service);
          return (
            <button
              key={service}
              type="button"
              onClick={() => handleChipClick(service)}
              disabled={disabled || isLoading}
              tabIndex={0}
              className={`px-4 py-2 rounded-full text-sm font-medium flex items-center gap-1 transition-all focus:outline-none focus:ring-2 focus:ring-primary/60 focus:ring-offset-2
                ${isActive
                  ? 'bg-primary text-white shadow-md' 
                  : 'bg-muted/70 text-foreground hover:bg-primary/10 hover:text-primary'}
                ${disabled || isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              `}
              aria-pressed={isActive}
              aria-label={service}
            >
              {service}
              {isActive && <Check size={16} className="ml-1" />}
            </button>
          );
        })}
        {!showCustomInput && (
          <button
            type="button"
            onClick={() => setShowCustomInput(true)}
            disabled={disabled || isLoading}
            className="px-4 py-2 rounded-full text-sm font-medium bg-muted/70 text-muted-foreground hover:bg-primary/10 hover:text-primary transition-all flex items-center gap-1 focus:outline-none focus:ring-2 focus:ring-primary/60 focus:ring-offset-2"
            tabIndex={0}
            aria-label="Add custom service"
          >
            <Plus size={16} />
            Custom
          </button>
        )}
      </div>
      {showCustomInput && (
        <div className="flex gap-2 items-center mt-2">
          <Input
            ref={inputRef}
            value={customService}
            onChange={(e) => setCustomService(e.target.value)}
            placeholder="Enter custom service..."
            className="flex-1 min-w-0"
            onKeyDown={async (e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                await handleCustomServiceAdd();
              }
              if (e.key === 'Escape') {
                setShowCustomInput(false);
                setCustomService("");
              }
            }}
            aria-label="Custom service name"
            disabled={disabled || isLoading}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => {
              setShowCustomInput(false);
              setCustomService("");
            }}
            aria-label="Cancel custom service"
            tabIndex={0}
          >
            <X size={16} />
          </Button>
          <Button
            type="button"
            onClick={handleCustomServiceAdd}
            disabled={!customService.trim() || disabled || isLoading}
            className="bg-primary text-white px-4 py-2 rounded-full"
            aria-label="Add custom service"
          >
            Add
          </Button>
        </div>
      )}
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
} 