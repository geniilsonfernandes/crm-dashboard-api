-- CreateTable
CREATE TABLE "imports" (
    "id" TEXT NOT NULL,

    CONSTRAINT "imports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subscriptions" (
    "id" TEXT NOT NULL,
    "periodicity" TEXT NOT NULL,
    "billing_quantity" TEXT NOT NULL,
    "billing_every_x_days" TEXT NOT NULL,
    "start_date" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "status_date" TEXT NOT NULL,
    "cancellation_date" TEXT NOT NULL,
    "amount" TEXT NOT NULL,
    "nex_cycle" TEXT NOT NULL,
    "subscriber_id" TEXT NOT NULL,
    "import_id" TEXT,

    CONSTRAINT "subscriptions_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_import_id_fkey" FOREIGN KEY ("import_id") REFERENCES "imports"("id") ON DELETE SET NULL ON UPDATE CASCADE;
