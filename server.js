const express = require("express");
const path = require("path");
const http = require("http");

const PORT = process.env.PORT || 3000;
const socket = require("socket.io");
const app = express();
const server = http.createServer(app);
const io = socket(server);

app.use(express.static(path.join(__dirname, "public")));

server.listen(PORT, () => console.log("El servidor está corriendo"));
const connection = [null, null];

io.on("connection", (socket) => {
  let playerIndex = -1;
  for (let i in connection) {
    if (connection[i] == null) {
      playerIndex = i;
      break;
    }
  }
  socket.emit("player-number", playerIndex);
  console.log(`Jugador ${player} se ha conectado`);
  if (playerIndex === -1) return;
  connection[playerIndex] = false;

  socket.broadcast.emit("player-connection", playerIndex);
  socket.on("disconnect", () => {
    console.log(`Jugador ${player} se ha desconectado`);
    connection[playerIndex] = null;
    socket.broadcast.emit("player-connection", playerIndex);
  });
  socket.on("player-rady", () => {
    socket.broadcast.emit("enemy-ready", playerIndex);
    connection[playerIndex] = true
  });
  socket.io("check-players", () => {
    const players = []
    for( let i in connection){
        connection[i] === null ? 
        players.push({connected: false, ready: false}) :
        players.push({connected: true, ready: connection[i]})
    }
    socket.emit("check-players", players);
  })
  socket.on("fire", id => {
    console.log(`Disparo de ${playerIndex}`, id)
    socket.broadcast.emit("fire", id);
  })
  socket.on("fire-reply", square => {
    console.log(square)
    socket.broadcast.emit("fire-reply", square);
  })
  setTimeout(() => {
    connection[playerIndex] = null;
    socket.emit("timeout")
    socket.dissconnect()
  }, 600000)
});
