<template>
  <div class="join-container">
    <h2>Join Room</h2>

    <input
      v-model="roomCodeInput"
      placeholder="Enter Room Code"
      class="room-input"
    />

    <button @click="joinRoom" class="start-btn">Join Game</button>
    <button @click="$emit('go-home')" class="back-btn">⬅️ Back</button>
  </div>
</template>

<script>
import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";

export default {
  data() {
    return {
      roomCodeInput: "",
    };
  },
  methods: {
    async joinRoom() {
      const formattedCode = this.roomCodeInput.trim().toUpperCase();

      if (!formattedCode) {
        alert("Please enter a room code.");
        return;
      }

      const roomRef = doc(db, "rooms", formattedCode);
      const roomSnap = await getDoc(roomRef);

      if (!roomSnap.exists()) {
        alert("Room not found. Please check the code.");
        return;
      }

      const roomData = roomSnap.data();
      
      // Auto-assign the opposite letter of creator, or default to O
      let assignedLetter = "O";
      if (roomData.creatorLetter) {
        assignedLetter = roomData.creatorLetter === "X" ? "O" : "X";
      }

      this.$emit("start-game", {
        roomCode: formattedCode,
        playerLetter: assignedLetter,
      });
    },
  },
};
</script>

<style scoped>
.join-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  font-family: sans-serif;
  background: #fdfdfd;
}

h2 {
  font-size: 36px;
  margin-bottom: 20px;
  color: #333;
}

.room-input {
  padding: 12px;
  font-size: 18px;
  border: 1px solid #ccc;
  border-radius: 8px;
  margin-bottom: 20px;
  width: 220px;
  text-transform: uppercase;
}

.start-btn {
  padding: 15px 30px;
  font-size: 18px;
  border: none;
  background: #333;
  color: #fff;
  border-radius: 8px;
  cursor: pointer;
  transition: 0.2s ease;
}

.start-btn:hover {
  background: #444;
}

.back-btn {
  position: absolute;
  top: 20px;
  left: 20px;
  padding: 8px 16px;
  font-size: 14px;
  border: none;
  background: #ccc;
  color: #333;
  border-radius: 6px;
  cursor: pointer;
  transition: 0.2s ease;
}

.back-btn:hover {
  background: #bbb;
}
</style>