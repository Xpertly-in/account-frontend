import { FormConfig, FormValidationConfig } from '@/types/onboarding.type';

export const onboardingFormConfig: FormConfig = {
  sections: [
    {
      id: 'basic-info',
      title: 'Basic Information',
      subtitle: 'Your personal details',
      order: 1,
      fields: [
        {
          id: 'name',
          type: 'text',
          label: 'Full Name',
          placeholder: 'Enter your full name',
          required: true,
        },
        {
          id: 'gender',
          type: 'select',
          label: 'Gender',
          placeholder: 'Select your gender',
          required: true,
          options: [
            { label: 'Male', value: 'MALE' },
            { label: 'Female', value: 'FEMALE' }
          ]
        },
        {
          id: 'phone',
          type: 'tel',
          label: 'Phone Number',
          placeholder: 'Enter your phone number',
          required: true,
        },
        {
          id: 'about',
          type: 'textarea',
          label: 'About',
          placeholder: 'Write a brief professional description about yourself...',
          required: true,
          description: 'Share your expertise, experience, and what makes you unique as a CA professional',
        },
        {
          id: 'yearsOfExperience',
          type: 'number',
          label: 'Years of Experience',
          placeholder: 'Enter years of experience',
          required: true,
          min: 0,
          max: 50,
        },
      ],
    },
    {
      id: 'services',
      title: 'Services',
      subtitle: 'Add the services you offer to your clients',
      order: 2,
      fields: [
        {
          id: 'serviceSelect',
          type: 'service',
          label: 'Select Services',
          placeholder: 'Search and select services you offer',
          required: true,
          description: 'Add services you specialize in. You can add multiple services.',
          validation: {
            minLength: 1,
            message: 'Please select at least one service',
          },
        },
        {
          id: 'serviceDescription',
          type: 'textarea',
          label: 'Service Description',
          placeholder: 'Describe your expertise in these services...',
          description: 'Provide details about your experience and approach for each service',
          validation: {
            minLength: 50,
            maxLength: 500,
            message: 'Description must be between 50 and 500 characters',
          },
        },
      ],
    },
    {
      id: 'experience',
      title: 'Experience',
      subtitle: 'Add your work experience and highlight a recent service',
      order: 3,
      fields: [
        {
          id: 'companyName',
          type: 'text',
          label: 'Company Name',
          placeholder: 'Enter company name',
          required: true,
          validation: {
            minLength: 2,
            maxLength: 100,
            message: 'Company name must be between 2 and 100 characters',
          },
        },
        {
          id: 'position',
          type: 'text',
          label: 'Position',
          placeholder: 'Enter your position',
          required: true,
          validation: {
            minLength: 2,
            maxLength: 100,
            message: 'Position must be between 2 and 100 characters',
          },
        },
        {
          id: 'startDate',
          type: 'text',
          label: 'Start Date',
          placeholder: 'MM/YYYY',
          required: true,
          validation: {
            pattern: '^(0[1-9]|1[0-2])/(19|20)\\d{2}$',
            message: 'Please enter a valid date in MM/YYYY format',
          },
        },
        {
          id: 'endDate',
          type: 'text',
          label: 'End Date',
          placeholder: 'MM/YYYY or Present',
          validation: {
            pattern: '^(0[1-9]|1[0-2])/(19|20)\\d{2}$|^Present$',
            message: 'Please enter a valid date in MM/YYYY format or "Present"',
          },
        },
        {
          id: 'description',
          type: 'textarea',
          label: 'Description',
          placeholder: 'Describe your responsibilities and achievements...',
          required: true,
          validation: {
            minLength: 50,
            maxLength: 500,
            message: 'Description must be between 50 and 500 characters',
          },
        },
        {
          id: 'recentService',
          type: 'text',
          label: 'Recent Service Highlight',
          placeholder: 'Enter a notable service you provided',
          description: 'Highlight a specific service you provided in this role',
          validation: {
            minLength: 10,
            maxLength: 200,
            message: 'Service highlight must be between 10 and 200 characters',
          },
        },
      ],
    },
    {
      id: 'education',
      title: 'Education',
      subtitle: 'Add your educational background',
      order: 4,
      fields: [
        {
          id: 'instituteName',
          type: 'text',
          label: 'Institute Name',
          placeholder: 'Enter institute name',
          required: true,
          validation: {
            minLength: 2,
            maxLength: 100,
            message: 'Institute name must be between 2 and 100 characters',
          },
        },
        {
          id: 'degree',
          type: 'text',
          label: 'Degree',
          placeholder: 'Enter your degree',
          required: true,
          validation: {
            minLength: 2,
            maxLength: 100,
            message: 'Degree must be between 2 and 100 characters',
          },
        },
        {
          id: 'fieldOfStudy',
          type: 'text',
          label: 'Field of Study',
          placeholder: 'Enter your field of study',
          required: true,
          validation: {
            minLength: 2,
            maxLength: 100,
            message: 'Field of study must be between 2 and 100 characters',
          },
        },
        {
          id: 'startDate',
          type: 'text',
          label: 'Start Date',
          placeholder: 'MM/YYYY',
          required: true,
          validation: {
            pattern: '^(0[1-9]|1[0-2])/(19|20)\\d{2}$',
            message: 'Please enter a valid date in MM/YYYY format',
          },
        },
        {
          id: 'endDate',
          type: 'text',
          label: 'End Date',
          placeholder: 'MM/YYYY or Present',
          validation: {
            pattern: '^(0[1-9]|1[0-2])/(19|20)\\d{2}$|^Present$',
            message: 'Please enter a valid date in MM/YYYY format or "Present"',
          },
        },
        {
          id: 'grade',
          type: 'text',
          label: 'Grade/Score',
          placeholder: 'Enter your grade or score',
          validation: {
            pattern: '^[A-Za-z0-9.]+$',
            message: 'Please enter a valid grade or score',
          },
        },
        {
          id: 'description',
          type: 'textarea',
          label: 'Description',
          placeholder: 'Add any additional details about your education...',
          validation: {
            maxLength: 500,
            message: 'Description must not exceed 500 characters',
          },
        },
      ],
    },
    {
      id: 'address',
      title: 'Address & Location',
      subtitle: 'Your contact and location details',
      order: 5,
      fields: [
        {
          id: 'address',
          type: 'textarea',
          label: 'Address',
          placeholder: 'Enter your office address',
          required: true,
        },
        {
          id: 'city',
          type: 'text',
          label: 'City',
          placeholder: 'Enter your city',
          required: true,
        },
        {
          id: 'state',
          type: 'text',
          label: 'State',
          placeholder: 'Enter your state',
          required: true,
        },
        {
          id: 'pincode',
          type: 'text',
          label: 'Pincode',
          placeholder: 'Enter your pincode',
          required: true,
          validation: {
            pattern: '^[0-9]{6}$',
            message: 'Please enter a valid 6-digit pincode',
          },
        },
      ],
    },
    {
      id: 'social',
      title: 'Social & Online Presence',
      subtitle: 'Share your professional online profiles',
      order: 6,
      fields: [
        {
          id: 'linkedin',
          type: 'url',
          label: 'LinkedIn Profile',
          placeholder: 'https://linkedin.com/in/your-profile',
          description: 'Your professional LinkedIn profile URL',
        },
        {
          id: 'website',
          type: 'url',
          label: 'Professional Website',
          placeholder: 'https://your-website.com',
          description: 'Your personal or firm website',
        },
        {
          id: 'icaiNumber',
          type: 'text',
          label: 'ICAI Membership Number',
          placeholder: 'Enter your ICAI membership number',
          required: true,
        },
        {
          id: 'licenseNumber',
          type: 'text',
          label: 'Practice License Number',
          placeholder: 'Enter your practice license number',
          required: true,
        },
        {
          id: 'professionalEmail',
          type: 'email',
          label: 'Professional Email',
          placeholder: 'your.name@firm.com',
          required: true,
        },
        {
          id: 'professionalPhone',
          type: 'tel',
          label: 'Professional Phone',
          placeholder: 'Office/Professional contact number',
        },
        {
          id: 'expertise',
          type: 'textarea',
          label: 'Areas of Expertise',
          placeholder: 'List your specialized areas of practice (e.g., Tax Planning, Audit, Financial Advisory)',
          description: 'Highlight your key areas of specialization',
        },
      ],
    },
  ],
};

// Add form validation configuration
export const formValidationConfig: FormValidationConfig = {
  'basic-info': {
    name: {
      required: true,
      minLength: 2,
      maxLength: 100,
      message: 'Name must be between 2 and 100 characters',
    },
    phone: {
      required: true,
      pattern: '^[0-9]{10}$',
      message: 'Please enter a valid 10-digit phone number',
    },
    about: {
      required: true,
      minLength: 50,
      maxLength: 1000,
      message: 'About must be between 50 and 1000 characters',
    },
    yearsOfExperience: {
      required: true,
      min: 0,
      max: 50,
      message: 'Years of experience must be between 0 and 50',
    },
  },
  'address': {
    address: {
      required: true,
      minLength: 10,
      maxLength: 200,
      message: 'Address must be between 10 and 200 characters',
    },
    city: {
      required: true,
      minLength: 2,
      maxLength: 50,
      message: 'City must be between 2 and 50 characters',
    },
    state: {
      required: true,
      minLength: 2,
      maxLength: 50,
      message: 'State must be between 2 and 50 characters',
    },
    pincode: {
      required: true,
      pattern: '^[0-9]{6}$',
      message: 'Please enter a valid 6-digit pincode',
    },
  },
  'social': {
    linkedin: {
      pattern: '^https://linkedin.com/in/[a-zA-Z0-9-]+$',
      message: 'Please enter a valid LinkedIn profile URL',
    },
    website: {
      pattern: '^https?://[a-zA-Z0-9-]+(\\.[a-zA-Z0-9-]+)+([/?].*)?$',
      message: 'Please enter a valid website URL',
    },
    icaiNumber: {
      required: true,
      pattern: '^[A-Za-z0-9-]+$',
      message: 'Please enter a valid ICAI membership number',
    },
    licenseNumber: {
      required: true,
      pattern: '^[A-Za-z0-9-]+$',
      message: 'Please enter a valid practice license number',
    },
    professionalEmail: {
      required: true,
      pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$',
      message: 'Please enter a valid email address',
    },
    professionalPhone: {
      pattern: '^[0-9]{10}$',
      message: 'Please enter a valid 10-digit phone number',
    },
    expertise: {
      maxLength: 500,
      message: 'Expertise description must not exceed 500 characters',
    },
  },
}; 