const express = require("express");
const router = express.Router();
const {getChatHistory, sendMessageFromServer} = require("../controller/chatController");
const Chat = require("../models/chat.js");

//채팅방 목록 조회
router.get("/rooms", async (req, res) => {
    try {
      console.log("✅ API 호출됨: /chat-rooms");
  
      const chats = await Chat.find({}).lean();
      console.log("✅ DB에서 조회된 전체 데이터:", chats);
  
      if (!chats.length) {
        console.log("❌ MongoDB에서 데이터를 찾을 수 없음.");
      }
  
      const userIds = chats.map(chat => chat.userId);
      console.log("✅ 추출된 userId 목록:", userIds);
  
      const chatRooms = [...new Set(userIds)];
      console.log("✅ 중복 제거된 채팅 목록:", chatRooms);
  
      res.json(chatRooms);
    } catch (err) {
      console.error("❌ Error fetching chat rooms:", err);
      res.status(500).json({ error: "Server error" });
    }
});

//채팅 기록 조회
router.get("/:userId", getChatHistory);

//서버에서 메시지 전송
router.post("/send-message", sendMessageFromServer);

module.exports = router;
