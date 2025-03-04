<template>
  <div class="chat-container">
    <h2 class="chat-header">채팅방: {{ userId }}</h2>
    <button class="exit-btn" @click="exitChat">나가기</button>
    <div class="chat-box">
      <div v-for="(msg, index) in messages" :key="index"
           :class="msg.sender === userId ? 'user-message' : 'server-message'">
        <strong>{{ msg.sender }}:</strong> {{ msg.message }}
      </div>
    </div>
    <div class="chat-input">
      <input v-model="message" @keyup.enter="sendMessage" placeholder="메시지 입력..." />
      <button @click="sendMessage">Send</button>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { io } from "socket.io-client";
import axios from "axios";

export default {
  setup() {
    const route = useRoute();
    const router = useRouter();
    const userId = ref(route.params.id);
    const socket = io("http://localhost:5003", { query: { userId: userId.value } });
    const messages = ref([]);
    const message = ref("");

    // ✅ 이전 채팅 기록 불러오기
    const loadChatHistory = async () => {
      try {
        const res = await axios.get(`http://localhost:5003/chat/${userId.value}`);
        messages.value = res.data;
      } catch (error) {
        console.error("Error loading chat history:", error);
      }
    };

    onMounted(() => {
      loadChatHistory();
      socket.on("receive-message", (msg) => messages.value.push(msg));
    });

    onUnmounted(() => {
      socket.disconnect();
    });

    // ✅ 메시지 전송
    const sendMessage = () => {
      if (message.value.trim()) {
        socket.emit("send-message", message.value);
        message.value = ""; // 입력창 초기화
      }
    };

    // ✅ 채팅방 나가기
    const exitChat = () => {
      router.push("/");
    };

    return { messages, message, sendMessage, exitChat, userId };
  },
};
</script>

<style scoped>
.chat-container {
  display: flex;
  flex-direction: column;
  width: 400px;
  margin: auto;
  height: 100vh;
  justify-content: space-between;
}

.chat-header {
  text-align: center;
  background-color: #007bff;
  color: white;
  padding: 10px;
  font-size: 18px;
}

.chat-box {
  flex: 1;
  overflow-y: auto;
  border: 1px solid #ccc;
  padding: 10px;
}

.user-message {
  text-align: right;
  background-color: #d1e7dd;
  padding: 5px;
  border-radius: 5px;
  margin: 5px 0;
}

.server-message {
  text-align: left;
  background-color: #f8d7da;
  padding: 5px;
  border-radius: 5px;
  margin: 5px 0;
}

.chat-input {
  display: flex;
  padding: 10px;
  border-top: 1px solid #ccc;
}

.chat-input input {
  flex: 1;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.chat-input button {
  padding: 10px;
  margin-left: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 5px;
}

.chat-input button:hover {
  background-color: #0056b3;
}
</style>
