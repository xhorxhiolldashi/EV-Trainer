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

// Maximum possible EVs you can invest across the board
let evMax = 508;
// Count of EVs at the moment
let evsCount = 0;
// Flag to stop adding
let evsMaxed = false;

// Map for EVs
let EVsMap = {
  'hp': 0,
  'atk': 0,
  'def': 0,
  'spa': 0,
  'spd': 0,
  'spe': 0
  }
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

// Button for user to confirm this pokemon
// When selected, get rid of dropdown and display the pokemon
let confirmButton = document.getElementById('letsBuild');
confirmButton.addEventListener('click',dropdownOptionSelected);

// Training button event listeners
let chooseHealth = document.getElementById('chooseHealth');
let chooseAtk = document.getElementById('chooseAtk');
let chooseDef = document.getElementById('chooseDef');
let chooseSpa = document.getElementById('chooseSpa');
let chooseSpDef = document.getElementById('chooseSpDef');
let chooseSpe = document.getElementById('chooseSpe');
//let start = document.getElementById('letsStart');

// Add event listeners to each of the buttons such that
// when they're clicked, create their respective tables
// and hide the 'choose' buttons
chooseHealth.addEventListener('click', function () {
addTrainingTable('hp');
chooseHealth.style.display = "none";
});
chooseAtk.addEventListener('click', function () {
addTrainingTable('atk');
chooseAtk.style.display = "none";
});
chooseDef.addEventListener('click', function () {
addTrainingTable('def');
chooseDef.style.display = "none";
});
chooseSpa.addEventListener('click', function () {
addTrainingTable('spa');
chooseSpa.style.display = "none";
});
chooseSpDef.addEventListener('click', function () {
addTrainingTable('spd');
chooseSpDef.style.display = "none";
});
chooseSpe.addEventListener('click', function () {
addTrainingTable('spe');
chooseSpe.style.display = "none";
});
  
  
  
  


// Create a table for this Effort Value.
function addTrainingTable(effortValue){

  const effortMappings = {
    'hp': {powerItem: "Power Band", vitamin: "HP Up", feather: "Health Feather", berry: "Pomeg Berry"},
    'atk': {powerItem: "Power Bracer", vitamin: "Protein", feather: "Attack Feather", berry: "Kelpsy Berry"},
    'def': {powerItem: "Power Belt", vitamin: "Iron", feather: "Defense Feather", berry: "Qualot Berry"},
    'spa': {powerItem: "Power Lens", vitamin: "Calcium", feather: "Sp. Attack Feather", berry: "Hondew Berry"},
    'spd': {powerItem: "Power Band", vitamin: "Zinc", feather: "Sp. Defense Feather", berry: "Grepa Berry"},
    'spe': {powerItem: "Power Anklet", vitamin: "Carbos", feather: "Speed Feather", berry: "Tamato Berry"}
    }

  // Create new table to add stuff
  const newTable = document.createElement("table");
  // Create the head of the table
  const newHead = document.createElement("thead");
  // Create the tr of the head of the table
  const newTr = document.createElement("tr");
  // Create body
  const newBod = document.createElement("tbody");

  // We need a th for each training option
    const berryTh = document.createElement("th");
    berryTh.setAttribute("scope", "col");
    berryTh.innerText = "Use " + effortMappings[effortValue].berry + " (-10 EVs)";
    berryTh.classList.add("p-3");

    const vitaminTh = document.createElement("th");
    vitaminTh.setAttribute("scope", "col");
    vitaminTh.innerText = "Use " + effortMappings[effortValue].vitamin + " (+10 EVs)";
    vitaminTh.classList.add("p-3");

    const featherTh = document.createElement("th");
    featherTh.setAttribute("scope", "col");
    featherTh.innerText = "Use " + effortMappings[effortValue].feather + " (+1 EVs)";
    featherTh.classList.add("p-3");

    const equipmentTh = document.createElement("th");
    equipmentTh.setAttribute("scope", "col");
    equipmentTh.innerText = "Equip " + effortMappings[effortValue].powerItem + " (+8 EVs)";
    equipmentTh.classList.add("p-3");

  // That is the head and tr done, add everything
  newTr.appendChild(berryTh);
  newTr.appendChild(vitaminTh);
  newTr.appendChild(featherTh);
  newTr.appendChild(equipmentTh);
  newHead.appendChild(newTr);
  
  // Now the body must be populated with the buttons
  const berryButton = document.createElement("button");
  berryButton.innerText = "Feed " + effortMappings[effortValue].berry;

  const vitaminButton = document.createElement("button");
  vitaminButton.innerText = "Use " + effortMappings[effortValue].vitamin;

  const featherButton = document.createElement("button");
  featherButton.innerText = "Use " + effortMappings[effortValue].feather;

  const equipmentButton = document.createElement("button");
  equipmentButton.innerText = "Equip " + effortMappings[effortValue].powerItem;
  
  // Add event listeners to each of the buttons
  // Berries remove 10 of an EV
  berryButton.addEventListener('click', function(){

    EVsMap[effortValue] = EVsMap[effortValue] - 10;
    if(EVsMap[effortValue] <= 0){
      EVsMap[effortValue] = 0;
    }
    console.log("berry pressed");
    updateChart();
  });
  
  // Vitamins add 10 of an EV
  vitaminButton.addEventListener('click', function(){
    // Increase this EV
    EVsMap[effortValue] = EVsMap[effortValue] + 10;
    // Cap it at 252
    if(EVsMap[effortValue] >= 252){
      EVsMap[effortValue] = 252;
    }
    console.log("vitamin pressed");
    updateChart();
  });
  // Feathers add 1 of an EV
  featherButton.addEventListener('click', function(){

    EVsMap[effortValue] = EVsMap[effortValue] + 1;
    if(EVsMap[effortValue] >= 252){
      EVsMap[effortValue] = 252;
    }
    console.log("feather pressed");
    updateChart();
  });

  const newRow = document.createElement("tr");

  const berryTd = document.createElement("td");
  berryTd.classList.add("p-3");
  berryTd.appendChild(berryButton);
  
  const vitaminTd = document.createElement("td");
  vitaminTd.classList.add("p-3");
  vitaminTd.appendChild(vitaminButton);
  
  const featherTd = document.createElement("td");
  featherTd.classList.add("p-3");
  featherTd.appendChild(featherButton);
  
  const equipmentTd = document.createElement("td");
  equipmentTd.classList.add("p-3");
  equipmentTd.appendChild(equipmentButton);
  
  newRow.appendChild(berryTd);
  newRow.appendChild(vitaminTd);
  newRow.appendChild(featherTd);
  newRow.appendChild(equipmentTd);
  newBod.appendChild(newRow);

  // Add the body to the table and the span
  newTable.appendChild(newHead);
  newTable.appendChild(newBod);
  document.getElementById("addTables").appendChild(newTable);

  




  }

// Function to update the chart with the current EV values
function updateChart() {
  statChart.data.datasets[0].data = [
    EVsMap['hp'],
    EVsMap['atk'],
    EVsMap['def'],
    EVsMap['spe'],
    EVsMap['spd'],
    EVsMap['spa']
  ];
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
        //evWindow.style.display = "block";     // dont display mon for now
        startup.style.display = "none";
        trainingOptions.style.display = "block";
        replaceWithMon.style.display = "block";
        evChart.style.display = "flex";
        evChart.style.justifyContent = "center";
        

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
            let stat = document.createElement('p');
            stat.textContent = stats + " " + statAbbreviation; 
            baseStatsWindow.appendChild(stat);
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

/**
 * A function to get all the dex entries to date.
 * Kinda don't need this right now... keeping it for now
 */
function fetchDexEntries(){
    // fetch pokedex JSON, contains dex entry number
    fetch(`https://pokeapi.co/api/v2/pokemon-species/?limit=0`)
    // check response status
    .then(res => {
        if (!res.ok){
            // if not, throw an error
            throw new Error("Dex entry fetch failed.");
        }
            //return the response as json
        return res.json();
    })
    // response is ok, handle data
    .then(data => {
        // get number of dex entries
        dexEntries = data.count;
        console.log("PokeAPI Dex entry count: " + dexEntries);
        return dexEntries;
        

    })
    // catch any errors
    .catch(error => {
        console.error(error);
    })
}



