/*
  Warnings:

  - You are about to drop the column `importsId` on the `subscriptions` table. All the data in the column will be lost.
  - You are about to drop the column `nex_cycle` on the `subscriptions` table. All the data in the column will be lost.
  - Added the required column `name` to the `imports` table without a default value. This is not possible if the table is not empty.
  - Added the required column `next_cycle` to the `subscriptions` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "subscriptions" DROP CONSTRAINT "subscriptions_importsId_fkey";

-- AlterTable
ALTER TABLE "imports" ADD COLUMN     "name" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "subscriptions" DROP COLUMN "importsId",
DROP COLUMN "nex_cycle",
ADD COLUMN     "next_cycle" TEXT NOT NULL;
