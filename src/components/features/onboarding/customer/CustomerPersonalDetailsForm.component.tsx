"use client";
import { useRef } from "react";
import { Input } from "@/ui/Input.ui";
import { Select } from "@/ui/Select.ui";
import { Textarea } from "@/ui/Textarea.ui";
import { Camera } from "@phosphor-icons/react";
import { toast } from "react-hot-toast";

const USER_TYPES = [
  "Individual",
  "Proprietorship",
  "Partnership",
  "Private Limited / LLP",
  "NGO / Trust",
  "Other"
];
const GENDER_OPTIONS = [
  { value: "", label: "Select your gender" },
  { value: "MALE", label: "Male" },
  { value: "FEMALE", label: "Female" },
  { value: "OTHER", label: "Other" },
  { value: "PREFER_NOT_TO_SAY", label: "Prefer not to say" },
];

function getInitials(name: string) {
  if (!name) return "";
  return name
    .split(" ")
    .map(n => n[0])
    .join("")
    .toUpperCase();
}

interface CustomerPersonalDetailsFormProps {
  formData: {
    name?: string;
    gender?: string;
    mobile?: string;
    userType?: string;
    about?: string;
    profilePhoto?: File | null;
    profile_picture?: string | null;
  };
  setFormData: (data: any) => void;
  errors: {
    name?: string;
    gender?: string;
    mobile?: string;
    userType?: string;
    about?: string;
  };
  setErrors: (errors: any) => void;
  onProfileImageChange: (file: File | null) => Promise<void>;
  imageUploading: boolean;
}

export default function CustomerPersonalDetailsForm({ 
  formData, 
  setFormData, 
  errors, 
  setErrors,
  onProfileImageChange,
  imageUploading 
}: CustomerPersonalDetailsFormProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const profilePhoto = formData.profilePhoto;
  const initials = getInitials(formData.name || "User");
  const photoUrl = profilePhoto ? URL.createObjectURL(profilePhoto) : formData.profile_picture;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-2">
        {/* Profile Image */}
        <div className="relative">
          <div className="w-28 h-28 rounded-full overflow-hidden bg-muted flex items-center justify-center text-3xl font-bold text-primary border-2 border-primary/30">
            {photoUrl ? (
              <img src={photoUrl} alt="Profile" className="object-cover w-full h-full" />
            ) : (
              <span>{initials}</span>
            )}
          </div>
          <button
            type="button"
            className="absolute bottom-0 right-0 bg-primary text-white rounded-full p-2 shadow-lg border-2 border-white hover:bg-primary/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => fileInputRef.current?.click()}
            aria-label="Upload profile photo"
            disabled={imageUploading}
          >
            {imageUploading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Camera size={20} />
            )}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={async (e) => {
              const file = e.target.files?.[0] || null;
              if (file) {
                try {
                  if (typeof onProfileImageChange === 'function') {
                    await onProfileImageChange(file);
                  } else {
                    console.error('onProfileImageChange is not a function');
                    toast.error('Image upload functionality is not available');
                    // Clear the file input
                    if (fileInputRef.current) {
                      fileInputRef.current.value = '';
                    }
                  }
                } catch (err) {
                  console.error('Error uploading image:', err);
                  toast.error('Failed to upload image');
                  // Clear the file input
                  if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                  }
                }
              }
            }}
          />
        </div>
        {/* Fields Grid */}
        <div className="flex-1 w-full">
          <div className="mb-2">
            <span className="block text-xl font-bold">Profile Picture</span>
            <span className="block text-sm text-muted-foreground">Upload a professional photo of yourself or your business. This will be visible to potential clients.</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-foreground block mb-0.5">Full Name</label>
              <Input
                name="name"
                type="text"
                placeholder="Enter your full name"
                value={formData.name || ""}
                onChange={e => setFormData((f: any) => ({ ...f, name: e.target.value }))}
                className={errors.name ? "border-red-500" : ""}
              />
              {errors.name && <p className="text-xs text-red-500 mt-0.5">{errors.name}</p>}
            </div>
            <div>
              <label className="text-sm font-medium text-foreground block mb-0.5">Gender</label>
              <Select
                name="gender"
                value={formData.gender || ""}
                onChange={e => setFormData((f: any) => ({ ...f, gender: e.target.value }))}
                className={errors.gender ? "border-red-500" : ""}
              >
                {GENDER_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </Select>
              {errors.gender && <p className="text-xs text-red-500 mt-0.5">{errors.gender}</p>}
            </div>
            <div>
              <label className="text-sm font-medium text-foreground block mb-0.5">Phone Number</label>
              <Input
                name="mobile"
                type="tel"
                placeholder="Enter your phone number"
                value={formData.mobile || ""}
                onChange={e => setFormData((f: any) => ({ ...f, mobile: e.target.value }))}
                className={errors.mobile ? "border-red-500" : ""}
              />
              {errors.mobile && <p className="text-xs text-red-500 mt-0.5">{errors.mobile}</p>}
            </div>
            <div>
              <label className="text-sm font-medium text-foreground block mb-0.5">Type of User</label>
              <Select
                name="userType"
                value={formData.userType || ""}
                onChange={e => setFormData((f: any) => ({ ...f, userType: e.target.value }))}
                className={errors.userType ? "border-red-500" : ""}
              >
                <option value="">Select type</option>
                {USER_TYPES.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </Select>
              {errors.userType && <p className="text-xs text-red-500 mt-0.5">{errors.userType}</p>}
            </div>
          </div>
        </div>
      </div>
      {/* About Section */}
      <div>
        <label className="text-sm font-medium text-foreground block mb-0.5">About</label>
        <Textarea
          name="about"
          placeholder="Share your expertise, experience, and what makes you unique as a professional."
          value={formData.about || ""}
          onChange={e => setFormData((f: any) => ({ ...f, about: e.target.value }))}
          className={`w-full min-h-[80px] ${errors.about ? "border-red-500" : ""}`}
        />
        {errors.about && <p className="text-xs text-red-500 mt-0.5">{errors.about}</p>}
        <p className="text-xs text-muted-foreground mt-0.5">Share your expertise, experience, and what makes you unique as a professional.</p>
      </div>
    </div>
  );
} 