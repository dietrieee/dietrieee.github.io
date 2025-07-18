// load all songs
function loadInitialSongs() {
  const initialSongs = [];

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
