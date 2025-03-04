require("dotenv").config();
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const connectDB = require("./config/db");
const chatRoutes = require("./routes/chatRoutes");
const Chat = require("./models/chat");
const morgan = require("morgan");

connectDB(); //mongodb connection

const app = express();
const server = http.createServer(app);
const io = new Server(server,{
    cors:{origin:"*"}
});

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.use((req,res,next)=>{ //socket통신은 http가 아니기 때문에 이것처럼 핸들러를 만들어줘야함. 지금은 http 처럼 사용할 수 있도록 요청을 잡아주는 코드.
    req.io = io;
    next();
});


app.use((req, res, next) => {
    console.log(`🔍 API 요청 감지됨: ${req.method} ${req.url}`);
    next();
});

//router
app.use("/chat",chatRoutes);

//socket
io.on("connection", (socket) => {//우리같은 경우는 (socket,type) 이런식으로 받아와 아이채팅과 성인 채팅을 구분해 로직을 짜면 될 것 같음.
    //우리는 userID랑 AnalysisID를 받아와야함.
    const userId = socket.handshake.query.userId;
    socket.join(userId); //우린 join에 analysisID를 넣어서 채팅방 구분
    console.log(`✅ User connected: ${userId}`);
  
    socket.on("send-message", async (message) => {
      io.to(userId).emit("receive-message", { sender: userId, message });
  
      // MongoDB에 저장
      await Chat.findOneAndUpdate(
        { userId },//여기도 analysisID를 넣어줘야함.
        { $push: { messages: { sender: userId, message, timestamp: new Date() } } },
        { upsert: true, new: true }
      );
    });
  
    socket.on("disconnect", () => {
      console.log(`❌ User disconnected: ${userId}`);
    });
  });


  const PORT = process.env.PORT || 5000;
  server.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
  })