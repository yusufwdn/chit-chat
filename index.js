var express = require("express");
var http = require("http");

var app = express();
var server = http.createServer(app);

var io = require("socket.io")(server);

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/src/index.html");
});

var name;

/** socket.io connect */
io.on("connection", (socket) => {
  /** Menampilkan log untuk mendeteksi ketika ada user baru bergabung */
  console.log("Seseorang telah bergabung");

  /** Event ketika terdapat user yang baru bergabung */
  socket.on("join", (username) => {
    /** Berikan value dari parameter username ke variabel name */
    name = username;

    /** Hit event 'info' */
    io.emit("info", `${name} telah bergabung`);
  });

  /** Event untuk mendeteksi user yang disconnect */
  socket.on("disconnect", () => {
    /** Menampilkan log untuk mendeteksi ketika ada user yang keluar */
    console.log(`${name} telah keluar`);

    /** Hit event 'info' */
    io.emit("info", `${name} keluar`);
  });

  /** Kirim info user bergabung/keluar ke semua orang, kecuali yang user terkait */
  socket.on("info", (message) => {
    socket.broadcast.emit("info", message);
  });

  /** Kirim pesan ke semua orang, kecuali yang mengirimnya */
  socket.on("sendMessage", (data) => {
    socket.broadcast.emit("sendMessage", data);
  });
});

/** Jalankan server di port 3000 */
server.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});
