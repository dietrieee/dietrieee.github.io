// load all songs
function loadInitialSongs() {
  const initialSongs = [
    "Bohemian Rhapsody",
    "Smells Like Teen Spirit",
    "Imagine",
    "Hotel California",
    "Billie Jean",
    "Stairway to Heaven",
    "Sweet Child O' Mine",
    "Hey Jude",
    "Wonderwall",
    "Let It Be",
  ];

  initialSongs.forEach((title) => {
    const uuid = new Date().getTime() + Math.random(); // biar unik
    let _data = { id: uuid, value: title };
    list.push(_data);
    addList(_data, "list");
  });
}

$(document).ready(function () {
  loadInitialSongs(); // ← load otomatis saat halaman dibuka
});
