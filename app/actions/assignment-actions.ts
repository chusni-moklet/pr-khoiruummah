'use server';

import { prisma } from '@/app/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function getAllAssignments(classLevel?: string) {
  try {
    const where = classLevel ? { classLevel } : {};
    
    const assignments = await prisma.assignment.findMany({
      where,
      include: {
        teacher: {
          select: {
            id: true,
            name: true,
            subject: true,
          }
        }
      },
      orderBy: { createdAt: 'desc' },
    });

    return { success: true, data: assignments };
  } catch (error) {
    console.error('Error fetching assignments:', error);
    return { success: false, error: 'Gagal mengambil data PR' };
  }
}

export async function getAssignmentsByTeacher(teacherId: string) {
  try {
    const assignments = await prisma.assignment.findMany({
      where: { teacherId },
      include: {
        teacher: {
          select: {
            id: true,
            name: true,
            subject: true,
          }
        }
      },
      orderBy: { createdAt: 'desc' },
    });

    return { success: true, data: assignments };
  } catch (error) {
    console.error('Error fetching teacher assignments:', error);
    return { success: false, error: 'Gagal mengambil data PR' };
  }
}

export async function createAssignment(formData: FormData, teacherId: string) {
  try {
    const title = formData.get('title')?.toString();
    const subject = formData.get('subject')?.toString();
    const classLevel = formData.get('classLevel')?.toString();
    const dueDate = formData.get('dueDate')?.toString();
    const description = formData.get('description')?.toString();

    if (!title || !subject || !classLevel) {
      return { success: false, error: 'Judul, mata pelajaran, dan kelas wajib diisi' };
    }

    const assignment = await prisma.assignment.create({
      data: {
        title,
        subject,
        classLevel,
        description: description || null,
        dueDate: dueDate ? new Date(dueDate) : null,
        teacherId,
      },
    });

    revalidatePath('/teacher/dashboard');
    revalidatePath('/');
    return { success: true, data: assignment };
  } catch (error) {
    console.error('Error creating assignment:', error);
    return { success: false, error: 'Gagal membuat PR' };
  }
}

export async function updateAssignment(id: string, formData: FormData) {
  try {
    const title = formData.get('title')?.toString();
    const subject = formData.get('subject')?.toString();
    const classLevel = formData.get('classLevel')?.toString();
    const dueDate = formData.get('dueDate')?.toString();
    const description = formData.get('description')?.toString();

    if (!title || !subject || !classLevel) {
      return { success: false, error: 'Judul, mata pelajaran, dan kelas wajib diisi' };
    }

    const assignment = await prisma.assignment.update({
      where: { id },
      data: {
        title,
        subject,
        classLevel,
        description: description || null,
        dueDate: dueDate ? new Date(dueDate) : null,
      },
    });

    revalidatePath('/teacher/dashboard');
    revalidatePath('/');
    return { success: true, data: assignment };
  } catch (error) {
    console.error('Error updating assignment:', error);
    return { success: false, error: 'Gagal mengupdate PR' };
  }
}

export async function deleteAssignment(id: string) {
  try {
    await prisma.assignment.delete({
      where: { id },
    });

    revalidatePath('/teacher/dashboard');
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error('Error deleting assignment:', error);
    return { success: false, error: 'Gagal menghapus PR' };
  }
}