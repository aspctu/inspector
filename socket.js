const ws = require("ws");
const wss = new ws.WebSocketServer({ port: 8085 });

function sendChange(change, filepath) {
  wss.clients.forEach(function each(client) {
    if (client.readyState === ws.WebSocket.OPEN) {
      client.send(
        JSON.stringify({ type: "change", change: change, fp: filepath })
      );
    }
  });
}

wss.on("connection", function connection(ws) {
  ws.on("message", function incoming(message) {
    log(message);
  });
});

module.exports = {
  sendChange,
};
