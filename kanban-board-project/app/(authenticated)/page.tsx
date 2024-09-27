// app/(authenticated)/page.tsx

'use client';

import Header from '@/components/Header';
import Board from '@/components/Board';
import Modal from '@/components/Modal';
import EditModal from '@/components/editModal';
import Alert from '@/components/Alert'; // Import Alert

export default function Home() {
  return (
    <main className="flex-1">
      <Header />
      <Board />
      <Modal />
      <EditModal />
      <Alert /> {/* Include the Alert component */}
    </main>
  );
}