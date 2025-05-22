import { useState } from "react";
import { Card } from "@/ui/Card.ui";
import { Button } from "@/ui/Button.ui";
import { Input } from "@/ui/Input.ui";
import { Textarea } from "@/ui/Textarea.ui";
import { Switch } from "@/ui/Switch.ui";
import { Select } from "@/ui/Select.ui";
import { Plus, PencilSimple, Trash, X } from "@phosphor-icons/react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/store/context/Auth.provider";
import { educationConfig, FormField } from "@/constants/form-sections.config";
import { validateEducation } from "@/helper/form.helper";

interface Education {
  id: string;
  degree: string;
  instituteName: string;
  fieldOfStudy: string;
  isCurrent: boolean;
  startDate: string;
  endDate: string;
  grade: string;
  description: string;
}

interface EducationFormProps {
  educations: Education[];
  onEducationsChange: (educations: Education[]) => void;
  educationsLoading: boolean;
}

export function EducationForm({ educations, onEducationsChange, educationsLoading }: EducationFormProps) {
  const { auth } = useAuth();
  const [editingEducationId, setEditingEducationId] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, any>>({});

  const handleAddEducation = () => {
    if (editingEducationId) return;
    const newId = `temp-${Date.now()}`;
    onEducationsChange([
      ...educations,
      {
        id: newId,
        degree: "",
        instituteName: "",
        fieldOfStudy: "",
        isCurrent: false,
        startDate: "",
        endDate: "",
        grade: "",
        description: "",
      },
    ]);
    setEditingEducationId(newId);
  };

  const handleCancelEdit = () => {
    if (editingEducationId?.startsWith('temp-')) {
      onEducationsChange(educations.filter(edu => edu.id !== editingEducationId));
    }
    setEditingEducationId(null);
    setValidationErrors({});
  };

  const handleSaveEducation = async (id: string, edu: Education) => {
    const errors = validateEducation(edu);
    setValidationErrors(errors);
    
    if (Object.keys(errors).length > 0) {
      toast.error("Please fill in all required fields correctly");
      return;
    }

    if (!auth.user) return;

    try {
      if (id.startsWith('temp-')) {
        const { data, error } = await supabase
          .from("educations")
          .insert([{
            ca_id: auth.user.id,
            degree: edu.degree,
            institute_name: edu.instituteName,
            field_of_study: edu.fieldOfStudy,
            start_date: edu.startDate,
            end_date: edu.endDate || null,
            grade: edu.grade,
            description: edu.description,
            is_active: true,
          }])
          .select()
          .single();

        if (error) throw error;

        onEducationsChange(educations.map(e => 
          e.id === id ? { ...edu, id: data.id } : e
        ));
        toast.success("Education added successfully");
      } else {
        const { error } = await supabase
          .from("educations")
          .update({
            degree: edu.degree,
            institute_name: edu.instituteName,
            field_of_study: edu.fieldOfStudy,
            is_current: edu.isCurrent,
            start_date: edu.startDate,
            end_date: edu.isCurrent ? null : edu.endDate,
            grade: edu.grade,
            description: edu.description,
          })
          .eq("id", id);

        if (error) throw error;

        onEducationsChange(educations.map(e => 
          e.id === id ? { ...edu, id } : e
        ));
        toast.success("Education updated successfully");
      }

      setEditingEducationId(null);
      setValidationErrors({});
    } catch (error) {
      console.error("Error saving education:", error);
      toast.error("Failed to save education");
    }
  };

  const handleRemoveEducation = async (id: string) => {
    if (!auth.user) return;

    try {
      if (id.startsWith('temp-')) {
        onEducationsChange(educations.filter(e => e.id !== id));
      } else {
        const { error } = await supabase
          .from("educations")
          .update({ is_active: false })
          .eq("id", id);

        if (error) throw error;

        onEducationsChange(educations.filter(e => e.id !== id));
        toast.success("Education removed successfully");
      }
    } catch (error) {
      console.error("Error removing education:", error);
      toast.error("Failed to remove education");
    }
  };

  const renderField = (field: FormField, education: Education, index: number) => {
    const error = validationErrors[field.id];
    const value = education[field.id as keyof Education];

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
                const updatedEducation = {
                  ...education,
                  [field.id]: e.target.value,
                };
                onEducationsChange(educations.map(edu => 
                  edu.id === education.id ? updatedEducation : edu
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
                const updatedEducation = {
                  ...education,
                  [field.id]: e.target.value,
                };
                onEducationsChange(educations.map(edu => 
                  edu.id === education.id ? updatedEducation : edu
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
                const updatedEducation = {
                  ...education,
                  [field.id]: e.target.value,
                };
                onEducationsChange(educations.map(edu => 
                  edu.id === education.id ? updatedEducation : edu
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
                const updatedEducation = {
                  ...education,
                  [field.id]: checked,
                };
                onEducationsChange(educations.map(edu => 
                  edu.id === education.id ? updatedEducation : edu
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
            <h2 className="text-xl font-semibold">Education</h2>
            <p className="text-sm text-muted-foreground">Add your educational background</p>
          </div>
          <Button
            onClick={handleAddEducation}
            disabled={!!editingEducationId}
            className="bg-gradient-to-r from-primary to-secondary text-white"
          >
            <Plus size={16} className="mr-2" />
            Add Education
          </Button>
        </div>
      </div>

      {educationsLoading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-sm text-muted-foreground">Loading education...</p>
        </div>
      ) : educations.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No education added yet</p>
        </div>
      ) : (
        <div className="space-y-6">
          {educations.map((education, index) => (
            <div
              key={education.id}
              className=""
            >
              {editingEducationId === education.id ? (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {educationConfig.fields.map(field => renderField(field, education, index))}
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
                      onClick={() => handleSaveEducation(education.id, education)}
                      className="bg-gradient-to-r from-primary to-secondary text-white"
                    >
                      Save Education
                    </Button>
                  </div>
                </>
              ) : (
                <div className="bg-muted border p-4 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{education.degree}</h3>
                      <p className="text-sm text-muted-foreground">
                        {education.instituteName}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {education.fieldOfStudy}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(education.startDate).toLocaleDateString()} -{" "}
                        {education.isCurrent
                          ? "Present"
                          : new Date(education.endDate).toLocaleDateString()}
                      </p>
                      {education.grade && (
                        <p className="text-sm text-muted-foreground">
                          Grade: {education.grade}
                        </p>
                      )}
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditingEducationId(education.id)}
                      >
                        <PencilSimple size={16} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveEducation(education.id)}
                      >
                        <Trash size={16} />
                      </Button>
                    </div>
                  </div>
                  {education.description && (
                    <p className="text-sm text-muted-foreground">
                      {education.description}
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