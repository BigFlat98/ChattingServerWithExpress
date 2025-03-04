const mongoose = require("mongoose");
require("dotenv").config(); //db 환경변수 불러오기

//MongoDB 연결
const connectDB = async()=>{
    try{
        await mongoose.connect(process.env.MONGO_URI,{
            useNewUrlParser: true, //mongoose 6.x 이상에서 사용
            useUnifiedTopology: true, 
        });
        console.log("MongoDB 연결 성공");
    }catch(error){
        console.error("MongoDB 연결 실패:",error);
        process.exit(1);//프로세스 강제 종료. 없으면 연결될 때 까지 반복 실행.
    }
}

module.exports = connectDB;