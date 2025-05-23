// Key untuk localStorage
const MODAL_KEY = 'welcomeModalShown';

// Elements
const modal = document.getElementById('welcomeModal');
const modalContent = document.getElementById('modalContent');
const closeModal = document.getElementById('closeModal');
const closeModalBtn = document.getElementById('closeModalBtn');

// Tampilkan modal dengan animasi
function showModal() {
    modal.classList.remove('hidden');
    setTimeout(() => {
        modalContent.classList.remove('scale-95', 'opacity-0');
        modalContent.classList.add('scale-100', 'opacity-100');
    }, 10);
}

// Sembunyikan modal dengan animasi
function hideModal() {
    modalContent.classList.remove('scale-100', 'opacity-100');
    modalContent.classList.add('scale-95', 'opacity-0');
    setTimeout(() => {
        modal.classList.add('hidden');
    }, 300);
}

// Tutup modal dan simpan status ke localStorage
function closeModalAndSave() {
    hideModal();
    localStorage.setItem(MODAL_KEY, 'true');
}

// Event listener untuk tombol close
closeModal.addEventListener('click', closeModalAndSave);
closeModalBtn.addEventListener('click', closeModalAndSave);

// Tutup modal saat klik di luar area konten
modal.addEventListener('click', function(e) {
    if (e.target === modal) {
        closeModalAndSave();
    }
});

// Tutup modal dengan tombol ESC
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
        closeModalAndSave();
    }
});

// Tampilkan modal saat halaman pertama kali dimuat
document.addEventListener('DOMContentLoaded', function() {
    const hasShownModal = localStorage.getItem(MODAL_KEY);
    if (!hasShownModal) {
        setTimeout(showModal, 500);
    }
});
