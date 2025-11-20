'use client';

import { useState } from 'react';
import { Plus, Edit2, Trash2, Users, Eye, EyeOff } from 'lucide-react';
import { createTeacher, updateTeacher, deleteTeacher } from '@/app/actions/teacher-actions';
import { useRouter } from 'next/navigation';

export interface Teacher {
  id: string;
  name: string;
  email: string;
  subject: string;
  createdAt: Date;
  _count: {
    assignments: number;
  };
}

interface Props {
  initialTeachers: Teacher[];
}

export default function AdminDashboardClient({ initialTeachers }: Props) {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    let result;

    if (editingId) {
      result = await updateTeacher(editingId, formData);
    } else {
      result = await createTeacher(formData);
    }

    setLoading(false);

    if (result.success) {
      setShowForm(false);
      setEditingId(null);
      e.currentTarget.reset();
      router.refresh();
    } else {
      alert(result.error);
    }
  };

  const handleEdit = (teacher: Teacher) => {
    setEditingId(teacher.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus guru ini?')) return;

    const result = await deleteTeacher(id);
    if (result.success) {
      router.refresh();
    } else {
      alert(result.error);
    }
  };

  const editingTeacher = editingId ? initialTeachers.find((t) => t.id === editingId) : null;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Dashboard Admin</h1>
          <p className="text-gray-600">Kelola data guru dan sistem</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Daftar Guru</h2>
            <button
              onClick={() => {
                setShowForm(true);
                setEditingId(null);
              }}
              className="flex items-center space-x-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition"
            >
              <Plus className="w-5 h-5" />
              <span>Tambah Guru Baru</span>
            </button>
          </div>

          {showForm && (
            <form onSubmit={handleSubmit} className="bg-purple-50 rounded-lg p-6 mb-6 border border-purple-200">
              <h3 className="text-xl font-bold mb-4">
                {editingId ? 'Edit Guru' : 'Tambah Guru Baru'}
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Nama Lengkap <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    defaultValue={editingTeacher?.name}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Contoh: Bu Sarah"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    defaultValue={editingTeacher?.email}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Contoh: sarah@sd.com"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Password {editingId ? '' : <span className="text-red-500">*</span>}
                  </label>
                  <input
                    type="password"
                    name="password"
                    required={!editingId}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder={editingId ? 'Kosongkan jika tidak ingin mengubah' : 'Masukkan password'}
                  />
                  {editingId && (
                    <p className="text-sm text-gray-500 mt-1">
                      Kosongkan jika tidak ingin mengubah password
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Mata Pelajaran <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="subject"
                    required
                    defaultValue={editingTeacher?.subject}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Contoh: Matematika"
                  />
                </div>

                <div className="flex space-x-3">
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition disabled:bg-gray-400"
                  >
                    {loading ? 'Menyimpan...' : editingId ? 'Update' : 'Simpan'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      setEditingId(null);
                    }}
                    className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition"
                  >
                    Batal
                  </button>
                </div>
              </div>
            </form>
          )}

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b-2 border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Nama</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Email</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                    Mata Pelajaran
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                    Jumlah PR
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {initialTeachers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                      <Users className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                      <p>Belum ada data guru</p>
                    </td>
                  </tr>
                ) : (
                  initialTeachers.map((teacher) => (
                    <tr key={teacher.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-800 font-medium">
                        {teacher.name}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">{teacher.email}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{teacher.subject}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-semibold">
                          {teacher._count.assignments} PR
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEdit(teacher)}
                            className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(teacher.id)}
                            className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}