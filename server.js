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

io.on("connection", socket => {
    let playerIndex = -1;
    for(let i in connection){
        if(connections[i] == null){
            playerIndex = i
            break;
        }

    }
})



