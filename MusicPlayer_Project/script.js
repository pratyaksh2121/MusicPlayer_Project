// Playlist. Replace the src links with your own mp3 files if you want
// (e.g. "songs/mysong.mp3"). These demo tracks are free sample music.
const songs = [
  {
    title: "Sunrise Drive",
    artist: "SoundHelix",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    cover: "https://picsum.photos/id/1015/400/400"
  },
  {
    title: "Night Walk",
    artist: "SoundHelix",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    cover: "https://picsum.photos/id/1018/400/400"
  },
  {
    title: "Slow River",
    artist: "SoundHelix",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    cover: "https://picsum.photos/id/1039/400/400"
  },
  {
    title: "City Rain",
    artist: "SoundHelix",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
    cover: "https://picsum.photos/id/1048/400/400"
  }
];

const audio = document.getElementById("audio");
const player = document.querySelector(".player");
const cover = document.getElementById("cover");
const titleEl = document.getElementById("title");
const artistEl = document.getElementById("artist");
const playBtn = document.getElementById("play");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");
const progress = document.getElementById("progress");
const currentTimeEl = document.getElementById("currentTime");
const durationEl = document.getElementById("duration");
const volume = document.getElementById("volume");
const autoplay = document.getElementById("autoplay");
const playlistEl = document.getElementById("playlist");

let index = 0;
let isPlaying = false;

// turns seconds into m:ss
function formatTime(sec) {
  if (isNaN(sec)) return "0:00";
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return m + ":" + (s < 10 ? "0" + s : s);
}

function loadSong(i) {
  const song = songs[i];
  audio.src = song.src;
  cover.src = song.cover;
  titleEl.textContent = song.title;
  artistEl.textContent = song.artist;
  progress.value = 0;
  currentTimeEl.textContent = "0:00";
  durationEl.textContent = "0:00";

  // highlight the song in the playlist
  document.querySelectorAll(".playlist li").forEach((li, n) => {
    li.classList.toggle("active", n === i);
  });
}

function playSong() {
  audio.play().then(() => {
    isPlaying = true;
    player.classList.add("playing");
    playBtn.innerHTML = "&#10074;&#10074;";
  }).catch(err => {
    console.log("Could not play:", err);
  });
}

function pauseSong() {
  audio.pause();
  isPlaying = false;
  player.classList.remove("playing");
  playBtn.innerHTML = "&#9654;";
}

function nextSong() {
  index = (index + 1) % songs.length;
  loadSong(index);
  playSong();
}

function prevSong() {
  // if the song is already past 3 seconds, restart it instead
  if (audio.currentTime > 3) {
    audio.currentTime = 0;
    return;
  }
  index = (index - 1 + songs.length) % songs.length;
  loadSong(index);
  playSong();
}

// playlist list
songs.forEach((song, i) => {
  const li = document.createElement("li");
  li.innerHTML = `<span>${song.title}</span><span>${song.artist}</span>`;
  li.addEventListener("click", () => {
    index = i;
    loadSong(index);
    playSong();
  });
  playlistEl.appendChild(li);
});

// button events
playBtn.addEventListener("click", () => {
  isPlaying ? pauseSong() : playSong();
});
nextBtn.addEventListener("click", nextSong);
prevBtn.addEventListener("click", prevSong);

// audio events
audio.addEventListener("loadedmetadata", () => {
  durationEl.textContent = formatTime(audio.duration);
});

audio.addEventListener("timeupdate", () => {
  if (!audio.duration) return;
  progress.value = (audio.currentTime / audio.duration) * 100;
  currentTimeEl.textContent = formatTime(audio.currentTime);
});

audio.addEventListener("ended", () => {
  if (autoplay.checked) {
    nextSong();
  } else {
    pauseSong();
    audio.currentTime = 0;
  }
});

// seek when the user moves the progress bar
progress.addEventListener("input", () => {
  if (!audio.duration) return;
  audio.currentTime = (progress.value / 100) * audio.duration;
});

// volume
audio.volume = volume.value;
volume.addEventListener("input", () => {
  audio.volume = volume.value;
});

// spacebar = play/pause
document.addEventListener("keydown", e => {
  if (e.code === "Space" && e.target.tagName !== "INPUT") {
    e.preventDefault();
    isPlaying ? pauseSong() : playSong();
  }
});

loadSong(index);
