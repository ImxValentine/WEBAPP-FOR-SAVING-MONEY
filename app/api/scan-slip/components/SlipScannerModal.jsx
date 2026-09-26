'use client';
import { useState } from 'react';

export default function SlipScannerModal({ isOpen, onClose, onSave }) {
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState('expense'); // 'income' หรือ 'expense'
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    amount: '',
    note: ''
  });

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    const body = new FormData();
    body.append('file', file);

    try {
      const res = await fetch('/api/scan-slip', { method: 'POST', body });
      const result = await res.json();

      if (result.success) {
        setFormData({
          date: result.data.date || '',
          time: result.data.time || '',
          amount: result.data.amount || '',
          note: result.data.note || '' // ถ้าไม่มีจะเป็นค่าว่าง
        });
      }
    } catch (err) {
      alert('เกิดข้อผิดพลาดในการสแกนสลิป');
    } finally {
      setLoading(false);
    }
  };

  // ตรวจสอบว่ากรอกข้อมูลครบถ้วนหรือไม่ (บังคับกรอก Note ถ้าสลิปไม่มี)
  const isValid = formData.date && formData.time && formData.amount > 0 && formData.note.trim() !== '';

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isValid) return;

    onSave({
      ...formData,
      type,
      amount: parseFloat(formData.amount)
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
        <h2 className="text-xl font-bold mb-4">สแกนสลิปบันทึกรายการ</h2>

        {/* ช่องอัปโหลดไฟล์ */}
        <input 
          type="file" 
          accept="image/*" 
          onChange={handleFileUpload} 
          className="mb-4 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
        />

        {loading ? (
          <div className="text-center py-8 text-indigo-600 font-semibold">กำลังสแกนสลิปด้วย AI...</div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* เลือกประเภท: รายรับ / รายจ่าย */}
            <div className="flex gap-4">
              <label className={`flex-1 p-3 text-center rounded-xl cursor-pointer border ${type === 'expense' ? 'bg-red-100 border-red-500 text-red-700 font-bold' : 'bg-gray-50'}`}>
                <input type="radio" name="type" value="expense" checked={type === 'expense'} onChange={() => setType('expense')} className="hidden" />
                🔴 รายจ่าย
              </label>
              <label className={`flex-1 p-3 text-center rounded-xl cursor-pointer border ${type === 'income' ? 'bg-green-100 border-green-500 text-green-700 font-bold' : 'bg-gray-50'}`}>
                <input type="radio" name="type" value="income" checked={type === 'income'} onChange={() => setType('income')} className="hidden" />
                🟢 รายรับ
              </label>
            </div>

            {/* ฟิลด์ข้อมูล */}
            <div>
              <label className="block text-xs text-gray-500 mb-1">วันที่</label>
              <input type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="w-full p-2 border rounded-lg" required />
            </div>

            <div>
              <label className="block text-xs text-gray-500 mb-1">เวลา</label>
              <input type="time" value={formData.time} onChange={e => setFormData({...formData, time: e.target.value})} className="w-full p-2 border rounded-lg" required />
            </div>

            <div>
              <label className="block text-xs text-gray-500 mb-1">จำนวนเงิน (บาท)</label>
              <input type="number" step="0.01" value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} className="w-full p-2 border rounded-lg" required />
            </div>

            <div>
              <label className="block text-xs text-gray-500 mb-1">
                จ่ายไปกับอะไร / รายการ <span className="text-red-500">*จำเป็นต้องระบุ</span>
              </label>
              <input 
                type="text" 
                placeholder="เช่น ค่าไฟ, ค่าน้ำ, ค่าอาหาร" 
                value={formData.note} 
                onChange={e => setFormData({...formData, note: e.target.value})} 
                className={`w-full p-2 border rounded-lg ${!formData.note.trim() ? 'border-red-400 bg-red-50' : 'border-gray-300'}`} 
                required 
              />
              {!formData.note.trim() && (
                <p className="text-xs text-red-500 mt-1">⚠️ โปรดระบุรายการก่อนบันทึก</p>
              )}
            </div>

            {/* ปุ่มบันทึก (ถูกล็อกไว้ถ้ายังกรอกข้อมูลไม่ครบ) */}
            <div className="flex gap-2 pt-4">
              <button type="button" onClick={onClose} className="flex-1 py-2 border rounded-xl hover:bg-gray-50">ยกเลิก</button>
              <button 
                type="submit" 
                disabled={!isValid} 
                className={`flex-1 py-2 rounded-xl font-bold text-white transition ${isValid ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-gray-300 cursor-not-allowed'}`}
              >
                บันทึกรายการ
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
