// ExperienceStep Component - Step 3: Work Experience
// Mobile-first design, under 200 lines, follows project standards

"use client";

import { useState, useEffect } from "react";
import { Input } from "@/ui/Input.ui";
import { Textarea } from "@/ui/Textarea.ui";
import { Button } from "@/ui/Button.ui";
import { Badge } from "@/ui/Badge.ui";
import { Switch } from "@/ui/Switch.ui";
import { PlusIcon, XIcon, BriefcaseIcon, CalendarIcon, MapPinIcon } from "@phosphor-icons/react";
import type { CAProfile, Experience } from "@/types/profile.type";

interface ExperienceStepProps {
  profile: CAProfile;
  formData: Partial<CAProfile>;
  onFormDataChange: (data: Partial<CAProfile>) => void;
}

export default function ExperienceStep({
  profile,
  formData,
  onFormDataChange,
}: ExperienceStepProps) {
  const [localData, setLocalData] = useState({
    experiences: formData.experiences || [],
  });

  const [newExperience, setNewExperience] = useState<Partial<Experience>>({
    title: "",
    company_name: "",
    location: "",
    is_current: false,
    start_date: "",
    end_date: "",
    description: "",
  });

  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    onFormDataChange(localData);
  }, [localData]);

  const handleAddExperience = () => {
    if (newExperience.title && newExperience.company_name) {
      setLocalData(prev => ({
        ...prev,
        experiences: [...prev.experiences, { ...newExperience, id: Date.now().toString() }],
      }));
      setNewExperience({
        title: "",
        company_name: "",
        location: "",
        is_current: false,
        start_date: "",
        end_date: "",
        description: "",
      });
      setShowAddForm(false);
    }
  };

  const handleRemoveExperience = (index: number) => {
    setLocalData(prev => ({
      ...prev,
      experiences: prev.experiences.filter((_, i) => i !== index),
    }));
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
    });
  };

  const calculateDuration = (startDate: string, endDate: string, isCurrent: boolean) => {
    if (!startDate) return "";

    const start = new Date(startDate);
    const end = isCurrent ? new Date() : new Date(endDate);

    const months =
      (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());

    if (months < 12) {
      return `${months} month${months !== 1 ? "s" : ""}`;
    }

    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;

    if (remainingMonths === 0) {
      return `${years} year${years !== 1 ? "s" : ""}`;
    }

    return `${years} year${years !== 1 ? "s" : ""} ${remainingMonths} month${
      remainingMonths !== 1 ? "s" : ""
    }`;
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Work Experience
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Add your professional work experience and career history
        </p>
      </div>

      {/* Experience List */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Professional Experience
          </h3>
          <Button variant="outline" size="sm" onClick={() => setShowAddForm(!showAddForm)}>
            <PlusIcon className="h-4 w-4 mr-2" />
            Add Experience
          </Button>
        </div>

        {/* Existing Experience */}
        <div className="space-y-4 mb-4">
          {localData.experiences.map((experience, index) => (
            <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <BriefcaseIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      {experience.title}
                    </h4>
                    {experience.is_current && (
                      <Badge
                        variant="secondary"
                        className="bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300"
                      >
                        Current
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    {experience.company_name}
                  </p>
                  <div className="flex flex-wrap gap-4 text-xs text-gray-500 dark:text-gray-400 mb-2">
                    <div className="flex items-center gap-1">
                      <CalendarIcon className="h-3 w-3" />
                      <span>
                        {formatDate(experience.start_date)} -{" "}
                        {experience.is_current ? "Present" : formatDate(experience.end_date)}
                      </span>
                    </div>
                    <div>
                      {calculateDuration(
                        experience.start_date,
                        experience.end_date,
                        experience.is_current
                      )}
                    </div>
                    {experience.location && (
                      <div className="flex items-center gap-1">
                        <MapPinIcon className="h-3 w-3" />
                        <span>{experience.location}</span>
                      </div>
                    )}
                  </div>
                  {experience.description && (
                    <p className="text-sm text-gray-700 dark:text-gray-300 mt-2">
                      {experience.description}
                    </p>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveExperience(index)}
                  className="text-red-600 hover:text-red-800"
                >
                  <XIcon className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Add Experience Form */}
        {showAddForm && (
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-800">
            <h4 className="font-medium text-gray-900 dark:text-white mb-4">Add New Experience</h4>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Job Title *
                  </label>
                  <Input
                    value={newExperience.title}
                    onChange={e => setNewExperience(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="e.g., Senior Accountant, Tax Consultant"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Company Name *
                  </label>
                  <Input
                    value={newExperience.company_name}
                    onChange={e =>
                      setNewExperience(prev => ({ ...prev, company_name: e.target.value }))
                    }
                    placeholder="Enter company name"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Location
                </label>
                <Input
                  value={newExperience.location}
                  onChange={e => setNewExperience(prev => ({ ...prev, location: e.target.value }))}
                  placeholder="e.g., Mumbai, Maharashtra"
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Currently Working Here
                  </label>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Check if this is your current position
                  </p>
                </div>
                <Switch
                  checked={newExperience.is_current}
                  onCheckedChange={checked =>
                    setNewExperience(prev => ({ ...prev, is_current: checked }))
                  }
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Start Date
                  </label>
                  <Input
                    type="date"
                    value={newExperience.start_date}
                    onChange={e =>
                      setNewExperience(prev => ({ ...prev, start_date: e.target.value }))
                    }
                  />
                </div>
                {!newExperience.is_current && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      End Date
                    </label>
                    <Input
                      type="date"
                      value={newExperience.end_date}
                      onChange={e =>
                        setNewExperience(prev => ({ ...prev, end_date: e.target.value }))
                      }
                    />
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Job Description
                </label>
                <Textarea
                  value={newExperience.description}
                  onChange={e =>
                    setNewExperience(prev => ({ ...prev, description: e.target.value }))
                  }
                  placeholder="Describe your role, responsibilities, and achievements..."
                  rows={3}
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleAddExperience} size="sm">
                  Add Experience
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
