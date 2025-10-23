import React, { useEffect, useState } from 'react';
import './MuroJaah.css';

function MuroJaah() {
  // State untuk menyimpan input nama surat
  const [namaSurat, setNamaSurat] = useState('');
  // State untuk menyimpan input ayat
  const [ayat, setAyat] = useState('');
  // State untuk daftar target murojaah
  // Data diambil dari localStorage agar tersimpan walau halaman di-refresh
  const [targets, setTargets] = useState(() => {
    const saved = localStorage.getItem('murojaahTargets');
    return saved ? JSON.parse(saved) : [];
  });

  // Setiap kali "targets" berubah, simpan lagi ke localStorage

  useEffect(() => {
    localStorage.setItem('murojaahTargets', JSON.stringify(targets));
  }, [targets]);
// Fungsi menambah target baru
  const handleAddTarget = () => {
    // Kalau input kosong, jangan lanjut
    if (namaSurat.trim() === '' || ayat.trim() === '') return;

    const newTarget = {
      id: Date.now(),   // ID unik berdasarkan waktu
      surat: namaSurat, // Nama surat
      ayat: ayat,       // Rentang ayat
      status: 'Baru',   // status awal
    };
     // Tambahkan target baru ke daftar
    setTargets([...targets, newTarget]);
    // Kosongkan kembali input
    setNamaSurat('');
    setAyat('');
  };
  // Fungsi untuk hapus target berdasarkan ID
  const handleDelete = (id) => {
    setTargets(targets.filter((target) => target.id !== id));
  };
  // Fungsi untuk ubah status (Baru → Murojaah → Lancar → Baru lagi)
  const handleChangeStatus = (id) => {
    setTargets(targets.map((target) => {
      if (target.id === id) {
        let nextStatus;
        if (target.status === 'Baru') nextStatus = 'Murojaah';
        else if (target.status === 'Murojaah') nextStatus = 'Lancar';
        else nextStatus = 'Baru';
        return { ...target, status: nextStatus };
      }
      return target;
    }));
  };
  // Bagian tampilan (UI)
  return (
    <div className="murojaah-container">
      {/* Container utama untuk seluruh isi halaman */}
      <h1>Muroja'ah Tracker 📖</h1> {/* Judul utama aplikasi */}

      <div className="input-section">
        {/* Input untuk menulis nama surat */}
        <input
          type="text"
          placeholder="Nama Surat (cth: An-Naba)"
          value={namaSurat} // Nilai input diambil dari state namaSurat
          onChange={(e) => setNamaSurat(e.target.value)} // Update state namaSurat saat user mengetik
        />
        {/* Input untuk menulis ayat */}
        <input
          type="text"
          placeholder="Ayat (cth: 1-10)"
          value={ayat} // Nilai input diambil dari state ayat
          onChange={(e) => setAyat(e.target.value)} // Update state ayat saat user mengetik
        />
      </div>

      {/* Tombol untuk menambahkan target baru */}
      <button className="add-btn" onClick={handleAddTarget}>Tambah Target</button>

      {/* Bagian daftar target yang sudah ditambahkan */}
      <div className="target-list">
        {/* Melakukan perulangan (loop) pada semua data target */}
        {targets.map((target) => (
          <div className="target-card" key={target.id}> {/* Card untuk setiap target */}
            <div>
              {/* Menampilkan nama surat dan ayat dari target */}
              <h2>{target.surat}</h2>
              <p>Ayat: {target.ayat}</p>
            </div>
            <div className="btn-group">
              {/* Tombol untuk mengganti status target (misalnya: Belum → Selesai) */}
              <button
                className={`status-btn ${target.status.toLowerCase()}`}
                onClick={() => handleChangeStatus(target.id)} // Jalankan fungsi ubah status
              >
                {target.status} {/* Menampilkan status saat ini */}
              </button>
              {/* Tombol untuk menghapus target berdasarkan id */}
              <button className="delete-btn" onClick={() => handleDelete(target.id)}>Hapus</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MuroJaah;

