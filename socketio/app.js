const express = require('express');
const http = require('http');
const { Server } = require('socket.io');


const app = express();
const server = http.createServer(app); //서버 실행
const io = new Server(server, {transports:['websocket']}); //소켓 연결. socket.io는 기본적으로 polling 방식과 더불어 websocket 방식도 지원. polling 은 http환경에서 사용하던 채팅 방식으로 리소스 낭비가 심함. 때문에 websocket 방식을 사용하는 것을 권장.

app.use(express.static(__dirname + '/public'));

//기본 페이지 만들기
app.get('/',(req,res)=>{
    res.sendFile(__dirname + '/index.html');
});

//사용자 정보 저장 객체
const users = {};
let userCount = 1;

//사용자 접속시 소켓 연결
io.on('connection',(socket) => {
    const userName = `user${userCount++}`;
    users[socket.id] = userName;
    console.log(`${userName} 사용자가 접속했습니다.`);

    //클라이언트에 유저명 전달
    socket.emit(`set Username`,userName);

    //채팅 메시지 처리
    socket.on('chat message',(msg)=>{
        io.emit('chat message',{user:users[socket.id],text:msg});
    });

    //타이핑 중인 사용자 알림
    socket.on('typing', (username) => {
        socket.broadcast.emit('typing', `${username} is typing...`);
      });

    //연결 종료 처리
    socket.on('disconnect',()=>{
        console.log(`${users[socket.id]} 사용자가 나가셨습니다.`);
        delete users[socket.id];
    });
});

server.listen(3000,()=>{
    console.log('서버가 3000번 포트에서 실행중입니다.');
}); 