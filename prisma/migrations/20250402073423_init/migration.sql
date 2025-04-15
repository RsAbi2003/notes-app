-- DropForeignKey
ALTER TABLE "Note" DROP CONSTRAINT "Note_authorId_fkey";

-- AddForeignKey
ALTER TABLE "Note" ADD CONSTRAINT "Note_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
