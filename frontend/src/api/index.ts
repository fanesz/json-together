const isBrowser = typeof window !== "undefined";
const socket = isBrowser ? new WebSocket('ws://localhost:5000/ws/join') : null;

let connect = (cb: any) => {
  console.log("Attempting Connection...");
  if (socket) {
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
}

let sendMsg = (msg: any) => {
  console.log("sending msg: ", msg);
  if (socket) {
    // socket.send(JSON.stringify({
    //   room_id: 1,
    //   data: msg
    // }));
    socket.send(msg)
  }
}

export { connect, sendMsg };