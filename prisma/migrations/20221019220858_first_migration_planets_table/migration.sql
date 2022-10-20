-- CreateTable
CREATE TABLE "planets" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "mass" INTEGER NOT NULL,
    "hasStation" BOOLEAN NOT NULL,

    CONSTRAINT "planets_pkey" PRIMARY KEY ("id")
);
