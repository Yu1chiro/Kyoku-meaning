require('dotenv').config();
const express = require('express');
const path = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

// Inisialisasi Gemini API dengan versi terbaru
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Gunakan model yang lebih baru (gemini-2.0-flash atau gemini-pro:latest)
const model = genAI.getGenerativeModel({ 
  model: "gemini-2.0-flash", // atau "gemini-pro:latest"
  generationConfig: {
    maxOutputTokens: 3000, // ditingkatkan untuk lirik yang panjang
    temperature: 0.3, // diturunkan untuk hasil yang lebih konsisten
  },
});

// Middleware
app.use(express.json());

// Konfigurasi CORS yang lebih baik
app.use(cors({
    origin: '*', // Untuk development, bisa disesuaikan dengan domain production nanti
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.static(path.join(__dirname, 'public')));



// Endpoint analisis makna dengan prompt yang diperbaiki
app.post('/api/find-meaning', async (req, res) => {
    const { lyrics, songTitle } = req.body;

    if (!lyrics || lyrics.trim() === '') {
        return res.status(400).json({ error: 'Lirik diperlukan untuk analisis.' });
    }

    try {
const prompt = `Bayangkan kamu adalah seorang teman yang peka dan hangat—seorang penulis dan pemerhati musik yang tidak hanya mengerti kata, tapi juga luka, harapan, dan makna dalam setiap jeda hidup. Kali ini, kamu akan mengajak seseorang merenung bersama lewat lagu ${songTitle ? `"${songTitle}"` : 'berikut ini'}, bukan sebagai pengamat, tapi sebagai teman perjalanan hidup mereka.

LIRIK LAGU:
${lyrics}

INSTRUKSI:
1. **Mulailah seperti ngobrol dari hati ke hati.** Ajak audiens masuk dalam percakapan yang reflektif—seolah kamu tahu mereka sedang merasa kosong, bingung, atau butuh pelukan dari lagu.
2. **Makna & Filosofi Kehidupan**: Temukan pesan utama lagu ini. Apa yang ingin dikatakan lagu ini pada orang yang sedang kehilangan arah atau harapan?
3. **Emosi Terdalam**: Jelaskan rasa di balik kata—rindu yang tak terucap, harapan yang dipendam, atau luka yang diam-diam masih terasa.
4. **Simbol & Metafora**: Ungkap makna tersembunyi yang mungkin tak langsung terlihat. Apa yang sebenarnya sedang dibicarakan oleh lagu ini?
5. **Kaitkan dengan Hidup Audiens**: Apa yang bisa lagu ini bantu sembuhkan atau jelaskan dari hidup mereka? Bawa mereka untuk melihat dirinya dalam lirik.
6. **Kutipan Lirik Paling Menyentuh**: Pilih 1–2 bait paling menggetarkan hati. Jelaskan kenapa bait ini bisa jadi cermin kehidupan banyak orang.
7. **Penafsiran Pribadi & Akhir yang Menenangkan**: Berikan sudut pandang unik yang membuat pendengar merasa dimengerti. Akhiri dengan satu kalimat lembut yang membuat hati mereka terasa tenang dan tidak sendirian.

FORMAT RESPONS:
Tulis dalam 4–6 paragraf naratif yang mengalir hangat, reflektif, dan menyentuh. Gunakan bahasa Indonesia yang puitis, penuh empati, namun tetap mudah dimengerti. Buat audiens merasa bahwa lagu ini adalah pelukan, bukan pelajaran. Jangan terlalu formal—biarkan tulisanmu seperti suara yang mengisi ruang sepi di malam hari.`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        res.json({ meaning: text.trim() });

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ 
            error: `Gagal menganalisis: ${error.message}` 
        });
    }
});



app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
    console.log(`Server berjalan di http://localhost:${port}`);
});