<template>
  <div class="app-viewport">
    <CreateRoom v-if="page === 'create'" @start-game="startGame" @go-home="goHome"/>
    <JoinRoom v-if="page === 'join'" @start-game="startGame" @go-home="goHome"/>
    <GameBoard
      v-if="page === 'game'"
      :roomCode="roomCode"
      :playerLetter="playerLetter"
      @go-home="goHome"
    />
    <LocalGameBoard v-if="page === 'local'" @go-home="goHome" />
    
    <div v-if="page === 'home'" class="glass-card home-card">
      <h1 class="title">Tic Tac Toe</h1>
      <p class="subtitle">Realtime & Local Battle</p>

      <div class="button-group">
        <button @click="page = 'create'" class="btn primary-btn">Create Room</button>
        <button @click="page = 'join'" class="btn secondary-btn">Join Room</button>
      </div>

      <div class="divider">
        <span>OR</span>
      </div>

      <button @click="page = 'local'" class="btn local-btn">
        Local Multiplayer
      </button>
    </div>
  </div>
</template>

<script>
import CreateRoom from "./components/CreateRoom.vue";
import JoinRoom from "./components/JoinRoom.vue";
import GameBoard from "./components/GameBoard.vue";
import LocalGameBoard from "./components/LocalGameBoard.vue";

export default {
  components: { CreateRoom, JoinRoom, GameBoard, LocalGameBoard },
  data() {
    return {
      page: "home",
      roomCode: "",
      playerLetter: "",
    };
  },
  mounted() {
    const savedRoom = sessionStorage.getItem("ttt_roomCode");
    const savedLetter = sessionStorage.getItem("ttt_playerLetter");

    if (savedRoom && savedLetter) {
      this.roomCode = savedRoom;
      this.playerLetter = savedLetter;
      this.page = "game";
    }
  },
  methods: {
    startGame({ roomCode, playerLetter }) {
      this.roomCode = roomCode;
      this.playerLetter = playerLetter;
      this.page = "game";

      sessionStorage.setItem("ttt_roomCode", roomCode);
      sessionStorage.setItem("ttt_playerLetter", playerLetter);
    },
    goHome() {
      this.page = "home";
      this.roomCode = "";
      this.playerLetter = "";

      sessionStorage.removeItem("ttt_roomCode");
      sessionStorage.removeItem("ttt_playerLetter");
    },
  },
};
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;700;800&display=swap');

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: 'Plus Jakarta Sans', sans-serif;
  background: radial-gradient(circle at top left, #1e1b4b, #0f172a, #020617);
  color: #f8fafc;
  min-height: 100dvh;
  overflow-x: hidden;
}

.app-viewport {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100dvh;
  padding: 16px;
}

.glass-card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 24px;
  padding: 32px 24px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.4);
  text-align: center;
  width: 100%;
  max-width: 400px;
}

.title {
  font-size: 28px;
  font-weight: 800;
  background: linear-gradient(135deg, #a5b4fc, #38bdf8);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 6px;
}

.subtitle {
  font-size: 13px;
  color: #94a3b8;
  margin-bottom: 24px;
}

.button-group {
  display: flex;
  gap: 12px;
}

.btn {
  flex: 1;
  padding: 14px 16px;
  font-size: 14px;
  font-weight: 700;
  border-radius: 12px;
  cursor: pointer;
  border: none;
  transition: all 0.25s ease;
}

.primary-btn {
  background: linear-gradient(135deg, #6366f1, #4f46e5);
  color: #ffffff;
  box-shadow: 0 8px 20px rgba(99, 102, 241, 0.35);
}

.primary-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 25px rgba(99, 102, 241, 0.5);
}

.secondary-btn {
  background: rgba(255, 255, 255, 0.08);
  color: #f8fafc;
  border: 1px solid rgba(255, 255, 255, 0.15);
}

.secondary-btn:hover {
  background: rgba(255, 255, 255, 0.15);
  transform: translateY(-2px);
}

.divider {
  display: flex;
  align-items: center;
  margin: 20px 0;
  color: #64748b;
  font-size: 12px;
  font-weight: 700;
}

.divider::before,
.divider::after {
  content: "";
  flex: 1;
  height: 1px;
  background: rgba(255, 255, 255, 0.1);
}

.divider span {
  padding: 0 12px;
}

.local-btn {
  width: 100%;
  background: linear-gradient(135deg, #06b6d4, #0891b2);
  color: #ffffff;
  box-shadow: 0 8px 20px rgba(6, 182, 212, 0.3);
}

.local-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 25px rgba(6, 182, 212, 0.45);
}

@media (max-width: 380px) {
  .glass-card {
    padding: 24px 16px;
  }
  .title {
    font-size: 24px;
  }
  .button-group {
    flex-direction: column;
  }
}
</style>