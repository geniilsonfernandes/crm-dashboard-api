/*
  Warnings:

  - The primary key for the `imports` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `subscriptions` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[id]` on the table `imports` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id]` on the table `subscriptions` will be added. If there are existing duplicate values, this will fail.
  - Made the column `import_id` on table `subscriptions` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "subscriptions" DROP CONSTRAINT "subscriptions_import_id_fkey";

-- AlterTable
ALTER TABLE "imports" DROP CONSTRAINT "imports_pkey",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "deleted_at" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "subscriptions" DROP CONSTRAINT "subscriptions_pkey",
ADD COLUMN     "importsId" TEXT,
ALTER COLUMN "import_id" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "imports_id_key" ON "imports"("id");

-- CreateIndex
CREATE UNIQUE INDEX "subscriptions_id_key" ON "subscriptions"("id");

-- AddForeignKey
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_importsId_fkey" FOREIGN KEY ("importsId") REFERENCES "imports"("id") ON DELETE SET NULL ON UPDATE CASCADE;
