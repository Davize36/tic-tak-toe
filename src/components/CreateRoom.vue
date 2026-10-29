<template>
  <div class="create-container">
    <h2>Create Room</h2>

    <p class="room-code">Your Room Code:</p>
    <div class="room-display">{{ roomCode }}</div>

    <label class="label">Pick Your Letter:</label>
    <select v-model="playerLetter" class="letter-select">
      <option value="X">X</option>
      <option value="O">O</option>
    </select>

    <button @click="createRoom" class="start-btn">Start Game</button>
    <button @click="$emit('go-home')" class="back-btn">⬅️ Back</button>
  </div>
</template>

<script>
import { db } from "../firebase";
import { doc, setDoc } from "firebase/firestore";

export default {
  data() {
    return {
      roomCode: Math.random().toString(36).substr(2, 5).toUpperCase(),
      playerLetter: "X",
    };
  },
  methods: {
    async createRoom() {
      await setDoc(doc(db, "rooms", this.roomCode), {
        board: ["", "", "", "", "", "", "", "", ""],
        currentPlayer: "X",
        winner: null,
        isDraw: false,
        winningCells: [],
        scores: {
          X: 0,
          O: 0,
        },
      });

      this.$emit("start-game", {
        roomCode: this.roomCode,
        playerLetter: this.playerLetter,
      });
    },
  },
};
</script>

<style scoped>
.create-container {
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

.room-code {
  font-size: 18px;
  margin-bottom: 8px;
  color: #555;
}

.room-display {
  padding: 12px 20px;
  font-size: 22px;
  background: #eee;
  border-radius: 8px;
  margin-bottom: 20px;
  width: 180px;
  text-align: center;
  font-weight: bold;
}

.label {
  font-size: 18px;
  margin-bottom: 8px;
}

.letter-select {
  padding: 10px;
  font-size: 16px;
  border-radius: 8px;
  border: 1px solid #ccc;
  margin-bottom: 20px;
  width: 120px;
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