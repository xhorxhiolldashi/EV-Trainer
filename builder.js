"use strict";

// Populate dropdown immediately upon site load
populateDropdown();

// Dropdown to select
let dropdown = document.getElementById("monDropdown");
// The dropdown
let monDropdown = document.getElementById('monDropdown');
// Startup window
let startup = document.getElementById('loadupWindow');
// EV page (to be unhidden)
let evWindow = document.getElementById('evWindow');
// What are we training prompt
let trainingOptions = document.getElementById('trainOptionButtons');
// Unhide the name
let replaceWithMon = document.getElementById('replaceWithMon');
// Base stats window
let baseStatsWindow = document.getElementById('baseStats');
// Chart container
let evChart = document.getElementById('evChart');

// <p> that asks what you will train
let whatTrain = document.getElementById('whatTrain');

// Button for user to confirm this pokemon is the one they want to build with
// When selected, get rid of dropdown and display the pokemon
let confirmButton = document.getElementById('letsBuild');
confirmButton.addEventListener('click',dropdownOptionSelected);

// Training buttons for giving them event listeners
let chooseHealth = document.getElementById('chooseHealth');
let chooseAtk = document.getElementById('chooseAtk');
let chooseDef = document.getElementById('chooseDef');
let chooseSpa = document.getElementById('chooseSpa');
let chooseSpDef = document.getElementById('chooseSpDef');
let chooseSpe = document.getElementById('chooseSpe');

let backButton = document.getElementById('goBack');

let evContainer = document.getElementById('evContainer');
let battleContainer = document.getElementById('battleContainer');

// Battle table options
let yield3 = document.getElementById('yield3');
let yield2 = document.getElementById('yield2');
let yield1 = document.getElementById('yield1');

// Table columns for respective items
let berryCol = document.getElementById('berryCol');
let featherCol = document.getElementById('featherCol');
let vitaminCol = document.getElementById('vitaminCol');
let powerItemCol = document.getElementById('powerItemCol');

let feedBerryButton = document.getElementById('feedBerryButton');
let useFeatherButton = document.getElementById('useFeatherButton');
let useVitaminButton = document.getElementById('useVitaminButton');

// Table for EV battling dropdown
let battleTable = document.getElementById('battleTable');
let battleDropdown = document.getElementById('battleDropdown');
console.log("Dropdown: " + battleDropdown);
let knockoutButton = document.getElementById('knockoutButton');

// Maximum possible EVs you can invest across the board
let evMax = 508;

// EV investments
let hpEvsCt = 0;
let atkEvsCt = 0;
let defEvsCt = 0;
let spaEvsCt = 0;
let spdEvsCt = 0;
let speEvsCt = 0;

let totalEvs = 0;

let remaining = 508 - totalEvs;

console.log("total evs at start: " + totalEvs);

// Flag to stop adding
let evsMaxed = false;

// For use with equipment button
let equipped = false;
let equipToggle = document.getElementById('equipToggle');
let equipmentBonus = 8;

equipToggle.addEventListener('click', function(){
  equipped = !equipped;
  if(equipped){
    equipToggle.classList.remove("btn-primary");
    equipToggle.classList.add("btn-secondary");
    console.log("power item bonus active!")
    equipToggle.value = "Unequip Power Item";
  } else {
    equipToggle.classList.remove("btn-secondary");
    equipToggle.classList.add("btn-primary");
    console.log("power item bonus off");
    equipToggle.value = "Equip Power Item";
  }
});

// Remove EV Functions
feedBerryButton.addEventListener('click', function(){
  const berryText = berryCol.textContent;

  if(berryText.includes("Pomeg")){
    berryFed("hp");
  } else if(berryText.includes("Kelpsy")){
    berryFed("atk");
  } else if(berryText.includes("Qualot")){
    berryFed("def");
  } else if(berryText.includes("Hondew")){
    berryFed("spa");
  } else if(berryText.includes("Grepa")){
    berryFed("spd");
  } else if(berryText.includes("Tamato")){
    berryFed("spe");
  }

});
function berryFed(stat){
  //...
  switch(stat) {
    case "hp":
      hpEvsCt = Math.max(0, hpEvsCt - 10);
      break;
    case "atk":
      atkEvsCt = Math.max(0, atkEvsCt - 10);
      break;
    case "def":
      defEvsCt = Math.max(0, defEvsCt - 10);
      break;
    case "spa":
      spaEvsCt = Math.max(0, spaEvsCt - 10);
      break;
    case "spd":
      spdEvsCt = Math.max(0, spdEvsCt - 10);
      break;
    case "spe":
      speEvsCt = Math.max(0, speEvsCt - 10);
      break;
  }
  console.log("Berries fed");
  verifyTotal();
  updateChart();
}

// Add Ev Functions

useFeatherButton.addEventListener('click', function(){
  const featherText = featherCol.textContent;

  if(featherText === ("Use Health Feather (+1 EVs)")){
    featherUsed("hp");
  } else if(featherText === ("Use Attack Feather (+1 EVs)")){
    featherUsed("atk");
  } else if(featherText === ("Use Defense Feather (+1 EVs)")){
    featherUsed("def");
  } else if(featherText === ("Use Sp. Attack Feather (+1 EVs)")){
    featherUsed("spa");
  } else if(featherText === ("Use Sp. Defense Feather (+1 EVs)")){
    featherUsed("spd");
  } else if(featherText === ("Use Speed Feather (+1 EVs)")){
    featherUsed("spe");
  }
});

function featherUsed(stat) {
  if(totalEvs == 508){
    console.log("EVs full");
    maxEVsAlert();
    return;
  }

  // Add 1 to the relevant stat, ensuring it does not exceed 252
  // Don't add more than what's left
  let addable = Math.min(1, remaining); 
  switch (stat) {
    case "hp":
      hpEvsCt = Math.min(252, hpEvsCt + addable);
      break;
    case "atk":
      atkEvsCt = Math.min(252, atkEvsCt + addable);
      break;
    case "def":
      defEvsCt = Math.min(252, defEvsCt + addable);
      break;
    case "spa":
      spaEvsCt = Math.min(252, spaEvsCt + addable);
      break;
    case "spd":
      spdEvsCt = Math.min(252, spdEvsCt + addable);
      break;
    case "spe":
      speEvsCt = Math.min(252, speEvsCt + addable);
      break;
  }

  console.log("Feathers used");
  verifyTotal();
  updateChart();
}

useVitaminButton.addEventListener('click', function(){
  const vitaminText = vitaminCol.textContent;

  if(vitaminText.includes("HP Up")){
    vitaminUsed("hp");
  } else if(vitaminText.includes("Protein")){
    vitaminUsed("atk");
  } else if(vitaminText.includes("Iron")){
    vitaminUsed("def");
  } else if(vitaminText.includes("Calcium")){
    vitaminUsed("spa");
  } else if(vitaminText.includes("Zinc")){
    vitaminUsed("spd");
  } else if(vitaminText.includes("Carbos")){
    vitaminUsed("spe");
  }
});
function vitaminUsed(stat){
  if(totalEvs == 508){
    maxEVsAlert();
    console.log("EVs full");
    return;
  }
  // Add 10 to the relevant stat, ensuring it does not exceed 252
  // Don't add more than what's left
  let addable = Math.min(10, remaining); 
  switch (stat) {
    case "hp":
      hpEvsCt = Math.min(252, hpEvsCt + addable);
      break;
    case "atk":
      atkEvsCt = Math.min(252, atkEvsCt + addable);
      break;
    case "def":
      defEvsCt = Math.min(252, defEvsCt + addable);
      break;
    case "spa":
      spaEvsCt = Math.min(252, spaEvsCt + addable);
      break;
    case "spd":
      spdEvsCt = Math.min(252, spdEvsCt + addable);
      break;
    case "spe":
      speEvsCt = Math.min(252, speEvsCt + addable);
      break;
  }
  console.log("Vitamins used");
  verifyTotal();
  updateChart();
}


function verifyTotal(){
  totalEvs = hpEvsCt + atkEvsCt + defEvsCt + spaEvsCt + spdEvsCt + speEvsCt;
  remaining = 508 - totalEvs;
  if(totalEvs > 508){
    totalEvs = 508;
    maxEVsAlert();
  }
  console.log("total evs: " + totalEvs);
}

function maxEVsAlert(){
  alert("You have reached 508 EVs across the board (functional max). Berries can decrement your stats!");
}

// Battle EV training
let koValue = 0;
let yieldValue;

// It is a jQuery/select2 dropdown
// I must use their event listeners not native js

$("#battleDropdown").on("change", function() {

  console.log("battleDropdown firing cuz of change");
  yieldValue = $(this).val(); // jQuery to get value

  if(yieldValue === "3"){
    koValue = 3;
    console.log("koValue: " + koValue);
  } else if(yieldValue === "2"){
    koValue = 2;
    console.log("koValue: " + koValue);
  } else if(yieldValue === "1"){
    koValue = 1;
    console.log("koValue: " + koValue);
  } else {console.log("You can't fight for EVs unless you select a yield.")
          koValue = 0;
  };
  
});

function knockout(koValToUse, stat){

  if(koValue == 0){
    alert("Select an EV Yield from the dropdown. You can battle a Pokemon that yields 1, 2, or 3 of your chosen EV.");
    throw new Error( Error("No koValue selected. Use dropdown"));
  }
  if(equipped){
    koValToUse = koValToUse + equipmentBonus // 3, 2, or 1, plus 8
  }

  let remainingEVs = 508 - totalEvs;
  let addable = Math.min(koValToUse, remainingEVs);

  switch(stat){
    case "hp":
      hpEvsCt = Math.min(252, hpEvsCt + addable);
      break;
    case "atk":
      atkEvsCt = Math.min(252, atkEvsCt + addable);
      break;
    case "def":
      defEvsCt = Math.min(252, defEvsCt + addable);
      break;
    case "spa":
      spaEvsCt = Math.min(252, spaEvsCt + addable);
      break;
    case "spd":
      spdEvsCt = Math.min(252, spdEvsCt + addable);
      break;
    case "spe":
      speEvsCt = Math.min(252, speEvsCt + addable);
      break;
    case "default":
      console.log("You didn't select anything from the dropdown probably");

  }
  verifyTotal();
  updateChart();

  console.log("EVs applied through battle: " + koValToUse);
}

knockoutButton.addEventListener('click', function(){
  const itemText = powerItemCol.textContent;

  if(itemText.includes("Weight")){
    knockout(koValue, "hp");
  } else if(itemText.includes("Bracer")){
    knockout(koValue, "atk");
  } else if(itemText.includes("Belt")){
    knockout(koValue, "def");
  } else if(itemText.includes("Lens")){
    knockout(koValue, "spa");
  } else if(itemText.includes("Band")){
    knockout(koValue, "spd");
  } else if(itemText.includes("Anklet")){
    knockout(koValue, "spe");
  }

});



// Map for EVs
let EVsMap = {'hp': 0,'atk': 0,'def': 0,'spa': 0,'spd': 0,'spe': 0}
// Array for base stats
let statsArr = [0,0,0,0,0,0]
// Chart.js EV and Stats chart
      const ctx = document.getElementById('evs');
      let statChart = new Chart(ctx, {
        type: 'radar',
        data: {
          labels: ['HP', 'Atk', 'Def', 'Spe', 'Sp. Def', 'Sp. Atk'],
          datasets: [
            {
            label: 'Effort Values',
            data: [EVsMap['hp'], EVsMap['atk'], EVsMap['def'], EVsMap['spe'], EVsMap['spd'], EVsMap['spa']],
            borderWidth: 1
          }
          ]
        },
        options: {
            // Chart.js has a bug where it mysteriously starts to
            // shrink the graph, ironically the solution is to set
            // aspect ratio to false
            maintainAspectRatio: false, 
          scales: {
            r: {
                max: 255,
                grid: {
                    display: false
                },
                ticks: {
                    stepSize: 252,
                    display: false
                },
            }
          }
        }
      });

    // A map for the stat and its items
  const effortMappings = {
  'Health': {powerItem: "Power Weight", vitamin: "HP Up", feather: "Health Feather", berry: "Pomeg Berry"},
  'Attack': {powerItem: "Power Bracer", vitamin: "Protein", feather: "Attack Feather", berry: "Kelpsy Berry"},
  'Defense': {powerItem: "Power Belt", vitamin: "Iron", feather: "Defense Feather", berry: "Qualot Berry"},
  'Sp. Attack': {powerItem: "Power Lens", vitamin: "Calcium", feather: "Sp. Attack Feather", berry: "Hondew Berry"},
  'Sp. Defense': {powerItem: "Power Band", vitamin: "Zinc", feather: "Sp. Defense Feather", berry: "Grepa Berry"},
  'Speed': {powerItem: "Power Anklet", vitamin: "Carbos", feather: "Speed Feather", berry: "Tamato Berry"}
  }

  let buttons = [chooseHealth, chooseAtk, chooseDef, chooseSpa, chooseSpDef, chooseSpe];
  let options = ['Health', 'Attack', 'Defense', 'Sp. Attack', 'Sp. Defense', 'Speed'];
  
  // Adding event listeners for the investment buttons
  buttons.forEach((button, index) => {
    button.addEventListener('click', function() {
      editTable(options[index]);
      hideButtons();
    });
  });

  // Hide the investment and battle tables, and unhide
  // choose buttons.
  backButton.addEventListener('click', function(){
    
    // Unhide
    unhideButtons();

    // Hide
    evContainer.style.display = "none";
    battleContainer.style.display = "none";
    backButton.style.display = "none";
    // Reset tables, too
    console.log("resetting cols");
    powerItemCol.innerText = "Equip RESPECTIVE_POWER_ITEM (+8 EVs in Battle)";
    vitaminCol.innerText = "Use RESPECTIVE_VITAMIN (+10 EVs)";
    featherCol.innerText = "Use RESPECTIVE_FEATHER (+1 EVs)";
    berryCol.innerText = "Feed RESPECTIVE_BERRY (-10 EVs)";
    console.log("resetting battle tables");

  });

/**
 * Function to hide buttons.
 */
  function hideButtons(){
    chooseAtk.style.display = "none";
    chooseDef.style.display = "none";
    chooseHealth.style.display = "none";
    chooseSpDef.style.display = "none";
    chooseSpa.style.display = "none";
    chooseSpe.style.display = "none";
  }

  function unhideButtons(){
    chooseAtk.style.display = "inline-block";
    chooseDef.style.display = "inline-block";
    chooseHealth.style.display = "inline-block";
    chooseSpDef.style.display = "inline-block";
    chooseSpa.style.display = "inline-block";
    chooseSpe.style.display = "inline-block";
  }

/**
 * A function to populate the monDropdown element with Pokemon.
 */
function populateDropdown(){
  // read in file
  fetch("parsedDex.txt")
      .then(r=>r.text())
      .then(text => {
      // convert to array
      let lines;
      lines = text.split("\n")
      console.log(lines);

      let dropdown = document.getElementById('monDropdown');
      for(const element of lines){
      // create dropdown option with this line
      let newOption = document.createElement('option');
      newOption.value = element;
      newOption.text = element;
      dropdown.add(newOption);
      }
  });
}

// PLAN
// One stat at a time for now. update table depending on stat selected. then, prompt with dropdown of
// mons that give that EV yield and only that EV yield maybe
function editTable(effortValue){

  console.log("editTable called with effortValue:", effortValue);


  // Get header of the EV table
  let header = document.getElementById('evTableHeader');

  // Update table information accordingly depending on the stat button pressed
  powerItemCol.innerText = powerItemCol.innerText.replace("RESPECTIVE_POWER_ITEM", effortMappings[effortValue].powerItem);
  vitaminCol.innerText = vitaminCol.innerText.replace("RESPECTIVE_VITAMIN", effortMappings[effortValue].vitamin);
  featherCol.innerText = featherCol.innerText.replace("RESPECTIVE_FEATHER", effortMappings[effortValue].feather);
  berryCol.innerText = berryCol.innerText.replace("RESPECTIVE_BERRY", effortMappings[effortValue].berry);

  // Hide the buttons now that a button has been pressed

  whatTrain.style.display = "none";
  chooseHealth.style.display = "none";
  chooseAtk.style.display = "none";
  chooseDef.style.display = "none";
  chooseSpa.style.display = "none";
  chooseSpDef.style.display = "none";
  chooseSpe.style.display = "none";

  // Unhide relevant tables
  evContainer.style.display = "table";
  battleContainer.style.display = "table";
  // And back button
  backButton.style.display = "inline-block";
}

// Function to update the chart with the current EV values
function updateChart() {
  statChart.data.datasets[0].data = [hpEvsCt, atkEvsCt, defEvsCt, speEvsCt, spdEvsCt, spaEvsCt];
  statChart.update();
  statChart.update();
}

// Event listener that listens for any change in the dropdown
//monDropdown.addEventListener('change',dropdownOptionSelected);

/**
 * Function to get name of option selected in the dropdown and
 * search PokeAPI for it. 
 * NOTE ------------------------------
 * This does NOT work with all Pokemon yet, because of Pokemon like
 * Necrozma, Mimikyu, etc. having forms (mimikyu-busted, 
 * necrozma-dusk-mane). Arceus, Silvally, totem Pokemon, all need
 * to be handled. I'll work on it once I get this to work with the
 * other mons for starters.
 */
function dropdownOptionSelected(){
    // Gets the selected dropdown element
    let dropdownMon = monDropdown.value;
    console.log(dropdownMon + " element value");
    let pokeName = dropdownMon.toString();
    console.log(pokeName + " string");
    if(pokeName === "default"){
      alert("Select a Pokemon.");
    }
    // Call API to get this Pokemon name object
    fetch(`https://pokeapi.co/api/v2/pokemon/${pokeName}/`)
    // Check status
    .then(res => {
        if(!res.ok){
            throw new Error("Unable to fetch " + pokeName + " from PokeAPI.")
        } return res.json();
    })
    // Then handle data
    .then(data => {
        console.log(data);
        // We got a 'mon, unhide EV page, training, and hide startup
        evWindow.style.display = "block";     // display mon for now
        // Make it sticky to top-right
        evWindow.style.position = "fixed";
        evWindow.style.top = "0";
        evWindow.style.right = "0";
        evWindow.style.zIndex = "999";
        let tut = document.getElementById('tut');
        tut.style.display = "none";
        startup.style.display = "none";
        trainingOptions.style.display = "block";
        replaceWithMon.style.display = "block";
        evChart.style.display = "flex";
        evChart.style.justifyContent = "center";
        evChart.style.maxHeight = "50vh";


        // Get the text element that shows this Pokemon's name and
        // replace it with the name of the chosen Pokemon
        let buildMon = document.getElementById('replaceWithMon');
        let buildMonsName = data.name;
        // Uppercasing first letter here
        let uppercasingFirstLetter = buildMonsName.substring(0,1).toUpperCase();
        buildMonsName = uppercasingFirstLetter + buildMonsName.substring(1);
        buildMon.textContent = buildMonsName;
        // get the animated version if it exists, if not then get the
        // regular front-facing sprite
        let pokeImage;
        pokeImage = document.getElementById('replaceWithSprite');
        if(data.sprites.other.showdown.front_default != null){
            pokeImage.src = data.sprites.other.showdown.front_default;
        } else {
        // display the Pokemon's front-facing sprite
        pokeImage.src = data.sprites.front_default;
        }
        // make it cry
        let cry = new Audio(data.cries.latest);
        cry.play();
        // populate array with its stats
        statsArr = [
            data.stats[0].base_stat, // hp
            data.stats[1].base_stat, // atk
            data.stats[2].base_stat, // def
            data.stats[3].base_stat, // spa
            data.stats[4].base_stat, // spd
            data.stats[5].base_stat // spe
        ]
        let index = 0; 
        // print out base values
        for(let stats of statsArr){    
            let statAbbreviation = "";
            switch(index){
                case 0:
                  statAbbreviation = "HP";
                  index++;
                  break;
                case 1:
                  statAbbreviation = "Atk";
                  index++;
                  break;
                case 2:
                   statAbbreviation = "Def";
                   index++;
                  break;
                case 3:
                  statAbbreviation = "Sp. Atk";
                  index++;
                  break;
                case 4:
                  statAbbreviation = "Sp. Def";
                  index++;
                  break;
                case 5:
                  statAbbreviation = "Speed";
                  break;
                default:
                    statAbbreviation = "???";
              }
            console.log(stats);
            //let stat = document.createElement('p');
            //stat.textContent = stats + " " + statAbbreviation; 
            //baseStatsWindow.appendChild(stat);
        }
            // push base stats
            statChart.data.datasets.push({
                label: 'Base Stat Values',
                data: [statsArr[0], statsArr[1], statsArr[2], statsArr[5], statsArr[4], statsArr[3]],
                borderWidth: 1,
                backgroundColor: 'rgba(255, 251, 16, 0.49)'
            });
    })
    .catch(error => {
        console.error(error);
    });
}
