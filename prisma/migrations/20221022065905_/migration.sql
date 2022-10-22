-- CreateTable
CREATE TABLE "planets" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "mass" DOUBLE PRECISION NOT NULL,
    "hasStation" BOOLEAN NOT NULL,

    CONSTRAINT "planets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stations" (
    "id" SERIAL NOT NULL,
    "planetID" INTEGER NOT NULL,
    "isRecharging" BOOLEAN NOT NULL,
    "rechargeEnds" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "stations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "refills" (
    "id" SERIAL NOT NULL,
    "userID" INTEGER NOT NULL,
    "stationID" INTEGER NOT NULL,
    "startRecharge" DOUBLE PRECISION NOT NULL,
    "endRecharge" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "refills_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- AddForeignKey
ALTER TABLE "stations" ADD CONSTRAINT "stations_planetID_fkey" FOREIGN KEY ("planetID") REFERENCES "planets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "refills" ADD CONSTRAINT "refills_userID_fkey" FOREIGN KEY ("userID") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "refills" ADD CONSTRAINT "refills_stationID_fkey" FOREIGN KEY ("stationID") REFERENCES "stations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
