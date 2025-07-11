"use client";
import { useEffect, useState } from "react";
import { Card } from "@/ui/Card.ui";
import { useAuth } from "@/store/context/Auth.provider";
import { supabase } from "@/lib/supabase";
import { CustomerProfile } from "@/types/customer-profile.type";
import { Camera } from "@phosphor-icons/react";
import { toast } from "sonner";

function getInitials(name: string) {
  if (!name) return "";
  return name
    .split(" ")
    .map(n => n[0])
    .join("")
    .toUpperCase();
}

export default function ProfileCard() {
  const { auth } = useAuth();
  const [profile, setProfile] = useState<CustomerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [imageUploading, setImageUploading] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      if (!auth.user?.id) return;
      
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select(`
            id,
            user_id,
            name,
            gender,
            profile_picture,
            phone,
            about,
            type_of_user,
            type_of_communication,
            verification_status,
            created_at,
            updated_at,
            onboarding_completed
          `)
          .eq("user_id", auth.user.id)
          .single();

        if (error) throw error;
        setProfile(data);
      } catch (error) {
        console.error("Error loading profile:", error);
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [auth.user]);

  const calculateCompletionPercentage = (profile: CustomerProfile | null) => {
    if (!profile) return 0;

    const fields = [
      { key: 'name', weight: 2 },
      { key: 'gender', weight: 1 },
      { key: 'phone', weight: 1 },
      { key: 'type_of_user', weight: 1 },
      { key: 'about', weight: 1 },
      { key: 'type_of_communication', weight: 1 },
      { key: 'profile_picture', weight: 1 }
    ];

    let totalWeight = 0;
    let filledWeight = 0;

    fields.forEach(field => {
      totalWeight += field.weight;
      const value = profile[field.key as keyof CustomerProfile];
      
      if (value !== undefined && value !== null && value !== '') {
        filledWeight += field.weight;
      }
    });
    
    return Math.round((filledWeight / totalWeight) * 100);
  };

  const handleProfileImageChange = async (file: File | null) => {
    if (!file || !auth.user?.id) return;
    setImageUploading(true);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${auth.user.id}-${Date.now()}.${fileExt}`;
      const filePath = `profile-images/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, file, {
          upsert: true,
          cacheControl: '3600'
        });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('images')
        .getPublicUrl(filePath);

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ profile_picture: publicUrl })
        .eq('user_id', auth.user.id);

      if (updateError) throw updateError;

      setProfile(prev => prev ? { ...prev, profile_picture: publicUrl } : null);
      toast.success('Profile image updated successfully');
    } catch (error) {
      console.error('Error uploading profile image:', error);
      toast.error('Failed to upload profile image');
    } finally {
      setImageUploading(false);
    }
  };

  if (loading) {
    return (
      <Card className="w-1/3 p-6 animate-pulse">
        <div className="flex flex-col items-center gap-4">
          <div className="w-24 h-24 rounded-full bg-muted" />
          <div className="w-32 h-4 bg-muted rounded" />
          <div className="w-full h-2 bg-muted rounded" />
        </div>
      </Card>
    );
  }

  const completionPercentage = calculateCompletionPercentage(profile);
  const initials = getInitials(profile?.name || "User");

  return (
    <Card className="w-1/3 p-6">
      <div className="flex flex-col items-center gap-4">
        {/* Profile Image */}
        <div className="relative">
          <div className="w-24 h-24 rounded-full overflow-hidden bg-muted flex items-center justify-center text-3xl font-bold text-primary border-2 border-primary/30">
            {profile?.profile_picture ? (
              <img 
                src={profile.profile_picture} 
                alt="Profile" 
                className="object-cover w-full h-full" 
              />
            ) : (
              <span>{initials}</span>
            )}
          </div>
          <button
            type="button"
            className="absolute bottom-0 right-0 bg-primary text-white rounded-full p-2 shadow-lg border-2 border-white hover:bg-primary/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => document.getElementById('profile-image-input')?.click()}
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
            id="profile-image-input"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleProfileImageChange(e.target.files?.[0] || null)}
          />
        </div>

        {/* Name */}
        <div className="text-center">
          <h3 className="text-xl font-semibold">{profile?.name || "User"}</h3>
          <p className="text-sm text-muted-foreground">{profile?.type_of_user || "User"}</p>
        </div>

        {/* Progress Bar */}
        <div className="w-full">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Profile Completion</span>
            <span className="text-sm font-medium">{completionPercentage}%</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full transition-all duration-300"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4 w-full mt-4">
          <div className="text-center p-3 bg-muted/50 rounded-lg">
            <p className="text-sm text-muted-foreground">Phone</p>
            <p className="font-medium">{profile?.phone || "Not set"}</p>
          </div>
          <div className="text-center p-3 bg-muted/50 rounded-lg">
            <p className="text-sm text-muted-foreground">Gender</p>
            <p className="font-medium">{profile?.gender || "Not set"}</p>
          </div>
        </div>
      </div>
    </Card>
  );
} 