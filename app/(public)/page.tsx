import { getAllAssignments } from '@/app/actions/assignment-actions';
import AssignmentCard from '@/app/components/AssignmentCard';
import { BookOpen, Users, UserCheck, FileText } from 'lucide-react';
import ClassFilter from './ClassFilter';

export default async function LandingPage({
  searchParams,
}: {
  searchParams: Promise<{ class?: string }>;
}) {
  // Await searchParams di Next.js 15
  const params = await searchParams;
  const selectedClass = params.class ?? 'Semua Kelas';
  
  const result = await getAllAssignments(
    selectedClass === 'Semua Kelas' ? undefined : selectedClass
  );

  const assignments = result.success ? result.data : [];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-[#00913f] to-blue-700 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Pekerjaan Rumah SD Online
          </h1>
          <p className="text-xl text-blue-100 mb-8">
            Pantau dan akses informasi PR Ananda dengan mudah dan terorganisir
          </p>
        </div>
      </div>

      {/* Filter & Assignments Section */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Filter Section */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <label className="block text-gray-700 font-medium mb-2">
            Filter Kelas:
          </label>
          <ClassFilter selectedClass={selectedClass} />
        </div>

        {/* Assignments Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {!assignments || assignments.length === 0 ? (
            <div className="col-span-full text-center py-12 text-gray-500">
              <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p>Belum ada PR untuk kelas ini</p>
            </div>
          ) : (
            assignments.map((assignment: any) => (
              <AssignmentCard key={assignment.id} assignment={assignment} />
            ))
          )}
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-gray-50 py-16 px-4 mt-12">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
            Fitur Unggulan
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Informasi PR Lengkap</h3>
              <p className="text-gray-600">
                Lihat semua PR dengan detail mata pelajaran dan deadline
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Panel Guru</h3>
              <p className="text-gray-600">
                Guru dapat mengelola PR dengan mudah dan cepat
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <UserCheck className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Manajemen Admin</h3>
              <p className="text-gray-600">
                Admin dapat mengelola data guru dengan efisien
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}