// app/(authenticated)/page.tsx

'use client';

import Header from '@/components/Header';
import Board from '@/components/Board';
import Modal from '@/components/Modal';

export default function Home() {
  return (
    <main className="flex-1">
      <Header />
      <Board />
      <Modal /> {/* Include the Modal component here */}
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
