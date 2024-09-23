// app/(authenticated)/page.tsx

'use client';

import Header from '@/components/Header';
import Board from '@/components/Board';
import Modal from '@/components/Modal';
import EditModal from '@/components/editModal'; // Import EditModal

export default function Home() {
  return (
    <main className="flex-1">
      <Header />
      <Board />
      <Modal />
      <EditModal /> {/* Include the EditModal component */}
    </main>
  );
}



// import Board from "@/components/Board";
// import Header from "@/components/Header";
// export default function Home() {
//   return (
//     <main>
//       {/* Header */}
//         <Header />
//       {/* Board */}
//       <Board />
//     </main>
//   )
  
// }
