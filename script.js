const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
const synth = window.speechSynthesis;

const statusText = document.getElementById('status');
const transcriptText = document.getElementById('transcript');
const orb = document.getElementById('orb');
const movieContainer = document.getElementById('movie-results');
const modalOverlay = document.getElementById('modal-overlay');
const guideText = document.getElementById('guide-text');

const TMDB_KEY = '5348b46c982c351bef0f233ac2f5eb6f';
const IMG_BASE_URL = 'https://image.tmdb.org/t/p/w500';

// CONTEXTUAL GUIDE LOGIC
let currentUIState = 'home'; // home | results | modal
const contextPhrases = {
    home: ['"Search for Batman"', '"Find Horror movies"', '"Hello"', '"Hey VoiceFlix"'],
    results: ['"Select Movie Number 1"', '"Scroll Down"', '"Search for Action"', '"Go Home"'],
    modal: ['"Close"', '"Play Movie"', '"Go Back"']
};

let phraseIndex = 0;
function updateVoiceGuide() {
    const list = contextPhrases[currentUIState];
    phraseIndex = (phraseIndex + 1) % list.length;
    guideText.innerText = `Try saying: ${list[phraseIndex]}`;
}
setInterval(updateVoiceGuide, 4000);

recognition.continuous = true;
recognition.lang = 'en-US';
recognition.interimResults = false;

// 1. Audio Visualizer
let audioContext, analyser, dataArray;
function createWave() {
    const wave = document.createElement('div');
    wave.className = 'visualizer-wave';
    document.getElementById('orb-container').appendChild(wave);
    setTimeout(() => wave.remove(), 2000);
}

async function startVisualizer() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        audioContext = new AudioContext();
        analyser = audioContext.createAnalyser();
        const source = audioContext.createMediaStreamSource(stream);
        source.connect(analyser);
        analyser.fftSize = 32;
        dataArray = new Uint8Array(analyser.frequencyBinCount);

        function draw() {
            requestAnimationFrame(draw);
            analyser.getByteFrequencyData(dataArray);
            const volume = dataArray.reduce((a, b) => a + b) / dataArray.length;
            if (volume > 50) {
                orb.style.transform = `scale(${1 + volume/200})`;
                if (volume > 100) createWave();
            }
        }
        draw();
    } catch(e) { console.error("Mic access denied for visualizer"); }
}

// 2. Speech
function speak(text) {
    return new Promise((resolve) => {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.onstart = () => recognition.stop();
        utterance.onend = () => { try { recognition.start(); } catch(e) {} resolve(); };
        synth.speak(utterance);
    });
}

function openModal(movie) {
    currentUIState = 'modal'; // Update State
    modalOverlay.classList.remove('hidden');
    document.getElementById('modal-content').innerHTML = `
        <img src="${IMG_BASE_URL}${movie.poster_path}" style="width:200px; border-radius:8px; margin-bottom:15px;" onerror="this.src='https://via.placeholder.com/500x750?text=No+Poster'">
        <h2 style="color:white; margin:0;">${movie.title}</h2>
        <p style="color:#aaa; font-size:0.9rem; margin:15px 0;">${movie.overview || 'No description available.'}</p>
        <button class="play-btn-red">Play Movie</button>
    `;
    speak(`Opening ${movie.title}.`);
}

async function handleVoiceCommand(message) {
    const input = message.toLowerCase();

    if (input.includes('close') || input.includes('go back')) {
        modalOverlay.classList.add('hidden');
        currentUIState = movieContainer.classList.contains('hidden') ? 'home' : 'results';
        return;
    }

    if (input.includes('select movie number') || input.includes('choose number')) {
        const num = parseInt(input.match(/\d+/));
        const cards = document.querySelectorAll('.movie-card');
        if (cards[num - 1]) {
            const movieData = JSON.parse(cards[num - 1].dataset.info);
            openModal(movieData);
            cards[num - 1].scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        return;
    }

    if (input.includes('scroll down')) { window.scrollBy(0, 600); return; }
    if (input.includes('scroll up')) { window.scrollBy(0, -600); return; }

    if (input.includes('search') || input.includes('find')) {
        const query = input.split('search')[1] || input.split('find')[1];
        statusText.innerText = `Searching: ${query}`;
        await speak(`Searching for ${query}.`);
        fetchMovies(`https://api.themoviedb.org/3/search/movie?api_key=${TMDB_KEY}&query=${encodeURIComponent(query)}`);
    } 
    else if (input.includes('hello') || input.includes('hi') || input.includes('hey')) {
        await speak("Hello. Ready for your commands.");
    }
    else if (input.includes('home') || input.includes('reset') || input.includes('go back')) {
        location.reload();
    }
}

// 3. API
async function fetchMovies(url) {
    const res = await fetch(url);
    const data = await res.json();
    displayPosters(data.results);
}

function displayPosters(movies) {
    currentUIState = 'results'; // Update State
    orb.style.width = '60px'; orb.style.height = '60px';
    movieContainer.innerHTML = '';
    movieContainer.classList.remove('hidden');

    movies.slice(0, 16).forEach((movie, index) => {
        const card = document.createElement('div');
        card.className = "movie-card";
        card.dataset.info = JSON.stringify(movie);
        const poster = movie.poster_path ? IMG_BASE_URL + movie.poster_path : 'https://via.placeholder.com/500x750?text=No+Poster';
        
        card.innerHTML = `
            <div class="movie-number">${index + 1}</div>
            <img src="${poster}" alt="${movie.title}" onerror="this.src='https://via.placeholder.com/500x750?text=No+Poster'">
        `;
        movieContainer.appendChild(card);
    });
}

// 4. Init
recognition.onresult = (event) => {
    const transcript = event.results[event.results.length - 1][0].transcript;
    transcriptText.innerText = transcript;
    handleVoiceCommand(transcript);
};

recognition.onend = () => { if (!synth.speaking) recognition.start(); };

document.body.onclick = () => {
    recognition.start();
    startVisualizer();
    statusText.innerText = "System Active";
    speak("Voice system activated.");
};