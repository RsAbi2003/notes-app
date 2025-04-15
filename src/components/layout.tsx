import Link from 'next/link';
import { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className=' w-full '>
      {/* Navbar */}
      <nav className="bg-blue-600 className=' w-full' p-4 text-white">
        <div className="w-full flex justify-between items-center">
          <Link href="/" className="text-xl font-bold">📝 Notes App</Link>
          <div className=" p-3 flex gap-3 space-x-6">
            <Link href="/" className="hover:underline">Home</Link>
            <Link href="/create" className="hover:underline">Create Note</Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className=" w-full  bg-gray-100 shadow-md rounded-lg">
        {children}
      </main>
    </div>
  );
};

export default Layout;
