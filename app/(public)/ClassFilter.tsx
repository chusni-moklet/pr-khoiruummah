'use client';

import { useState, useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

const ClassFilter = ({ selectedClass }: { selectedClass: string }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [value, setValue] = useState(selectedClass);

  const classes = [
    'Semua Kelas',
    'Kelas 1A', 'Kelas 1B', 'Kelas 2A', 'Kelas 2B', 'Kelas 3A', 'Kelas 3B', 'Kelas 4A', 'Kelas 4B', 'Kelas 5A', 'Kelas 5B', 'Kelas 6A', 'Kelas 6B'
  ];

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newClass = e.target.value;
    setValue(newClass);

    // Update URL without reload
    const params = new URLSearchParams(searchParams.toString());
    if (newClass === 'Semua Kelas') {
      params.delete('class');
    } else {
      params.set('class', newClass);
    }

    startTransition(() => {
      router.replace(`/?${params.toString()}`);
    });
  };

  return (
    <select
      name="class"
      value={value}
      onChange={handleChange}
      disabled={isPending}
      className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
    >
      {classes.map((cls) => (
        <option key={cls} value={cls}>
          {cls}
        </option>
      ))}
    </select>
  );
};

export default ClassFilter;