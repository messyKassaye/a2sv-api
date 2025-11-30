-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "display" TEXT,
ADD COLUMN     "model" TEXT;

-- CreateTable
CREATE TABLE "Visitors" (
    "id" TEXT NOT NULL,
    "totalVisitors" INTEGER NOT NULL,

    CONSTRAINT "Visitors_pkey" PRIMARY KEY ("id")
);
