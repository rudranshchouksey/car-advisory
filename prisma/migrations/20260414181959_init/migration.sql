-- CreateTable
CREATE TABLE "Car" (
    "id" SERIAL NOT NULL,
    "make" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "variant" TEXT,
    "year" INTEGER NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "fuelType" TEXT NOT NULL,
    "transmission" TEXT NOT NULL,
    "mileageKmpl" DOUBLE PRECISION,
    "seatingCap" INTEGER,
    "bodyType" TEXT,
    "safetyRating" DOUBLE PRECISION,
    "engineCC" INTEGER,
    "features" TEXT,
    "useCase" TEXT,

    CONSTRAINT "Car_pkey" PRIMARY KEY ("id")
);
