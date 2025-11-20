'use server';

import { prisma } from '@/app/lib/prisma';
import { revalidatePath } from 'next/cache';
import bcrypt from 'bcryptjs';

export async function getAllTeachers() {
  try {
    const teachers = await prisma.teacher.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        email: true,
        subject: true,
        createdAt: true,
        _count: {
          select: { assignments: true }
        }
      }
    });
    return { success: true, data: teachers };
  } catch (error) {
    console.error('Error fetching teachers:', error);
    return { success: false, error: 'Gagal mengambil data guru' };
  }
}

export async function createTeacher(formData: FormData) {
  try {
    const name = formData.get('name')?.toString();
    const email = formData.get('email')?.toString();
    const password = formData.get('password')?.toString();
    const subject = formData.get('subject')?.toString();

    if (!name || !email || !password || !subject) {
      return { success: false, error: 'Semua field wajib diisi' };
    }

    // Check if email already exists
    const existingTeacher = await prisma.teacher.findUnique({
      where: { email }
    });

    if (existingTeacher) {
      return { success: false, error: 'Email sudah terdaftar' };
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const teacher = await prisma.teacher.create({
      data: {
        name,
        email,
        password: hashedPassword,
        subject,
      },
    });

    revalidatePath('/admin/dashboard');
    return { success: true, data: teacher };
  } catch (error) {
    console.error('Error creating teacher:', error);
    return { success: false, error: 'Gagal membuat data guru' };
  }
}

export async function updateTeacher(id: string, formData: FormData) {
  try {
    const name = formData.get('name')?.toString();
    const email = formData.get('email')?.toString();
    const subject = formData.get('subject')?.toString();
    const password = formData.get('password')?.toString();

    if (!name || !email || !subject) {
      return { success: false, error: 'Nama, email, dan mata pelajaran wajib diisi' };
    }

    const updateData: any = {
      name,
      email,
      subject,
    };

    // Only update password if provided
    if (password && password.trim() !== '') {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const teacher = await prisma.teacher.update({
      where: { id },
      data: updateData,
    });

    revalidatePath('/admin/dashboard');
    return { success: true, data: teacher };
  } catch (error) {
    console.error('Error updating teacher:', error);
    return { success: false, error: 'Gagal mengupdate data guru' };
  }
}

export async function deleteTeacher(id: string) {
  try {
    // Check if teacher has assignments
    const teacher = await prisma.teacher.findUnique({
      where: { id },
      include: { _count: { select: { assignments: true } } }
    });

    if (teacher && teacher._count.assignments > 0) {
      return { success: false, error: 'Tidak dapat menghapus guru yang masih memiliki PR aktif' };
    }

    await prisma.teacher.delete({
      where: { id },
    });

    revalidatePath('/admin/dashboard');
    return { success: true };
  } catch (error) {
    console.error('Error deleting teacher:', error);
    return { success: false, error: 'Gagal menghapus data guru' };
  }
}