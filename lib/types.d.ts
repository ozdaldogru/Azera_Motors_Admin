type CategoryType = {
  _id: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
}


type DriveTypeType = {
  _id: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
}

type FeatureType = {
  _id: string;
  title: string;
  products: ProductType[];
  createdAt: Date;
  updatedAt: Date;
}

type FuelTypeType = {
  _id: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
}

type MakeType = {
  _id: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
}

type ProductType = {
  _id: string;
  make: string;
  model: string;
  price: number;
  features: FeatureType[];
  numberofowner: number;
  year: number;
  mileage: number;
  driveType: string;
  fuelType: string;
  transmission: string;
  engineSize: number;
  cylinder: number;
  color: string;
  interiorColor: string;
  door: number;
  status: string;
  vin: string;
  history: string;
  description: string;
  media: [string];
  categories: string;
  totalCost: number;
  soldPrice: number;
  soldDate: string;
  createdAt: Date;
  updatedAt: Date;
}

type StatusType = {
  _id: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
}

type TransmissionType = {
  _id: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
}


