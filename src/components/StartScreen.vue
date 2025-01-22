<template>
  <div>
    <h1>MED ANDRA ORD</h1>
    <label for="teams">Antal lag: </label>
    <select id="teams" v-model="numberOfTeams">
      <option v-for="n in maxTeams" :key="n" :value="n">{{ n }}</option>
    </select>
    <br />
    <label for="teams">Poäng för vinst: </label>
    <select id="teams" v-model="numberOfPoints">
      <option v-for="n in maxPoints" :key="n" :value="n">{{ n }}</option>
    </select>
    <br />
    <label for="teams">Sekunder per omgång: </label>
    <select id="teams" v-model="secondsPerRound">
      <option v-for="n in perRound" :key="n" :value="n">{{ n }}</option>
    </select>
    <br />
    <label for="wordlist">Välj ordlista: </label>
    <select id="wordlist" v-model="selectedWordList">
      <option v-for="(list, key) in wordLists" :key="key" :value="key">
        {{ list.name }}
      </option>
    </select>
    <br />
    <label for="teams">Hoppa över ord? </label>
    <select id="teams" v-model="selectedSkipWords">
      <option v-for="value in skipWords" :key="value" :value="value">
        {{ formatSkipWord(value) }}
      </option>
    </select>
    <br />
    <label>Minuspoäng för att hoppa över ord?</label>
    <input type="radio" v-model="minusPointsForSkip" :value="true" />Ja
    <input type="radio" v-model="minusPointsForSkip" :value="false" />Nej
    <br />
    <button @click="startGame">Starta spel</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      maxTeams: 10,
      minTeams: 2,
      maxPoints: 100,
      minPoints: 0,
      perRound: ["30", "60", "90", "120"],
      skipWords: ["0", "1", "2", "3", "4", "5", "1000"],
      minusPointsForSkip: false,
      numberOfTeams: 2, // Default number of teams
      numberOfPoints: 20, // Default number of points
      secondsPerRound: 60, // Default number of seconds
      selectedWordList: "mainlist", // Default wordlist
      selectedSkipWords: "1000",
      wordLists: {
        mainlist: { name: "Standard (6000+)" },
        varumarken: { name: "Varumärken" },
        fotboll: { name: "Tema: Fotboll" },
        eurovision: { name: "Tema: Eurovision" },
      },
    };
  },
  methods: {
    formatSkipWord(value) {
      if (value === "0") return "Nej";
      if (value === "1000") return "Oändligt";
      return value.toString();
    },
    startGame() {
      // Log the selected wordlist to debug

      // Dynamically create teams based on the number of teams selected
      const teams = Array.from({ length: this.numberOfTeams }, (v, i) => ({
        name: `Lag ${i + 1}`,
        score: 0,
      }));

      // Navigate to the SimpleGame route with teams using `state`
      this.$router.push({
        name: "SimpleGame",
        state: {
          teams,
          winningPoints: this.numberOfPoints,
          time: this.secondsPerRound,
          selectedWordList: this.selectedWordList,
          numberOfSkipWords: this.selectedSkipWords,
          minusPointsForSkip: this.minusPointsForSkip,
        }, // Pass the generated teams via state
      });
    },
  },
};
</script>

<style scoped>
/* General styling */
html,
body {
  font-family: "Arial", sans-serif;
  font-size: 16px;
  line-height: 1.6; /* Improve readability */
  margin: 0;
  padding: 0;
  background-color: #f8f9fa; /* Light background for contrast */
  color: #333333; /* Slightly darker text for readability */
}

/* Headings */
h1,
h2,
h3 {
  margin: 20px 0 10px; /* Add spacing around headings */
  color: #2c3e50; /* Slightly darker blue-gray for headings */
  text-align: center; /* Center align headings */
}

h1 {
  font-size: 2.5rem; /* Larger size for the main title */
}

h2 {
  font-size: 2rem; /* Slightly smaller than the main title */
}

h3 {
  font-size: 1.5rem; /* Standard subheading size */
}

/* Paragraphs and labels */
p,
label {
  margin-bottom: 10px; /* Space between paragraphs and labels */
  font-size: 1rem; /* Standard font size */
}

/* Form controls (select, radio, etc.) */
select,
input[type="radio"] {
  margin: 10px 5px; /* Space around form controls */
  padding: 5px 10px; /* Add some padding inside form controls */
  border: 1px solid #ccc; /* Light border for inputs */
  border-radius: 4px; /* Slight rounding */
  font-size: 1rem; /* Match text size */
  outline: none; /* Remove default focus outline */
  transition: border-color 0.3s ease; /* Smooth focus effect */
}

select:focus,
input[type="radio"]:focus {
  border-color: #42b983; /* Highlight on focus */
}

/* Buttons */
button {
  background-color: #42b983; /* Primary green background */
  color: white; /* Text color */
  padding: 12px 24px; /* Space inside the button */
  border: none; /* Remove default border */
  border-radius: 8px; /* Rounded corners */
  font-size: 16px; /* Font size */
  margin: 15px 10px; /* More space around buttons */
  font-weight: bold; /* Bold text */
  cursor: pointer; /* Pointer cursor on hover */
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* Subtle shadow */
  transition: all 0.3s ease; /* Smooth hover effects */
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

button:disabled {
  background-color: #cccccc; /* Light gray background */
  color: #666666; /* Dark gray text */
  cursor: not-allowed; /* "Not allowed" cursor */
  opacity: 0.6; /* Reduce opacity */
  box-shadow: none; /* Remove shadow */
}

/* Lists */
ul {
  list-style-type: none;
  padding: 0;
  margin: 20px 0; /* Space above and below lists */
  text-align: center; /* Center align list items */
}

li {
  font-size: 18px; /* Larger font size for list items */
  margin: 8px 0; /* Space between list items */
}

/* Highlight current team */
.current-team {
  font-weight: bold;
  color: #2c3e50; /* Dark gray for visibility */
  background-color: #d4edda; /* Light green background */
  border: 2px solid #42b983; /* Green border */
  padding: 10px 15px;
  border-radius: 8px; /* Rounded corners */
  text-align: center; /* Center align text */
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* Subtle shadow for depth */
}

/* Big word styling */
.bigword {
  font-size: 48px; /* Large text size */
  font-weight: bold;
  color: #42b983;
  text-align: center;
  display: inline-block;
  text-transform: uppercase; /* Convert text to uppercase */
  margin: 20px auto; /* Space above and below the word */
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
}
</style>
