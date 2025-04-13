import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPin, Star, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { CAData } from "@/types/ca.type";

interface CACardProps {
  ca: CAData;
}

export function CACard({ ca }: CACardProps) {
  const initials = ca.name
    .split(" ")
    .map(n => n[0])
    .join("")
    .toUpperCase();

  return (
    <Card className="overflow-hidden">
      <CardHeader className="p-6">
        <div className="flex items-start gap-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src={ca.imageUrl} alt={ca.name} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <CardTitle className="text-lg">{ca.name}</CardTitle>
              {ca.verified && (
                <CheckCircle2 className="h-4 w-4 text-accent" aria-label="Verified CA" />
              )}
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <MapPin className="mr-1 h-3 w-3" />
              <span>{ca.location}</span>
            </div>
            <div className="flex items-center">
              <Star className="mr-1 h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-medium">
                {ca.rating} ({ca.reviews} reviews)
              </span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 pt-0">
        <CardDescription className="mb-2">{ca.experience} years experience</CardDescription>
        <div className="flex flex-wrap gap-1">
          {ca.specialization.map(spec => (
            <span
              key={spec}
              className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            >
              {spec}
            </span>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between p-6 pt-0">
        <Button variant="outline" asChild>
          <Link href={`/ca/${ca.id}`}>View Profile</Link>
        </Button>
        <Button asChild>
          <Link href={`/ca/${ca.id}/contact`}>Contact</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
