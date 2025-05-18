import { Card } from "@/ui/Card.ui";
import { Input } from "@/ui/Input.ui";
import { Textarea } from "@/ui/Textarea.ui";
import { MapPin } from "@phosphor-icons/react";

interface AddressFormProps {
  formData: {
    address?: string;
    city?: string;
    state?: string;
    pincode?: string;
    [key: string]: any; // Allow other form data fields
  };
  onFormDataChange: (data: Partial<AddressFormProps['formData']>) => void;
  validationErrors: {
    address?: string;
    city?: string;
    state?: string;
    pincode?: string;
  };
}

export function AddressForm({ formData, onFormDataChange, validationErrors }: AddressFormProps) {
  const handleInputChange = (field: keyof AddressFormProps['formData'], value: string) => {
    // Create a new object with all existing form data
    const updatedData = { ...formData };
    // Update only the specific field
    updatedData[field] = value;
    // Pass the complete updated data
    onFormDataChange(updatedData);
  };

  return (
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
        {/* Address */}
        <div className="sm:col-span-2">
          <label className="flex items-center gap-2 text-sm font-medium mb-2">
            <MapPin size={16} /> Address <span className="text-red-500">*</span>
          </label>
          <Textarea
            placeholder="Enter your complete address"
            value={formData.address || ""}
            onChange={e => handleInputChange('address', e.target.value)}
            required
            className={`min-h-[80px] ${validationErrors.address ? "border-red-500" : ""}`}
          />
          {validationErrors.address && (
            <p className="text-xs text-red-500 mt-1">{validationErrors.address}</p>
          )}
        </div>

        {/* City */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium mb-2">
            <MapPin size={16} /> City <span className="text-red-500">*</span>
          </label>
          <Input
            placeholder="Enter your city"
            value={formData.city || ""}
            onChange={e => handleInputChange('city', e.target.value)}
            required
            className={validationErrors.city ? "border-red-500" : ""}
          />
          {validationErrors.city && (
            <p className="text-xs text-red-500 mt-1">{validationErrors.city}</p>
          )}
        </div>

        {/* State */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium mb-2">
            <MapPin size={16} /> State <span className="text-red-500">*</span>
          </label>
          <Input
            placeholder="Enter your state"
            value={formData.state || ""}
            onChange={e => handleInputChange('state', e.target.value)}
            required
            className={validationErrors.state ? "border-red-500" : ""}
          />
          {validationErrors.state && (
            <p className="text-xs text-red-500 mt-1">{validationErrors.state}</p>
          )}
        </div>

        {/* Pincode */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium mb-2">
            <MapPin size={16} /> Pincode <span className="text-red-500">*</span>
          </label>
          <Input
            placeholder="Enter your pincode"
            value={formData.pincode || ""}
            onChange={e => handleInputChange('pincode', e.target.value)}
            required
            className={validationErrors.pincode ? "border-red-500" : ""}
          />
          {validationErrors.pincode && (
            <p className="text-xs text-red-500 mt-1">{validationErrors.pincode}</p>
          )}
        </div>
      </div>
    </Card>
  );
} 