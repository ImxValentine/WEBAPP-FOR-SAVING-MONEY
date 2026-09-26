'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function ExpenseGoals() {
  const [goals, setGoals] = useState([
    { id: 1, title: 'ค่าผ่อนบ้านประจำเดือน', target: 12000, current: 4000, dueDate: '2026-10-05' },
    { id: 2, title: 'ค่าน้ำ-ค่าไฟ', target: 2500, current: 2500, dueDate: '2026-09-30' }
  ]);

  const [form, setForm] = useState({ title: '', target: '', dueDate: '' });

  const handleAddGoal = (e) => {
    e.preventDefault();
    if (!form.title || !form.target || !form.dueDate) return;

    setGoals([
      ...goals,
      {
        id: Date.now(),
        title: form.title,
        target: parseFloat(form.target),
        current: 0,
        dueDate: form.dueDate
      }
    ]);
    setForm({ title: '', target: '', dueDate: '' });
  };

  const handlePay = (id, amount) => {
    setGoals(goals.map(g => {
      if (g.id === id) {
        const updated = Math.min(g.target, g.current + amount);
        return { ...g, current: updated };
      }
      return g;
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 font-sans">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Navigation */}
        <div className="flex justify-between items-center">
          <Link href="/" className="text-gray-500 hover:text-gray-800 text-sm font-semibold flex items-center gap-1">
            ← กลับหน้าภาพรวม
          </Link>
          <h1 className="text-2xl font-bold text-gray-800">🎯 เป้าหมายรายจ่าย (Gamified)</h1>
        </div>

        {/* Add Goal Form */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-md font-bold text-gray-800 mb-3">➕ เพิ่มเป้าหมายรายจ่ายใหม่</h2>
          <form onSubmit={handleAddGoal} className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <input 
              type="text" 
              placeholder="รายการ (เช่น ค่าเน็ต)" 
              value={form.title} 
              onChange={e => setForm({...form, title: e.target.value})} 
              className="p-2 border rounded-xl text-sm" 
              required 
            />
            <input 
              type="number" 
              placeholder="ยอดเป้าหมาย (บาท)" 
              value={form.target} 
              onChange={e => setForm({...form, target: e.target.value})} 
              className="p-2 border rounded-xl text-sm" 
              required 
            />
            <input 
              type="date" 
              value={form.dueDate} 
              onChange={e => setForm({...form, dueDate: e.target.value})} 
              className="p-2 border rounded-xl text-sm" 
              required 
            />
            <button type="submit" className="bg-indigo-600 text-white font-bold py-2 rounded-xl text-sm hover:bg-indigo-700">
              สร้างภารกิจ
            </button>
          </form>
        </div>

        {/* Goals Cards List */}
        <div className="space-y-4">
          {goals.map(goal => {
            const progress = Math.min(100, Math.round((goal.current / goal.target) * 100));
            const isCompleted = progress === 100;

            return (
              <div key={goal.id} className={`bg-white p-6 rounded-2xl border ${isCompleted ? 'border-green-200 bg-green-50/20' : 'border-gray-100'} shadow-sm space-y-3`}>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-lg text-gray-800">{goal.title}</h3>
                    <p className="text-xs text-gray-400">ครบกำหนด: {goal.dueDate}</p>
                  </div>
                  {isCompleted ? (
                    <span className="bg-green-100 text-green-700 font-bold px-3 py-1 rounded-full text-xs">
                      🎉 ภารกิจสำเร็จ!
                    </span>
                  ) : (
                    <span className="bg-amber-100 text-amber-700 font-bold px-3 py-1 rounded-full text-xs">
                      กำลังดำเนินการ
                    </span>
                  )}
                </div>

                {/* HP/Progress Bar */}
                <div>
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span className="text-gray-500">ความคืบหน้า ({progress}%)</span>
                    <span className="text-gray-800">฿{goal.current.toLocaleString()} / ฿{goal.target.toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-500 ${isCompleted ? 'bg-green-500' : 'bg-indigo-600'}`} 
                      style={{ width: `${progress}%` }} 
                    />
                  </div>
                </div>

                {/* Action */}
                {!isCompleted && (
                  <div className="flex justify-end gap-2 pt-2">
                    <button 
                      onClick={() => handlePay(goal.id, 500)} 
                      className="bg-gray-100 text-gray-700 text-xs font-semibold px-3 py-2 rounded-xl hover:bg-gray-200"
                    >
                      + จ่ายเติม ฿500
                    </button>
                    <button 
                      onClick={() => handlePay(goal.id, goal.target - goal.current)} 
                      className="bg-indigo-50 text-indigo-600 text-xs font-bold px-3 py-2 rounded-xl hover:bg-indigo-100"
                    >
                      ⚡ เคลียร์ส่วนที่เหลือ
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
