import { BookOpen, Calendar, UserCheck } from 'lucide-react';

interface AssignmentCardProps {
  assignment: {
    id: string;
    title: string;
    description: string | null;
    subject: string;
    classLevel: string;
    dueDate: Date | null;
    teacher: {
      name: string;
    };
  };
}

export default function AssignmentCard({ assignment }: AssignmentCardProps) {
  const formatDate = (date: Date | null) => {
    if (!date) return 'Tidak ada deadline';
    return new Date(date).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition p-6 border-l-4 border-blue-500">
      <div className="flex items-start justify-between mb-3">
        <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full">
          {assignment.classLevel}
        </span>
        <span className="text-xs text-gray-500 flex items-center">
          <Calendar className="w-3 h-3 mr-1" />
          {formatDate(assignment.dueDate)}
        </span>
      </div>
      
      <h3 className="text-xl font-bold text-gray-800 mb-2">{assignment.title}</h3>
      
      <div className="flex items-center text-sm text-gray-600 mb-3">
        <BookOpen className="w-4 h-4 mr-2" />
        <span>{assignment.subject}</span>
      </div>

      <p className="text-gray-600 mb-4 line-clamp-3">
        {assignment.description || 'Tidak ada deskripsi'}
      </p>
      
      <div className="flex items-center text-sm text-gray-500 pt-3 border-t border-gray-100">
        <UserCheck className="w-4 h-4 mr-2" />
        <span>{assignment.teacher.name}</span>
      </div>
    </div>
  );
}