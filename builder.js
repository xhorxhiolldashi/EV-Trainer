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
// Base stats window
let baseStatsWindow = document.getElementById('baseStats');
// Array for obtained base stat values
    // it goes hp, atk, def, spa, spd, spe
    let statsArr = [
        0,0,0,0,0,0
    ];

// Button for user to confirm this pokemon
// When selected, get rid of dropdown and display the pokemon
let confirmButton = document.getElementById('letsBuild');
confirmButton.addEventListener('click',dropdownOptionSelected);

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
        evWindow.style.display = "block";
        startup.style.display = "none";
        trainingOptions.style.display = "block";
        // Get the text element that shows this Pokemon's name and
        // replace it with the name of the chosen Pokemon
        let buildMon = document.getElementById('replaceWithMon');
        let buildMonsName = data.name;
        // Uppercasing first letter here
        let uppercasingFirstLetter = buildMonsName.substring(0,1).toUpperCase();
        buildMonsName = uppercasingFirstLetter + buildMonsName.substring(1);
        buildMon.innerHTML = buildMonsName;
        // display the Pokemon's front-facing sprite
        let pokeImage = document.getElementById('replaceWithSprite');
        pokeImage.src = data.sprites.front_default;
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
            stat.innerHTML = stats + " " + statAbbreviation; 
            baseStatsWindow.appendChild(stat);
        }

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



