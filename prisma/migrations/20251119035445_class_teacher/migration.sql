-- CreateTable
CREATE TABLE "classToTeacher" (
    "id" TEXT NOT NULL,
    "classId" TEXT NOT NULL,
    "teacherId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "classToTeacher_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KelasSiswa" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "teacherId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "KelasSiswa_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "classToTeacher_classId_teacherId_key" ON "classToTeacher"("classId", "teacherId");

-- AddForeignKey
ALTER TABLE "classToTeacher" ADD CONSTRAINT "classToTeacher_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "Teacher"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "classToTeacher" ADD CONSTRAINT "classToTeacher_classId_fkey" FOREIGN KEY ("classId") REFERENCES "KelasSiswa"("id") ON DELETE CASCADE ON UPDATE CASCADE;
