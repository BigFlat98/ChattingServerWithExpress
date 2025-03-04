const Chat = require("../models/chat");

//사용자 채팅 기록 조회
const getChatHistory = async(req,res)=>{
    const {userId} = req.params;
    try{
        const chat = await Chat.findOne({userId});
        res.status(200).json(chat ? chat.messages : []);
    }catch(error){
        res.status(500).json({error: "채팅 기록 조회 실패"});
    }
};

//서버에서 메시지 전송 -> llm의 응답을 전달할 때 사용할 메서드
const sendMessageFromServer = async(req,res) => {
    const {userId, message} = req.body;
    try{
        req.io.to(userId).emit("receive-message",{sender: "llm",message});
        await Chat.findOneAndUpdate(
            {userId},
            {$push: {messages: {sender: "llm",message, timestamp: new Date()}}},
            {upsert: true, new: true}//upsert: true는 존재하지 않는 경우 생성, new: true는 생성된 데이터 반환
        );
        res.status(200).json({success: true, message: "메시지 전송 성공"});
    }catch(error){
        res.status(500).json({error: "메시지 전송 실패"});
    }
};

module.exports = {getChatHistory, sendMessageFromServer};