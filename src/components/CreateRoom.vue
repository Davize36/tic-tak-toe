<template>
  <div class="glass-wrapper">
    <div class="glass-card">
      <button @click="leaveRoom" class="back-btn">⬅ Back</button>

      <h2>Create Room</h2>

      <div class="code-box">
        <span class="code-label">ROOM CODE</span>
        <div class="room-display">{{ roomCode }}</div>
      </div>

      <div class="select-group">
        <label>Pick Your Letter</label>
        <div class="toggle-group">
          <button
            type="button"
            :class="['toggle-btn', { active: playerLetter === 'X' }]"
            @click="playerLetter = 'X'"
          >
            X
          </button>
          <button
            type="button"
            :class="['toggle-btn', { active: playerLetter === 'O' }]"
            @click="playerLetter = 'O'"
          >
            O
          </button>
        </div>
      </div>

      <button @click="createRoom" class="start-btn">Launch Game</button>
    </div>
  </div>
</template>

<script>
import { db } from "../firebase";
import { doc, setDoc, deleteDoc } from "firebase/firestore";

export default {
  data() {
    return {
      roomCode: "",
      playerLetter: "X",
      roomCreated: false,
    };
  },
  mounted() {
    this.generateRoomCode();
  },
  methods: {
    generateRoomCode() {
      this.roomCode = Math.random().toString(36).substring(2, 7).toUpperCase();
    },
    async createRoom() {
      if (!this.roomCode) {
        this.generateRoomCode();
      }

      await setDoc(doc(db, "rooms", this.roomCode), {
        board: ["", "", "", "", "", "", "", "", ""],
        currentPlayer: "X",
        winner: null,
        isDraw: false,
        winningCells: [],
        scores: { X: 0, O: 0 },
        creatorLetter: this.playerLetter,
      });

      this.roomCreated = true;

      this.$emit("start-game", {
        roomCode: this.roomCode,
        playerLetter: this.playerLetter,
      });
    },

    async leaveRoom() {
      if (this.roomCreated && this.roomCode) {
        try {
          await deleteDoc(doc(db, "rooms", this.roomCode));
        } catch (error) {
          console.error("Error deleting room:", error);
        }
      }
      this.$emit("go-home");
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
  margin-bottom: 20px;
}

.code-box {
  background: rgba(0, 0, 0, 0.25);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 14px;
  padding: 14px;
  margin-bottom: 20px;
}

.code-label {
  font-size: 10px;
  font-weight: 800;
  color: #64748b;
  letter-spacing: 1.5px;
}

.room-display {
  font-size: 28px;
  font-weight: 800;
  letter-spacing: 4px;
  color: #38bdf8;
  margin-top: 2px;
}

.select-group {
  margin-bottom: 24px;
}

.select-group label {
  display: block;
  font-size: 12px;
  font-weight: 700;
  color: #94a3b8;
  margin-bottom: 8px;
}

.toggle-group {
  display: flex;
  gap: 8px;
  background: rgba(255, 255, 255, 0.04);
  padding: 4px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.toggle-btn {
  flex: 1;
  padding: 10px;
  font-size: 15px;
  font-weight: 800;
  border: none;
  border-radius: 8px;
  background: transparent;
  color: #64748b;
  cursor: pointer;
  transition: all 0.2s ease;
}

.toggle-btn.active {
  background: rgba(255, 255, 255, 0.15);
  color: #f8fafc;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.start-btn {
  width: 100%;
  padding: 14px;
  font-size: 15px;
  font-weight: 700;
  border-radius: 12px;
  border: none;
  background: linear-gradient(135deg, #6366f1, #4f46e5);
  color: #ffffff;
  cursor: pointer;
  box-shadow: 0 8px 20px rgba(99, 102, 241, 0.35);
  transition: 0.2s ease;
}

.start-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 25px rgba(99, 102, 241, 0.5);
}
</style>