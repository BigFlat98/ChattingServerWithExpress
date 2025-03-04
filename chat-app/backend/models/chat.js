const mongoose = require("mongoose");

const ChatSchema = new mongoose.Schema({
    userId:{type: String, required: true}, //룸 구분을 위한 데이터, 우리는 analysisID를 넣어줘야함. socket.join에 사용될 예정
    messages:[{
        sender:{type: String}, //누가 보냈는지 확인하기 위한 데이터 
        message:{type: String}, //메시지 내용
        timestamp:{type: Date, default: Date.now} //메시지 보낸 시간
    }]
},{timestamps: true});

//ChatSchema.index({userId:1}); //userId를 기준으로 검색 최적화, 이건 수업에 없었음. 뭔지 확인해봐야할 듯
const Chat = mongoose.model("Chat",ChatSchema);
module.exports = Chat;