import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";

const connectionString = `${process.env.DATABASE_URL}`;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.car.deleteMany()

  const cars = [
    // Budget (Under ₹8L)
    { make: 'Maruti', model: 'Alto K10', variant: 'VXI', year: 2024, price: 499000, fuelType: 'Petrol', transmission: 'Manual', mileageKmpl: 24.9, seatingCap: 5, bodyType: 'Hatchback', safetyRating: 3.0, engineCC: 998, features: 'Power Steering,AC,Bluetooth', useCase: 'city' },
    { make: 'Maruti', model: 'WagonR', variant: 'LXI', year: 2024, price: 599000, fuelType: 'Petrol', transmission: 'Manual', mileageKmpl: 24.4, seatingCap: 5, bodyType: 'Hatchback', safetyRating: 3.0, engineCC: 1197, features: 'Height Adjustable Driver Seat,AC,Bluetooth', useCase: 'city' },
    { make: 'Tata', model: 'Tiago', variant: 'XZ+', year: 2024, price: 749000, fuelType: 'Petrol', transmission: 'Manual', mileageKmpl: 19.8, seatingCap: 5, bodyType: 'Hatchback', safetyRating: 4.0, engineCC: 1199, features: 'Touchscreen,Reverse Camera,AC,Bluetooth', useCase: 'city' },
    { make: 'Maruti', model: 'Celerio', variant: 'ZXI', year: 2024, price: 680000, fuelType: 'CNG', transmission: 'Manual', mileageKmpl: 35.6, seatingCap: 5, bodyType: 'Hatchback', safetyRating: 3.0, engineCC: 998, features: 'CNG Factory Fitted,AC,Bluetooth', useCase: 'city' },

    // Mid Range (₹8L - ₹15L)
    { make: 'Maruti', model: 'Brezza', variant: 'ZXI+', year: 2024, price: 1350000, fuelType: 'Petrol', transmission: 'Automatic', mileageKmpl: 17.38, seatingCap: 5, bodyType: 'SUV', safetyRating: 4.0, engineCC: 1462, features: 'Sunroof,360 Camera,HUD,Wireless Charger', useCase: 'city,family' },
    { make: 'Hyundai', model: 'Venue', variant: 'SX(O)', year: 2024, price: 1299000, fuelType: 'Petrol', transmission: 'DCT', mileageKmpl: 18.15, seatingCap: 5, bodyType: 'SUV', safetyRating: 3.0, engineCC: 998, features: 'Sunroof,ADAS,Connected Car,Bose Audio', useCase: 'city,family' },
    { make: 'Tata', model: 'Nexon', variant: 'Creative+', year: 2024, price: 1449000, fuelType: 'Petrol', transmission: 'AMT', mileageKmpl: 17.01, seatingCap: 5, bodyType: 'SUV', safetyRating: 5.0, engineCC: 1199, features: 'Panoramic Sunroof,ADAS,JBL Audio,Ventilated Seats', useCase: 'city,family' },
    { make: 'Kia', model: 'Sonet', variant: 'GTX+', year: 2024, price: 1599000, fuelType: 'Diesel', transmission: 'Automatic', mileageKmpl: 24.1, seatingCap: 5, bodyType: 'SUV', safetyRating: 3.0, engineCC: 1493, features: 'Sunroof,ADAS,Bose Audio,Ventilated Seats', useCase: 'city,highway' },
    { make: 'Honda', model: 'Amaze', variant: 'VX CVT', year: 2024, price: 1050000, fuelType: 'Petrol', transmission: 'CVT', mileageKmpl: 18.6, seatingCap: 5, bodyType: 'Sedan', safetyRating: 4.0, engineCC: 1199, features: 'Touchscreen,Reverse Camera,Lane Watch', useCase: 'city,family' },
    { make: 'Maruti', model: 'Dzire', variant: 'ZXI+', year: 2024, price: 999000, fuelType: 'CNG', transmission: 'Manual', mileageKmpl: 31.12, seatingCap: 5, bodyType: 'Sedan', safetyRating: 3.0, engineCC: 1197, features: 'CNG,Touchscreen,Reverse Camera', useCase: 'city,family' },

    // Upper Mid (₹15L - ₹25L)
    { make: 'Hyundai', model: 'Creta', variant: 'SX Tech', year: 2024, price: 2099000, fuelType: 'Petrol', transmission: 'DCT', mileageKmpl: 16.8, seatingCap: 5, bodyType: 'SUV', safetyRating: 3.0, engineCC: 1482, features: 'Panoramic Sunroof,ADAS,Bose Audio,Ventilated Seats,360 Camera', useCase: 'city,family,highway' },
    { make: 'Kia', model: 'Seltos', variant: 'GTX+ IVT', year: 2024, price: 2199000, fuelType: 'Petrol', transmission: 'IVT', mileageKmpl: 16.5, seatingCap: 5, bodyType: 'SUV', safetyRating: 3.0, engineCC: 1497, features: 'Panoramic Sunroof,ADAS,Bose Audio,HUD', useCase: 'city,highway,family' },
    { make: 'Tata', model: 'Harrier', variant: 'Adventure+', year: 2024, price: 2499000, fuelType: 'Diesel', transmission: 'Automatic', mileageKmpl: 14.6, seatingCap: 5, bodyType: 'SUV', safetyRating: 5.0, engineCC: 1956, features: 'Panoramic Sunroof,ADAS,JBL Audio,TERRAIN Modes', useCase: 'highway,offroad,family' },
    { make: 'MG', model: 'Astor', variant: 'Savvy AI', year: 2024, price: 1999000, fuelType: 'Petrol', transmission: 'CVT', mileageKmpl: 15.84, seatingCap: 5, bodyType: 'SUV', safetyRating: 4.0, engineCC: 1349, features: 'AI Personal Assistant,ADAS,Panoramic Sunroof,360 Camera', useCase: 'city,family' },
    { make: 'Volkswagen', model: 'Taigun', variant: 'GT Plus DSG', year: 2024, price: 2199000, fuelType: 'Petrol', transmission: 'DSG', mileageKmpl: 17.29, seatingCap: 5, bodyType: 'SUV', safetyRating: 5.0, engineCC: 1498, features: 'Sunroof,ADAS,Travel Assist,Connected Car', useCase: 'highway,city' },

    // Premium (₹25L+)
    { make: 'Toyota', model: 'Innova Crysta', variant: 'GX AT', year: 2024, price: 2199000, fuelType: 'Diesel', transmission: 'Automatic', mileageKmpl: 11.0, seatingCap: 8, bodyType: 'MPV', safetyRating: 4.0, engineCC: 2393, features: 'Captain Seats,Cruise Control,7/8 Seater', useCase: 'family,highway' },
    { make: 'Toyota', model: 'Fortuner', variant: 'Legender 4x2 AT', year: 2024, price: 4599000, fuelType: 'Diesel', transmission: 'Automatic', mileageKmpl: 10.02, seatingCap: 7, bodyType: 'SUV', safetyRating: 4.0, engineCC: 2755, features: '4x4,KDSS,JBL Audio,360 Camera,ADAS', useCase: 'offroad,highway,family' },
    { make: 'Mahindra', model: 'XUV700', variant: 'AX7 AWD', year: 2024, price: 2999000, fuelType: 'Diesel', transmission: 'Automatic', mileageKmpl: 13.69, seatingCap: 7, bodyType: 'SUV', safetyRating: 5.0, engineCC: 2184, features: 'ADAS,Panoramic Sunroof,Sony 3D Audio,AWD,TPMS', useCase: 'family,highway,offroad' },
    { make: 'Mahindra', model: 'Scorpio-N', variant: 'Z8 L AWD', year: 2024, price: 2499000, fuelType: 'Diesel', transmission: 'Automatic', mileageKmpl: 13.8, seatingCap: 7, bodyType: 'SUV', safetyRating: 5.0, engineCC: 2184, features: 'AWD,Terrain Modes,Sunroof,Sony Audio,4x4', useCase: 'offroad,highway,family' },

    // Electric
    { make: 'Tata', model: 'Nexon EV', variant: 'Max LR', year: 2024, price: 1999000, fuelType: 'Electric', transmission: 'Automatic', mileageKmpl: 0, seatingCap: 5, bodyType: 'SUV', safetyRating: 5.0, engineCC: 0, features: 'Range 437km,Fast Charging,ADAS,Ventilated Seats,V2L', useCase: 'city,family' },
    { make: 'MG', model: 'ZS EV', variant: 'Excite Pro', year: 2024, price: 2499000, fuelType: 'Electric', transmission: 'Automatic', mileageKmpl: 0, seatingCap: 5, bodyType: 'SUV', safetyRating: 4.0, engineCC: 0, features: 'Range 461km,Fast Charging,Panoramic Sunroof,ADAS', useCase: 'city,highway' },
    { make: 'Hyundai', model: 'Creta Electric', variant: 'Excellence', year: 2024, price: 2299000, fuelType: 'Electric', transmission: 'Automatic', mileageKmpl: 0, seatingCap: 5, bodyType: 'SUV', safetyRating: 5.0, engineCC: 0, features: 'Range 473km,V2L,ADAS,Bose Audio,Panoramic Sunroof', useCase: 'city,family,highway' },
    { make: 'BYD', model: 'Atto 3', variant: 'Standard', year: 2024, price: 3399000, fuelType: 'Electric', transmission: 'Automatic', mileageKmpl: 0, seatingCap: 5, bodyType: 'SUV', safetyRating: 5.0, engineCC: 0, features: 'Range 521km,Fast Charging,Rotating Console,ADAS', useCase: 'city,highway,family' },

    // Hybrid
    { make: 'Maruti', model: 'Grand Vitara', variant: 'Intelligent Hybrid', year: 2024, price: 1999000, fuelType: 'Hybrid', transmission: 'Automatic', mileageKmpl: 27.97, seatingCap: 5, bodyType: 'SUV', safetyRating: 3.0, engineCC: 1490, features: 'Self Charging Hybrid,HUD,Panoramic Sunroof,ADAS', useCase: 'city,highway,family' },
    { make: 'Toyota', model: 'Hyryder', variant: 'e-Drive Hybrid', year: 2024, price: 2099000, fuelType: 'Hybrid', transmission: 'Automatic', mileageKmpl: 27.97, seatingCap: 5, bodyType: 'SUV', safetyRating: 3.0, engineCC: 1490, features: 'Self Charging Hybrid,Sunroof,Connected Car,ADAS', useCase: 'city,highway,family' },

    // 7-Seaters
    { make: 'Kia', model: 'Carens', variant: 'Luxury Plus', year: 2024, price: 1999000, fuelType: 'Diesel', transmission: 'Automatic', mileageKmpl: 19.0, seatingCap: 7, bodyType: 'MPV', safetyRating: 3.0, engineCC: 1493, features: 'Panoramic Sunroof,Bose Audio,ADAS,Captain Seats', useCase: 'family,highway' },
    { make: 'Maruti', model: 'Ertiga', variant: 'ZXI+ AT', year: 2024, price: 1399000, fuelType: 'CNG', transmission: 'Automatic', mileageKmpl: 26.11, seatingCap: 7, bodyType: 'MPV', safetyRating: 3.0, engineCC: 1462, features: 'CNG,7 Seater,Smartplay Studio,Rear AC Vents', useCase: 'family' },
    { make: 'Toyota', model: 'Innova HyCross', variant: 'ZX Hybrid', year: 2024, price: 3599000, fuelType: 'Hybrid', transmission: 'CVT', mileageKmpl: 21.1, seatingCap: 8, bodyType: 'MPV', safetyRating: 4.0, engineCC: 1987, features: 'Hybrid,8 Seater,ADAS,Ottoman Seats,Panoramic Roof', useCase: 'family,highway' },

    // Performance / Fun
    { make: 'Hyundai', model: 'i20 N Line', variant: 'N8 DCT', year: 2024, price: 1299000, fuelType: 'Petrol', transmission: 'DCT', mileageKmpl: 20.35, seatingCap: 5, bodyType: 'Hatchback', safetyRating: 3.0, engineCC: 998, features: 'Sporty Design,Drive Modes,Bose Audio,Sunroof', useCase: 'city' },
    { make: 'Volkswagen', model: 'Polo GT', variant: 'TSI DSG', year: 2023, price: 1099000, fuelType: 'Petrol', transmission: 'DSG', mileageKmpl: 16.47, seatingCap: 5, bodyType: 'Hatchback', safetyRating: 4.0, engineCC: 999, features: 'Sporty,DSG,Cruise Control,Touchscreen', useCase: 'city' },
  ]

  await prisma.car.createMany({ data: cars })
  console.log(`✅ Seeded ${cars.length} cars`)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())