import { Outlet } from 'react-router-dom';
import FacultyNavigation from '@/components/faculty/FacultyNavigation.jsx';

export default function FacultyLayout() {
  return (
    <>
      <FacultyNavigation />
      <main className="pt-20 pb-20 px-4 md:px-6">
        <Outlet />
      </main>
    </>
  );
}