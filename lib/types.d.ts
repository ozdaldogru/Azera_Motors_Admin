type FeatureType = {
  _id: string;
  title: string;
  products: ProductType[];
  createdAt: Date;
  updatedAt: Date;
}


type ProductType = {
  _id: string;
  title: string;
  make: string;
  price: number;
  features: FeatureType[];
  condition: string;
  numberofowner: number;
  year: number;
  mileage: number;
  lowmileage: string;
  driveType: string;
  fuelType: string;
  consumption: number;
  transmission: string;
  engineSize: number;
  cylinder: number;
  color: string;
  interiorColor: string;
  door: number;
  status: string;
  vin:  string;
  history: string;
  description: string;
  media: [string];
  categories: string;
  createdAt: Date;
  updatedAt: Date;
}


