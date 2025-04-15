/*
  Warnings:

  - The primary key for the `bill` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `kdv_cost` on the `project_expenses` table. All the data in the column will be lost.
  - You are about to drop the column `authorization_ids` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `hash_password` on the `user` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name]` on the table `permissions` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `bill_date` to the `project_expenses` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cost_without_tax` to the `project_expenses` table without a default value. This is not possible if the table is not empty.
  - Added the required column `deduction_kdv_period` to the `project_expenses` table without a default value. This is not possible if the table is not empty.
  - Added the required column `expense_allocation_type_id` to the `project_expenses` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ggb_id` to the `project_expenses` table without a default value. This is not possible if the table is not empty.
  - Added the required column `goods_or_service_tax` to the `project_expenses` table without a default value. This is not possible if the table is not empty.
  - Added the required column `material_count` to the `project_expenses` table without a default value. This is not possible if the table is not empty.
  - Added the required column `material_description` to the `project_expenses` table without a default value. This is not possible if the table is not empty.
  - Added the required column `measurement_type` to the `project_expenses` table without a default value. This is not possible if the table is not empty.
  - Added the required column `return_eligible_transaction_type` to the `project_expenses` table without a default value. This is not possible if the table is not empty.
  - Added the required column `seller_id` to the `project_expenses` table without a default value. This is not possible if the table is not empty.
  - Added the required column `seller_info` to the `project_expenses` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tax_cost` to the `project_expenses` table without a default value. This is not possible if the table is not empty.
  - Added the required column `total_kdv` to the `project_expenses` table without a default value. This is not possible if the table is not empty.
  - Added the required column `total_weight` to the `project_expenses` table without a default value. This is not possible if the table is not empty.
  - Added the required column `upload_kdv_period` to the `project_expenses` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `user` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "project_expenses" DROP CONSTRAINT "project_expenses_bill_id_fkey";

-- AlterTable
ALTER TABLE "bill" DROP CONSTRAINT "bill_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "bill_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "bill_id_seq";

-- AlterTable
ALTER TABLE "project_expenses" DROP COLUMN "kdv_cost",
ADD COLUMN     "bill_date" DATE NOT NULL,
ADD COLUMN     "cost_without_tax" DECIMAL NOT NULL,
ADD COLUMN     "deduction_kdv_period" VARCHAR NOT NULL,
ADD COLUMN     "expense_allocation_type_id" INTEGER NOT NULL,
ADD COLUMN     "ggb_id" VARCHAR NOT NULL,
ADD COLUMN     "goods_or_service_tax" DECIMAL NOT NULL,
ADD COLUMN     "material_count" DECIMAL NOT NULL,
ADD COLUMN     "material_description" VARCHAR NOT NULL,
ADD COLUMN     "measurement_type" "measurement_units" NOT NULL,
ADD COLUMN     "return_eligible_transaction_type" VARCHAR NOT NULL,
ADD COLUMN     "seller_id" VARCHAR NOT NULL,
ADD COLUMN     "seller_info" VARCHAR NOT NULL,
ADD COLUMN     "tax_cost" DECIMAL NOT NULL,
ADD COLUMN     "total_kdv" DECIMAL NOT NULL,
ADD COLUMN     "total_weight" DECIMAL NOT NULL,
ADD COLUMN     "upload_kdv_period" VARCHAR NOT NULL,
ALTER COLUMN "bill_id" SET DATA TYPE VARCHAR;

-- AlterTable
ALTER TABLE "user" DROP COLUMN "authorization_ids",
DROP COLUMN "hash_password",
ADD COLUMN     "password" VARCHAR NOT NULL,
ADD COLUMN     "permissions" INTEGER[],
ADD COLUMN     "roles" INTEGER[];

-- CreateTable
CREATE TABLE "expense_allocation_type" (
    "id" SERIAL NOT NULL,
    "description" VARCHAR NOT NULL,

    CONSTRAINT "expense_allocation_type_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "role" (
    "id" BIGSERIAL NOT NULL,
    "name" VARCHAR,
    "description" VARCHAR,
    "permissions" INTEGER[],

    CONSTRAINT "role_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "role_name_key" ON "role"("name");

-- CreateIndex
CREATE UNIQUE INDEX "permissions_name_key" ON "permissions"("name");

-- AddForeignKey
ALTER TABLE "project_expenses" ADD CONSTRAINT "project_expenses_bill_id_fkey" FOREIGN KEY ("bill_id") REFERENCES "bill"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_expenses" ADD CONSTRAINT "project_expenses_expense_allocation_type_id_fkey" FOREIGN KEY ("expense_allocation_type_id") REFERENCES "expense_allocation_type"("id") ON DELETE NO ACTION ON UPDATE CASCADE;
