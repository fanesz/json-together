const socket = new WebSocket('ws://localhost:5000/ws');

let connect = (cb: any) => {
  console.log("Attempting Connection...");

  socket.onopen = () => {
    console.log("Successfully Connected");
  };

  socket.onmessage = msg => {
    cb(msg);
  };

  socket.onclose = event => {
    console.log("Socket Closed Connection: ", event);
  };

  socket.onerror = error => {
    console.log("Socket Error: ", error);
  };
}

let sendMsg = (msg: any) => {
  console.log("sending msg: ", msg);
  socket.send(msg);
}

export { connect, sendMsg };