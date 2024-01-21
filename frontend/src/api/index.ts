const isBrowser = typeof window !== "undefined";
let socket: WebSocket | null = null;

let connect = (cb: any) => {
  try {
    if (isBrowser) {
      console.log("Attempting Connection...");
      socket = new WebSocket('ws://localhost:5000/ws/join?action=join&room_id=CJRIX');

      socket.onopen = () => {
        console.log("Successfully Connected");
      };

      socket.onmessage = (msg) => {
        cb(msg);
      };

      socket.onclose = (event) => {
        console.log("Socket Closed Connection: ", event);
      };

      socket.onerror = (error) => {
        console.error("Socket Error: ", error);
      };
    }
  } catch (error) {
    console.error('Error creating WebSocket:', error);
  }
};

let sendMsg = (msg: any) => {
  console.log("sending msg: ", msg);
  if (socket) {
    socket.send(msg)
  }
}

export { connect, sendMsg };