<template>
  <div class="chat-container">
    <h2>Chat Room - {{ userId }}</h2>
    <div class="chat-box">
      <div v-for="(msg, index) in messages" :key="index"
           :class="msg.sender === userId ? 'user-message' : 'server-message'">
        <strong>{{ msg.sender }}:</strong> {{ msg.message }}
      </div>
    </div>
    <input v-model="message" @keyup.enter="sendMessage" placeholder="Type a message..." />
    <button @click="sendMessage">Send</button>
  </div>
</template>


<script>
import {defineComponent, ref, onMounted, computed} from '@vue/composition-api';
import {ref, onMounted} from 'vue';
import io from 'socket.io-client';
import axios from 'axios';

export default {
    props:["userId"],
    setup(props){
        const socket = io("http://localhost:5003",{query:{userId: props.userId}}); //소켓 연결
        const messages = ref([]);
        const message = ref("");

        const loadChatHistory = async () => {
            try{
                const response = await axios.get(`http://localhost:5003/chat/${props.userId}`);
                messages.value = response.data;
            }catch(error){
                console.error("채팅 기록 로드 실패:", error);
            }
        };

        onMounted(()=>{
            loadChatHistory();
            socket.on("receive-message",(msg) => { //서버에서 메시지 수신
                messages.value.push(msg);
            });
        });

        const sendMessage = () => {
            if(message.value.trim()){
                socket.emit("send-message",message.value);
                messages.value.push({sender:props.userId,message:message.value});
                message.value = "";
            }
        };

        return {
            message,
            messages,
            sendMessage
        }
    }
}
</script>

<style scoped>
.home-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  gap: 10px;
}

input {
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 5px;
  width: 250px;
  text-align: center;
}

button {
  padding: 10px 15px;
  font-size: 16px;
  background-color: #007bff;
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 5px;
}

button:hover {
  background-color: #0056b3;
}

h2 {
  margin-top: 20px;
  font-size: 18px;
}

ul {
  list-style: none;
  padding: 0;
  width: 250px;
}

li {
  padding: 10px;
  border: 1px solid #ccc;
  cursor: pointer;
  margin: 5px 0;
  border-radius: 5px;
  text-align: center;
  background-color: #f8f9fa;
}

li:hover {
  background-color: #e9ecef;
}

.no-chat {
  font-size: 14px;
  color: gray;
}
</style>
