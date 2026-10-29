<template>
  <div>
    <CreateRoom v-if="page === 'create'" @start-game="startGame" @go-home="goHome"/>
    <JoinRoom v-if="page === 'join'" @start-game="startGame" @go-home="goHome"/>
    <GameBoard
      v-if="page === 'game'"
      :roomCode="roomCode"
      :playerLetter="playerLetter"
      @go-home="goHome"
    />
    <LocalGameBoard v-if="page === 'local'" @go-home="goHome" />
    
    <div v-if="page === 'home'" class="home-container">
      <h1 class="title">Tic Tac Toe Multiplayer</h1>
      <div class="button-group">
        <button @click="page = 'create'">Create Room</button>
        <button @click="page = 'join'">Join Room</button>
      </div>

      <h3 class="or-text">- or -</h3>

      <div class="button-group">
        <button @click="page = 'local'" class="local-btn">
          Local Multiplayer
        </button>
      </div>
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
    // Restore session on refresh if stored
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

      // Save session to browser storage
      sessionStorage.setItem("ttt_roomCode", roomCode);
      sessionStorage.setItem("ttt_playerLetter", playerLetter);
    },
    goHome() {
      this.page = "home";
      this.roomCode = "";
      this.playerLetter = "";

      // Clear session when intentionally leaving
      sessionStorage.removeItem("ttt_roomCode");
      sessionStorage.removeItem("ttt_playerLetter");
    },
  },
};
</script>

<style scoped>
.home-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  font-family: sans-serif;
  background: #fdfdfd;
}

.title {
  font-size: 42px;
  margin-bottom: 30px;
  color: #222;
}

.button-group {
  display: flex;
  gap: 20px;
}

.button-group button {
  padding: 15px 30px;
  font-size: 18px;
  border: none;
  background: #333;
  color: #fff;
  border-radius: 8px;
  cursor: pointer;
  transition: 0.2s ease;
}

.button-group button:hover {
  background: #444;
}

.or-text {
  margin: 30px 0 20px;
  font-size: 20px;
  color: #555;
}

.local-btn {
  padding: 18px 36px;
  font-size: 20px;
  background: #00d1b2;
  color: #fff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: 0.2s ease;
}

.local-btn:hover {
  background: #00c4a7;
}
</style>