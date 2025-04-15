/*
  Warnings:

  - You are about to drop the `_NoteToTag` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_NoteToTag" DROP CONSTRAINT "_NoteToTag_A_fkey";

-- DropForeignKey
ALTER TABLE "_NoteToTag" DROP CONSTRAINT "_NoteToTag_B_fkey";

-- DropTable
DROP TABLE "_NoteToTag";

-- CreateTable
CREATE TABLE "_NoteTags" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_NoteTags_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_NoteTags_B_index" ON "_NoteTags"("B");

-- AddForeignKey
ALTER TABLE "_NoteTags" ADD CONSTRAINT "_NoteTags_A_fkey" FOREIGN KEY ("A") REFERENCES "Note"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_NoteTags" ADD CONSTRAINT "_NoteTags_B_fkey" FOREIGN KEY ("B") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;
