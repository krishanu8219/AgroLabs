export interface FarmerProfile {
  id?: string;
  user_id: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  preferred_language: string;
  created_at?: string;
  updated_at?: string;
}

export interface Farm {
  id?: string;
  user_id: string;
  name: string;
  location: {
    lat: number;
    lng: number;
    address?: string;
  };
  size_acres?: number;
  crop_type: string;
  irrigation_type: string;
  created_at?: string;
  updated_at?: string;
}

export interface Location {
  lat: number;
  lng: number;
  address?: string;
}
