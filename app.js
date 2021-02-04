const zmq = require("zeromq");
const symbol_sdk = require("symbol-sdk");
const level = require("level");
const io = require("socket.io")({
  cors: {
    origin: "*"
  }
});

const db = level("transactions");

io.listen(8000);

const hashNotExists = async hash => {
  return new Promise((resolve, reject) => {
    db.get(hash, (err, value) => {
      if(err){
        if(err.notFound){
          resolve(true);
        }else{
          reject();
        }
      }else{
        resolve(false);
      }
    });
  });
};

const insertHash = async hash => {
  return new Promise((resolve, reject) => {
    db.put(hash, "", (err) => {
      if(err){
        reject();
      }else{
        resolve();
      }
    });
  });
};

process.on("exit", function() {
  db.close();
});

process.on("SIGINT", function() {
  process.exit(0);
});

(async () => {
  const sock = new zmq.Subscriber();
  sock.connect("tcp://api-01.ap-northeast-1.testnet.symboldev.network:7902");
  sock.subscribe("u");
  sock.subscribe(Buffer.from("496ACA80E4D8F29F", "hex"));
  console.log("Connected");

  for await (const [topic, body1, body2, body3] of sock) {
    const firstByte = topic.readInt8(0);

    if(firstByte === 0x75){
      const payload = body1.toString("hex");
      const hash = body2.toString("hex")

      const notExists = await hashNotExists(hash).catch(() => false);
      if (notExists) {
        await insertHash(hash).catch(() => false);
        io.emit("newUnconfirmedTx", {hash, payload});
      }
    }else if(Buffer.from("496ACA80E4D8F29F", "hex").equals(topic.slice(0, 8))){
      const payload = body1.toString("hex");
      const hash = body2.toString("hex");
      io.emit("newBlock", {hash, payload});
    }
  }
})();
