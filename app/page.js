'use client';
import { useState } from 'react';
import Link from 'next/link';
import SlipScannerModal from '@/components/SlipScannerModal';

export default function Dashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [transactions, setTransactions] = useState([]);

  // คำนวณยอดเงินรวม
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpense;

  const handleSaveTransaction = (newTx) => {
    setTransactions([newTx, ...transactions]);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 font-sans">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">📊 ภาพรวมบัญชี</h1>
          <Link href="/goals" className="bg-indigo-50 text-indigo-600 px-4 py-2 rounded-xl text-sm font-semibold hover:bg-indigo-100 transition">
            🎯 เป้าหมายรายจ่าย
          </Link>
        </div>

        {/* Balance Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <p className="text-xs text-gray-500 mb-1">ยอดเงินคงเหลือรวม</p>
            <p className={`text-3xl font-extrabold ${balance >= 0 ? 'text-gray-900' : 'text-red-500'}`}>
              ฿{balance.toLocaleString('th-TH', { minimumFractionDigits: 2 })}
            </p>
          </div>
          <div className="bg-green-50/50 p-6 rounded-2xl border border-green-100">
            <p className="text-xs text-green-600 mb-1">รายรับรวม</p>
            <p className="text-2xl font-bold text-green-600">
              +฿{totalIncome.toLocaleString('th-TH', { minimumFractionDigits: 2 })}
            </p>
          </div>
          <div className="bg-red-50/50 p-6 rounded-2xl border border-red-100">
            <p className="text-xs text-red-600 mb-1">รายจ่ายรวม</p>
            <p className="text-2xl font-bold text-red-600">
              -฿{totalExpense.toLocaleString('th-TH', { minimumFractionDigits: 2 })}
            </p>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex gap-3">
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex-1 bg-indigo-600 text-white font-bold py-3 px-4 rounded-xl shadow-md hover:bg-indigo-700 transition flex items-center justify-center gap-2"
          >
            📸 สแกนสลิปบันทึกรายการ
          </button>
        </div>

        {/* Recent Transactions Table */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-gray-800 mb-4">ประวัติรายการล่าสุด</h2>
          {transactions.length === 0 ? (
            <p className="text-gray-400 text-center py-8 text-sm">ยังไม่มีรายการบันทึก กดปุ่มสแกนสลิปเพื่อเพิ่มรายการได้เลย!</p>
          ) : (
            <div className="space-y-3">
              {transactions.map((tx, idx) => (
                <div key={idx} className="flex justify-between items-center p-3 hover:bg-gray-50 rounded-xl border border-gray-100">
                  <div>
                    <p className="font-semibold text-gray-800">{tx.note}</p>
                    <p className="text-xs text-gray-400">{tx.date} • {tx.time} น.</p>
                  </div>
                  <p className={`font-bold ${tx.type === 'income' ? 'text-green-600' : 'text-red-500'}`}>
                    {tx.type === 'income' ? '+' : '-'}฿{tx.amount.toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Slip Modal */}
        <SlipScannerModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          onSave={handleSaveTransaction} 
        />

      </div>
    </div>
  );
}
