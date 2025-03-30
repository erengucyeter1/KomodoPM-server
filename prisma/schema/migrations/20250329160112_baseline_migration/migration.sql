-- CreateEnum
CREATE TYPE "measurement_units" AS ENUM ('kg', 'meter', 'liter', 'box', 'piece');

-- CreateTable
CREATE TABLE "bill" (
    "id" BIGSERIAL NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "bill_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "material" (
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "measurement_unit" "measurement_units" NOT NULL,
    "stock_code" VARCHAR NOT NULL,
    "description" VARCHAR NOT NULL,
    "balance" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "material_pkey" PRIMARY KEY ("stock_code")
);

-- CreateTable
CREATE TABLE "project_expenses" (
    "id" BIGSERIAL NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "creator_id" BIGINT NOT NULL,
    "bill_id" BIGINT NOT NULL,
    "material_code" VARCHAR NOT NULL,
    "total_cost" DECIMAL NOT NULL,
    "kdv_cost" DECIMAL NOT NULL,
    "project_id" BIGINT NOT NULL,

    CONSTRAINT "project_expenses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "treyler_project" (
    "id" BIGSERIAL NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "creator_id" BIGINT NOT NULL,
    "treyler_type_id" BIGINT NOT NULL,

    CONSTRAINT "treyler_project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "treyler_type" (
    "id" BIGSERIAL NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" VARCHAR NOT NULL,

    CONSTRAINT "treyler_type_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user" (
    "id" BIGSERIAL NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "username" VARCHAR NOT NULL,
    "hash_password" VARCHAR NOT NULL,
    "name" VARCHAR NOT NULL,
    "surname" VARCHAR NOT NULL,
    "email" VARCHAR NOT NULL,
    "authorization_ids" INTEGER[],
    "authorization_rank" INTEGER NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "permissions" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR NOT NULL,
    "description" VARCHAR NOT NULL,

    CONSTRAINT "permissions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_username_key" ON "user"("username");

-- AddForeignKey
ALTER TABLE "project_expenses" ADD CONSTRAINT "project_expenses_bill_id_fkey" FOREIGN KEY ("bill_id") REFERENCES "bill"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_expenses" ADD CONSTRAINT "project_expenses_creator_id_fkey" FOREIGN KEY ("creator_id") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_expenses" ADD CONSTRAINT "project_expenses_material_code_fkey" FOREIGN KEY ("material_code") REFERENCES "material"("stock_code") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_expenses" ADD CONSTRAINT "project_expenses_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "treyler_project"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "treyler_project" ADD CONSTRAINT "treyler_project_creator_id_fkey" FOREIGN KEY ("creator_id") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "treyler_project" ADD CONSTRAINT "treyler_project_treyler_type_id_fkey" FOREIGN KEY ("treyler_type_id") REFERENCES "treyler_type"("id") ON DELETE NO ACTION ON UPDATE CASCADE;
