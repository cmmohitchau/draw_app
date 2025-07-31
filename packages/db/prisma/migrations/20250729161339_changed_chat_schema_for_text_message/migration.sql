/*
  Warnings:

  - You are about to drop the column `messages` on the `Chat` table. All the data in the column will be lost.
  - Added the required column `color` to the `Chat` table without a default value. This is not possible if the table is not empty.
  - Added the required column `font` to the `Chat` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fontSize` to the `Chat` table without a default value. This is not possible if the table is not empty.
  - Added the required column `x` to the `Chat` table without a default value. This is not possible if the table is not empty.
  - Added the required column `y` to the `Chat` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "size" AS ENUM ('XS', 'S', 'M', 'L', 'XL');

-- AlterTable
ALTER TABLE "Chat" DROP COLUMN "messages",
ADD COLUMN     "color" TEXT NOT NULL,
ADD COLUMN     "font" TEXT NOT NULL,
ADD COLUMN     "fontSize" "size" NOT NULL,
ADD COLUMN     "x" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "y" DOUBLE PRECISION NOT NULL;
