/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `ApplicationToken` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "ApplicationToken_name_key" ON "ApplicationToken"("name");
