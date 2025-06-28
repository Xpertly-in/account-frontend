import React from "react";
import { Card } from "@/ui/Card.ui";
import { Badge } from "@/ui/Badge.ui";
import { Avatar } from "@/ui/Avatar.ui";
import {
  CheckCircle,
  MapPin,
  Star,
  Calendar,
  Users,
  Globe,
  LinkedinLogo,
} from "@phosphor-icons/react";

interface CAContactSidebarProps {
  ca: {
    id: string;
    name: string;
    email: string;
    phone?: string;
    profile_picture?: string;
    about?: string;
    years_of_experience?: number;
    is_verified?: boolean;
    location: string;
    specialization: string[];
    services: string[];
    rating?: number;
    clients?: string;
    member_since?: string;
    website?: string;
    linkedin?: string;
  };
}

export const CAContactSidebar: React.FC<CAContactSidebarProps> = ({ ca }) => {
  const {
    name,
    profile_picture,
    about,
    years_of_experience,
    is_verified: verified,
    location,
    specialization,
    services,
    rating,
    clients,
    member_since,
    website,
    linkedin,
  } = ca;

  const profilePicture = profile_picture || undefined;

  return (
    <div className="space-y-6">
      {/* CA Profile Card */}
      <Card className="p-6">
        <div className="text-center">
          {verified && (
            <Badge variant="replied" className="mb-2">
              <CheckCircle className="h-3 w-3 mr-1" />
              Verified CA
            </Badge>
          )}

          <div className="flex justify-center mb-4">
            <Avatar
              src={profilePicture}
              alt={name}
              name={name}
              size="lg"
              className="h-16 w-16 sm:h-20 sm:w-20"
            />
          </div>

          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{name}</h2>

          {location && (
            <div className="flex items-center justify-center text-gray-600 dark:text-gray-400 mb-4">
              <MapPin className="h-4 w-4 mr-1" />
              <span className="text-sm">{location}</span>
            </div>
          )}

          {about && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">{about}</p>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          {rating && (
            <div className="text-center">
              <div className="flex items-center justify-center mb-1">
                <Star className="h-4 w-4 text-yellow-500 mr-1" weight="fill" />
                <span className="text-lg font-semibold text-gray-900 dark:text-white">
                  {rating}
                </span>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400">Rating</p>
            </div>
          )}

          {years_of_experience && (
            <div className="text-center">
              <div className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                {years_of_experience}+
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400">Years Exp.</p>
            </div>
          )}

          {clients && (
            <div className="text-center">
              <div className="flex items-center justify-center mb-1">
                <Users className="h-4 w-4 text-blue-600 dark:text-blue-400 mr-1" />
                <span className="text-lg font-semibold text-gray-900 dark:text-white">
                  {clients}
                </span>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400">Clients</p>
            </div>
          )}

          {member_since && (
            <div className="text-center">
              <div className="flex items-center justify-center mb-1">
                <Calendar className="h-4 w-4 text-green-600 dark:text-green-400 mr-1" />
                <span className="text-lg font-semibold text-gray-900 dark:text-white">
                  {member_since}
                </span>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400">Member Since</p>
            </div>
          )}
        </div>

        {/* Social Links */}
        {(website || linkedin) && (
          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex justify-center space-x-3">
              {website && (
                <a
                  href={website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  <Globe className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                </a>
              )}
              {linkedin && (
                <a
                  href={linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  <LinkedinLogo className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </a>
              )}
            </div>
          </div>
        )}
      </Card>

      {/* Specializations */}
      {specialization && specialization.length > 0 && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Specializations
          </h3>
          <div className="flex flex-wrap gap-2">
            {specialization.map((spec, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {spec.trim()}
              </Badge>
            ))}
          </div>
        </Card>
      )}

      {/* Services */}
      {services && services.length > 0 && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Services Offered
          </h3>
          <div className="space-y-2">
            {services.slice(0, 6).map((service, index) => (
              <div
                key={index}
                className="flex items-center text-sm text-gray-600 dark:text-gray-400"
              >
                <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400 mr-2 flex-shrink-0" />
                {service}
              </div>
            ))}
            {services.length > 6 && (
              <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                +{services.length - 6} more services
              </p>
            )}
          </div>
        </Card>
      )}
    </div>
  );
};
