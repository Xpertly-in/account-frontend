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
import { FormField, FormValues, ValidationErrors, FormSection, Service, Education } from "@/types/onboarding.type";
import { validateStep, getInitialFormValues, shouldShowField } from "@/helper/form.helper";
import { Card } from "@/ui/Card.ui";
import { Button } from "@/ui/Button.ui";
import { Camera, PencilSimple, Trash, Plus, X, Info, Briefcase, Calendar, NotePencil, Buildings, MapPin, GraduationCap } from "@phosphor-icons/react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { ServiceSelect } from "./ServiceSelect.component";
import { onboardingFormConfig } from "@/constants/onboarding-form.config";
import { FormConfig, FormStep } from '@/types/onboarding.type';
import { BasicInfoForm } from "./BasicInfoForm.component";
import { ServicesForm } from "./ServicesForm.component";
import { ExperienceForm } from "./ExperienceForm.component";
import { EducationForm } from "./EducationForm.component";
import { AddressForm } from "./AddressForm.component";
import { SocialForm } from "./SocialForm.component";
import OnboardingStepper from "./OnboardingStepper.component";

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

interface OnboardingStepperProps {
  formData: FormValues;
  setFormData: (data: Partial<FormValues>) => void;
  validationErrors: ValidationErrors;
  setValidationErrors: (errors: ValidationErrors) => void;
  services: Service[];
  setServices: (services: Service[]) => void;
  experiences: any[]; // Replace 'any' with your Experience type if available
  setExperiences: (experiences: any[]) => void;
  educations: Education[];
  setEducations: (educations: Education[]) => void;
  isSubmitting: boolean;
  handleSubmit: () => void;
  servicesLoading: boolean;
  experiencesLoading: boolean;
  educationsLoading: boolean;
  profileImageUrl: string;
  onProfileImageChange: (file: File | null) => void;
  imageUploading: boolean;
}

export default function DynamicForm() {
  const router = useRouter();
  const { auth } = useAuth();
  const [formData, setFormData] = useState<FormValues>({});
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [profileImageUrl, setProfileImageUrl] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);
  const [services, setServices] = useState<Service[]>([]);
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
  const [educations, setEducations] = useState<Education[]>([]);
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
          name: service.service_name
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
          isCurrent: false
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

  // Add this after the existing useEffect hooks
  useEffect(() => {
    const fetchProfileData = async () => {
      if (!auth.user) return;

      try {
        // Fetch basic profile information
        const { data: profileData, error: profileError } = await supabase
          .from('ca_profiles')
          .select('*')
          .eq('user_id', auth.user.id)
          .single();

        if (profileError) throw profileError;

        // Fetch address information
        const { data: addressData, error: addressError } = await supabase
          .from('ca_address')
          .select('*')
          .eq('ca_id', auth.user.id)
          .single();

        if (addressError) throw addressError;

        // Fetch social profile information
        const { data: socialData, error: socialError } = await supabase
          .from('ca_social_profile')
          .select('*')
          .eq('ca_id', auth.user.id)
          .single();

        // Don't throw error if no social profile exists yet
        if (socialError && socialError.code !== 'PGRST116') {
          console.error('Error fetching social profile:', socialError);
        }

        // Combine all data into formData
        setFormData(prev => ({
          ...prev,
          // Basic Information
          name: profileData.name || '',
          phone: profileData.phone || '',
          about: profileData.about || '',
          yearsOfExperience: profileData.years_of_experience || '',

          // Address & Location
          address: addressData?.address || '',
          city: addressData?.city || '',
          state: addressData?.state || '',
          pincode: addressData?.pincode || '',

          // Social & Online Presence
          linkedin: socialData?.linkedin_profile || '',
          website: socialData?.professional_website || '',
          icaiNumber: socialData?.icai_membership_number || '',
          licenseNumber: socialData?.practice_license_number || '',
          professionalEmail: socialData?.professional_email || '',
          professionalPhone: socialData?.professional_phone || '',
          expertise: socialData?.areas_of_expertise || '',
        }));

      } catch (error) {
        console.error('Error fetching profile data:', error);
      
      }
    };

    fetchProfileData();
  }, [auth.user]);

  // Add a new service row
  const handleAddService = () => {
    if (editingServiceId) return; // Prevent adding if already editing
    const newId = `temp-${Date.now()}`;
    setServices(prev => [
      ...prev,
      {
        id: newId,
        name: "",
        description: "",
        price: "",
        duration: ""
      }
    ]);
    setEditingServiceId(newId);
  };

  // Save a service
  const handleSaveService = async (id: string, service: Service) => {
    if (!auth.user) return;

    try {
      if (id.startsWith('temp-')) {
        // Insert new service
        const { data, error } = await supabase
          .from("ca_services")
          .insert([{
            ca_id: auth.user.id,
            service_name: service.name,
            is_active: true
          }])
          .select()
          .single();

        if (error) throw error;

        setServices(prev => prev.map(s =>
          s.id === id ? { ...service, id: data.service_id } : s
        ));
        toast.success("Service added successfully");
      } else {
        // Update existing service
        const { error } = await supabase
          .from("ca_services")
          .update({
            service_name: service.name,
          })
          .eq("service_id", id);

        if (error) throw error;

        setServices(prev => prev.map(s =>
          s.id === id ? { ...service, id } : s
        ));
        toast.success("Service updated successfully");
      }

      setEditingServiceId(null);
    } catch (error) {
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
        
        // Refresh experiences list
        const { data, error: fetchError } = await supabase
          .from("experiences")
          .select("id, title, employment_type, company_name, location, is_current, start_date, end_date, industry, description, recent_service, is_active")
          .eq("ca_id", auth.user.id)
          .eq("is_active", true);
          
        if (!fetchError && data) {
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
      }
      toast.success("Experience removed successfully");
    } catch (error) {
      console.error("Error removing experience:", error);
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
        isCurrent: false,
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
      if (String(id).startsWith('temp-')) {
        // Check if an education record already exists for this user
        const { data: existingEducation, error: checkError } = await supabase
          .from("educations")
          .select("id")
          .eq("ca_id", auth.user.id)
          .eq("is_active", true)
          .single();

        if (checkError && checkError.code !== 'PGRST116') {
          throw checkError;
        }

        if (existingEducation) {
          // Update existing record
          const { error: updateError } = await supabase
            .from("educations")
            .update({
              institute_name: edu.instituteName,
              degree: edu.degree,
              field_of_study: edu.fieldOfStudy,
              start_date: edu.startDate,
              end_date: edu.endDate,
              grade: edu.grade,
              description: edu.description,
              is_active: true
            })
            .eq("id", existingEducation.id);

          if (updateError) throw updateError;

          setEducations(prev =>
            prev.map(e => (e.id === id ? { ...edu, id: existingEducation.id } : e))
          );
        } else {
          // Insert new record
          const { data, error: insertError } = await supabase
            .from("educations")
            .insert([{
              ca_id: auth.user.id,
              institute_name: edu.instituteName,
              degree: edu.degree,
              field_of_study: edu.fieldOfStudy,
              start_date: edu.startDate,
              end_date: edu.endDate,
              grade: edu.grade,
              description: edu.description,
              is_active: true,
            }])
            .select()
            .single();

          if (insertError) throw insertError;

          setEducations(prev =>
            prev.map(e => (e.id === id ? { ...edu, id: data.id } : e))
          );
        }
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
      console.error("Error saving education:", error);
      toast.error(error instanceof Error ? error.message : "Failed to save education");
    }
  };

  const handleRemoveEducation = async (id: string) => {
    if (!auth.user) {
      toast.error("You must be logged in to remove education");
      return;
    }

    try {
      const educationId = String(id);
      
      // Optimistically update UI
      const updatedEducations = educations.filter(e => e.id !== educationId);
      setEducations(updatedEducations);

      if (educationId.startsWith('temp-')) {
        toast.success("Education removed successfully");
      } else {
        const { error } = await supabase
          .from("educations")
          .update({ is_active: false })
          .eq("id", educationId);

        if (error) {
          // Revert the optimistic update if there's an error
          console.error("Supabase update error:", error);
          setEducations(educations);
          toast.error(`Failed to remove education: ${error.message}`);
          return;
        }

        // Refresh educations list
        const { data, error: fetchError } = await supabase
          .from("educations")
          .select("id, institute_name, degree, field_of_study, start_date, end_date, grade, description, is_active")
          .eq("ca_id", auth.user.id)
          .eq("is_active", true);

        if (!fetchError && data) {
          setEducations(data.map(edu => ({
            id: edu.id,
            instituteName: edu.institute_name,
            degree: edu.degree,
            fieldOfStudy: edu.field_of_study,
            startDate: edu.start_date,
            endDate: edu.end_date,
            grade: edu.grade,
            description: edu.description,
            isCurrent: false
          })));
        }
        toast.success("Education removed successfully");
      }

      // Clear editing state if the deleted education was being edited
      if (editingEducationId === educationId) {
        setEditingEducationId(null);
        setEducationErrors({});
      }
    } catch (error) {
      // Revert the optimistic update if there's an error
      setEducations(educations);
      console.error("Error removing education:", error);
      toast.error(error instanceof Error ? error.message : "Failed to remove education");
    }
  };

  const handleFormDataChange = (data: Partial<FormValues>) => {
    // Use the functional update pattern to ensure we're working with the latest state
    setFormData(prevFormData => {
      // Create a new object that includes all existing form data
      const newFormData = { ...prevFormData };
      
      // Update only the fields that are provided in the new data
      Object.entries(data).forEach(([key, value]) => {
        // Only update if the value is not undefined or null
        if (value !== undefined && value !== null) {
          newFormData[key] = value;
        }
      });
      
      return newFormData;
    });

    // Clear validation errors for the updated fields
    setValidationErrors(prevErrors => {
      const newErrors = { ...prevErrors };
      Object.keys(data).forEach(key => {
        if (newErrors[key]) {
          delete newErrors[key];
        }
      });
      return newErrors;
    });
  };

  const handleInputChange = (id: string, value: any) => {
    // Use the same pattern for individual field updates
    setFormData(prevFormData => ({
      ...prevFormData,
      [id]: value
    }));

    // Clear validation error for this field if it exists
    if (validationErrors[id]) {
      setValidationErrors(prevErrors => {
        const newErrors = { ...prevErrors };
        delete newErrors[id];
        return newErrors;
      });
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
      const value = formData[field];

      if (
        value === undefined ||
        value === null ||
        (typeof value === 'string' && value.trim() === '') ||
        (value instanceof File && value.size === 0) ||
        (Array.isArray(value) && value.length === 0)
      ) {
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
      try {
        const { data: addressData, error: addressError } = await supabase
          .from('ca_address')
          .select('*')
          .eq('ca_id', auth.user?.id);

        if (addressError) {
          console.error('Address check error:', addressError);
          throw addressError;
        }

        if (!addressData || addressData.length === 0) {
          // No existing record, perform insert
          console.log('No existing address found, performing insert');
          const { data: insertData, error: insertError } = await supabase
            .from('ca_address')
            .insert({
              ca_id: auth.user?.id,
              address: formData.address || null,
              city: formData.city || null,
              state: formData.state || null,
              pincode: formData.pincode || null,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            })
            .select();

          if (insertError) {
            console.error('Address insert error:', insertError);
            throw insertError;
          }
          console.log('Address inserted successfully:', insertData);
        } else {
          // Existing record found, perform update
          console.log('Existing address found, performing update');
          const { error: updateError } = await supabase
            .from('ca_address')
            .update({
              address: formData.address || null,
              city: formData.city || null,
              state: formData.state || null,
              pincode: formData.pincode || null,
              updated_at: new Date().toISOString()
            })
            .eq('ca_id', auth.user?.id);

          if (updateError) {
            console.error('Address update error:', updateError);
            throw updateError;
          }
          console.log('Address updated successfully');
        }
      } catch (error) {
        console.error('Address operation failed:', error);
        throw error;
      }

      // Update or insert social profile
      try {
        const { data: socialData, error: socialError } = await supabase
          .from('ca_social_profile')
          .select('*')
          .eq('ca_id', auth.user?.id);

        if (socialError) {
          console.error('Social profile check error:', socialError);
          throw socialError;
        }

        if (!socialData || socialData.length === 0) {
          // No existing record, perform insert
          console.log('No existing social profile found, performing insert');
          const { data: insertData, error: insertError } = await supabase
            .from('ca_social_profile')
            .insert({
              ca_id: auth.user?.id,
              linkedin_profile: formData.linkedin || null,
              professional_website: formData.website || null,
              icai_membership_number: formData.icaiNumber || null,
              practice_license_number: formData.licenseNumber || null,
              professional_email: formData.professionalEmail || null,
              professional_phone: formData.professionalPhone || null,
              areas_of_expertise: formData.expertise || null,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            })
            .select();

          if (insertError) {
            console.error('Social profile insert error:', insertError);
            throw insertError;
          }
          console.log('Social profile inserted successfully:', insertData);
        } else {
          // Existing record found, perform update
          console.log('Existing social profile found, performing update');
          const { error: updateError } = await supabase
            .from('ca_social_profile')
            .update({
              linkedin_profile: formData.linkedin || null,
              professional_website: formData.website || null,
              icai_membership_number: formData.icaiNumber || null,
              practice_license_number: formData.licenseNumber || null,
              professional_email: formData.professionalEmail || null,
              professional_phone: formData.professionalPhone || null,
              areas_of_expertise: formData.expertise || null,
              updated_at: new Date().toISOString()
            })
            .eq('ca_id', auth.user?.id);

          if (updateError) {
            console.error('Social profile update error:', updateError);
            throw updateError;
          }
          console.log('Social profile updated successfully');
        }
      } catch (error) {
        console.error('Social profile operation failed:', error);
        throw error;
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
              className={`w-full ${field.multiple ? "min-h-[120px]" : ""} ${error ? "border-red-500" : ""
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
    <OnboardingStepper
      formData={formData}
      setFormData={setFormData}
      validationErrors={validationErrors}
      setValidationErrors={setValidationErrors}
      services={services}
      setServices={setServices}
      experiences={experiences}
      setExperiences={setExperiences}
      educations={educations}
      setEducations={setEducations}
      isSubmitting={isSubmitting}
      handleSubmit={handleSubmit}
      servicesLoading={servicesLoading}
      experiencesLoading={experiencesLoading}
      educationsLoading={educationsLoading}
      profileImageUrl={profileImageUrl}
      onProfileImageChange={handleProfileImageChange}
      imageUploading={imageUploading}
    />
  );
}
