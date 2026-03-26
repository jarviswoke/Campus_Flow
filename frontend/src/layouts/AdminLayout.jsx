import { Outlet } from 'react-router-dom';
import AdminNavigation from '@/components/admin/AdminNavigation.jsx';

export default function AdminLayout() {
  return (
    <>
      <AdminNavigation />
      <main className="pt-20 pb-20 px-4 md:px-6">
        <Outlet />
      </main>
    </>
  );
}