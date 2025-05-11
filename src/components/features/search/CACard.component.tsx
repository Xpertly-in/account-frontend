import { Card } from "@/ui/Card.ui";
import { useRouter } from "next/navigation";
import { Camera, MapPin, Briefcase, Star } from "@phosphor-icons/react";

interface CACardProps {
  ca: {
    id: string;
    name: string;
    profile_picture: string;
    about: string;
    years_of_experience: number;
    city: string;
    state: string;
    areas_of_expertise: string;
    rating?: number;
  };
}

export function CACard({ ca }: CACardProps) {
  const router = useRouter();

  return (
    <Card 
      className="p-4 hover:shadow-lg transition-all cursor-pointer"
      onClick={() => router.push(`/ca/${ca.id}`)}
    >
      <div className="flex gap-4">
        {/* Profile Image */}
        <div className="w-20 h-20 rounded-full overflow-hidden bg-muted flex-shrink-0">
          {ca.profile_picture ? (
            <img
              src={ca.profile_picture}
              alt={ca.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-primary/10">
              <Camera size={24} className="text-primary" />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="font-semibold text-lg truncate">{ca.name}</h3>
              <p className="text-sm text-muted-foreground">
                {ca.years_of_experience} years of experience
              </p>
            </div>
            {ca.rating && (
              <div className="flex items-center gap-1 text-amber-500">
                <Star size={16} weight="fill" />
                <span className="text-sm font-medium">{ca.rating.toFixed(1)}</span>
              </div>
            )}
          </div>

          <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin size={16} />
            <span className="truncate">
              {ca.city}, {ca.state}
            </span>
          </div>

          <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
            <Briefcase size={16} />
            <span className="truncate">
              {ca.areas_of_expertise}
            </span>
          </div>

          <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
            {ca.about}
          </p>
        </div>
      </div>
    </Card>
  );
} 