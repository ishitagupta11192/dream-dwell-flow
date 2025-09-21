const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// In-memory database (replace with DynamoDB in production)
let properties = [
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
    description: "Beautiful modern home with stunning architecture",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    userId: "demo-user"
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
    description: "Luxury apartment in the heart of the city",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    userId: "demo-user"
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
    description: "Perfect family home in quiet neighborhood",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    userId: "demo-user"
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
    description: "Stunning villa with panoramic ocean views",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    userId: "demo-user"
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
    description: "Affordable studio apartment near university",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    userId: "demo-user"
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
    description: "Charming historic home with modern updates",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    userId: "demo-user"
  }
];

// Routes

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Real Estate API is running' });
});

// Get all properties with optional filtering
app.get('/properties', (req, res) => {
  try {
    let filteredProperties = [...properties];
    
    // Apply filters
    if (req.query.type) {
      filteredProperties = filteredProperties.filter(p => p.type === req.query.type);
    }
    if (req.query.minPrice) {
      filteredProperties = filteredProperties.filter(p => p.price >= parseInt(req.query.minPrice));
    }
    if (req.query.maxPrice) {
      filteredProperties = filteredProperties.filter(p => p.price <= parseInt(req.query.maxPrice));
    }
    if (req.query.minBedrooms) {
      filteredProperties = filteredProperties.filter(p => p.bedrooms >= parseInt(req.query.minBedrooms));
    }
    if (req.query.maxBedrooms) {
      filteredProperties = filteredProperties.filter(p => p.bedrooms <= parseInt(req.query.maxBedrooms));
    }
    if (req.query.location) {
      filteredProperties = filteredProperties.filter(p => 
        p.location.toLowerCase().includes(req.query.location.toLowerCase())
      );
    }
    
    res.json(filteredProperties);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch properties' });
  }
});

// Get single property
app.get('/properties/:id', (req, res) => {
  try {
    const property = properties.find(p => p.id === req.params.id);
    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }
    res.json(property);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch property' });
  }
});

// Create new property
app.post('/properties', (req, res) => {
  try {
    const newProperty = {
      id: uuidv4(),
      ...req.body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      userId: 'demo-user' // In real app, get from JWT token
    };
    
    properties.push(newProperty);
    res.status(201).json(newProperty);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create property' });
  }
});

// Update property
app.put('/properties/:id', (req, res) => {
  try {
    const propertyIndex = properties.findIndex(p => p.id === req.params.id);
    if (propertyIndex === -1) {
      return res.status(404).json({ error: 'Property not found' });
    }
    
    properties[propertyIndex] = {
      ...properties[propertyIndex],
      ...req.body,
      id: req.params.id, // Ensure ID doesn't change
      updatedAt: new Date().toISOString()
    };
    
    res.json(properties[propertyIndex]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update property' });
  }
});

// Delete property
app.delete('/properties/:id', (req, res) => {
  try {
    const propertyIndex = properties.findIndex(p => p.id === req.params.id);
    if (propertyIndex === -1) {
      return res.status(404).json({ error: 'Property not found' });
    }
    
    properties.splice(propertyIndex, 1);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete property' });
  }
});

// Image upload endpoint (mock)
app.post('/upload', (req, res) => {
  try {
    const { fileName, fileType } = req.body;
    
    // In a real app, this would generate a pre-signed URL for S3
    const mockImageUrl = `https://images.unsplash.com/photo-${Math.random().toString(36).substr(2, 9)}?w=600&h=400&fit=crop`;
    
    res.json({
      uploadUrl: `https://mock-upload-url.com/upload/${fileName}`,
      imageUrl: mockImageUrl
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate upload URL' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Real Estate API server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🏠 Properties API: http://localhost:${PORT}/properties`);
});
