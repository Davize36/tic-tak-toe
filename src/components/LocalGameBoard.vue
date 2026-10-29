<template>
  <div class="container">
    <button @click="$emit('go-home')" class="back-btn">⬅️ Back</button>
    <h2>Local Multiplayer</h2>

    <!-- Scoreboard UI -->
    <div class="scoreboard">
      <div class="score-card" :class="{ active: currentPlayer === 'X' }">
        <span class="label">Player X</span>
        <span class="value">{{ scores.X }}</span>
      </div>
      <div class="score-card" :class="{ active: currentPlayer === 'O' }">
        <span class="label">Player O</span>
        <span class="value">{{ scores.O }}</span>
      </div>
    </div>

    <h3 v-if="!winner && !isDraw">Current Turn: {{ currentPlayer }}</h3>

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

    <p v-if="winner">
      <strong>{{ winner }} wins!</strong>
    </p>
    <p v-else-if="isDraw">
      <strong>It’s a draw!</strong>
    </p>

    <button @click="resetGame" v-if="winner || isDraw">New Match</button>
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
      scores: {
        X: 0,
        O: 0,
      },
      clickSound: new Audio("/sounds/play.mp3"),
      winSound: new Audio("/sounds/win.wav"),
      drawSound: new Audio("/sounds/draw.wav"),
    };
  },
  methods: {
    makeMove(index) {
      if (!this.board[index] && !this.winner && !this.isDraw) {
        this.clickSound.play(); // 🔊 move sound

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
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
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
          this.scores[this.winner]++; // Increment local winner score
          this.winSound.play(); // 🔊 win sound
          break;
        }
      }
    },
    checkDraw() {
      if (!this.winner && this.board.every((cell) => cell)) {
        this.isDraw = true;
        this.drawSound.play(); // 🔊 draw sound
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
.container {
  text-align: center;
  font-family: sans-serif;
  background: #fdfdfd;
  padding: 30px;
  min-height: 100vh;
  position: relative;
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
  margin-top: 0;
}

.back-btn:hover {
  background: #bbb;
}

.scoreboard {
  display: flex;
  justify-content: center;
  gap: 40px;
  margin: 15px auto;
  padding: 10px 20px;
  background: #f0f0f0;
  border-radius: 10px;
  max-width: 260px;
}

.score-card {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.score-card.active {
  font-weight: bold;
  color: #007acc;
}

.label {
  font-size: 14px;
  color: #666;
}

.value {
  font-size: 20px;
  font-weight: bold;
}

.board {
  display: grid;
  grid-template-columns: repeat(3, 100px);
  gap: 8px;
  justify-content: center;
  margin: 20px auto;
}

.cell {
  width: 100px;
  height: 100px;
  font-size: 48px;
  background: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border-radius: 12px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  user-select: none;
  transition: transform 0.15s ease;
}

.cell:active {
  transform: scale(0.95);
}

.x-cell {
  color: #ff3860;
}

.o-cell {
  color: #00d1b2;
}

.x-cell,
.o-cell {
  animation: pop 0.25s ease;
}

@keyframes pop {
  0% {
    transform: scale(0);
    opacity: 0;
  }
  80% {
    transform: scale(1.15);
    opacity: 1;
  }
  100% {
    transform: scale(1);
  }
}

.winner {
  background: #ffeaa7;
  animation: flash 0.6s infinite alternate;
}

@keyframes flash {
  from {
    background-color: #ffeaa7;
  }
  to {
    background-color: #f6e58d;
  }
}

button {
  padding: 10px 20px;
  font-size: 16px;
  margin-top: 20px;
  border: none;
  background: #222;
  color: #fff;
  border-radius: 6px;
  cursor: pointer;
}

button:hover {
  background: #333;
}
</style>