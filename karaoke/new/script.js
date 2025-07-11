let songs = [];
let isPaused = false;
let animationSpeed = 50;
let controlsVisible = true;

const songInput = document.getElementById("songInput");
const artistInput = document.getElementById("artistInput");
const addBtn = document.getElementById("addBtn");
const songList = document.getElementById("songList");
const pauseBtn = document.getElementById("pauseBtn");
const shuffleBtn = document.getElementById("shuffleBtn");
const clearBtn = document.getElementById("clearBtn");
const toggleControlsBtn = document.getElementById("toggleControlsBtn");
const controlGroup = document.getElementById("controlGroup");
const speedSlider = document.getElementById("speedSlider");
const speedValue = document.getElementById("speedValue");
const totalSongs = document.getElementById("totalSongs");

// Add sample songs
const sampleSongs = [
  { title: "Bohemian Rhapsody", artist: "Queen" },
  { title: "Hotel California", artist: "Eagles" },
  { title: "Stairway to Heaven", artist: "Led Zeppelin" },
  { title: "Sweet Child O' Mine", artist: "Guns N' Roses" },
  { title: "Billie Jean", artist: "Michael Jackson" },
  { title: "Like a Rolling Stone", artist: "Bob Dylan" },
  { title: "Smells Like Teen Spirit", artist: "Nirvana" },
  { title: "Purple Haze", artist: "Jimi Hendrix" },
  { title: "Yesterday", artist: "The Beatles" },
  { title: "What's Going On", artist: "Marvin Gaye" },
];

// Initialize with sample songs (add to beginning for newest-first order)
sampleSongs.reverse().forEach((song) => {
  addSong(song.title, song.artist);
});

function addSong(title, artist) {
  if (!title.trim() || !artist.trim()) return;

  const song = {
    id: Date.now() + Math.random(),
    title: title.trim(),
    artist: artist.trim(),
  };

  songs.unshift(song); // Add to beginning instead of end
  renderSongs();
  updateStats();
}

function deleteSong(id) {
  songs = songs.filter((song) => song.id !== id);
  renderSongs();
  updateStats();
}

function shuffleSongs() {
  for (let i = songs.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [songs[i], songs[j]] = [songs[j], songs[i]];
  }
  renderSongs();
}

function renderSongs() {
  if (songs.length === 0) {
    songList.innerHTML = `
                    <div class="empty-state">
                        <h3>🎼 No songs yet!</h3>
                        <p>Add some tracks above to start your playlist</p>
                    </div>
                `;
    return;
  }

  // Duplicate songs to create seamless loop
  const duplicatedSongs = [...songs, ...songs];

  songList.innerHTML = [...songs]
    .map(
      (song, index) => `
                <div class="song-item">
                    <div class="song-icon">
                        🎵
                    </div>
                    <div class="song-info">
                        <div class="song-title">${song.title}</div>
                        <div class="song-artist">${song.artist}</div>
                    </div>
                    <div class="song-actions">
                        <button class="delete-btn" onclick="deleteSong(${song.id})">Delete</button>
                    </div>
                </div>
            `
    )
    .join("");

  updateAnimation();
}

function updateAnimation() {
  songList.style.animationDuration = `${animationSpeed}s`;
}

function updateStats() {
  const total = songs.length;
  const nowPlaying =
    songs.length > 0 ? `${songs[0].title} - ${songs[0].artist}` : "No songs";

  totalSongs.textContent = total;
  document.getElementById("nowPlaying").textContent = nowPlaying;
}

// Event listeners
addBtn.addEventListener("click", () => {
  addSong(songInput.value, artistInput.value);
  songInput.value = "";
  artistInput.value = "";
  songInput.focus();
});

songInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    artistInput.focus();
  }
});

artistInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    addSong(songInput.value, artistInput.value);
    songInput.value = "";
    artistInput.value = "";
    songInput.focus();
  }
});

pauseBtn.addEventListener("click", () => {
  isPaused = !isPaused;
  if (isPaused) {
    songList.classList.add("paused");
    pauseBtn.textContent = "▶️ Play";
    pauseBtn.classList.add("active");
  } else {
    songList.classList.remove("paused");
    pauseBtn.textContent = "⏸️ Pause";
    pauseBtn.classList.remove("active");
  }
});

shuffleBtn.addEventListener("click", () => {
  shuffleSongs();
  shuffleBtn.classList.add("active");
  setTimeout(() => shuffleBtn.classList.remove("active"), 300);
});

clearBtn.addEventListener("click", () => {
  if (confirm("Are you sure you want to clear all songs?")) {
    songs = [];
    renderSongs();
    updateStats();
  }
});

toggleControlsBtn.addEventListener("click", () => {
  controlsVisible = !controlsVisible;
  if (controlsVisible) {
    controlGroup.classList.remove("hidden");
    toggleControlsBtn.textContent = "👁️ Hide Controls";
  } else {
    controlGroup.classList.add("hidden");
    toggleControlsBtn.textContent = "👁️ Show Controls";
  }
});

speedSlider.addEventListener("input", (e) => {
  animationSpeed = parseInt(e.target.value);
  speedValue.textContent = `${animationSpeed}s`;
  updateAnimation();
});

// Initialize
renderSongs();
updateStats();
