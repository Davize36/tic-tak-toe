<template>
  <div class="glass-wrapper">
    <div class="glass-card">
      <button @click="$emit('go-home')" class="back-btn">⬅ Back</button>

      <h2>Join Room</h2>

      <div class="input-group">
        <label>Enter Room Code</label>
        <input
          v-model="roomCodeInput"
          placeholder="e.g. A1B2C"
          class="room-input"
          maxlength="5"
        />
      </div>

      <button @click="joinRoom" class="start-btn">Join Match</button>
    </div>
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
        alert("Room not found. Check the code and try again.");
        return;
      }

      const roomData = roomSnap.data();
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
.glass-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100dvh;
  padding: 16px;
  width: 100%;
}

.glass-card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 24px;
  padding: 32px 20px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
  text-align: center;
  width: 100%;
  max-width: 380px;
  position: relative;
}

.back-btn {
  position: absolute;
  top: 16px;
  left: 16px;
  padding: 6px 12px;
  font-size: 12px;
  font-weight: 700;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  background: rgba(255, 255, 255, 0.06);
  color: #cbd5e1;
  cursor: pointer;
  transition: 0.2s ease;
}

.back-btn:hover {
  background: rgba(255, 255, 255, 0.15);
}

h2 {
  font-size: 22px;
  font-weight: 800;
  margin-top: 16px;
  margin-bottom: 24px;
}

.input-group {
  margin-bottom: 24px;
  text-align: left;
}

.input-group label {
  display: block;
  font-size: 11px;
  font-weight: 800;
  color: #94a3b8;
  margin-bottom: 6px;
  letter-spacing: 0.5px;
}

.room-input {
  width: 100%;
  padding: 12px 16px;
  font-size: 18px;
  font-weight: 800;
  letter-spacing: 3px;
  text-transform: uppercase;
  text-align: center;
  background: rgba(0, 0, 0, 0.25);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  color: #38bdf8;
  outline: none;
  transition: 0.2s ease;
}

.room-input:focus {
  border-color: rgba(56, 189, 248, 0.5);
  box-shadow: 0 0 15px rgba(56, 189, 248, 0.2);
}

.start-btn {
  width: 100%;
  padding: 14px;
  font-size: 15px;
  font-weight: 700;
  border-radius: 12px;
  border: none;
  background: linear-gradient(135deg, #38bdf8, #0284c7);
  color: #ffffff;
  cursor: pointer;
  box-shadow: 0 8px 20px rgba(56, 189, 248, 0.35);
  transition: 0.2s ease;
}

.start-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 25px rgba(56, 189, 248, 0.5);
}
</style>