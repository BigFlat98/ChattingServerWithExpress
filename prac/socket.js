const WebSocket = require('ws');

module.exports = (server) =>{
    //웹소켓 서버 생성
    const wss = new WebSocket.Server({ server });

    //클라이언트 접속 감지
    wss.on('connection',(ws,req)=>{//ws -> WebSocket 연결이 성공적으로 수립된 후 생성되는 WebSocket 객체, req -> HTTP 업그레이드 요청에 대한 정보를 담고 있는 객체, 클라이언트의 요청 정보를 확인
        //ws.send(): 클라이언트에게 메시지를 전송
        //ws.on('message', callback): 클라이언트로부터 메시지 수신
        //ws.close(): 연결 종료
        //ws.on('close', callback): 연결 종료 감지

        //req.headers: 요청 헤더 정보
        //req.connection: TCP 연결 정보
        //req.url: 요청 URL
        //req.method: HTTP 메서드

        //클라이언트의 접속 정보 확인
        const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        console.log('새로운 클라이언트 접속', ip);

        //클라이언트로부터 메시지 수신
        ws.on('message',(message)=>{
            console.log(message.toString());
        });

        //웹소켓 오류 발생 감지
        ws.on('error',(error)=>{
            console.log('웹소켓 오류 발생', error);
        });

        //클라이언트 접속 해제 감지
        ws.on('close',()=>{
            console.log('클라이언트 접속 해제', ip);
            clearInterval(ws.interval); // 클라이언트 접속 해제 시 타이머 초기화
        });

        ws.interval = setInterval(()=>{
            if(ws.readyState === ws.OPEN){
                ws.send("서버에서 클라이언트로 메시지 전송");
            }
        },3000);//3초마다 서버에서 클라이언트로 메시지 전송


    });
}