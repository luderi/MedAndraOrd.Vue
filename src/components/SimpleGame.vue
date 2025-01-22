<template>
  <div>
    <p
      :class="['bigword', { animate: animateWord }]"
      @animationend="resetAnimation"
    >
      {{ currentWord }}
    </p>
    <br />
    <button class="start-button" @click="startGame" :disabled="timerActive">
      Starta spel/omgång.
    </button>
    <br />
    <button @click="correctWord">Rätt!</button>
    <button
      class="start-button"
      @click="incorrectWord"
      :disabled="skipDisabled"
    >
      Nytt ord
    </button>
    <h2>{{ time }}</h2>
    <h3>Poängställning:</h3>
    <ul>
      <li
        v-for="(team, index) in teams"
        :key="index"
        :class="{ 'current-team': index === currentTeamIndex }"
      >
        {{ team.name }}: {{ team.score }}
      </li>
    </ul>
  </div>
  <div>
    <h3>Senaste orden:</h3>
    <ul>
      <li v-for="(words, index) in recentWords.slice(-10)" :key="index">
        {{ words }}
      </li>
    </ul>
  </div>
</template>

<script>
import mainlist from "@/assets/wordlists/mainlist";
import varumarken from "@/assets/wordlists/varumarken";
import fotboll from "@/assets/wordlists/fotboll";
import eurovision from "@/assets/wordlists/eurovision";

export default {
  data() {
    return {
      wordLists: {
        mainlist,
        varumarken,
        fotboll,
        eurovision,
      },
      selectedWordList: "mainlist", // Default wordlist
      teams: [],
      currentTeamIndex: 0,
      timerActive: false,
      numberOfSkipWords: [],
      skippedWords: [],
      minusPointsForSkip: false,
      wordList: ["test1", "test2", "test3", "test4", "test5"],
      time: 60,
      timer: null,
      recentWords: [],
      currentWord: "Ord",
      animateWord: false,
      winningPoints: 20,
    };
  },
  created() {
    // Retrieve data from route state
    const routeState = this.$router.options.history.state;

    // Check if teams and winning points exist in the state
    if (routeState) {
      this.teams = routeState.teams || [];
      this.winningPoints = routeState.winningPoints || 20; // Default to 10 if not provided
      this.time = routeState.time || 20; // Default to 10 if not provided
      this.selectedWordList = routeState.selectedWordList || "mainlist"; // Default to 10 if not provided
      this.numberOfSkipWords = routeState.numberOfSkipWords || "1000";
      this.minusPointsForSkip = routeState.minusPointsForSkip || "false";

      // Load the selected wordlist
      this.wordList = this.wordLists[this.selectedWordList] || [];
    }
  },
  computed: {
    skipDisabled() {
      const maxSkips = this.numberOfSkipWords.includes("1000")
        ? 1000
        : this.numberOfSkipWords;
      return this.skippedWords >= maxSkips;
    },
  },
  methods: {
    winner() {
      if (this.teams[this.currentTeamIndex].score >= this.winningPoints) {
        alert(
          `JIPPI, lag ${this.currentTeamIndex + 1} vinner! Spelet nollställs.`
        );
        this.recentWords = [];
        //reset timer
        clearInterval(this.timer);
        this.timerActive = false;
        this.timer = null;
        // Reset team scores
        this.teams.forEach((team) => {
          team.score = 0;

          // Reset the game state
          this.currentTeamIndex = 0;
          this.time = 60;
          this.currentWord = "ord";
        });
      }
    },
    randomWordFunction() {
      const randomIndex = Math.floor(Math.random() * this.wordList.length);
      this.currentWord = this.wordList[randomIndex];
      this.animateWord = true;
    },
    resetAnimation() {
      this.animateWord = false;
    },
    correctWord() {
      if (this.timerActive) {
        this.teams[this.currentTeamIndex].score++;
        this.recentWords.push(` ✅ ${this.currentWord}`);
        this.randomWordFunction();
        this.winner();
      }
    },
    switchTeam() {
      this.currentTeamIndex = (this.currentTeamIndex + 1) % this.teams.length;
    },
    resetRecentWords() {
      this.recentWords = [];
    },
    incorrectWord() {
      if (!this.skipDisabled) {
        this.skippedWords++;
      }
      if (this.timerActive) {
        if (this.minusPointsForSkip) {
          this.teams[this.currentTeamIndex].score--;
        }
        this.recentWords.push(` ❌ ${this.currentWord}`);
        this.randomWordFunction();
      }
    },
    startGame() {
      this.startCountdown();
      this.resetRecentWords();
    },
    startCountdown() {
      if (this.timer) {
        clearInterval(this.timer);
      }
      //start interval
      this.randomWordFunction();

      this.timer = setInterval(() => {
        if (this.time > 0) {
          this.timerActive = true;
          this.time--;
        } else {
          this.timerActive = false;
          clearInterval(this.timer);
          this.timer = null;
          this.resetCountDown();
          this.switchTeam();
        }
      }, 1000);
    },
    resetCountDown() {
      this.time = 60;
      clearInterval(this.timer);
      this.timer = null;
    },
    stopCountDown() {
      clearInterval(this.timer);
      this.timer = null;
    },
  },
};
</script>

<style scoped>
/* Default styling for the list */
ul {
  list-style-type: none;
  padding: 0;
  text-align: center;
}

li {
  font-size: 18px;
  margin: 5px 0; /* Adds vertical spacing between items */
}

/* Styling for the current team */
.current-team {
  font-weight: bold; /* Make the text bold */
  color: black; /* Keep the text color black */
  background-color: #f0f0f0; /* Light gray background */
  border: 2px solid #42b983; /* Green border */
  padding: 10px 15px; /* Add padding for a box-like appearance */
  border-radius: 8px; /* Rounded corners for a modern look */
  text-align: center; /* Center align the text */
  display: inline-block; /* Make the box fit the text */
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* Subtle shadow for depth */
}

/* Button styles */
button {
  background-color: #42b983; /* Primary background color */
  color: white; /* Text color */
  padding: 12px 24px; /* Space inside the button */
  border: none; /* Remove default border */
  border-radius: 8px; /* Rounded corners */
  font-size: 16px; /* Font size */
  margin: 10px; /* Space around the button */
  font-weight: bold; /* Bold text */
  cursor: pointer; /* Pointer cursor on hover */
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* Subtle shadow */
  transition: all 0.3s ease; /* Smooth transition for hover effects */
}

button:hover {
  background-color: #36a072; /* Slightly darker green on hover */
  box-shadow: 0 6px 8px rgba(0, 0, 0, 0.2); /* Deeper shadow on hover */
  transform: translateY(-2px); /* Slight lift on hover */
}

button:focus {
  outline: none; /* Remove default focus outline */
  box-shadow: 0 0 0 3px rgba(66, 185, 131, 0.5); /* Custom focus ring */
}

button:active {
  transform: translateY(0); /* Return to normal when clicked */
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* Shadow reset */
}

/* Styling for the big word */
.bigword {
  font-size: 48px; /* Base size */
  font-weight: bold;
  color: #42b983;
  text-align: center;
  display: inline-block;
  text-transform: uppercase; /* Convert text to uppercase */
  transition: transform 0.3s ease, color 0.3s ease; /* Smooth hover effects */
}

.bigword:hover {
  transform: scale(1.2); /* Slightly enlarge on hover */
  color: #36a072; /* Change the color on hover */
}

/* Animation applied when animateWord is true */
.animate {
  animation: explode 0.5s ease forwards;
}

/* Styling for the start button */
.start-button {
  background-color: #42b983; /* Primary green background */
  color: white; /* Text color */
  padding: 12px 24px; /* Space inside the button */
  border: none; /* Remove default border */
  border-radius: 8px; /* Rounded corners */
  font-size: 16px; /* Font size */
  font-weight: bold; /* Bold text */
  cursor: pointer; /* Pointer cursor on hover */
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* Subtle shadow */
  transition: all 0.3s ease; /* Smooth transition for hover effects */
}

.start-button:hover:enabled {
  background-color: #36a072; /* Darker green on hover */
  box-shadow: 0 6px 8px rgba(0, 0, 0, 0.2); /* Deeper shadow on hover */
  transform: translateY(-2px); /* Slight lift on hover */
}

/* Disabled state styling for the start button */
.start-button:disabled {
  background-color: #cccccc; /* Light gray background */
  color: #666666; /* Dark gray text */
  cursor: not-allowed; /* "Not allowed" cursor */
  opacity: 0.6; /* Reduce opacity */
  box-shadow: none; /* Remove shadow */
}

/* Keyframes for the explosion effect */
@keyframes explode {
  0% {
    transform: scale(1);
    opacity: 1;
    color: #42b983;
  }
  50% {
    transform: scale(2); /* Enlarges */
    opacity: 0.5; /* Fades slightly */
    color: #f54242; /* Changes to red */
  }
  100% {
    transform: scale(1);
    opacity: 1;
    color: #42b983; /* Resets to original color */
  }

  html {
    font-size: 16px; /* Ensure the base font size is at least 16px to avoid automatic zoom */
  }

  button,
  input,
  textarea,
  select {
    font-size: inherit; /* Ensure text elements match the base font size */
  }
}
</style>
