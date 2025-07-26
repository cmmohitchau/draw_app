-- CreateEnum
CREATE TYPE "shapes" AS ENUM ('Rectangle', 'Circle', 'Rhombus', 'Triangle', 'Pencil', 'Line', 'Arrow');

-- CreateTable
CREATE TABLE "Shape" (
    "id" SERIAL NOT NULL,
    "RoomId" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "shapes" NOT NULL,
    "x" DOUBLE PRECISION NOT NULL,
    "y" DOUBLE PRECISION NOT NULL,
    "width" DOUBLE PRECISION NOT NULL,
    "height" DOUBLE PRECISION NOT NULL,
    "color" TEXT,
    "pencilPoints" JSONB,

    CONSTRAINT "Shape_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Shape" ADD CONSTRAINT "Shape_RoomId_fkey" FOREIGN KEY ("RoomId") REFERENCES "Room"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Shape" ADD CONSTRAINT "Shape_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
