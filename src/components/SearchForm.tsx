import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, MapPin, Home, DollarSign } from "lucide-react";

interface SearchFormProps {
  onSearch?: (filters: SearchFilters) => void;
}

export interface SearchFilters {
  location: string;
  propertyType: string;
  priceRange: string;
  bedrooms: string;
}

const SearchForm = ({ onSearch }: SearchFormProps) => {
  const [filters, setFilters] = useState<SearchFilters>({
    location: "",
    propertyType: "",
    priceRange: "",
    bedrooms: "",
  });

  const handleSearch = () => {
    onSearch?.(filters);
  };

  const updateFilter = (key: keyof SearchFilters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-card p-6 border border-border">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Location */}
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Location"
            value={filters.location}
            onChange={(e) => updateFilter("location", e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Property Type */}
        <Select value={filters.propertyType} onValueChange={(value) => updateFilter("propertyType", value)}>
          <SelectTrigger>
            <div className="flex items-center">
              <Home className="w-4 h-4 mr-2 text-muted-foreground" />
              <SelectValue placeholder="Property Type" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="house">House</SelectItem>
            <SelectItem value="apartment">Apartment</SelectItem>
            <SelectItem value="condo">Condo</SelectItem>
            <SelectItem value="townhouse">Townhouse</SelectItem>
            <SelectItem value="villa">Villa</SelectItem>
          </SelectContent>
        </Select>

        {/* Price Range */}
        <Select value={filters.priceRange} onValueChange={(value) => updateFilter("priceRange", value)}>
          <SelectTrigger>
            <div className="flex items-center">
              <DollarSign className="w-4 h-4 mr-2 text-muted-foreground" />
              <SelectValue placeholder="Price Range" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Any Price</SelectItem>
            <SelectItem value="0-250000">$0 - $250k</SelectItem>
            <SelectItem value="250000-500000">$250k - $500k</SelectItem>
            <SelectItem value="500000-750000">$500k - $750k</SelectItem>
            <SelectItem value="750000-1000000">$750k - $1M</SelectItem>
            <SelectItem value="1000000+">$1M+</SelectItem>
          </SelectContent>
        </Select>

        {/* Bedrooms */}
        <Select value={filters.bedrooms} onValueChange={(value) => updateFilter("bedrooms", value)}>
          <SelectTrigger>
            <SelectValue placeholder="Bedrooms" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Any</SelectItem>
            <SelectItem value="1">1+ Bed</SelectItem>
            <SelectItem value="2">2+ Beds</SelectItem>
            <SelectItem value="3">3+ Beds</SelectItem>
            <SelectItem value="4">4+ Beds</SelectItem>
            <SelectItem value="5">5+ Beds</SelectItem>
          </SelectContent>
        </Select>

        {/* Search Button */}
        <Button 
          onClick={handleSearch}
          className="bg-real-estate-primary hover:bg-real-estate-primary/90 text-real-estate-primary-foreground"
        >
          <Search className="w-4 h-4 mr-2" />
          Search
        </Button>
      </div>
    </div>
  );
};

export default SearchForm;