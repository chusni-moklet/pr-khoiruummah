'use client';

import { useState } from 'react';
import { Plus, Edit2, Trash2, FileText, Calendar, BookOpen } from 'lucide-react';
import { createAssignment, updateAssignment, deleteAssignment } from '@/app/actions/assignment-actions';
import { useRouter } from 'next/navigation';

export interface Assignment {
  id: string;
  title: string;
  description: string | null;
  subject: string;
  classLevel: string;
  dueDate: Date | null;
  createdAt: Date;
  teacher: {
    name: string;
  };
}

interface Props {
  teacherId: string;
  teacherName: string;
  initialAssignments: Assignment[];
}

export default function TeacherDashboardClient({ teacherId, teacherName, initialAssignments }: Props) {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const classes = ['Kelas 1A', 'Kelas 1B', 'Kelas 2A', 'Kelas 2B', 'Kelas 3A', 'Kelas 3B', 'Kelas 4A', 'Kelas 4B', 'Kelas 5A', 'Kelas 5B', 'Kelas 6A', 'Kelas 6B'];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    let result;

    if (editingId) {
      result = await updateAssignment(editingId, formData);
    } else {
      result = await createAssignment(formData, teacherId);
    }

    setLoading(false);

    if (result.success) {
      setShowForm(false);
      setEditingId(null);
      router.refresh();
    } else {
      alert(result.error);
    }
  };

  const handleEdit = (assignment: Assignment) => {
    setEditingId(assignment.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus PR ini?')) return;

    const result = await deleteAssignment(id);
    if (result.success) {
      router.refresh();
    } else {
      alert(result.error);
    }
  };

  const formatDate = (date: Date | null) => {
    if (!date) return '';
    return new Date(date).toISOString().split('T')[0];
  };

  const formatDisplayDate = (date: Date | null) => {
    if (!date) return 'Tidak ada deadline';
    return new Date(date).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const editingAssignment = editingId ? initialAssignments.find(a => a.id === editingId) : null;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Dashboard Guru</h1>
          <p className="text-gray-600">Kelola pekerjaan rumah untuk siswa Anda</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Daftar PR Saya</h2>
            <button
              onClick={() => {
                setShowForm(true);
                setEditingId(null);
              }}
              className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              <Plus className="w-5 h-5" />
              <span>Tambah PR Baru</span>
            </button>
          </div>

          {showForm && (
            <form onSubmit={handleSubmit} className="bg-blue-50 rounded-lg p-6 mb-6 border border-blue-200">
              <h3 className="text-xl font-bold mb-4">
                {editingId ? 'Edit PR' : 'Tambah PR Baru'}
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Judul PR <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    required
                    defaultValue={editingAssignment?.title}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Contoh: Latihan Perkalian"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Mata Pelajaran <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="subject"
                    required
                    defaultValue={editingAssignment?.subject}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Contoh: Matematika"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Kelas <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="classLevel"
                    required
                    defaultValue={editingAssignment?.classLevel}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Pilih Kelas</option>
                    {classes.map((cls) => (
                      <option key={cls} value={cls}>
                        {cls}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">Deadline</label>
                  <input
                    type="date"
                    name="dueDate"
                    defaultValue={formatDate(editingAssignment?.dueDate || null)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">Deskripsi</label>
                  <textarea
                    name="description"
                    defaultValue={editingAssignment?.description || ''}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Jelaskan detail tugas..."
                  />
                </div>

                <div className="flex space-x-3">
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400"
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

          <div className="space-y-4">
            {initialAssignments.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p>Anda belum membuat PR</p>
              </div>
            ) : (
              initialAssignments.map((assignment) => (
                <div
                  key={assignment.id}
                  className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:border-blue-300 transition"
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full">
                          {assignment.classLevel}
                        </span>
                        <span className="bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full">
                          {assignment.subject}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-gray-800 mb-1">
                        {assignment.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-2">
                        {assignment.description || 'Tidak ada deskripsi'}
                      </p>
                      <div className="flex items-center text-xs text-gray-500">
                        <Calendar className="w-3 h-3 mr-1" />
                        <span>Deadline: {formatDisplayDate(assignment.dueDate)}</span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(assignment)}
                        className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition"
                      >
                        <Edit2 className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(assignment.id)}
                        className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}