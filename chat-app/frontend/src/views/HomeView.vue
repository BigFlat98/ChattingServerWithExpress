<template>
  <div class="home-container">
    <h1>채팅방 입장</h1>
    <input v-model="userId" type="text" placeholder="사용자 ID 입력" />
    <button @click="enterChat">채팅방 입장</button>

    <h2>최근 채팅 목록</h2>
    <ul v-if="chatRooms.length > 0">
      <li v-for="chat in chatRooms" :key="chat" @click="enterExistingChat(chat)">
        {{ chat }}
      </li>
    </ul>
    <p v-else class="no-chat">저장된 채팅이 없습니다.</p>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";

export default {
  setup() {
    const router = useRouter();
    const userId = ref("");
    const chatRooms = ref([]);

    // ✅ 사용자가 새로운 채팅방에 입장
    const enterChat = () => {
      if (userId.value.trim()) {
        router.push(`/chat/${userId.value}`); // 사용자의 ID를 기반으로 채팅방 이동
      } else {
        alert("사용자 ID를 입력해주세요!");
      }
    };

    // ✅ 기존 채팅방 클릭 시 해당 채팅방으로 이동
    const enterExistingChat = (chatId) => {
      router.push(`/chat/${chatId}`);
    };

    // ✅ 최근 채팅 목록 불러오기 (백엔드에서 가져오기)
    const loadChatRooms = async () => {
      try {
        const res = await axios.get("http://localhost:5003/chat/rooms");  // ✅ MongoDB에서 사용자 ID 목록 가져오기
        chatRooms.value = res.data;
        console.log("✅ 채팅 목록 불러오기 성공:", res.data);
      } catch (error) {
        console.error("❌ Error loading chat rooms:", error);
      }
    };

    // ✅ 컴포넌트가 마운트되면 채팅 목록 불러오기
    onMounted(() => {
      loadChatRooms();
    });

    return { userId, enterChat, chatRooms, enterExistingChat };
  },
};
</script>

<style>
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
