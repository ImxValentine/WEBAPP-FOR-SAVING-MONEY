'use client';

import { useState } from 'react';
import Link from 'next/link';
import SlipScannerModal from '../components/SlipScannerModal';

export default function Dashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">Savings App</h1>
      <button
        onClick={() => setIsModalOpen(true)}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg"
      >
        Scan Slip
      </button>

      {isModalOpen && (
        <SlipScannerModal onClose={() => setIsModalOpen(false)} />
      )}
    </main>
  );
}