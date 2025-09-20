import { API } from 'aws-amplify';
import { authService } from './auth';

export interface Property {
  id: string;
  title: string;
  price: number;
  location: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  image: string;
  type: 'sale' | 'rent';
  featured?: boolean;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
  userId?: string;
}

export interface CreatePropertyParams {
  title: string;
  price: number;
  location: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  image: string;
  type: 'sale' | 'rent';
  description?: string;
}

export interface UpdatePropertyParams extends Partial<CreatePropertyParams> {
  id: string;
}

export interface SearchFilters {
  type?: 'sale' | 'rent';
  minPrice?: number;
  maxPrice?: number;
  minBedrooms?: number;
  maxBedrooms?: number;
  location?: string;
}

class ApiService {
  private async getAuthHeaders(): Promise<Record<string, string>> {
    try {
      const session = await authService.getCurrentSession();
      if (session) {
        return {
          'Authorization': `Bearer ${session.getIdToken().getJwtToken()}`,
          'Content-Type': 'application/json',
        };
      }
    } catch (error) {
      console.error('Error getting auth headers:', error);
    }
    return {
      'Content-Type': 'application/json',
    };
  }

  async getProperties(filters?: SearchFilters): Promise<Property[]> {
    try {
      const params = new URLSearchParams();
      if (filters?.type) params.append('type', filters.type);
      if (filters?.minPrice) params.append('minPrice', filters.minPrice.toString());
      if (filters?.maxPrice) params.append('maxPrice', filters.maxPrice.toString());
      if (filters?.minBedrooms) params.append('minBedrooms', filters.minBedrooms.toString());
      if (filters?.maxBedrooms) params.append('maxBedrooms', filters.maxBedrooms.toString());
      if (filters?.location) params.append('location', filters.location);

      const queryString = params.toString();
      const url = queryString ? `/properties?${queryString}` : '/properties';

      const response = await fetch(`${import.meta.env.VITE_API_URL}${url}`, {
        method: 'GET',
        headers: await this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching properties:', error);
      throw error;
    }
  }

  async getProperty(id: string): Promise<Property> {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/properties/${id}`, {
        method: 'GET',
        headers: await this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching property:', error);
      throw error;
    }
  }

  async createProperty(property: CreatePropertyParams): Promise<Property> {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/properties`, {
        method: 'POST',
        headers: await this.getAuthHeaders(),
        body: JSON.stringify(property),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating property:', error);
      throw error;
    }
  }

  async updateProperty(property: UpdatePropertyParams): Promise<Property> {
    try {
      const { id, ...updateData } = property;
      const response = await fetch(`${import.meta.env.VITE_API_URL}/properties/${id}`, {
        method: 'PUT',
        headers: await this.getAuthHeaders(),
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating property:', error);
      throw error;
    }
  }

  async deleteProperty(id: string): Promise<void> {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/properties/${id}`, {
        method: 'DELETE',
        headers: await this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error deleting property:', error);
      throw error;
    }
  }

  async uploadImage(file: File): Promise<{ uploadUrl: string; imageUrl: string }> {
    try {
      // First, get a pre-signed URL for upload
      const response = await fetch(`${import.meta.env.VITE_API_URL}/upload`, {
        method: 'POST',
        headers: await this.getAuthHeaders(),
        body: JSON.stringify({
          fileName: file.name,
          fileType: file.type,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const { uploadUrl, imageUrl } = await response.json();

      // Upload the file to S3 using the pre-signed URL
      const uploadResponse = await fetch(uploadUrl, {
        method: 'PUT',
        body: file,
        headers: {
          'Content-Type': file.type,
        },
      });

      if (!uploadResponse.ok) {
        throw new Error('Failed to upload image to S3');
      }

      return { uploadUrl, imageUrl };
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  }
}

export const apiService = new ApiService();
export default apiService;
