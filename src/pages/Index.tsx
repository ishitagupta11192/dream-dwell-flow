import { useState } from "react";
import Navbar from "@/components/Navbar";
import SearchForm, { SearchFilters } from "@/components/SearchForm";
import PropertyCard, { Property } from "@/components/PropertyCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, TrendingUp, Shield, Award, Users } from "lucide-react";

// Mock data for properties
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
    description: "Beautiful modern home with stunning architecture"
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
    description: "Luxury apartment in the heart of the city"
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
    description: "Perfect family home in quiet neighborhood"
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
    description: "Stunning villa with panoramic ocean views"
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
    description: "Affordable studio apartment near university"
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
    description: "Charming historic home with modern updates"
  }
];

const Index = () => {
  const [properties, setProperties] = useState<Property[]>(mockProperties);
  
  const handleSearch = (filters: SearchFilters) => {
    // In a real app, this would make an API call
    console.log("Search filters:", filters);
  };

  const featuredProperties = properties.filter(p => p.featured);
  const stats = [
    { label: "Properties Listed", value: "10,000+", icon: TrendingUp },
    { label: "Happy Clients", value: "5,000+", icon: Users },
    { label: "Years Experience", value: "15+", icon: Award },
    { label: "Trusted Agents", value: "500+", icon: Shield },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-hero text-white py-20 lg:py-32">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Find Your <span className="text-real-estate-accent">Dream Home</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-white/90 max-w-3xl mx-auto">
              Discover the perfect property with our comprehensive real estate platform. 
              From cozy apartments to luxury estates, we have it all.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-real-estate-accent hover:bg-real-estate-accent/90 text-black">
                Browse Properties
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-black">
                List Your Property
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="py-16 bg-real-estate-secondary/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Search Properties</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Use our advanced search to find exactly what you're looking for
            </p>
          </div>
          <SearchForm onSearch={handleSearch} />
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="w-12 h-12 bg-real-estate-primary/10 rounded-full flex items-center justify-center">
                    <stat.icon className="w-6 h-6 text-real-estate-primary" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-foreground mb-2">{stat.value}</div>
                <div className="text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-16 bg-real-estate-secondary/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-4">Featured Properties</h2>
              <p className="text-muted-foreground">
                Handpicked properties that offer exceptional value
              </p>
            </div>
            <Badge className="bg-real-estate-primary text-real-estate-primary-foreground">
              {featuredProperties.length} Featured
            </Badge>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {featuredProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        </div>
      </section>

      {/* Latest Properties */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Latest Properties</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Explore our newest listings across various locations and price ranges
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {properties.slice(0, 6).map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Button size="lg" variant="outline" className="border-real-estate-primary text-real-estate-primary hover:bg-real-estate-primary hover:text-real-estate-primary-foreground">
              View All Properties
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-real-estate-primary text-real-estate-primary-foreground">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Find Your Dream Home?</h2>
          <p className="text-xl mb-8 text-real-estate-primary-foreground/90">
            Join thousands of satisfied customers who found their perfect property with us
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary">
              Get Started Today
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-real-estate-primary">
              Contact Our Agents
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
