"use client";
import { Card } from "@/ui/Card.ui";
import { Input } from "@/ui/Input.ui";
import { Textarea } from "@/ui/Textarea.ui";
import { MapPin } from "@phosphor-icons/react";

export default function CustomerAddressForm({ formData, setFormData, errors, setErrors }: any) {
  const handleInputChange = (field: string, value: string) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
  };
  return (
    <Card className="mb-8 border-0 shadow-none">
    
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Address */}
        <div className="sm:col-span-2">
          <label className="flex items-center gap-2 text-sm font-medium mb-2">
            <MapPin size={16} /> Address
          </label>
          <Textarea
            placeholder="Enter your complete address"
            value={formData.address || ""}
            onChange={e => handleInputChange('address', e.target.value)}
            className={`min-h-[80px] ${errors.address ? "border-red-500" : ""}`}
          />
          {errors.address && (
            <p className="text-xs text-red-500 mt-1">{errors.address}</p>
          )}
        </div>
        {/* City */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium mb-2">
            <MapPin size={16} /> City
          </label>
          <Input
            placeholder="Enter your city"
            value={formData.city || ""}
            onChange={e => handleInputChange('city', e.target.value)}
            className={errors.city ? "border-red-500" : ""}
          />
          {errors.city && (
            <p className="text-xs text-red-500 mt-1">{errors.city}</p>
          )}
        </div>
        {/* State */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium mb-2">
            <MapPin size={16} /> State
          </label>
          <Input
            placeholder="Enter your state"
            value={formData.state || ""}
            onChange={e => handleInputChange('state', e.target.value)}
            className={errors.state ? "border-red-500" : ""}
          />
          {errors.state && (
            <p className="text-xs text-red-500 mt-1">{errors.state}</p>
          )}
        </div>
        {/* Pincode */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium mb-2">
            <MapPin size={16} /> Pincode
          </label>
          <Input
            placeholder="Enter your pincode"
            value={formData.pincode || ""}
            onChange={e => handleInputChange('pincode', e.target.value)}
            className={errors.pincode ? "border-red-500" : ""}
          />
          {errors.pincode && (
            <p className="text-xs text-red-500 mt-1">{errors.pincode}</p>
          )}
        </div>
      </div>
    </Card>
  );
} 