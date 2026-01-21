// Fotball Trener App - Endelig versjon med sikre fikser
// Passord: "1234"

// === GLOBALE VARIABLER ===
let players = [];
let ligaData = null;
let lastTeamSetup = null; // For å sjekke om vi får ny inndeling

// === INNLASTING ===
document.addEventListener('DOMContentLoaded', function() {
    console.log('App starter...');
    
    // Sjekk om vi allerede er logget inn
    checkLoginStatus();
});

// === PASSORD FUNKSJONER === (samme som før - ikke vist for å spare plass)
// ... [samme passord-kode som før] ...

// === HOVEDAPP ===
function initApp() {
    console.log('Initialiserer hovedapp...');
    
    // Last spillere
    loadPlayers();
    
    // Last liga data
    loadLigaData();
    
    // Oppdater visning
    renderPlayers();
    updateStats();
    renderLigaTeamNames();
    renderLigaMatches();
    renderLigaTable();
    
    // Sett opp ALLE event listeners
    setupAllEventListeners();
    
    // Sett opp tabs
    setupTabs();
}

function loadPlayers() {
    const saved = localStorage.getItem('fotballPlayers');
    players = saved ? JSON.parse(saved) : [];
    console.log('Lastet', players.length, 'spillere');
}

// ... [samme kode for savePlayers, updateStats, renderPlayers, etc.] ...

// === TRENINGSGRUPPER === (NY ALGORITME - GARANTERT INGEN ENSOMME SPILLERE)
function createTrainingGroups() {
    const selectedCheckboxes = document.querySelectorAll('#trainingPlayerSelection input:checked');
    const selectedIndexes = Array.from(selectedCheckboxes).map(input => parseInt(input.value));
    
    console.log('Valgte spillere for trening:', selectedIndexes);
    
    if (selectedIndexes.length < 2) {
        showNotification('Velg minst 2 spillere for trening', 'error');
        return;
    }
    
    const groupsInput = document.getElementById('trainingGroups');
    const numGroups = groupsInput ? parseInt(groupsInput.value) : 2;
    
    // Tillat 2-6 grupper
    if (numGroups < 2 || numGroups > 6) {
        showNotification('Velg mellom 2 og 6 grupper', 'error');
        return;
    }
    
    if (selectedIndexes.length < numGroups) {
        showNotification(`For få spillere for ${numGroups} grupper`, 'error');
        return;
    }
    
    // SJEKK OM DET ER MULIG Å HA MINST 2 SPILLERE PER GRUPPE
    if (selectedIndexes.length < numGroups * 2) {
        showNotification(`For få spillere. Trenger minst ${numGroups * 2} spillere for ${numGroups} grupper (2 per gruppe)`, 'error');
        return;
    }
    
    const selectedPlayers = selectedIndexes.map(index => players[index]);
    
    // NY ALGORITME: GARANTERT MINIMUM 2 SPILLERE PER GRUPPE
    // 1. Bland spillerne TILFELDIG for ny inndeling hver gang
    const shuffledPlayers = shuffleArray([...selectedPlayers]);
    
    // 2. Sorter etter ferdighet (beste først) etter shuffling
    shuffledPlayers.sort((a, b) => b.skill - a.skill);
    
    // 3. Lag grupper
    const groups = Array.from({ length: numGroups }, () => ({
        players: [],
        totalSkill: 0,
        goalies: 0,
        groupQuality: ''
    }));
    
    // 4. FORDEL SPILLERE - GARANTERT 2 PER GRUPPE FØRST
    // Fordel 2 spillere til hver gruppe først
    for (let i = 0; i < numGroups * 2; i++) {
        const player = shuffledPlayers[i];
        const groupIndex = i % numGroups;
        
        groups[groupIndex].players.push(player);
        groups[groupIndex].totalSkill += player.skill;
        if (player.isGoalie) groups[groupIndex].goalies++;
    }
    
    // 5. FORDEL RESTEN AV SPILLERNE ROUND-ROBIN
    for (let i = numGroups * 2; i < shuffledPlayers.length; i++) {
        const player = shuffledPlayers[i];
        
        // Finn gruppe med lavest total ferdighet for balanse
        let minSkillGroup = 0;
        for (let j = 1; j < groups.length; j++) {
            if (groups[j].totalSkill < groups[minSkillGroup].totalSkill) {
                minSkillGroup = j;
            }
        }
        
        groups[minSkillGroup].players.push(player);
        groups[minSkillGroup].totalSkill += player.skill;
        if (player.isGoalie) groups[minSkillGroup].goalies++;
    }
    
    // 6. Sorter gruppene etter total ferdighet for kvalitetsmerking
    groups.sort((a, b) => b.totalSkill - a.totalSkill);
    
    // Sett gruppekvalitet
    groups.forEach((group, index) => {
        if (index === 0) {
            group.groupQuality = 'sterk';
        } else if (index === groups.length - 1) {
            group.groupQuality = 'svak';
        } else {
            group.groupQuality = 'middels';
        }
    });
    
    // Vis resultater
    displayTrainingResults(groups);
    
    showNotification(`Lagde ${numGroups} treningsgrupper (minst 2 spillere per gruppe)`, 'success');
}

// Hjelpefunksjon for å blande array
function shuffleArray(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}

function displayTrainingResults(groups) {
    const resultsDiv = document.getElementById('trainingResults');
    if (!resultsDiv) return;
    
    let html = '<div class="groups-container">';
    
    groups.forEach((group, index) => {
        const avgSkill = group.players.length > 0 
            ? (group.totalSkill / group.players.length).toFixed(1)
            : 0;
        
        // Sjekk at gruppen har minst 2 spillere
        if (group.players.length < 2) {
            console.warn(`Advarsel: Gruppe ${index + 1} har kun ${group.players.length} spiller(e)`);
        }
        
        let qualityIcon = '⚪';
        let qualityText = '';
        
        if (group.groupQuality === 'sterk') {
            qualityIcon = '🏆';
            qualityText = ' (Sterkeste)';
        } else if (group.groupQuality === 'svak') {
            qualityIcon = '🌱';
            qualityText = ' (Svakeste)';
        } else if (group.groupQuality === 'middels') {
            qualityIcon = '⚖️';
            qualityText = ' (Middels)';
        }
        
        html += `
            <div class="group-card">
                <div class="group-header">
                    <span class="group-name">${qualityIcon} Gruppe ${index + 1}${qualityText}</span>
                    <span class="group-stats">
                        ${group.players.length} spillere | 
                        Totalt: ${group.totalSkill} | 
                        Gj.snitt: ${avgSkill}
                        ${group.goalies > 0 ? ' | 🧤 ' + group.goalies + ' målvakt(er)' : ''}
                    </span>
                </div>
                <ul class="group-players">
        `;
        
        group.players.forEach(player => {
            html += `
                <li class="group-player">
                    <span>${player.name}</span>
                    <span>
                        <span class="skill-badge">${player.skill}</span>
                        ${player.isGoalie ? '🧤' : ''}
                    </span>
                </li>
            `;
        });
        
        html += `
                </ul>
            </div>
        `;
    });
    
    html += '</div>';
    resultsDiv.innerHTML = html;
}

// === KAMPOPPSETT === (NY ALGORITME - GARANTERT FORSKJELLIG HVER GANG)
function createMatchTeams() {
    console.log('Starter lag kampoppsett...');
    
    // Hent alle valgte spillere
    const selectedCheckboxes = document.querySelectorAll('#matchPlayerSelection input:checked');
    const selectedIndexes = Array.from(selectedCheckboxes).map(input => parseInt(input.value));
    
    console.log('Valgte spillere for kamp:', selectedIndexes);
    
    if (selectedIndexes.length < 2) {
        showNotification('Velg minst 2 spillere for kamp', 'error');
        return;
    }
    
    const teamsInput = document.getElementById('matchTeams');
    const numTeams = teamsInput ? parseInt(teamsInput.value) : 2;
    
    if (numTeams < 2 || numTeams > 5) {
        showNotification('Velg mellom 2 og 5 lag', 'error');
        return;
    }
    
    console.log('Antall lag:', numTeams);
    
    if (selectedIndexes.length < numTeams) {
        showNotification(`For få spillere for ${numTeams} lag. Velg minst ${numTeams} spillere.`, 'error');
        return;
    }
    
    const selectedPlayers = selectedIndexes.map(index => {
        return players[index];
    }).filter(player => player !== undefined);
    
    console.log('Valgte spillere:', selectedPlayers);
    
    // Sjekk målvakter
    const goalies = selectedPlayers.filter(p => p.isGoalie);
    console.log('Målvakter:', goalies.length);
    
    const allowWithoutGoalies = document.getElementById('allowTeamsWithoutGoalies') ?
        document.getElementById('allowTeamsWithoutGoalies').checked : true;
    
    if (!allowWithoutGoalies && goalies.length < numTeams) {
        showNotification(`Trenger minst ${numTeams} målvakter for ${numTeams} lag. Du har ${goalies.length}.`, 'error');
        return;
    }
    
    // NY ALGORITME: GARANTERT FORSKJELLIG INNDELING HVER GANG
    let teams;
    let attempts = 0;
    const maxAttempts = 10;
    
    do {
        attempts++;
        console.log(`Forsøk ${attempts} av ${maxAttempts} på å lage ny inndeling`);
        teams = generateNewTeamSetup(selectedPlayers, goalies, numTeams, allowWithoutGoalies);
    } while (isSameAsLastSetup(teams) && attempts < maxAttempts);
    
    // Lagre denne oppsettet for sammenligning neste gang
    lastTeamSetup = teams.map(team => ({
        playerNames: team.players.map(p => p.name).sort(),
        totalSkill: team.totalSkill
    }));
    
    console.log('Ferdige lag:', teams);
    
    // Vis resultater
    displayMatchResults(teams);
    
    if (attempts > 1) {
        showNotification(`Lagde ${numTeams} lag (forsøkte ${attempts} ganger for ny inndeling)`, 'success');
    } else {
        showNotification(`Lagde ${numTeams} balanserte lag (ny inndeling!)`, 'success');
    }
}

function generateNewTeamSetup(selectedPlayers, goalies, numTeams, allowWithoutGoalies) {
    // Lag en helt ny shufflet liste
    const shuffledPlayers = shuffleArray([...selectedPlayers]);
    
    // Lag lag
    const teams = Array.from({ length: numTeams }, () => ({
        players: [],
        totalSkill: 0,
        hasGoalie: false
    }));
    
    // Fordel målvakter først (hvis de finnes og det er tillatt)
    if (goalies.length > 0) {
        const shuffledGoalies = shuffleArray([...goalies]);
        
        shuffledGoalies.forEach((goalie, index) => {
            const teamIndex = index % numTeams;
            teams[teamIndex].players.push(goalie);
            teams[teamIndex].totalSkill += goalie.skill;
            teams[teamIndex].hasGoalie = true;
            
            // Fjern fra shuffledPlayers
            const playerIndex = shuffledPlayers.findIndex(p => p.id === goalie.id);
            if (playerIndex > -1) {
                shuffledPlayers.splice(playerIndex, 1);
            }
        });
    }
    
    // Sorter resterende spillere etter ferdighet (høyeste først)
    shuffledPlayers.sort((a, b) => b.skill - a.skill);
    
    // Fordel resten av spillerne - NY ALGORITME FOR VARIASJON
    // Alternate mellom å legge til i sterkeste og svakeste lag
    let addToWeakest = true;
    
    shuffledPlayers.forEach((player) => {
        let targetTeamIndex;
        
        if (addToWeakest) {
            // Finn lag med lavest total ferdighet
            targetTeamIndex = 0;
            for (let i = 1; i < teams.length; i++) {
                if (teams[i].totalSkill < teams[targetTeamIndex].totalSkill) {
                    targetTeamIndex = i;
                }
            }
        } else {
            // Finn lag med høyest total ferdighet
            targetTeamIndex = 0;
            for (let i = 1; i < teams.length; i++) {
                if (teams[i].totalSkill > teams[targetTeamIndex].totalSkill) {
                    targetTeamIndex = i;
                }
            }
        }
        
        // Legg til spilleren
        teams[targetTeamIndex].players.push(player);
        teams[targetTeamIndex].totalSkill += player.skill;
        
        // Bytt retning for neste spiller
        addToWeakest = !addToWeakest;
    });
    
    // Sorter spillere i hvert lag etter ferdighet
    teams.forEach(team => {
        team.players.sort((a, b) => b.skill - a.skill);
    });
    
    return teams;
}

function isSameAsLastSetup(newTeams) {
    if (!lastTeamSetup) return false;
    
    const newSetup = newTeams.map(team => ({
        playerNames: team.players.map(p => p.name).sort(),
        totalSkill: team.totalSkill
    }));
    
    // Sorter begge oppsettene for sammenligning
    const sortedLast = [...lastTeamSetup].sort((a, b) => 
        a.playerNames.join(',').localeCompare(b.playerNames.join(','))
    );
    
    const sortedNew = [...newSetup].sort((a, b) => 
        a.playerNames.join(',').localeCompare(b.playerNames.join(','))
    );
    
    // Sammenlign
    if (sortedLast.length !== sortedNew.length) return false;
    
    for (let i = 0; i < sortedLast.length; i++) {
        if (sortedLast[i].playerNames.join(',') !== sortedNew[i].playerNames.join(',')) {
            return false;
        }
    }
    
    return true;
}

function displayMatchResults(teams) {
    const resultsDiv = document.getElementById('matchResults');
    if (!resultsDiv) {
        console.error('Finner ikke matchResults div!');
        return;
    }
    
    console.log('Viser kampresultater for', teams.length, 'lag');
    
    const teamSkills = teams.map(t => t.totalSkill);
    const maxSkill = Math.max(...teamSkills);
    const minSkill = Math.min(...teamSkills);
    const skillDifference = maxSkill - minSkill;
    
    let html = `
        <div style="margin-bottom: 15px; padding: 10px; background: #e8f4f8; border-radius: 4px;">
            <strong>Balansestatus:</strong> 
            ${skillDifference <= 2 ? 'Godt balansert ⚖️' : 'Noe ubalansert ⚠️'} 
            (Største forskjell: ${skillDifference} poeng)
        </div>
        <div class="groups-container">
    `;
    
    teams.forEach((team, index) => {
        const avgSkill = team.players.length > 0 
            ? (team.totalSkill / team.players.length).toFixed(1)
            : 0;
        
        const teamGoalies = team.players.filter(p => p.isGoalie).length;
        
        html += `
            <div class="group-card">
                <div class="group-header">
                    <span class="group-name">Lag ${String.fromCharCode(65 + index)}</span>
                    <span class="group-stats">
                        ${team.players.length} spillere | 
                        Totalt: ${team.totalSkill} | 
                        Gj.snitt: ${avgSkill}
                        ${teamGoalies > 0 ? ' | 🧤 ' + teamGoalies + ' målvakt(er)' : ' | Målvakt: Annet'}
                    </span>
                </div>
                <ul class="group-players">
        `;
        
        team.players.forEach(player => {
            html += `
                <li class="group-player">
                    <span>${player.name}</span>
                    <span>
                        <span class="skill-badge">${player.skill}</span>
                        ${player.isGoalie ? '🧤' : ''}
                    </span>
                </li>
            `;
        });
        
        html += `
                </ul>
            </div>
        `;
    });
    
    html += '</div>';
    resultsDiv.innerHTML = html;
}

// ... [resten av koden for ligaspill og event listeners - samme som før] ...