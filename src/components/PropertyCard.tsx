import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Bed, Bath, Square, Heart, Share2 } from "lucide-react";

export interface Property {
  id: string;
  title: string;
  price: number;
  location: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  image: string;
  type: "sale" | "rent";
  featured?: boolean;
  description?: string;
}

interface PropertyCardProps {
  property: Property;
}

const PropertyCard = ({ property }: PropertyCardProps) => {
  const formatPrice = (price: number, type: "sale" | "rent") => {
    const formatted = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
    
    return type === "rent" ? `${formatted}/month` : formatted;
  };

  return (
    <Card className="group hover:shadow-card-hover transition-all duration-300 overflow-hidden bg-gradient-card border-0">
      <div className="relative">
        <div className="aspect-[4/3] overflow-hidden">
          <img
            src={property.image}
            alt={property.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        
        {/* Status Badge */}
        <Badge 
          className={`absolute top-3 left-3 ${
            property.type === "sale" 
              ? "bg-real-estate-success text-white" 
              : "bg-real-estate-warning text-white"
          }`}
        >
          For {property.type === "sale" ? "Sale" : "Rent"}
        </Badge>
        
        {/* Featured Badge */}
        {property.featured && (
          <Badge className="absolute top-3 right-3 bg-real-estate-primary text-real-estate-primary-foreground">
            Featured
          </Badge>
        )}
        
        {/* Action Buttons */}
        <div className="absolute top-3 right-3 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Button size="icon" variant="secondary" className="w-8 h-8 bg-white/90 hover:bg-white">
            <Heart className="w-4 h-4" />
          </Button>
          <Button size="icon" variant="secondary" className="w-8 h-8 bg-white/90 hover:bg-white">
            <Share2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
      
      <div className="p-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-foreground group-hover:text-real-estate-primary transition-colors">
            {property.title}
          </h3>
          <span className="text-xl font-bold text-real-estate-primary">
            {formatPrice(property.price, property.type)}
          </span>
        </div>
        
        <div className="flex items-center text-muted-foreground mb-4">
          <MapPin className="w-4 h-4 mr-1" />
          <span className="text-sm">{property.location}</span>
        </div>
        
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <div className="flex items-center">
              <Bed className="w-4 h-4 mr-1" />
              <span>{property.bedrooms}</span>
            </div>
            <div className="flex items-center">
              <Bath className="w-4 h-4 mr-1" />
              <span>{property.bathrooms}</span>
            </div>
            <div className="flex items-center">
              <Square className="w-4 h-4 mr-1" />
              <span>{property.area} sq ft</span>
            </div>
          </div>
        </div>
        
        <Button asChild className="w-full bg-real-estate-primary hover:bg-real-estate-primary/90">
          <Link to={`/property/${property.id}`}>
            View Details
          </Link>
        </Button>
      </div>
    </Card>
  );
};

export default PropertyCard;