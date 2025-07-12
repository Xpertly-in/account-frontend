// EducationMembershipStep Component - Step 2: Education & CA Membership
// Mobile-first design, under 200 lines, follows project standards

"use client";

import { useState, useEffect } from "react";
import { Input } from "@/ui/Input.ui";
import { Textarea } from "@/ui/Textarea.ui";
import { Button } from "@/ui/Button.ui";
import { Badge } from "@/ui/Badge.ui";
import { FileUpload } from "@/ui/FileUpload.ui";
import { PlusIcon, XIcon, GraduationCapIcon, UploadIcon, EyeIcon } from "@phosphor-icons/react";
import { uploadCertificate, getCertificateUrl } from "@/services/storage.service";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import type { CAProfile, Education } from "@/types/profile.type";

interface EducationMembershipStepProps {
  profile: CAProfile;
  formData: Partial<CAProfile>;
  onFormDataChange: (data: Partial<CAProfile>) => void;
}

export default function EducationMembershipStep({
  profile,
  formData,
  onFormDataChange,
}: EducationMembershipStepProps) {
  const [localData, setLocalData] = useState({
    educations: formData.educations || [],
    ca_verification: formData.ca_verification || {
      membership_number: "",
      membership_certificate_url: "",
    },
  });

  const [newEducation, setNewEducation] = useState<Partial<Education>>({
    institute_name: "",
    degree: "",
    field_of_study: "",
    start_date: "",
    end_date: "",
    grade: "",
    description: "",
  });

  const [showAddForm, setShowAddForm] = useState(false);
  const [uploadingCertificate, setUploadingCertificate] = useState(false);
  const [certificateUrl, setCertificateUrl] = useState<string | null>(null);

  useEffect(() => {
    onFormDataChange(localData);
  }, [localData]);

  useEffect(() => {
    // Load existing certificate URL if available
    if (localData.ca_verification?.membership_certificate_url) {
      loadCertificateUrl(localData.ca_verification.membership_certificate_url);
    }
  }, [localData.ca_verification?.membership_certificate_url]);

  const loadCertificateUrl = async (path: string) => {
    try {
      const url = await getCertificateUrl(path);
      setCertificateUrl(url);
    } catch (error) {
      console.error("Error loading certificate URL:", error);
    }
  };

  const handleVerificationChange = (field: string, value: string) => {
    setLocalData(prev => ({
      ...prev,
      ca_verification: {
        ...prev.ca_verification,
        [field]: value,
      },
    }));
  };

  const handleCertificateUpload = async (files: File[]) => {
    if (files.length === 0 || !profile.id) return;

    const file = files[0];
    setUploadingCertificate(true);

    try {
      // Upload file to storage
      const storagePath = await uploadCertificate(file, profile.id);

      // Update local state
      setLocalData(prev => ({
        ...prev,
        ca_verification: {
          ...prev.ca_verification,
          membership_certificate_url: storagePath,
        },
      }));

      // Update database
      const { error } = await supabase.from("ca_verifications").upsert({
        profile_id: profile.id,
        membership_number: localData.ca_verification?.membership_number || "",
        membership_certificate_url: storagePath,
      });

      if (error) throw error;

      toast.success("Certificate uploaded successfully!");

      // Load the new certificate URL
      loadCertificateUrl(storagePath);
    } catch (error) {
      console.error("Error uploading certificate:", error);
      toast.error(error instanceof Error ? error.message : "Failed to upload certificate");
    } finally {
      setUploadingCertificate(false);
    }
  };

  const handleAddEducation = () => {
    if (newEducation.institute_name && newEducation.degree) {
      setLocalData(prev => ({
        ...prev,
        educations: [...prev.educations, { ...newEducation, id: Date.now().toString() }],
      }));
      setNewEducation({
        institute_name: "",
        degree: "",
        field_of_study: "",
        start_date: "",
        end_date: "",
        grade: "",
        description: "",
      });
      setShowAddForm(false);
    }
  };

  const handleRemoveEducation = (index: number) => {
    setLocalData(prev => ({
      ...prev,
      educations: prev.educations.filter((_, i) => i !== index),
    }));
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Education & Membership
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Add your educational qualifications and CA verification details
        </p>
      </div>

      {/* CA Verification */}
      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          CA Verification Details
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              ICAI Membership Number *
            </label>
            <Input
              value={localData.ca_verification?.membership_number || ""}
              onChange={e => handleVerificationChange("membership_number", e.target.value)}
              placeholder="Enter your ICAI membership number"
              required
            />
          </div>

          {/* Certificate Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Membership Certificate *
            </label>

            {/* Show existing certificate if available */}
            {localData.ca_verification?.membership_certificate_url && certificateUrl && (
              <div className="mb-4 p-3 border border-green-200 dark:border-green-800 rounded-lg bg-green-50 dark:bg-green-900/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-green-500 flex items-center justify-center">
                      <GraduationCapIcon className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-green-800 dark:text-green-200">
                        Certificate Uploaded
                      </p>
                      <p className="text-xs text-green-600 dark:text-green-400">
                        Ready for verification
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(certificateUrl, "_blank")}
                    className="text-green-700 border-green-300 hover:bg-green-100"
                  >
                    <EyeIcon className="h-4 w-4 mr-1" />
                    View
                  </Button>
                </div>
              </div>
            )}

            {/* Upload component */}
            <FileUpload
              id="certificate-upload"
              label={
                localData.ca_verification?.membership_certificate_url
                  ? "Replace Certificate"
                  : "Upload Certificate"
              }
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={handleCertificateUpload}
              required={!localData.ca_verification?.membership_certificate_url}
            />

            {uploadingCertificate && (
              <div className="mt-2 text-sm text-blue-600 dark:text-blue-400">
                <UploadIcon className="h-4 w-4 inline mr-1 animate-spin" />
                Uploading certificate...
              </div>
            )}

            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              Upload your ICAI membership certificate (PDF, JPG, PNG - max 5MB)
            </p>
          </div>
        </div>
      </div>

      {/* Education List */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Educational Qualifications
          </h3>
          <Button variant="outline" size="sm" onClick={() => setShowAddForm(!showAddForm)}>
            <PlusIcon className="h-4 w-4 mr-2" />
            Add Education
          </Button>
        </div>

        {/* Existing Education */}
        <div className="space-y-4 mb-4">
          {localData.educations.map((education, index) => (
            <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <GraduationCapIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      {education.degree}
                    </h4>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    {education.institute_name}
                  </p>
                  {education.field_of_study && (
                    <Badge variant="secondary" className="mb-2">
                      {education.field_of_study}
                    </Badge>
                  )}
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {formatDate(education.start_date)} - {formatDate(education.end_date)}
                    {education.grade && ` • Grade: ${education.grade}`}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveEducation(index)}
                  className="text-red-600 hover:text-red-800"
                >
                  <XIcon className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Add Education Form */}
        {showAddForm && (
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-800">
            <h4 className="font-medium text-gray-900 dark:text-white mb-4">Add New Education</h4>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Institution Name *
                  </label>
                  <Input
                    value={newEducation.institute_name}
                    onChange={e =>
                      setNewEducation(prev => ({ ...prev, institute_name: e.target.value }))
                    }
                    placeholder="Enter institution name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Degree *
                  </label>
                  <Input
                    value={newEducation.degree}
                    onChange={e => setNewEducation(prev => ({ ...prev, degree: e.target.value }))}
                    placeholder="e.g., Bachelor of Commerce, CA"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Field of Study
                  </label>
                  <Input
                    value={newEducation.field_of_study}
                    onChange={e =>
                      setNewEducation(prev => ({ ...prev, field_of_study: e.target.value }))
                    }
                    placeholder="e.g., Accounting, Finance"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Start Date
                  </label>
                  <Input
                    type="date"
                    value={newEducation.start_date}
                    onChange={e =>
                      setNewEducation(prev => ({ ...prev, start_date: e.target.value }))
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    End Date
                  </label>
                  <Input
                    type="date"
                    value={newEducation.end_date}
                    onChange={e => setNewEducation(prev => ({ ...prev, end_date: e.target.value }))}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Grade/Score
                </label>
                <Input
                  value={newEducation.grade}
                  onChange={e => setNewEducation(prev => ({ ...prev, grade: e.target.value }))}
                  placeholder="e.g., First Class, 8.5 CGPA"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Description
                </label>
                <Textarea
                  value={newEducation.description}
                  onChange={e =>
                    setNewEducation(prev => ({ ...prev, description: e.target.value }))
                  }
                  placeholder="Additional details about your education..."
                  rows={2}
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleAddEducation} size="sm">
                  Add Education
                </Button>
                <Button variant="outline" onClick={() => setShowAddForm(false)} size="sm">
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
