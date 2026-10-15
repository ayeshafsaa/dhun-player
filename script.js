// ---------- Songs list ----------
const songs = [
    {
      title: "Wonders of the Earth",
      artist: "Grand_Project",
      src: "assets/songs/song1.mp3",
      cover: "assets/covers/cover1.jpg",
      color: "#0f766e"
    },
    {
      title: "Sports Rock Music",
      artist: "lNPLUSMUSIC",
      src: "assets/songs/song2.mp3",
      cover: "assets/covers/cover2.jpg",
      color: "#b91c1c"
    },
    {
      title: "Suspenseful Tense",
      artist: "lNPLUSMUSIC",
      src: "assets/songs/song3.mp3",
      cover: "assets/covers/cover3.jpg",
      color: "#6d28d9"
    }
  ];
  
  // ---------- Elements ----------
  const app = document.getElementById("app");
  const audio = document.getElementById("audio");
  
  const homeView = document.getElementById("home-view");
  const playerView = document.getElementById("player-view");
  
  const tabAll = document.getElementById("tab-all");
  const tabFav = document.getElementById("tab-fav");
  const songListEl = document.getElementById("song-list");
  const emptyMsg = document.getElementById("empty-msg");
  
  const miniPlayer = document.getElementById("mini-player");
  const miniCover = document.getElementById("mini-cover");
  const miniTitle = document.getElementById("mini-title");
  const miniArtist = document.getElementById("mini-artist");
  const miniPlay = document.getElementById("mini-play");
  
  const backBtn = document.getElementById("back-btn");
  const coverBox = document.getElementById("cover-box");
  const coverImg = document.getElementById("cover");
  const titleEl = document.getElementById("title");
  const artistEl = document.getElementById("artist");
  const favBtn = document.getElementById("fav-btn");
  
  const progress = document.getElementById("progress");
  const currentTimeEl = document.getElementById("current-time");
  const durationEl = document.getElementById("duration");
  
  const playBtn = document.getElementById("play");
  const prevBtn = document.getElementById("prev");
  const nextBtn = document.getElementById("next");
  const shuffleBtn = document.getElementById("shuffle");
  const repeatBtn = document.getElementById("repeat");
  const volume = document.getElementById("volume");
  const upNextEl = document.getElementById("up-next");
  
  // ---------- State ----------
  let currentIndex = -1;
  let isPlaying = false;
  let isShuffle = false;
  let isRepeat = false;
  let showFavOnly = false;
  let favourites = [];
  
  progress.step = 0.1;
  
  // ---------- Favourites (localStorage) ----------
  function loadFavourites() {
    try {
      const saved = localStorage.getItem("favSongs");
      favourites = saved ? JSON.parse(saved) : [];
    } catch (e) {
      favourites = [];
    }
  }
  
  function saveFavourites() {
    try {
      localStorage.setItem("favSongs", JSON.stringify(favourites));
    } catch (e) {
      console.log("Could not save favourites");
    }
  }
  
  function isFav(index) {
    return favourites.includes(songs[index].src);
  }
  
  function toggleFav(index) {
    const id = songs[index].src;
    if (favourites.includes(id)) {
      favourites = favourites.filter((f) => f !== id);
    } else {
      favourites.push(id);
    }
    saveFavourites();
    renderHome();
    updateFavButton();
  }
  
  function updateFavButton() {
    if (currentIndex < 0) return;
    const liked = isFav(currentIndex);
    favBtn.classList.toggle("liked", liked);
    favBtn.innerHTML = liked
      ? '<i class="fa-solid fa-heart"></i>'
      : '<i class="fa-regular fa-heart"></i>';
  }
  
  // ---------- Helpers ----------
  function formatTime(sec) {
    if (isNaN(sec)) return "0:00";
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return m + ":" + (s < 10 ? "0" : "") + s;
  }
  
  function showView(name) {
    homeView.classList.toggle("active", name === "home");
    playerView.classList.toggle("active", name === "player");
    window.scrollTo(0, 0);
  }
  
  // ---------- Create one song row ----------
  function createSongItem(index, onClick) {
    const song = songs[index];
    const li = document.createElement("li");
    li.className = "song-item";
    if (index === currentIndex) li.classList.add("active");
  
    const liked = isFav(index);
    li.innerHTML =
      '<img src="' + song.cover + '" alt="">' +
      '<div class="song-meta"><h4>' + song.title + "</h4><p>" + song.artist + "</p></div>" +
      '<button class="item-fav ' + (liked ? "liked" : "") + '">' +
      '<i class="' + (liked ? "fa-solid" : "fa-regular") + ' fa-heart"></i></button>';
  
    li.addEventListener("click", onClick);
  
    li.querySelector(".item-fav").addEventListener("click", (e) => {
      e.stopPropagation();
      toggleFav(index);
    });
  
    return li;
  }
  
  // ---------- Home list ----------
  function renderHome() {
    songListEl.innerHTML = "";
    let count = 0;
  
    songs.forEach((song, index) => {
      if (showFavOnly && !isFav(index)) return;
      songListEl.appendChild(createSongItem(index, () => openSong(index)));
      count++;
    });
  
    emptyMsg.style.display = showFavOnly && count === 0 ? "block" : "none";
  }
  
  // ---------- Up Next list ----------
  function renderUpNext() {
    upNextEl.innerHTML = "";
    for (let i = 1; i < songs.length; i++) {
      const index = (currentIndex + i) % songs.length;
      upNextEl.appendChild(
        createSongItem(index, () => {
          loadSong(index);
          playSong();
        })
      );
    }
  }
  
  // ---------- Load / Play / Pause ----------
  function loadSong(index) {
    currentIndex = index;
    const song = songs[index];
  
    audio.src = song.src;
    titleEl.textContent = song.title;
    artistEl.textContent = song.artist;
    coverImg.src = song.cover;
  
    miniCover.src = song.cover;
    miniTitle.textContent = song.title;
    miniArtist.textContent = song.artist;
    miniPlayer.classList.add("show");
  
    app.style.setProperty("--c1", song.color);
  
    progress.value = 0;
    currentTimeEl.textContent = "0:00";
    durationEl.textContent = "0:00";
  
    updateFavButton();
    renderUpNext();
    renderHome();
  }
  
  function updatePlayIcons() {
    const icon = isPlaying
      ? '<i class="fa-solid fa-pause"></i>'
      : '<i class="fa-solid fa-play"></i>';
    playBtn.innerHTML = icon;
    miniPlay.innerHTML = icon;
    coverBox.classList.toggle("playing", isPlaying);
  }
  
  function playSong() {
    audio.play().catch((err) => console.log("Play error:", err));
    isPlaying = true;
    updatePlayIcons();
  }
  
  function pauseSong() {
    audio.pause();
    isPlaying = false;
    updatePlayIcons();
  }
  
  function togglePlay() {
    isPlaying ? pauseSong() : playSong();
  }
  
  function nextSong() {
    if (isShuffle) {
      let random;
      do {
        random = Math.floor(Math.random() * songs.length);
      } while (random === currentIndex && songs.length > 1);
      loadSong(random);
    } else {
      loadSong((currentIndex + 1) % songs.length);
    }
    playSong();
  }
  
  function prevSong() {
    if (audio.currentTime > 3) {
      audio.currentTime = 0;
      return;
    }
    loadSong((currentIndex - 1 + songs.length) % songs.length);
    playSong();
  }
  
  // Home se song kholna
  function openSong(index) {
    if (index !== currentIndex) {
      loadSong(index);
      playSong();
    }
    showView("player");
  }
  
  // ---------- Button events ----------
  playBtn.addEventListener("click", togglePlay);
  nextBtn.addEventListener("click", nextSong);
  prevBtn.addEventListener("click", prevSong);
  
  miniPlay.addEventListener("click", (e) => {
    e.stopPropagation();
    togglePlay();
  });
  
  miniPlayer.addEventListener("click", () => showView("player"));
  
  backBtn.addEventListener("click", () => {
    renderHome();
    showView("home");
  });
  
  favBtn.addEventListener("click", () => {
    if (currentIndex >= 0) toggleFav(currentIndex);
  });
  
  shuffleBtn.addEventListener("click", () => {
    isShuffle = !isShuffle;
    shuffleBtn.classList.toggle("active", isShuffle);
  });
  
  repeatBtn.addEventListener("click", () => {
    isRepeat = !isRepeat;
    repeatBtn.classList.toggle("active", isRepeat);
  });
  
  // ---------- Tabs ----------
  tabAll.addEventListener("click", () => {
    showFavOnly = false;
    tabAll.classList.add("active");
    tabFav.classList.remove("active");
    renderHome();
  });
  
  tabFav.addEventListener("click", () => {
    showFavOnly = true;
    tabFav.classList.add("active");
    tabAll.classList.remove("active");
    renderHome();
  });
  
  // ---------- Audio events ----------
  audio.addEventListener("loadedmetadata", () => {
    durationEl.textContent = formatTime(audio.duration);
  });
  
  audio.addEventListener("timeupdate", () => {
    if (audio.duration) {
      progress.value = (audio.currentTime / audio.duration) * 100;
      currentTimeEl.textContent = formatTime(audio.currentTime);
    }
  });
  
  // Autoplay: song khatam hone par agla song
  audio.addEventListener("ended", () => {
    if (isRepeat) {
      audio.currentTime = 0;
      playSong();
    } else {
      nextSong();
    }
  });
  
  // ---------- Seek and Volume ----------
  progress.addEventListener("input", () => {
    if (audio.duration) {
      audio.currentTime = (progress.value / 100) * audio.duration;
    }
  });
  
  volume.addEventListener("input", () => {
    audio.volume = volume.value;
  });
  
  // ---------- Start ----------
  audio.volume = volume.value;
  loadFavourites();
  renderHome();