import { useState } from "react";
import { Card } from "@/ui/Card.ui";
import { Button } from "@/ui/Button.ui";
import { Input } from "@/ui/Input.ui";
import { Textarea } from "@/ui/Textarea.ui";
import { Switch } from "@/ui/Switch.ui";
import { Select } from "@/ui/Select.ui";
import { Plus, Briefcase, PencilSimple, Trash, X, Buildings, MapPin, Calendar, NotePencil } from "@phosphor-icons/react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/store/context/Auth.provider";
import { experienceConfig, FormField } from "@/constants/form-sections.config";
import { validateExperience } from "@/helper/form.helper";

const EMPLOYMENT_TYPES = [
  "Full-time",
  "Part-time",
  "Contract",
  "Internship",
  "Freelance",
  "Other"
];

const INDUSTRIES = [
  "Accounting",
  "Finance",
  "Consulting",
  "Tax",
  "Audit",
  "Legal",
  "Other"
];

interface Experience {
  id: string;
  title: string;
  employmentType: string;
  companyName: string;
  location: string;
  isCurrent: boolean;
  startDate: string;
  endDate: string;
  industry: string;
  description: string;
  recentService: string;
}

interface ExperienceFormProps {
  experiences: Experience[];
  onExperiencesChange: (experiences: Experience[]) => void;
  experiencesLoading: boolean;
}

export function ExperienceForm({ experiences, onExperiencesChange, experiencesLoading }: ExperienceFormProps) {
  const { auth } = useAuth();
  const [editingExperienceId, setEditingExperienceId] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, any>>({});

  const handleAddExperience = () => {
    if (editingExperienceId) return;
    const newId = `temp-${Date.now()}`;
    onExperiencesChange([
      ...experiences,
      {
        id: newId,
        title: "",
        employmentType: "",
        companyName: "",
        location: "",
        isCurrent: false,
        startDate: "",
        endDate: "",
        industry: "",
        description: "",
        recentService: "",
      },
    ]);
    setEditingExperienceId(newId);
  };

  const handleCancelEdit = () => {
    if (editingExperienceId) {
      const experienceId = String(editingExperienceId);
      if (experienceId.startsWith('temp-')) {
        onExperiencesChange(experiences.filter(exp => exp.id !== experienceId));
      }
    }
    setEditingExperienceId(null);
    setValidationErrors({});
  };

  const handleSaveExperience = async (id: string, exp: Experience) => {
    const errors = validateExperience(exp);
    setValidationErrors(errors);
    
    if (Object.keys(errors).length > 0) {
      toast.error("Please fill in all required fields correctly");
      return;
    }

    if (!auth.user) {
      toast.error("You must be logged in to save experience");
      return;
    }

    try {
      const experienceId = String(id);
      if (experienceId.startsWith('temp-')) {
        const { data, error } = await supabase
          .from("experiences")
          .insert([{
            ca_id: auth.user.id,
            title: exp.title,
            employment_type: exp.employmentType,
            company_name: exp.companyName,
            location: exp.location,
            is_current: exp.isCurrent,
            start_date: exp.startDate,
            end_date: exp.isCurrent ? null : exp.endDate,
            industry: exp.industry,
            description: exp.description,
            recent_service: exp.recentService,
            is_active: true,
          }])
          .select()
          .single();

        if (error) {
          console.error("Supabase insert error:", error);
          toast.error(`Failed to add experience: ${error.message}`);
          return;
        }

        onExperiencesChange(experiences.map(e => 
          e.id === experienceId ? { ...exp, id: data.id } : e
        ));
        toast.success("Experience added successfully");
      } else {
        const { error } = await supabase
          .from("experiences")
          .update({
            title: exp.title,
            employment_type: exp.employmentType,
            company_name: exp.companyName,
            location: exp.location,
            is_current: exp.isCurrent,
            start_date: exp.startDate,
            end_date: exp.isCurrent ? null : exp.endDate,
            industry: exp.industry,
            description: exp.description,
            recent_service: exp.recentService,
          })
          .eq("id", experienceId);

        if (error) {
          console.error("Supabase update error:", error);
          toast.error(`Failed to update experience: ${error.message}`);
          return;
        }

        onExperiencesChange(experiences.map(e => 
          e.id === experienceId ? { ...exp, id: experienceId } : e
        ));
        toast.success("Experience updated successfully");
      }

      setEditingExperienceId(null);
      setValidationErrors({});
    } catch (error) {
      console.error("Error saving experience:", error);
      toast.error(error instanceof Error ? error.message : "Failed to save experience");
    }
  };

  const handleRemoveExperience = async (id: string) => {
    if (!auth.user) {
      toast.error("You must be logged in to remove experience");
      return;
    }

    try {
      const experienceId = String(id);
      
      // Optimistically update UI
      const updatedExperiences = experiences.filter(e => e.id !== experienceId);
      onExperiencesChange(updatedExperiences);

      if (experienceId.startsWith('temp-')) {
        toast.success("Experience removed successfully");
      } else {
        const { error } = await supabase
          .from("experiences")
          .update({ is_active: false })
          .eq("id", experienceId);

        if (error) {
          // Revert the optimistic update if there's an error
          console.error("Supabase update error:", error);
          onExperiencesChange(experiences);
          toast.error(`Failed to remove experience: ${error.message}`);
          return;
        }

        // Refresh experiences list
        const { data, error: fetchError } = await supabase
          .from("experiences")
          .select("id, title, employment_type, company_name, location, is_current, start_date, end_date, industry, description, recent_service, is_active")
          .eq("ca_id", auth.user.id)
          .eq("is_active", true);

        if (!fetchError && data) {
          onExperiencesChange(data.map(exp => ({
            id: exp.id,
            title: exp.title,
            employmentType: exp.employment_type,
            companyName: exp.company_name,
            location: exp.location,
            isCurrent: exp.is_current,
            startDate: exp.start_date,
            endDate: exp.end_date,
            industry: exp.industry,
            description: exp.description,
            recentService: exp.recent_service,
          })));
        }
        toast.success("Experience removed successfully");
      }

      // Clear editing state if the deleted experience was being edited
      if (editingExperienceId === experienceId) {
        setEditingExperienceId(null);
        setValidationErrors({});
      }
    } catch (error) {
      // Revert the optimistic update if there's an error
      onExperiencesChange(experiences);
      console.error("Error removing experience:", error);
      toast.error(error instanceof Error ? error.message : "Failed to remove experience");
    }
  };

  const renderField = (field: FormField, experience: Experience, index: number) => {
    const error = validationErrors[field.id];
    const value = experience[field.id as keyof Experience];

    switch (field.type) {
      case "text":
      case "date":
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
                const updatedExperience = {
                  ...experience,
                  [field.id]: e.target.value,
                };
                onExperiencesChange(experiences.map(exp => 
                  exp.id === experience.id ? updatedExperience : exp
                ));
              }}
              required={field.required}
              className={error ? "border-red-500" : ""}
            />
            {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
          </div>
        );

      case "select":
        return (
          <div key={field.id}>
            <label className="text-sm font-medium mb-2 block">
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </label>
            <Select
              value={value as string}
              onChange={e => {
                const updatedExperience = {
                  ...experience,
                  [field.id]: e.target.value,
                };
                onExperiencesChange(experiences.map(exp => 
                  exp.id === experience.id ? updatedExperience : exp
                ));
              }}
              required={field.required}
              className={error ? "border-red-500" : ""}
            >
              <option value="">Select {field.label}</option>
              {field.options?.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
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
                const updatedExperience = {
                  ...experience,
                  [field.id]: e.target.value,
                };
                onExperiencesChange(experiences.map(exp => 
                  exp.id === experience.id ? updatedExperience : exp
                ));
              }}
              required={field.required}
              className={`min-h-[80px] ${error ? "border-red-500" : ""}`}
            />
            {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
          </div>
        );

      case "switch":
        return (
          <div key={field.id} className="flex items-center justify-between">
            <label className="text-sm font-medium">
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </label>
            <Switch
              checked={value as boolean}
              onCheckedChange={checked => {
                const updatedExperience = {
                  ...experience,
                  [field.id]: checked,
                };
                onExperiencesChange(experiences.map(exp => 
                  exp.id === experience.id ? updatedExperience : exp
                ));
              }}
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Card className="mb-8 p-6">
      <div className="">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">Work Experience</h2>
            <p className="text-sm text-muted-foreground">Add your professional experience</p>
          </div>
          <Button
            onClick={handleAddExperience}
            disabled={!!editingExperienceId}
            className="bg-gradient-to-r from-primary to-secondary text-white"
          >
            <Plus size={16} className="mr-2" />
            Add Experience
          </Button>
        </div>
      </div>

      {experiencesLoading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-sm text-muted-foreground">Loading experiences...</p>
        </div>
      ) : experiences.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No experiences added yet</p>
        </div>
      ) : (
        <div className="space-y-6">
          {experiences.map((experience, index) => (
            <div
              key={experience.id}
              className="space-y-4"
            >
              {editingExperienceId === experience.id ? (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {experienceConfig.fields.map(field => renderField(field, experience, index))}
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      onClick={handleCancelEdit}
                    >
                      <X size={16} className="mr-2" />
                      Cancel
                    </Button>
                    <Button
                      onClick={() => handleSaveExperience(experience.id, experience)}
                      className="bg-gradient-to-r from-primary to-secondary text-white"
                    >
                      Save Experience
                    </Button>
                  </div>
                </>
              ) : (
                <div className="bg-muted border p-4 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{experience.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {experience.companyName} • {experience.employmentType}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {experience.location}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(experience.startDate).toLocaleDateString()} -{" "}
                        {experience.isCurrent
                          ? "Present"
                          : new Date(experience.endDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditingExperienceId(experience.id)}
                      >
                        <PencilSimple size={16} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveExperience(experience.id)}
                      >
                        <Trash size={16} />
                      </Button>
                    </div>
                  </div>
                  {experience.description && (
                    <p className="text-sm text-muted-foreground">
                      {experience.description}
                    </p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </Card>
  );
} 