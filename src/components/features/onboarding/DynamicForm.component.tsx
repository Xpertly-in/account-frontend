"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/ui/Input.ui";
import { Select } from "@/ui/Select.ui";
import { FileUpload } from "@/ui/FileUpload.ui";
import { CheckboxGroup } from "@/ui/CheckboxGroup.ui";
import { Textarea } from "@/ui/Textarea.ui";
import { Switch } from "@/ui/Switch.ui";
import { useAuth } from "@/store/context/Auth.provider";
import { FormField, FormValues, ValidationErrors } from "@/types/onboarding.type";
import { validateStep, getInitialFormValues, shouldShowField } from "@/helper/form.helper";
import { Card } from "@/ui/Card.ui";
import { Button } from "@/ui/Button.ui";
import { Camera, PencilSimple, Trash, Plus, X, Info, Briefcase, Calendar, NotePencil, Buildings, MapPin, GraduationCap } from "@phosphor-icons/react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { ServiceSelect } from "./ServiceSelect.component";
import { onboardingFormConfig } from "@/constants/onboarding-form.config";
import { FormConfig, FormStep } from '@/types/onboarding.type';

const DEFAULT_SERVICES = [
  "Income Tax Filing",
  "GST Filing",
  "Company Incorporation",
  "Accounting Services",
  "Audit Services",
  "Compliance Services",
  "Financial Consulting",
];

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

export default function DynamicForm() {
  const router = useRouter();
  const { auth } = useAuth();
  const [formData, setFormData] = useState<FormValues>({});
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [profileImageUrl, setProfileImageUrl] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);
  const [services, setServices] = useState<Array<{ id: string; service_name: string }>>([]);
  const [servicesLoading, setServicesLoading] = useState(false);
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);
  const [experiences, setExperiences] = useState<Array<{
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
  }>>([]);
  const [experiencesLoading, setExperiencesLoading] = useState(false);
  const [editingExperienceId, setEditingExperienceId] = useState<string | null>(null);
  const [experienceErrors, setExperienceErrors] = useState<Record<string, { startDate?: string; endDate?: string }>>({});
  const [educations, setEducations] = useState<Array<{
    id: string;
    instituteName: string;
    degree: string;
    fieldOfStudy: string;
    startDate: string;
    endDate: string;
    grade: string;
    description: string;
  }>>([]);
  const [educationsLoading, setEducationsLoading] = useState(false);
  const [editingEducationId, setEditingEducationId] = useState<string | null>(null);
  const [educationErrors, setEducationErrors] = useState<Record<string, { startDate?: string; endDate?: string }>>({});
  const [imageUploading, setImageUploading] = useState(false);

  useEffect(() => {
    let name = "CA";
    if (auth.user?.user_metadata?.name) {
      name = auth.user.user_metadata.name;
    } else {
      try {
        const storedUser = JSON.parse(localStorage.getItem("mockUser") || "{}");
        if (storedUser.name) {
          name = storedUser.name;
        }
      } catch (error) {
        console.error("Error parsing stored user:", error);
      }
    }
    setFormData(prev => ({ ...prev, name }));
  }, [auth.user]);

  // Fetch services for the logged-in user on mount
  useEffect(() => {
    const fetchServices = async () => {
      if (!auth.user) return;
      setServicesLoading(true);
      const { data, error } = await supabase
        .from("ca_services")
        .select("service_id, service_name, is_active")
        .eq("ca_id", auth.user.id)
        .eq("is_active", true);
      if (!error && data) {
        setServices(data.map(service => ({
          id: service.service_id,
          service_name: service.service_name
        })));
      }
      setServicesLoading(false);
    };
    fetchServices();
  }, [auth.user]);

  // Fetch experiences for the logged-in user on mount
  useEffect(() => {
    const fetchExperiences = async () => {
      if (!auth.user) return;
      setExperiencesLoading(true);
      const { data, error } = await supabase
        .from("experiences")
        .select("id, title, employment_type, company_name, location, is_current, start_date, end_date, industry, description, recent_service, is_active")
        .eq("ca_id", auth.user.id)
        .eq("is_active", true);
      if (!error && data) {
        setExperiences(data.map(exp => ({
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
      setExperiencesLoading(false);
    };
    fetchExperiences();
  }, [auth.user]);

  // Fetch educations for the logged-in user on mount
  useEffect(() => {
    const fetchEducations = async () => {
      if (!auth.user) return;
      setEducationsLoading(true);
      const { data, error } = await supabase
        .from("educations")
        .select("id, institute_name, degree, field_of_study, start_date, end_date, grade, description, is_active")
        .eq("ca_id", auth.user.id)
        .eq("is_active", true);
      if (!error && data) {
        setEducations(data.map(edu => ({
          id: edu.id,
          instituteName: edu.institute_name,
          degree: edu.degree,
          fieldOfStudy: edu.field_of_study,
          startDate: edu.start_date,
          endDate: edu.end_date,
          grade: edu.grade,
          description: edu.description,
        })));
      }
      setEducationsLoading(false);
    };
    fetchEducations();
  }, [auth.user]);

  // Fetch profile image on mount if available
  useEffect(() => {
    const fetchProfileImage = async () => {
      if (!auth.user) return;
      const { data, error } = await supabase
        .from('ca_profiles')
        .select('profile_picture')
        .eq('user_id', auth.user.id)
        .single();
      if (!error && data?.profile_picture) {
        setProfileImageUrl(data.profile_picture);
      }
    };
    fetchProfileImage();
  }, [auth.user]);

  // Add a new service row
  const handleAddService = () => {
    if (editingServiceId) return; // Prevent adding if already editing
    const newId = `temp-${Date.now()}`;
    setServices(prev => [
      ...prev,
      { id: newId, service_name: "" },
    ]);
    setEditingServiceId(newId);
  };

  // Save a service
  const handleSaveService = async (id: string, serviceName: string) => {

    if (!auth.user || !serviceName.trim()) return;
    
    try {
      if (id.startsWith('temp-')) {
        // Insert new service
    const { data, error } = await supabase
      .from("ca_services")
          .insert([{ ca_id: auth.user.id, service_name: serviceName, is_active: true }])
      .select()
      .single();
        
        if (error) throw error;
        
        setServices(prev => prev.map(s => 
          s.id === id ? { id: data.service_id, service_name: serviceName } : s
        ));
        toast.success("Service added successfully");
      } else {
        // Update existing service
        const { error } = await supabase
          .from("ca_services")
          .update({ service_name: serviceName })
          .eq("service_id", id);
        
        if (error) throw error;
        
        setServices(prev => prev.map(s => 
          s.id === id ? { ...s, service_name: serviceName } : s
        ));
        toast.success("Service updated successfully");
      }
      
      setEditingServiceId(null);
    } catch (error) {
      console.log(error)
      console.error("Error saving service:", error);
      toast.error("Failed to save service");
    }
  };

  // Remove a service
  const handleRemoveService = async (id: string) => {
    if (!auth.user) return;
    
    try {
      if (id.startsWith('temp-')) {
        // Remove temporary service
        setServices(prev => prev.filter(s => s.id !== id));
      } else {
        // Soft delete existing service
        const { error } = await supabase
          .from("ca_services")
          .update({ is_active: false })
          .eq("service_id", id);
        
        if (error) throw error;
        
    setServices(prev => prev.filter(s => s.id !== id));
        toast.success("Service removed successfully");
      }
    } catch (error) {
      console.error("Error removing service:", error);
      toast.error("Failed to remove service");
    }
  };

  const handleAddExperience = () => {
    if (editingExperienceId) return; // Prevent adding if already editing
    const newId = `temp-${Date.now()}`;
    setExperiences(prev => [
      ...prev,
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

  const validateExperience = (exp: any) => {
    const errors: { startDate?: string; endDate?: string } = {};
    if (!exp.startDate) {
      errors.startDate = "Start date is required";
    }
    if (!exp.isCurrent && !exp.endDate) {
      errors.endDate = "End date is required";
    }
    if (exp.startDate && exp.endDate && !exp.isCurrent && exp.endDate < exp.startDate) {
      errors.endDate = "End date cannot be before start date";
    }
    return errors;
  };

  const handleSaveExperience = async (id: string, exp: any) => {
    const errors = validateExperience(exp);
    setExperienceErrors(prev => ({ ...prev, [id]: errors }));
    if (Object.keys(errors).length > 0 && (errors.startDate || errors.endDate)) return;
    if (!auth.user || !exp.title.trim() || !exp.companyName.trim()) return;
    try {
      if (String(id).startsWith("temp-")) {
        const { data, error } = await supabase
          .from("experiences")
          .insert([
            {
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
            },
          ])
          .select()
          .single();
        if (error) throw error;
        setExperiences(prev =>
          prev.map(e => (e.id === id ? { ...exp, id: data.id } : e))
        );
        setEditingExperienceId(null);
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
          .eq("id", id);
        if (error) throw error;
        setExperiences(prev =>
          prev.map(e => (e.id === id ? { ...exp, id } : e))
        );
      }
      setEditingExperienceId(null);
      setExperienceErrors(prev => ({ ...prev, [id]: {} }));
      toast.success("Experience saved successfully");
    } catch (error) {
      console.log(error)
      toast.error("Failed to save experience");
    }
  };

  const handleRemoveExperience = async (id: string) => {
    if (!auth.user) return;
    try {
      if (String(id).startsWith("temp-")) {
        setExperiences(prev => prev.filter(e => e.id !== id));
      } else {
        const { error } = await supabase
          .from("experiences")
          .update({ is_active: false })
          .eq("id", id);
        if (error) throw error;
        setExperiences(prev => prev.filter(e => e.id !== id));
      }
      toast.success("Experience removed successfully");
    } catch (error) {
      toast.error("Failed to remove experience");
    }
  };

  const handleAddEducation = () => {
    if (editingEducationId) return;
    const newId = `temp-${Date.now()}`;
    setEducations(prev => [
      ...prev,
      {
        id: newId,
        instituteName: "",
        degree: "",
        fieldOfStudy: "",
        startDate: "",
        endDate: "",
        grade: "",
        description: "",
      },
    ]);
    setEditingEducationId(newId);
  };

  const validateEducation = (edu: any) => {
    const errors: { startDate?: string; endDate?: string } = {};
    if (!edu.startDate) {
      errors.startDate = "Start date is required";
    }
    if (!edu.endDate) {
      errors.endDate = "End date is required";
    }
    if (edu.startDate && edu.endDate && edu.endDate < edu.startDate) {
      errors.endDate = "End date cannot be before start date";
    }
    return errors;
  };

  const handleSaveEducation = async (id: string, edu: any) => {
    const errors = validateEducation(edu);
    setEducationErrors(prev => ({ ...prev, [id]: errors }));
    if (Object.keys(errors).length > 0 && (errors.startDate || errors.endDate)) return;
    if (!auth.user || !edu.instituteName.trim() || !edu.degree.trim()) return;
    try {
      if (String(id).startsWith("temp-")) {
        const { data, error } = await supabase
          .from("educations")
          .insert([
            {
              ca_id: auth.user.id,
              institute_name: edu.instituteName,
              degree: edu.degree,
              field_of_study: edu.fieldOfStudy,
              start_date: edu.startDate,
              end_date: edu.endDate,
              grade: edu.grade,
              description: edu.description,
              is_active: true,
            },
          ])
          .select()
          .single();
        if (error) throw error;
        setEducations(prev =>
          prev.map(e => (e.id === id ? { ...edu, id: data.id } : e))
        );
        setEditingEducationId(null);
      } else {
        const { error } = await supabase
          .from("educations")
          .update({
            institute_name: edu.instituteName,
            degree: edu.degree,
            field_of_study: edu.fieldOfStudy,
            start_date: edu.startDate,
            end_date: edu.endDate,
            grade: edu.grade,
            description: edu.description,
          })
          .eq("id", id);
        if (error) throw error;
        setEducations(prev =>
          prev.map(e => (e.id === id ? { ...edu, id } : e))
        );
        setEditingEducationId(null);
      }
      setEducationErrors(prev => ({ ...prev, [id]: {} }));
      toast.success("Education saved successfully");
    } catch (error) {
      toast.error("Failed to save education");
    }
  };

  const handleRemoveEducation = async (id: string) => {
    if (!auth.user) return;
    try {
      if (String(id).startsWith("temp-")) {
        setEducations(prev => prev.filter(e => e.id !== id));
      } else {
        const { error } = await supabase
          .from("educations")
          .update({ is_active: false })
          .eq("id", id);
        if (error) throw error;
        setEducations(prev => prev.filter(e => e.id !== id));
      }
      toast.success("Education removed successfully");
    } catch (error) {
      toast.error("Failed to remove education");
    }
  };

  const handleInputChange = (id: string, value: any) => {
    setFormData(prev => ({ ...prev, [id]: value }));
    if (validationErrors[id]) {
      setValidationErrors(prev => ({ ...prev, [id]: undefined }));
    }
  };

  // Profile image upload handler
  const handleProfileImageChange = async (file: File | null) => {
    if (!file || !auth.user) return;
    setImageUploading(true);
    
    try {
      // Create a preview URL for immediate feedback
      const previewUrl = URL.createObjectURL(file);
      setProfileImageUrl(previewUrl);

      // Generate a unique filename using timestamp
      const timestamp = Date.now();
      const fileExt = file.name.split('.').pop();
      const filePath = `${auth.user.id}/profile_${timestamp}.${fileExt}`;

      // Upload the new file
      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, file, { 
          upsert: true,
          cacheControl: '3600'
        });

      if (uploadError) {
        throw new Error('Failed to upload image');
      }

      // Get public URL
      const { data: { publicUrl } } = supabase
        .storage
        .from('images')
        .getPublicUrl(filePath);

      // Update profile in database
      const { error: updateError } = await supabase
        .from('ca_profiles')
        .update({ 
          profile_picture: publicUrl
        })
        .eq('user_id', auth.user.id);

      if (updateError) {
        // If update fails, try insert
        const { error: insertError } = await supabase
          .from('ca_profiles')
          .insert({ 
            user_id: auth.user.id,
            profile_picture: publicUrl
          });

        if (insertError) {
          throw new Error('Failed to update profile');
        }
      }

      setProfileImageUrl(publicUrl);
      toast.success('Profile image updated!');
    } catch (err: any) {
      console.error('Upload error:', err);
      toast.error('Failed to update profile image');
      setProfileImageUrl('');
    } finally {
      setImageUploading(false);
    }
  };

  const validateForm = (): boolean => {
    const errors: ValidationErrors = {};
    let isValid = true;

    // Required fields validation
    const requiredFields = {
      name: "Full Name",
      phone: "Phone Number",
      about: "About",
      yearsOfExperience: "Years of Experience",
      address: "Address",
      city: "City",
      state: "State",
      pincode: "Pincode",
      icaiNumber: "ICAI Membership Number",
      licenseNumber: "Practice License Number",
      professionalEmail: "Professional Email"
    };

    for (const [field, label] of Object.entries(requiredFields)) {
      if (!formData[field] || formData[field].trim() === '') {
        errors[field] = `${label} is required`;
        isValid = false;
      }
    }

    // Email validation
    if (formData.professionalEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.professionalEmail)) {
      errors.professionalEmail = "Please enter a valid email address";
      isValid = false;
    }

    // Phone number validation
    if (formData.phone && !/^\+?[\d\s-]{10,}$/.test(formData.phone)) {
      errors.phone = "Please enter a valid phone number";
      isValid = false;
    }

    // Pincode validation (assuming 6 digits)
    if (formData.pincode && !/^\d{6}$/.test(formData.pincode)) {
      errors.pincode = "Pincode must be 6 digits";
      isValid = false;
    }

    setValidationErrors(errors);
    return isValid;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      toast.error("Please fill in all required fields correctly");
      return;
    }

    setIsSubmitting(true);

    try {
      // First, update the main ca_profiles table
      const { error: profileError } = await supabase
        .from('ca_profiles')
        .update({
          name: formData.name,
          phone: formData.phone,
          about: formData.about,
          years_of_experience: formData.yearsOfExperience,
          onboarding_completed: true,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', auth.user?.id);

      if (profileError) {
        // If update fails, try insert
        const { error: insertError } = await supabase
          .from('ca_profiles')
          .insert({
            user_id: auth.user?.id,
            name: formData.name,
            phone: formData.phone,
            about: formData.about,
            years_of_experience: formData.yearsOfExperience,
            onboarding_completed: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });

        if (insertError) throw insertError;
      }

      // Update or insert address
      const { error: addressError } = await supabase
        .from('ca_address')
        .update({
          address: formData.address,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
          updated_at: new Date().toISOString()
        })
        .eq('ca_id', auth.user?.id);

      if (addressError) {
        // If update fails, try insert
        const { error: insertError } = await supabase
          .from('ca_address')
          .insert({
            ca_id: auth.user?.id,
            address: formData.address,
            city: formData.city,
            state: formData.state,
            pincode: formData.pincode,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });

        if (insertError) throw insertError;
      }

      // Update or insert social profile
      const { error: socialError } = await supabase
        .from('ca_social_profile')
        .update({
          linkedin_profile: formData.linkedin,
          professional_website: formData.website,
          icai_membership_number: formData.icaiNumber,
          practice_license_number: formData.licenseNumber,
          professional_email: formData.professionalEmail,
          professional_phone: formData.professionalPhone,
          areas_of_expertise: formData.expertise,
          updated_at: new Date().toISOString()
        })
        .eq('ca_id', auth.user?.id);

      if (socialError) {
        // If update fails, try insert
        const { error: insertError } = await supabase
          .from('ca_social_profile')
          .insert({
            ca_id: auth.user?.id,
            linkedin_profile: formData.linkedin,
            professional_website: formData.website,
            icai_membership_number: formData.icaiNumber,
            practice_license_number: formData.licenseNumber,
            professional_email: formData.professionalEmail,
            professional_phone: formData.professionalPhone,
            areas_of_expertise: formData.expertise,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });

        if (insertError) throw insertError;
      }

      toast.success("Profile updated successfully!");
      router.push("/ca/dashboard");
    } catch (error: any) {
      console.error("Error updating profile:", error);
      toast.error(error.message || "Failed to update profile. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderField = (field: FormField) => {
    const error = validationErrors[field.id];

    const renderLabel = (
      fieldId: string,
      labelText: string,
      isRequired?: boolean,
      description?: string
    ) => (
      <div className="mb-0.5">
        <label htmlFor={fieldId} className="text-sm font-medium text-foreground">
          {labelText} {isRequired && <span className="text-red-500">*</span>}
        </label>
        {description && <p className="text-xs text-muted-foreground mt-0.5">{description}</p>}
      </div>
    );

    switch (field.type) {
      case "text":
      case "email":
      case "tel":
      case "number":
      case "url":
        return (
          <div key={field.id}>
            {renderLabel(field.id, field.label, field.required, field.description)}
            <Input
              id={field.id}
              name={field.id}
              type={field.type}
              placeholder={field.placeholder}
              value={(formData[field.id] as string) || ""}
              onChange={e => handleInputChange(field.id, e.target.value)}
              required={field.required}
              min={field.min}
              max={field.max}
              className={`w-full ${error ? "border-red-500" : ""}`}
              aria-invalid={!!error}
            />
            {error && <p className="text-xs text-red-500 mt-0.5">{error}</p>}
          </div>
        );
      case "textarea":
        return (
          <div key={field.id}>
            {renderLabel(field.id, field.label, field.required, field.description)}
            <Textarea
              id={field.id}
              name={field.id}
              placeholder={field.placeholder}
              value={(formData[field.id] as string) || ""}
              onChange={e => handleInputChange(field.id, e.target.value)}
              required={field.required}
              className={`w-full min-h-[80px] ${error ? "border-red-500" : ""}`}
              aria-invalid={!!error}
            />
            {error && <p className="text-xs text-red-500 mt-0.5">{error}</p>}
          </div>
        );
      case "select":
        const selectValue = formData[field.id];
        const validSelectValue =
          typeof selectValue === "string" || Array.isArray(selectValue)
            ? selectValue
            : field.multiple
            ? []
            : "";
        return (
          <div key={field.id}>
            {renderLabel(field.id, field.label, field.required, field.description)}
            <Select
              id={field.id}
              name={field.id}
              value={validSelectValue}
              onChange={e => {
                if (field.multiple) {
                  const selectedOptions = Array.from(e.target.selectedOptions).map(
                    option => option.value
                  );
                  handleInputChange(field.id, selectedOptions);
                } else {
                  handleInputChange(field.id, e.target.value);
                }
              }}
              multiple={field.multiple}
              required={field.required}
              className={`w-full ${field.multiple ? "min-h-[120px]" : ""} ${
                error ? "border-red-500" : ""
              }`}
              aria-invalid={!!error}
            >
              {!field.multiple && (
                <option value="" disabled={validSelectValue !== ""}>
                  {field.placeholder || "Select an option"}
                </option>
              )}
              {field.options?.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
            {field.multiple && (
              <p className="mt-1 text-xs text-muted-foreground">
                Hold Ctrl (or Cmd) to select multiple options
              </p>
            )}
            {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
          </div>
        );
      case "checkbox":
        if (field.options && field.options.length > 1) {
          return (
            <CheckboxGroup
              key={field.id}
              id={field.id}
              label={field.label}
              description={field.description}
              options={field.options || []}
              value={(formData[field.id] as string[]) || []}
              onChange={(value: string[]) => handleInputChange(field.id, value)}
              required={field.required}
              error={error}
            />
          );
        } else {
          const singleOption = field.options?.[0];
          const checkboxLabel = singleOption ? singleOption.label : field.label;
          const checkboxValue = singleOption ? singleOption.value : "true";
          const isChecked = Array.isArray(formData[field.id])
            ? (formData[field.id] as string[]).includes(checkboxValue)
            : !!formData[field.id];

          return (
            <div
              key={field.id}
              className="flex items-start space-x-3 rounded-md border border-input p-4"
            >
              <input
                type="checkbox"
                id={field.id}
                name={field.id}
                checked={isChecked}
                onChange={e => {
                  if (field.options && field.options.length === 1) {
                    handleInputChange(field.id, e.target.checked ? [checkboxValue] : []);
                  } else {
                    handleInputChange(field.id, e.target.checked);
                  }
                }}
                required={field.required}
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary mt-1"
                aria-invalid={!!error}
              />
              <div className="grid gap-1.5 leading-none">
                <label
                  htmlFor={field.id}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {checkboxLabel}
                  {field.required && <span className="text-red-500">*</span>}
                </label>
                {field.description && (
                  <p className="text-xs text-muted-foreground">{field.description}</p>
                )}
                {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
              </div>
            </div>
          );
        }
      case "switch":
        return (
          <div
            key={field.id}
            className="flex items-center justify-between rounded-md border border-input p-4"
          >
            <div className="space-y-0.5">
              {renderLabel(field.id, field.label, field.required, field.description)}
            </div>
            <Switch
              id={field.id}
              name={field.id}
              checked={!!formData[field.id]}
              onCheckedChange={checked => handleInputChange(field.id, checked)}
              required={field.required}
              aria-invalid={!!error}
            />
          </div>
        );
      case "file":
        return (
          <FileUpload
            key={field.id}
            id={field.id}
            label={field.label}
            description={field.description}
            accept={field.accept}
            onChange={(file: File | null) => handleInputChange(field.id, file)}
            required={field.required}
            error={error}
          />
        );
      default:
        console.warn("Unhandled field type in renderField:", field.type, field);
        return null;
    }
  };

  return (
    <div className="relative w-full max-w-7xl mx-auto px-4 py-8" ref={formRef}>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground sm:text-xl">Complete your CA Profile</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Fill in your details to create a professional profile that will help you connect with potential clients
        </p>
      </div>

      {/* Basic Information Section */}
      <Card className="mb-8 p-6">
        <div className="mb-6">
          <div className="flex items-center space-x-3">
           
            <div>
              <h2 className="text-xl font-semibold">Basic Information</h2>
              <p className="text-sm text-muted-foreground">Your personal details</p>
            </div>
          </div>
        </div>

        {/* Profile Image */}
        <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6 mb-6">
          <div className="relative">
            <div className="w-32 h-32 rounded-full overflow-hidden bg-muted">
              {profileImageUrl ? (
                <img
                  src={profileImageUrl}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-primary/10">
                  <Camera size={48} className="text-primary" />
                </div>
              )}
            </div>
            <label
              htmlFor="profile-image"
              className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full cursor-pointer hover:bg-primary/90 transition-colors"
            >
              <Camera size={20} />
            </label>
            <input
              type="file"
              id="profile-image"
              className="hidden"
              accept="image/*"
              onChange={(e) => handleProfileImageChange(e.target.files?.[0] || null)}
            />
          </div>
          <div className="text-center sm:text-left">
            <h3 className="text-lg font-semibold">Profile Picture</h3>
            <p className="text-sm text-muted-foreground max-w-md">
              Upload a professional photo of yourself. This will be visible to potential clients.
            </p>
          </div>
        </div>

        {/* Name and Phone Side by Side */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
          <div>
            <label htmlFor="name" className="text-sm font-medium text-foreground block mb-0.5">
              Full Name <span className="text-red-500">*</span>
            </label>
            <Input
              id="name"
              name="name"
              type="text"
              placeholder="Enter your full name"
              value={(formData.name as string) || ""}
              onChange={e => handleInputChange("name", e.target.value)}
              required
              className={validationErrors.name ? "border-red-500" : ""}
            />
            {validationErrors.name && (
              <p className="text-xs text-red-500 mt-0.5">{validationErrors.name}</p>
            )}
          </div>
          <div>
            <label htmlFor="phone" className="text-sm font-medium text-foreground block mb-0.5">
              Phone Number <span className="text-red-500">*</span>
            </label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              placeholder="Enter your phone number"
              value={(formData.phone as string) || ""}
              onChange={e => handleInputChange("phone", e.target.value)}
              required
              className={validationErrors.phone ? "border-red-500" : ""}
            />
            {validationErrors.phone && (
              <p className="text-xs text-red-500 mt-0.5">{validationErrors.phone}</p>
            )}
          </div>
        </div>

        {/* About Section */}
        <div className="mb-3">
          <label htmlFor="about" className="text-sm font-medium text-foreground block mb-0.5">
            About <span className="text-red-500">*</span>
          </label>
          <Textarea
            id="about"
            name="about"
            placeholder="Write a brief professional description about yourself..."
            value={(formData.about as string) || ""}
            onChange={e => handleInputChange("about", e.target.value)}
            required
            className={`w-full min-h-[80px] ${validationErrors.about ? "border-red-500" : ""}`}
          />
          {validationErrors.about && (
            <p className="text-xs text-red-500 mt-0.5">{validationErrors.about}</p>
          )}
          <p className="text-xs text-muted-foreground mt-0.5">
            Share your expertise, experience, and what makes you unique as a CA professional
          </p>
        </div>

        {/* Years of Experience */}
        <div className="mb-3">
          <label htmlFor="yearsOfExperience" className="text-sm font-medium text-foreground block mb-0.5">
            Years of Experience <span className="text-red-500">*</span>
          </label>
          <div className="flex items-center gap-2">
            <Input
              id="yearsOfExperience"
              name="yearsOfExperience"
              type="number"
              min="0"
              max="50"
              placeholder="Enter years of experience"
              value={(formData.yearsOfExperience as string) || ""}
              onChange={e => handleInputChange("yearsOfExperience", e.target.value)}
              required
              className={`w-32 ${validationErrors.yearsOfExperience ? "border-red-500" : ""}`}
            />
            <span className="text-sm text-muted-foreground">years</span>
          </div>
          {validationErrors.yearsOfExperience && (
            <p className="text-xs text-red-500 mt-0.5">{validationErrors.yearsOfExperience}</p>
          )}
        </div>
      </Card>

      {/* Services Section */}
      <Card className="mb-8 p-6">
        <div className="">
          <div className="flex items-center justify-between">
            <div>
          <h2 className="text-lg font-semibold">Services</h2>
              <p className="text-sm text-muted-foreground">Add the services you offer to your clients</p>
            </div>
            <Button
              size="sm"
              onClick={handleAddService}
              disabled={servicesLoading || !!editingServiceId}
              className="bg-gradient-to-r from-primary to-secondary text-white hover:shadow-lg transition-all"
            >
              <Plus size={16} className="mr-2" />
              Add Service
            </Button>
          </div>
          <div className="bg-muted/50 rounded-lg text-sm text-muted-foreground">
            <p className="flex items-center gap-2">
             
              <span>Start typing to search from existing services or add a new one</span>
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {services.map((service) => (
            <div key={service.id} className="group">
              {editingServiceId === service.id ? (
                <div className="relative">
                  <ServiceSelect
                  value={service.service_name}
                    onChange={(value) => handleSaveService(service.id, value)}
                    onBlur={() => setEditingServiceId(null)}
                  />
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => setEditingServiceId(null)}
                      className="h-6 w-6"
                      aria-label="Cancel"
                    >
                      <X size={14} />
                    </Button>
                  </div>
                </div>
              ) : (
                <div 
                  className="flex items-center justify-between p-3 rounded-lg border border-input bg-card hover:border-primary/50 transition-colors cursor-pointer group"
                  onClick={() => setEditingServiceId(service.id)}
                >
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      <Briefcase size={16} />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{service.service_name}</p>
                      <p className="text-xs text-muted-foreground">Click to edit</p>
                    </div>
              </div>
                  <div className="flex items-center gap-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingServiceId(service.id);
                      }}
                      className="h-8 w-8"
                      aria-label="Edit service"
                    >
                      <PencilSimple size={14} />
                    </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveService(service.id);
                      }}
                      className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                aria-label="Remove service"
              >
                      <Trash size={14} />
              </Button>
                  </div>
                </div>
              )}
            </div>
          ))}
          {services.length === 0 && (
            <div className="text-center py-12 border-2 border-dashed border-muted rounded-lg">
              <div className="flex flex-col items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <Briefcase size={24} />
                </div>
                <div>
                  <p className="text-sm font-medium">No services added yet</p>
                  <p className="text-xs text-muted-foreground mt-1">Click "Add Service" to get started</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Experience Section */}
      <Card className="mb-8 p-6">
        <div >
          <div className="flex items-center justify-between mb-2">
            <div>
              <h2 className="text-lg font-semibold">Experience</h2>
              <p className="text-sm text-muted-foreground">Add your work experience and highlight a recent service</p>
            </div>
            <Button
              size="sm"
              onClick={handleAddExperience}
              disabled={experiencesLoading}
              className="bg-gradient-to-r from-primary to-secondary text-white hover:shadow-lg transition-all"
            >
              <Plus size={16} className="mr-2" />
              Add Experience
            </Button>
          </div>
          <div className="bg-muted/50 rounded-lg text-sm text-muted-foreground">
            <p className="flex items-center gap-2">
           
              <span>Include your most recent or relevant work</span>
            </p>
          </div>
        </div>
        <div className="space-y-4">
          {experiences.map(exp => (
            <div key={exp.id} className="group">
              {editingExperienceId === exp.id ? (
                <div className="space-y-4 bg-card rounded-lg p-3 border border-input">
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium mb-2">
                      <Briefcase size={16} /> Job Title
                    </label>
                    <Input
                      placeholder="Job Title"
                      value={exp.title}
                      onChange={e => setExperiences(prev => prev.map(x => x.id === exp.id ? { ...x, title: e.target.value } : x))}
                      required
                    />
                  </div>
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium mb-2">
                      <Buildings size={16} /> Company Name
                    </label>
                    <Input
                      placeholder="Company Name"
                      value={exp.companyName}
                      onChange={e => setExperiences(prev => prev.map(x => x.id === exp.id ? { ...x, companyName: e.target.value } : x))}
                      required
                    />
                  </div>
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium mb-2">
                      <MapPin size={16} /> Location
                    </label>
                    <Input
                      placeholder="Location"
                      value={exp.location}
                      onChange={e => setExperiences(prev => prev.map(x => x.id === exp.id ? { ...x, location: e.target.value } : x))}
                    />
                  </div>
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium mb-2">
                      <Calendar size={16} /> Employment Type
                    </label>
                    <select
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                      value={exp.employmentType}
                      onChange={e => setExperiences(prev => prev.map(x => x.id === exp.id ? { ...x, employmentType: e.target.value } : x))}
                      required
                    >
                      <option value="">Select Employment Type</option>
                      {EMPLOYMENT_TYPES.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <div className="flex-1">
                      <label className="flex items-center gap-2 text-sm font-medium mb-2">
                        <Calendar size={16} /> Start Date
                      </label>
                      <Input
                        type="date"
                        value={exp.startDate}
                        onChange={e => setExperiences(prev => prev.map(x => x.id === exp.id ? { ...x, startDate: e.target.value } : x))}
                        required
                        className={experienceErrors[exp.id]?.startDate ? "border-red-500" : ""}
                      />
                      {experienceErrors[exp.id]?.startDate && (
                        <p className="text-xs text-red-500 mt-1">{experienceErrors[exp.id].startDate}</p>
                      )}
                    </div>
                    <div className="flex-1">
                      <label className="flex items-center gap-2 text-sm font-medium mb-2">
                        <Calendar size={16} /> End Date
                      </label>
                      <Input
                        type="date"
                        value={exp.endDate}
                        onChange={e => setExperiences(prev => prev.map(x => x.id === exp.id ? { ...x, endDate: e.target.value } : x))}
                        required={!exp.isCurrent}
                        disabled={exp.isCurrent}
                        className={experienceErrors[exp.id]?.endDate ? "border-red-500" : ""}
                      />
                      {experienceErrors[exp.id]?.endDate && (
                        <p className="text-xs text-red-500 mt-1">{experienceErrors[exp.id].endDate}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-2 sm:mt-6">
                      <Switch
                        id={`is-current-${exp.id}`}
                        checked={exp.isCurrent}
                        onCheckedChange={checked => setExperiences(prev => prev.map(x => x.id === exp.id ? { ...x, isCurrent: checked } : x))}
                      />
                      <label htmlFor={`is-current-${exp.id}`} className="text-xs text-muted-foreground">Currently Working</label>
                    </div>
                  </div>
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium mb-2">
                      <Briefcase size={16} /> Industry
                    </label>
                    <select
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                      value={exp.industry}
                      onChange={e => setExperiences(prev => prev.map(x => x.id === exp.id ? { ...x, industry: e.target.value } : x))}
                      required
                    >
                      <option value="">Select Industry</option>
                      {INDUSTRIES.map(ind => (
                        <option key={ind} value={ind}>{ind}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium mb-2">
                      <NotePencil size={16} /> Service Recently Done (highlight)
                    </label>
                    <Input
                      placeholder="Service Recently Done (highlight)"
                      value={exp.recentService}
                      onChange={e => setExperiences(prev => prev.map(x => x.id === exp.id ? { ...x, recentService: e.target.value } : x))}
                      required
                    />
                  </div>
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium mb-2">
                      <NotePencil size={16} /> Description (optional)
                    </label>
                    <Textarea
                      placeholder="Description (optional)"
                      value={exp.description}
                      onChange={e => setExperiences(prev => prev.map(x => x.id === exp.id ? { ...x, description: e.target.value } : x))}
                    />
                  </div>
                  <div className="flex gap-2 justify-end mt-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setEditingExperienceId(null)}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => handleSaveExperience(exp.id, exp)}
                      className="bg-gradient-to-r from-primary to-secondary text-white"
                    >
                      Save
                    </Button>
                  </div>
                </div>
              ) : (
                <div
                  className="rounded-lg border border-input bg-card p-3 mb-3 flex flex-col gap-1 cursor-pointer"
                  onClick={() => {
                    // If a temp card is open, remove it before switching edit
                    setExperiences(prev => prev.filter(x => !(String(x.id).startsWith('temp-') && x.id !== exp.id)));
                    setEditingExperienceId(exp.id);
                  }}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Briefcase size={15} className="text-primary" />
                    <span className="font-medium text-base text-foreground">{exp.title}</span>
                    <span className="text-xs text-muted-foreground">@</span>
                    <span className="font-medium text-base text-foreground">{exp.companyName}</span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <MapPin size={12} />
                      <span>{exp.location}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar size={12} />
                      <span>{exp.startDate} - {exp.isCurrent ? "Present" : exp.endDate}</span>
                    </div>
                    <div className="flex gap-2 ml-auto">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={e => {
                          e.stopPropagation();
                          setEditingExperienceId(exp.id);
                        }}
                        className="h-8 w-8"
                        aria-label="Edit experience"
                      >
                        <PencilSimple size={14} />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={e => {
                          e.stopPropagation();
                          handleRemoveExperience(exp.id);
                        }}
                        className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                        aria-label="Remove experience"
                      >
                        <Trash size={14} />
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
          {experiences.length === 0 && (
            <div className="text-center py-12 border-2 border-dashed border-muted rounded-lg">
              <div className="flex flex-col items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <Briefcase size={24} />
                </div>
                <div>
                  <p className="text-sm font-medium">No experience added yet</p>
                  <p className="text-xs text-muted-foreground mt-1">Click "Add Experience" to get started</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Education Section */}
      <Card className="mb-8 p-6">
        <div>
          <div className="flex items-center justify-between mb-2">
            <div>
              <h2 className="text-lg font-semibold">Education</h2>
              <p className="text-sm text-muted-foreground">Add your educational background</p>
            </div>
            <Button
              size="sm"
              onClick={handleAddEducation}
              disabled={educationsLoading || !!editingEducationId}
              className="bg-gradient-to-r from-primary to-secondary text-white hover:shadow-lg transition-all"
            >
              <Plus size={16} className="mr-2" />
              Add Education
            </Button>
          </div>
          <div className="bg-muted/50 rounded-lg text-sm text-muted-foreground">
            <p className="flex items-center gap-2">
              <span>Include your most relevant degrees</span>
            </p>
          </div>
        </div>
        <div className="space-y-4 mt-4">
          {educations.map(edu => (
            <div key={edu.id}>
              {editingEducationId === edu.id ? (
                <div className="space-y-4 bg-card rounded-lg p-3 border border-input">
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium mb-2">
                      <GraduationCap size={16} /> Degree
                    </label>
                    <Input
                      placeholder="Degree"
                      value={edu.degree}
                      onChange={e => setEducations(prev => prev.map(x => x.id === edu.id ? { ...x, degree: e.target.value } : x))}
                      required
                    />
                  </div>
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium mb-2">
                      <Buildings size={16} /> Institute Name
                    </label>
                    <Input
                      placeholder="Institute Name"
                      value={edu.instituteName}
                      onChange={e => setEducations(prev => prev.map(x => x.id === edu.id ? { ...x, instituteName: e.target.value } : x))}
                      required
                    />
                  </div>
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium mb-2">
                      <Briefcase size={16} /> Field of Study
                    </label>
                    <Input
                      placeholder="Field of Study"
                      value={edu.fieldOfStudy}
                      onChange={e => setEducations(prev => prev.map(x => x.id === edu.id ? { ...x, fieldOfStudy: e.target.value } : x))}
                    />
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <div className="flex-1">
                      <label className="flex items-center gap-2 text-sm font-medium mb-2">
                        <Calendar size={16} /> Start Date
                      </label>
                      <Input
                        type="date"
                        value={edu.startDate}
                        onChange={e => setEducations(prev => prev.map(x => x.id === edu.id ? { ...x, startDate: e.target.value } : x))}
                        required
                        className={educationErrors[edu.id]?.startDate ? "border-red-500" : ""}
                      />
                      {educationErrors[edu.id]?.startDate && (
                        <p className="text-xs text-red-500 mt-1">{educationErrors[edu.id].startDate}</p>
                      )}
                    </div>
                    <div className="flex-1">
                      <label className="flex items-center gap-2 text-sm font-medium mb-2">
                        <Calendar size={16} /> End Date
                      </label>
                      <Input
                        type="date"
                        value={edu.endDate}
                        onChange={e => setEducations(prev => prev.map(x => x.id === edu.id ? { ...x, endDate: e.target.value } : x))}
                        required
                        className={educationErrors[edu.id]?.endDate ? "border-red-500" : ""}
                      />
                      {educationErrors[edu.id]?.endDate && (
                        <p className="text-xs text-red-500 mt-1">{educationErrors[edu.id].endDate}</p>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium mb-2">
                      <NotePencil size={16} /> Grade
                    </label>
                    <Input
                      placeholder="Grade"
                      value={edu.grade}
                      onChange={e => setEducations(prev => prev.map(x => x.id === edu.id ? { ...x, grade: e.target.value } : x))}
                    />
                  </div>
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium mb-2">
                      <NotePencil size={16} /> Description (optional)
                    </label>
                    <Textarea
                      placeholder="Description (optional)"
                      value={edu.description}
                      onChange={e => setEducations(prev => prev.map(x => x.id === edu.id ? { ...x, description: e.target.value } : x))}
                    />
                  </div>
                  <div className="flex gap-2 justify-end mt-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setEditingEducationId(null)}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => handleSaveEducation(edu.id, edu)}
                      className="bg-gradient-to-r from-primary to-secondary text-white"
                    >
                      Save
                    </Button>
                  </div>
                </div>
              ) : (
                <div
                  className="rounded-lg border border-input bg-card p-3 mb-3 flex flex-col gap-1 cursor-pointer"
                  onClick={() => {
                    setEducations(prev => prev.filter(x => !(String(x.id).startsWith('temp-') && x.id !== edu.id)));
                    setEditingEducationId(edu.id);
                  }}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <GraduationCap size={15} className="text-primary" />
                    <span className="font-medium text-base text-foreground">{edu.degree}</span>
                    <span className="text-xs text-muted-foreground">@</span>
                    <span className="font-medium text-base text-foreground">{edu.instituteName}</span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Briefcase size={12} />
                      <span>{edu.fieldOfStudy}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar size={12} />
                      <span>{edu.startDate} - {edu.endDate}</span>
                    </div>
                    <div className="flex gap-2 ml-auto">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={e => {
                          e.stopPropagation();
                          setEducations(prev => prev.filter(x => !(String(x.id).startsWith('temp-') && x.id !== edu.id)));
                          setEditingEducationId(edu.id);
                        }}
                        className="h-8 w-8"
                        aria-label="Edit education"
                      >
                        <PencilSimple size={14} />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={e => {
                          e.stopPropagation();
                          handleRemoveEducation(edu.id);
                        }}
                        className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                        aria-label="Remove education"
                      >
                        <Trash size={14} />
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
          {educations.length === 0 && (
            <div className="text-center py-12 border-2 border-dashed border-muted rounded-lg">
              <div className="flex flex-col items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <GraduationCap size={24} />
                </div>
                <div>
                  <p className="text-sm font-medium">No education added yet</p>
                  <p className="text-xs text-muted-foreground mt-1">Click "Add Education" to get started</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Address & Location Section */}
      <Card className="mb-8 p-6">
        <div className="mb-6">
          <div className="flex items-center space-x-3">
        
            <div>
              <h2 className="text-xl font-semibold">Address & Location</h2>
              <p className="text-sm text-muted-foreground">Your contact and location details</p>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {onboardingFormConfig.sections
            .find((section: FormSection) => section.title === "Address & Location")
            ?.fields.map((field: FormField) => {
              // For textarea fields, make them span full width
              if (field.type === "textarea") {
                return (
                  <div key={field.id} className="sm:col-span-2">
                    {renderField(field)}
                  </div>
                );
              }
              return (
                <div key={field.id}>
                  {renderField(field)}
                </div>
              );
            })}
        </div>
      </Card>

      {/* Social & Online Presence Section */}
      <Card className="mb-8 p-6">
        <div className="mb-6">
          <div className="flex items-center space-x-3">
          
            <div>
              <h2 className="text-xl font-semibold">Social & Online Presence</h2>
              <p className="text-sm text-muted-foreground">Share your professional online profiles</p>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* LinkedIn Profile */}
          <div>
            <label htmlFor="linkedin" className="text-sm font-medium text-foreground block mb-0.5">
              LinkedIn Profile
            </label>
            <div className="flex items-center gap-2">
              <Input
                id="linkedin"
                name="linkedin"
                type="url"
                placeholder="https://linkedin.com/in/your-profile"
                value={(formData.linkedin as string) || ""}
                onChange={e => handleInputChange("linkedin", e.target.value)}
                className="flex-1"
              />
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Your professional LinkedIn profile URL
            </p>
          </div>

          {/* Professional Website */}
          <div>
            <label htmlFor="website" className="text-sm font-medium text-foreground block mb-0.5">
              Professional Website
            </label>
            <div className="flex items-center gap-2">
              <Input
                id="website"
                name="website"
                type="url"
                placeholder="https://your-website.com"
                value={(formData.website as string) || ""}
                onChange={e => handleInputChange("website", e.target.value)}
                className="flex-1"
              />
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Your personal or firm website
            </p>
          </div>

          {/* ICAI Membership Number */}
          <div>
            <label htmlFor="icaiNumber" className="text-sm font-medium text-foreground block mb-0.5">
              ICAI Membership Number <span className="text-red-500">*</span>
            </label>
            <Input
              id="icaiNumber"
              name="icaiNumber"
              type="text"
              placeholder="Enter your ICAI membership number"
              value={(formData.icaiNumber as string) || ""}
              onChange={e => handleInputChange("icaiNumber", e.target.value)}
              required
              className={validationErrors.icaiNumber ? "border-red-500" : ""}
            />
            {validationErrors.icaiNumber && (
              <p className="text-xs text-red-500 mt-0.5">{validationErrors.icaiNumber}</p>
            )}
          </div>

          {/* Practice License Number */}
          <div>
            <label htmlFor="licenseNumber" className="text-sm font-medium text-foreground block mb-0.5">
              Practice License Number <span className="text-red-500">*</span>
            </label>
            <Input
              id="licenseNumber"
              name="licenseNumber"
              type="text"
              placeholder="Enter your practice license number"
              value={(formData.licenseNumber as string) || ""}
              onChange={e => handleInputChange("licenseNumber", e.target.value)}
              required
              className={validationErrors.licenseNumber ? "border-red-500" : ""}
            />
            {validationErrors.licenseNumber && (
              <p className="text-xs text-red-500 mt-0.5">{validationErrors.licenseNumber}</p>
            )}
          </div>

          {/* Professional Email */}
          <div>
            <label htmlFor="professionalEmail" className="text-sm font-medium text-foreground block mb-0.5">
              Professional Email <span className="text-red-500">*</span>
            </label>
            <Input
              id="professionalEmail"
              name="professionalEmail"
              type="email"
              placeholder="your.name@firm.com"
              value={(formData.professionalEmail as string) || ""}
              onChange={e => handleInputChange("professionalEmail", e.target.value)}
              required
              className={validationErrors.professionalEmail ? "border-red-500" : ""}
            />
            {validationErrors.professionalEmail && (
              <p className="text-xs text-red-500 mt-0.5">{validationErrors.professionalEmail}</p>
            )}
          </div>

          {/* Professional Phone */}
          <div>
            <label htmlFor="professionalPhone" className="text-sm font-medium text-foreground block mb-0.5">
              Professional Phone
            </label>
            <Input
              id="professionalPhone"
              name="professionalPhone"
              type="tel"
              placeholder="Office/Professional contact number"
              value={(formData.professionalPhone as string) || ""}
              onChange={e => handleInputChange("professionalPhone", e.target.value)}
            />
          </div>

          {/* Areas of Expertise */}
          <div className="sm:col-span-2">
            <label htmlFor="expertise" className="text-sm font-medium text-foreground block mb-0.5">
              Areas of Expertise
            </label>
            <Textarea
              id="expertise"
              name="expertise"
              placeholder="List your specialized areas of practice (e.g., Tax Planning, Audit, Financial Advisory)"
              value={(formData.expertise as string) || ""}
              onChange={e => handleInputChange("expertise", e.target.value)}
              className="min-h-[80px]"
            />
            <p className="text-xs text-muted-foreground mt-0.5">
              Highlight your key areas of specialization
            </p>
          </div>
        </div>
      </Card>

      {/* Submit Button */}
      <div className="mt-8 flex justify-end">
        <Button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="bg-gradient-to-r from-primary to-secondary text-white px-8 py-2 rounded-lg hover:shadow-lg transition-all"
        >
          {isSubmitting ? (
            <div className="flex items-center gap-2">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-b-transparent"></span>
              <span>Saving Profile...</span>
            </div>
          ) : (
            "Save Profile"
          )}
        </Button>
      </div>
    </div>
  );
}
