import { useState } from "react";
import Navbar from "@/components/Navbar";
import SearchForm, { SearchFilters } from "@/components/SearchForm";
import PropertyCard, { Property } from "@/components/PropertyCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Grid3X3, List, SlidersHorizontal } from "lucide-react";

// Mock data - in real app this would come from API
const mockProperties: Property[] = [
  {
    id: "1",
    title: "Modern Family Home",
    price: 750000,
    location: "Beverly Hills, CA",
    bedrooms: 4,
    bathrooms: 3,
    area: 2500,
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&h=400&fit=crop",
    type: "sale",
    featured: true,
  },
  {
    id: "2",
    title: "Luxury Downtown Apartment",
    price: 3500,
    location: "Manhattan, NY",
    bedrooms: 2,
    bathrooms: 2,
    area: 1200,
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&h=400&fit=crop",
    type: "rent",
  },
  {
    id: "3",
    title: "Cozy Suburban House",
    price: 450000,
    location: "Austin, TX",
    bedrooms: 3,
    bathrooms: 2,
    area: 1800,
    image: "https://images.unsplash.com/photo-1605146769289-440113cc3d00?w=600&h=400&fit=crop",
    type: "sale",
  },
  {
    id: "4",
    title: "Ocean View Villa",
    price: 1200000,
    location: "Malibu, CA",
    bedrooms: 5,
    bathrooms: 4,
    area: 3500,
    image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=600&h=400&fit=crop",
    type: "sale",
    featured: true,
  },
  {
    id: "5",
    title: "Student Studio",
    price: 1200,
    location: "Boston, MA",
    bedrooms: 1,
    bathrooms: 1,
    area: 500,
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&h=400&fit=crop",
    type: "rent",
  },
  {
    id: "6",
    title: "Historic Townhouse",
    price: 650000,
    location: "Charleston, SC",
    bedrooms: 3,
    bathrooms: 3,
    area: 2200,
    image: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=600&h=400&fit=crop",
    type: "sale",
  },
  {
    id: "7",
    title: "Mountain Retreat",
    price: 850000,
    location: "Aspen, CO",
    bedrooms: 4,
    bathrooms: 3,
    area: 2800,
    image: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=600&h=400&fit=crop",
    type: "sale",
  },
  {
    id: "8",
    title: "Urban Loft",
    price: 2800,
    location: "Chicago, IL",
    bedrooms: 2,
    bathrooms: 2,
    area: 1100,
    image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&h=400&fit=crop",
    type: "rent",
  },
];

const Properties = () => {
  const [properties, setProperties] = useState<Property[]>(mockProperties);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const propertiesPerPage = 6;

  const handleSearch = (filters: SearchFilters) => {
    // In a real app, this would make an API call with filters
    console.log("Search filters:", filters);
  };

  const handleSort = (value: string) => {
    setSortBy(value);
    const sorted = [...properties].sort((a, b) => {
      switch (value) {
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "bedrooms":
          return b.bedrooms - a.bedrooms;
        case "area":
          return b.area - a.area;
        default:
          return 0;
      }
    });
    setProperties(sorted);
  };

  const totalPages = Math.ceil(properties.length / propertiesPerPage);
  const startIndex = (currentPage - 1) * propertiesPerPage;
  const endIndex = startIndex + propertiesPerPage;
  const currentProperties = properties.slice(startIndex, endIndex);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Header */}
      <section className="bg-real-estate-secondary/30 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-4">All Properties</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Browse through our extensive collection of properties to find your perfect match
            </p>
          </div>
          <SearchForm onSearch={handleSearch} />
        </div>
      </section>

      {/* Filters and Controls */}
      <section className="py-6 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-4">
              <Badge variant="secondary" className="text-sm">
                {properties.length} Properties Found
              </Badge>
              <Button variant="outline" size="sm">
                <SlidersHorizontal className="w-4 h-4 mr-2" />
                More Filters
              </Button>
            </div>
            
            <div className="flex items-center gap-4">
              <Select value={sortBy} onValueChange={handleSort}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="bedrooms">Most Bedrooms</SelectItem>
                  <SelectItem value="area">Largest Area</SelectItem>
                </SelectContent>
              </Select>
              
              <div className="flex border border-border rounded-md">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="rounded-r-none"
                >
                  <Grid3X3 className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="rounded-l-none"
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Properties Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {currentProperties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          ) : (
            <div className="space-y-6">
              {currentProperties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          )}
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center space-x-2 mt-12">
              <Button
                variant="outline"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                Previous
              </Button>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  onClick={() => setCurrentPage(page)}
                  className="w-10"
                >
                  {page}
                </Button>
              ))}
              
              <Button
                variant="outline"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                Next
              </Button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Properties;