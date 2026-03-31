import { Outlet } from 'react-router-dom';
import Navigation from '@/components/student/Navigation.jsx';

export default function StudentLayout() {
  return (
    <>
      <Navigation />
      <main className="pt-20 pb-20 px-4 md:px-6">
        <Outlet />
      </main>
    </>
  );
}