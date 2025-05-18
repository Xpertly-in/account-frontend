export interface FormField {
  id: string;
  type: "text" | "textarea" | "select" | "date" | "switch";
  label: string;
  placeholder: string;
  required: boolean;
  options?: Array<{
    value: string;
    label: string;
  }>;
}

export const experienceConfig = {
  fields: [
    {
      id: "title",
      type: "text" as const,
      label: "Job Title",
      placeholder: "Enter your job title",
      required: true,
    },
    {
      id: "companyName",
      type: "text" as const,
      label: "Company Name",
      placeholder: "Enter company name",
      required: true,
    },
    {
      id: "location",
      type: "text" as const,
      label: "Location",
      placeholder: "Enter work location",
      required: true,
    },
    {
      id: "employmentType",
      type: "select" as const,
      label: "Employment Type",
      placeholder: "Select employment type",
      required: true,
      options: [
        { value: "full-time", label: "Full Time" },
        { value: "part-time", label: "Part Time" },
        { value: "contract", label: "Contract" },
        { value: "freelance", label: "Freelance" },
        { value: "internship", label: "Internship" },
      ],
    },
    {
      id: "startDate",
      type: "date" as const,
      label: "Start Date",
      placeholder: "Select start date",
      required: true,
    },
    {
      id: "endDate",
      type: "date" as const,
      label: "End Date",
      placeholder: "Select end date",
      required: true,
    },
    {
      id: "isCurrent",
      type: "switch" as const,
      label: "I currently work here",
      placeholder: "",
      required: false,
    },
    {
      id: "industry",
      type: "text" as const,
      label: "Industry",
      placeholder: "Enter industry",
      required: true,
    },
    {
      id: "recentService",
      type: "text" as const,
      label: "Recent Service",
      placeholder: "Enter recent service",
      required: true,
    },
    {
      id: "description",
      type: "textarea" as const,
      label: "Description",
      placeholder: "Describe your responsibilities and achievements",
      required: false,
    },
  ],
};

export const educationConfig = {
  fields: [
    {
      id: "degree",
      type: "text" as const,
      label: "Degree",
      placeholder: "Enter your degree",
      required: true,
    },
    {
      id: "instituteName",
      type: "text" as const,
      label: "Institute Name",
      placeholder: "Enter institute name",
      required: true,
    },
    {
      id: "fieldOfStudy",
      type: "text" as const,
      label: "Field of Study",
      placeholder: "Enter field of study",
      required: true,
    },
    {
      id: "startDate",
      type: "date" as const,
      label: "Start Date",
      placeholder: "Select start date",
      required: true,
    },
    {
      id: "endDate",
      type: "date" as const,
      label: "End Date",
      placeholder: "Select end date",
      required: true,
    },
    {
      id: "isCurrent",
      type: "switch" as const,
      label: "I am currently studying here",
      placeholder: "",
      required: false,
    },
    {
      id: "grade",
      type: "text" as const,
      label: "Grade",
      placeholder: "Enter your grade",
      required: false,
    },
    {
      id: "description",
      type: "textarea" as const,
      label: "Description",
      placeholder: "Describe your education experience",
      required: false,
    },
  ],
};

export const servicesConfig = {
  fields: [
    {
      id: "name",
      type: "text" as const,
      label: "Service Name",
      placeholder: "Enter service name",
      required: true,
    },
    {
      id: "description",
      type: "textarea" as const,
      label: "Description",
      placeholder: "Describe your service",
      required: true,
    },
    {
      id: "price",
      type: "text" as const,
      label: "Price",
      placeholder: "Enter service price",
      required: true,
    },
    {
      id: "duration",
      type: "text" as const,
      label: "Duration",
      placeholder: "Enter service duration",
      required: true,
    },
  ],
}; 