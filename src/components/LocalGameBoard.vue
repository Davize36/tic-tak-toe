<template>
  <div class="game-wrapper">
    <div class="glass-card">
      <button @click="$emit('go-home')" class="back-btn">⬅ Leave</button>

      <h2>Local Match</h2>

      <!-- Scoreboard UI -->
      <div class="scoreboard">
        <div class="score-card x-card" :class="{ active: currentPlayer === 'X' }">
          <span class="label">PLAYER X</span>
          <span class="value">{{ scores.X }}</span>
        </div>
        <div class="score-card o-card" :class="{ active: currentPlayer === 'O' }">
          <span class="label">PLAYER O</span>
          <span class="value">{{ scores.O }}</span>
        </div>
      </div>

      <div class="status-banner">
        <span v-if="!winner && !isDraw">Turn: <strong :class="currentPlayer.toLowerCase()">{{ currentPlayer }}</strong></span>
      </div>

      <!-- Grid Board -->
      <div class="board">
        <div
          v-for="(cell, index) in board"
          :key="index"
          :class="['cell', cellClass(cell), { winner: winningCells.includes(index) }]"
          @click="makeMove(index)"
        >
          {{ cell }}
        </div>
      </div>

      <div v-if="winner" class="result-text">
        🎉 Player <span>{{ winner }}</span> Wins!
      </div>
      <div v-else-if="isDraw" class="result-text">
        🤝 It’s a Draw!
      </div>

      <button @click="resetGame" v-if="winner || isDraw" class="reset-btn">
        Next Round
      </button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      board: Array(9).fill(""),
      currentPlayer: "X",
      winner: null,
      isDraw: false,
      winningCells: [],
      scores: { X: 0, O: 0 },
      clickSound: new Audio("/sounds/play.mp3"),
      winSound: new Audio("/sounds/win.wav"),
      drawSound: new Audio("/sounds/draw.wav"),
    };
  },
  methods: {
    makeMove(index) {
      if (!this.board[index] && !this.winner && !this.isDraw) {
        this.clickSound.play();

        this.board[index] = this.currentPlayer;
        this.checkWinner();
        this.checkDraw();

        if (!this.winner && !this.isDraw) {
          this.currentPlayer = this.currentPlayer === "X" ? "O" : "X";
        }
      }
    },
    checkWinner() {
      const wins = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6],
      ];

      for (const combo of wins) {
        const [a, b, c] = combo;
        if (
          this.board[a] &&
          this.board[a] === this.board[b] &&
          this.board[a] === this.board[c]
        ) {
          this.winner = this.board[a];
          this.winningCells = combo;
          this.scores[this.winner]++;
          this.winSound.play();
          break;
        }
      }
    },
    checkDraw() {
      if (!this.winner && this.board.every((cell) => cell)) {
        this.isDraw = true;
        this.drawSound.play();
      }
    },
    resetGame() {
      this.board = Array(9).fill("");
      this.currentPlayer = "X";
      this.winner = null;
      this.isDraw = false;
      this.winningCells = [];
    },
    cellClass(cell) {
      if (cell === "X") return "x-cell";
      if (cell === "O") return "o-cell";
      return "";
    },
  },
};
</script>

<style scoped>
.game-wrapper {
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
  padding: 24px 18px;
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
  font-size: 20px;
  font-weight: 800;
  margin-top: 12px;
  margin-bottom: 16px;
}

.scoreboard {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
}

.score-card {
  flex: 1;
  padding: 10px;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  display: flex;
  flex-direction: column;
}

.score-card.active.x-card {
  border-color: rgba(244, 63, 94, 0.5);
  box-shadow: 0 0 16px rgba(244, 63, 94, 0.25);
}

.score-card.active.o-card {
  border-color: rgba(56, 189, 248, 0.5);
  box-shadow: 0 0 16px rgba(56, 189, 248, 0.25);
}

.label {
  font-size: 10px;
  font-weight: 800;
  color: #94a3b8;
  letter-spacing: 1px;
  margin-bottom: 2px;
}

.value {
  font-size: 20px;
  font-weight: 800;
}

.x-card .value { color: #f43f5e; }
.o-card .value { color: #38bdf8; }

.status-banner {
  font-size: 13px;
  color: #cbd5e1;
  margin-bottom: 16px;
}

.x { color: #f43f5e; }
.o { color: #38bdf8; }

.board {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  margin-bottom: 20px;
  width: 100%;
}

.cell {
  aspect-ratio: 1;
  width: 100%;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: clamp(28px, 8vw, 38px);
  font-weight: 800;
  cursor: pointer;
  user-select: none;
  transition: all 0.2s ease;
}

.cell:hover {
  background: rgba(255, 255, 255, 0.08);
  transform: scale(1.02);
}

.cell:active {
  transform: scale(0.95);
}

.x-cell {
  color: #f43f5e;
  text-shadow: 0 0 16px rgba(244, 63, 94, 0.6);
  animation: pop 0.25s ease;
}

.o-cell {
  color: #38bdf8;
  text-shadow: 0 0 16px rgba(56, 189, 248, 0.6);
  animation: pop 0.25s ease;
}

@keyframes pop {
  0% { transform: scale(0); opacity: 0; }
  80% { transform: scale(1.15); }
  100% { transform: scale(1); opacity: 1; }
}

.winner {
  background: rgba(250, 204, 21, 0.15) !important;
  border-color: rgba(250, 204, 21, 0.5) !important;
  box-shadow: 0 0 20px rgba(250, 204, 21, 0.3);
}

.result-text {
  font-size: 16px;
  font-weight: 800;
  margin-bottom: 14px;
}

.reset-btn {
  width: 100%;
  padding: 12px;
  font-size: 14px;
  font-weight: 700;
  border-radius: 12px;
  border: none;
  background: linear-gradient(135deg, #06b6d4, #0891b2);
  color: #ffffff;
  cursor: pointer;
  box-shadow: 0 8px 20px rgba(6, 182, 212, 0.35);
  transition: 0.2s ease;
}

.reset-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 25px rgba(6, 182, 212, 0.5);
}
</style>