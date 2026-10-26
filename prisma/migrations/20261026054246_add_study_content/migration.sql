-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_StudyMaterial" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "detail" TEXT NOT NULL,
    "content" TEXT NOT NULL DEFAULT '',
    "type" TEXT NOT NULL,
    "duration" TEXT NOT NULL,
    "premium" BOOLEAN NOT NULL DEFAULT false,
    "isDemo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_StudyMaterial" ("createdAt", "detail", "duration", "id", "isDemo", "premium", "subject", "title", "type", "updatedAt") SELECT "createdAt", "detail", "duration", "id", "isDemo", "premium", "subject", "title", "type", "updatedAt" FROM "StudyMaterial";
DROP TABLE "StudyMaterial";
ALTER TABLE "new_StudyMaterial" RENAME TO "StudyMaterial";
CREATE INDEX "StudyMaterial_subject_idx" ON "StudyMaterial"("subject");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
