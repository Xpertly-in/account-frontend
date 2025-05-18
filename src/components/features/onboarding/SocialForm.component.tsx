import { Card } from "@/ui/Card.ui";
import { Input } from "@/ui/Input.ui";
import { Textarea } from "@/ui/Textarea.ui";
import { LinkedinLogo, Globe, Envelope, Phone, GraduationCap } from "@phosphor-icons/react";

interface SocialFormProps {
  formData: {
    linkedin?: string;
    website?: string;
    icaiNumber?: string;
    licenseNumber?: string;
    professionalEmail?: string;
    professionalPhone?: string;
    expertise?: string;
  };
  onFormDataChange: (data: Partial<SocialFormProps['formData']>) => void;
  validationErrors: {
    linkedin?: string;
    website?: string;
    icaiNumber?: string;
    licenseNumber?: string;
    professionalEmail?: string;
    professionalPhone?: string;
    expertise?: string;
  };
}

export function SocialForm({ formData, onFormDataChange, validationErrors }: SocialFormProps) {
  return (
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
          <label className="flex items-center gap-2 text-sm font-medium mb-2">
            <LinkedinLogo size={16} /> LinkedIn Profile
          </label>
          <Input
            type="url"
            placeholder="https://linkedin.com/in/your-profile"
            value={formData.linkedin || ""}
            onChange={e => onFormDataChange({ linkedin: e.target.value })}
            className={validationErrors.linkedin ? "border-red-500" : ""}
          />
          {validationErrors.linkedin && (
            <p className="text-xs text-red-500 mt-1">{validationErrors.linkedin}</p>
          )}
          <p className="text-xs text-muted-foreground mt-1">
            Your professional LinkedIn profile URL
          </p>
        </div>

        {/* Professional Website */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium mb-2">
            <Globe size={16} /> Professional Website
          </label>
          <Input
            type="url"
            placeholder="https://your-website.com"
            value={formData.website || ""}
            onChange={e => onFormDataChange({ website: e.target.value })}
            className={validationErrors.website ? "border-red-500" : ""}
          />
          {validationErrors.website && (
            <p className="text-xs text-red-500 mt-1">{validationErrors.website}</p>
          )}
          <p className="text-xs text-muted-foreground mt-1">
            Your personal or firm website
          </p>
        </div>

        {/* ICAI Membership Number */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium mb-2">
            <GraduationCap size={16} /> ICAI Membership Number <span className="text-red-500">*</span>
          </label>
          <Input
            type="text"
            placeholder="Enter your ICAI membership number"
            value={formData.icaiNumber || ""}
            onChange={e => onFormDataChange({ icaiNumber: e.target.value })}
            required
            className={validationErrors.icaiNumber ? "border-red-500" : ""}
          />
          {validationErrors.icaiNumber && (
            <p className="text-xs text-red-500 mt-1">{validationErrors.icaiNumber}</p>
          )}
        </div>

        {/* Practice License Number */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium mb-2">
            <GraduationCap size={16} /> Practice License Number <span className="text-red-500">*</span>
          </label>
          <Input
            type="text"
            placeholder="Enter your practice license number"
            value={formData.licenseNumber || ""}
            onChange={e => onFormDataChange({ licenseNumber: e.target.value })}
            required
            className={validationErrors.licenseNumber ? "border-red-500" : ""}
          />
          {validationErrors.licenseNumber && (
            <p className="text-xs text-red-500 mt-1">{validationErrors.licenseNumber}</p>
          )}
        </div>

        {/* Professional Email */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium mb-2">
            <Envelope size={16} /> Professional Email <span className="text-red-500">*</span>
          </label>
          <Input
            type="email"
            placeholder="your.name@firm.com"
            value={formData.professionalEmail || ""}
            onChange={e => onFormDataChange({ professionalEmail: e.target.value })}
            required
            className={validationErrors.professionalEmail ? "border-red-500" : ""}
          />
          {validationErrors.professionalEmail && (
            <p className="text-xs text-red-500 mt-1">{validationErrors.professionalEmail}</p>
          )}
        </div>

        {/* Professional Phone */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium mb-2">
            <Phone size={16} /> Professional Phone
          </label>
          <Input
            type="tel"
            placeholder="Office/Professional contact number"
            value={formData.professionalPhone || ""}
            onChange={e => onFormDataChange({ professionalPhone: e.target.value })}
            className={validationErrors.professionalPhone ? "border-red-500" : ""}
          />
          {validationErrors.professionalPhone && (
            <p className="text-xs text-red-500 mt-1">{validationErrors.professionalPhone}</p>
          )}
        </div>

        {/* Areas of Expertise */}
        <div className="sm:col-span-2">
          <label className="flex items-center gap-2 text-sm font-medium mb-2">
            <GraduationCap size={16} /> Areas of Expertise
          </label>
          <Textarea
            placeholder="List your specialized areas of practice (e.g., Tax Planning, Audit, Financial Advisory)"
            value={formData.expertise || ""}
            onChange={e => onFormDataChange({ expertise: e.target.value })}
            className={`min-h-[80px] ${validationErrors.expertise ? "border-red-500" : ""}`}
          />
          {validationErrors.expertise && (
            <p className="text-xs text-red-500 mt-1">{validationErrors.expertise}</p>
          )}
          <p className="text-xs text-muted-foreground mt-1">
            Highlight your key areas of specialization
          </p>
        </div>
      </div>
    </Card>
  );
} 