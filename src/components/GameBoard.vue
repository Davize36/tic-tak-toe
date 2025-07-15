<template>
  <div class="container">
    <h2>Room Code: {{ roomCode }}</h2>
    <h3 v-if="!winner && !isDraw">Current Turn: {{ currentPlayer }}</h3>
    <h3>You are: {{ playerLetter }}</h3>

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

    <p v-if="winner"><strong>{{ winner }} wins!</strong></p>
    <p v-else-if="isDraw"><strong>It’s a draw!</strong></p>

    <button @click="resetGame" v-if="winner || isDraw">New Match</button>
  </div>
</template>

<script>
import { db } from "../firebase";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";

export default {
  props: ["roomCode", "playerLetter"],
  data() {
    return {
      board: Array(9).fill(""),
      currentPlayer: "X",
      winner: null,
      isDraw: false,
      winningCells: [],
      clickSound: new Audio("/sounds/play.mp3"),
      winSound: new Audio("/sounds/win.wav"),
      drawSound: new Audio("/sounds/draw.wav"),
    };
  },
  computed: {
    isMyTurn() {
      return this.currentPlayer === this.playerLetter;
    },
  },
  methods: {
    async makeMove(index) {
      if (this.isMyTurn && !this.board[index] && !this.winner && !this.isDraw) {
        this.clickSound.play();

        const roomRef = doc(db, "rooms", this.roomCode);
        const newBoard = [...this.board];
        newBoard[index] = this.currentPlayer;

        const nextPlayer = this.currentPlayer === "X" ? "O" : "X";

        await updateDoc(roomRef, {
          board: newBoard,
          currentPlayer: nextPlayer,
        });
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
          this.winSound.play();
          return;
        }
      }
    },
    checkDraw() {
      if (!this.winner && this.board.every((cell) => cell)) {
        this.isDraw = true;
        this.drawSound.play();
      }
    },
    async resetGame() {
      const roomRef = doc(db, "rooms", this.roomCode);
      await updateDoc(roomRef, {
        board: Array(9).fill(""),
        currentPlayer: "X",
        winner: null,
        isDraw: false,
        winningCells: [],
      });
    },
    cellClass(cell) {
      if (cell === "X") return "x-cell";
      if (cell === "O") return "o-cell";
      return "";
    },
  },
  mounted() {
    const roomRef = doc(db, "rooms", this.roomCode);

    onSnapshot(roomRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        this.board = data.board;
        this.currentPlayer = data.currentPlayer;

        this.winner = null;
        this.isDraw = false;
        this.winningCells = [];

        this.checkWinner();
        this.checkDraw();
      }
    });
  },
};
</script>

<style scoped>
/* same CSS as yours — untouched */
.container {
  text-align: center;
  font-family: sans-serif;
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

.winner {
  background: #ffeaa7;
  animation: flash 0.6s infinite alternate;
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

@keyframes flash {
  from {
    background-color: #ffeaa7;
  }
  to {
    background-color: #f6e58d;
  }
}
</style>
