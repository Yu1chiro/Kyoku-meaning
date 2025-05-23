        const analysisForm = document.getElementById('analysisForm');
        const songTitleInput = document.getElementById('songTitle');
        const lyricsInput = document.getElementById('lyricsInput');
        const analyzeBtn = document.getElementById('analyzeBtn');
        const btnText = document.getElementById('btnText');
        const btnLoading = document.getElementById('btnLoading');
        const loadingDiv = document.getElementById('loading');
        const meaningResultDiv = document.getElementById('meaningResult');
        const meaningContentDiv = document.getElementById('meaningContent');
        const errorMessageDiv = document.getElementById('errorMessage');
        const errorText = document.getElementById('errorText');
        const charCount = document.getElementById('charCount');

        // API Endpoint
        const BACKEND_URL = 'http://localhost:3000/api/find-meaning';

        // Character counter for lyrics input
        lyricsInput.addEventListener('input', () => {
            const count = lyricsInput.value.length;
            charCount.textContent = `${count} karakter`;
            
            if (count > 5000) {
                charCount.classList.add('text-red-500');
                charCount.textContent = `${count} karakter (terlalu panjang, maksimal 5000)`;
            } else {
                charCount.classList.remove('text-red-500');
            }
        });

        // Form submission handler
        analysisForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const songTitle = songTitleInput.value.trim();
            const lyrics = lyricsInput.value.trim();

            // Validation
            if (!lyrics) {
                showError('Lirik lagu harus diisi untuk melakukan analisis.');
                return;
            }

            if (lyrics.length < 50) {
                showError('Lirik terlalu pendek. Masukkan lirik yang lebih lengkap untuk analisis yang akurat.');
                return;
            }

            if (lyrics.length > 5000) {
                showError('Lirik terlalu panjang. Maksimal 5000 karakter.');
                return;
            }

            // Show loading state
            showLoading();

            try {
                const response = await fetch(BACKEND_URL, {
                    method: 'POST',
                    headers: { 
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ 
                        lyrics: lyrics,
                        songTitle: songTitle 
                    })
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || `HTTP error! Status: ${response.status}`);
                }

                const data = await response.json();

                if (data.meaning) {
                    showResult(data.meaning);
                } else {
                    showError('Tidak ada hasil analisis yang diterima dari server.');
                }

            } catch (error) {
                console.error('Error analyzing lyrics:', error);
                
                if (error.message.includes('fetch')) {
                    showError('Tidak dapat terhubung ke server. Pastikan server berjalan di localhost:3000');
                } else {
                    showError(`Terjadi kesalahan: ${error.message}`);
                }
            } finally {
                hideLoading();
            }
        });

        // Helper functions
        function showLoading() {
            analyzeBtn.disabled = true;
            btnText.classList.add('hidden');
            btnLoading.classList.remove('hidden');
            loadingDiv.classList.remove('hidden');
            hideError();
            hideResult();
        }

        function hideLoading() {
            analyzeBtn.disabled = false;
            btnText.classList.remove('hidden');
            btnLoading.classList.add('hidden');
            loadingDiv.classList.add('hidden');
        }

        function showResult(meaning) {
            // Format the meaning text with proper line breaks and styling
            const formattedMeaning = meaning
                .replace(/\*\*(.*?)\*\*/g, '<strong class="text-purple-700">$1</strong>')
                .replace(/\n\n/g, '</p><p class="mb-4">')
                .replace(/\n/g, '<br>');
            
            meaningContentDiv.innerHTML = `<p class="mb-4">${formattedMeaning}</p>`;
            meaningResultDiv.classList.remove('hidden');
            
            // Smooth scroll to result
            setTimeout(() => {
                meaningResultDiv.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 100);
        }

        function hideResult() {
            meaningResultDiv.classList.add('hidden');
        }

        function showError(message) {
            errorText.textContent = message;
            errorMessageDiv.classList.remove('hidden');
            
            // Auto hide error after 10 seconds
            setTimeout(() => {
                hideError();
            }, 10000);
        }

        function hideError() {
            errorMessageDiv.classList.add('hidden');
        }

        // Auto-resize textarea
        lyricsInput.addEventListener('input', function() {
            this.style.height = 'auto';
            this.style.height = Math.max(200, this.scrollHeight) + 'px';
        });

        // Keyboard shortcut: Ctrl+Enter to submit
        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                if (!analyzeBtn.disabled) {
                    analysisForm.dispatchEvent(new Event('submit'));
                }
            }
        });

        // Focus on lyrics input when page loads
        window.addEventListener('load', () => {
            lyricsInput.focus();
        });
