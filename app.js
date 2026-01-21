// Fotball Trener App - Fullstendig versjon med ekte logoer og alle fikser
// Passord: "1234"

// === GLOBALE VARIABLER ===
let players = [];
let ligaData = null;
let currentLogo = 'eggeil'; // 'eggeil' eller 'sorliail'

// === INNLASTING ===
document.addEventListener('DOMContentLoaded', function() {
    console.log('App starter...');
    
    // Last logo fra localStorage
    const savedLogo = localStorage.getItem('fotballLogo');
    if (savedLogo) {
        currentLogo = savedLogo;
    }
    
    // Sjekk om vi allerede er logget inn
    checkLoginStatus();
});

// === LOGO FUNKSJONER MED EKTE BILDER ===
function updateLogo() {
    const logoContainer = document.getElementById('logoContainer');
    if (!logoContainer) return;
    
    // Tøm container
    logoContainer.innerHTML = '';
    
    // Lag logo element basert på valgt klubb
    const logoDiv = document.createElement('div');
    logoDiv.className = 'club-logo';
    
    if (currentLogo === 'eggeil') {
        // Egge IL logo med ekte bilde
        logoDiv.innerHTML = `
            <div class="logo-display">
                <img src="https://scontent.ftrd3-1.fna.fbcdn.net/v/t39.30808-6/326250318_574466924548704_8084511500244280576_n.png?_nc_cat=100&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=639Ahqa3v6IQ7kNvwFWo49L&_nc_oc=Adn6xokJ6Q1epv_J7y34SO9voNSjm4xuVRcYQiSUibiXcCXocp0RoP2TTCkU3ySqmzo&_nc_zt=23&_nc_ht=scontent.ftrd3-1.fna&_nc_gid=1l1M8svavpz0ccqP1018Jw&oh=00_AfoHpRgfGa0-fHpGfqf-Z9QM3NeUaxyAqmkQSQJqzWRY8Q&oe=697706C0" 
                     alt="Egge IL Logo" class="logo-image">
                <div>
                    <div class="club-name">Egge IL</div>
                    <div class="club-sport">Fotball</div>
                </div>
            </div>
        `;
    } else {
        // Sørlia IL logo med ekte bilde
        logoDiv.innerHTML = `
            <div class="logo-display">
                <img src="https://upload.wikimedia.org/wikipedia/commons/2/27/S%C3%B8rlia_IL_logo.png" 
                     alt="Sørlia IL Logo" class="logo-image">
                <div>
                    <div class="club-name">Sørlia IL</div>
                    <div class="club-sport">Fotball</div>
                </div>
            </div>
        `;
    }
    
    // Lag logo bytte knapp
    const switchBtn = document.createElement('button');
    switchBtn.className = 'logo-switch-btn';
    switchBtn.innerHTML = '<i class="fas fa-sync-alt"></i>';
    switchBtn.title = 'Bytt klubb';
    switchBtn.onclick = function() {
        currentLogo = currentLogo === 'eggeil' ? 'sorliail' : 'eggeil';
        localStorage.setItem('fotballLogo', currentLogo);
        updateLogo();
        showNotification(`Byttet til ${currentLogo === 'eggeil' ? 'Egge IL' : 'Sørlia IL'}`, 'info');
    };
    
    logoContainer.appendChild(logoDiv);
    logoContainer.appendChild(switchBtn);
}

function showMainApp() {
    console.log('Viser hovedapp');
    document.getElementById('passwordProtection').style.display = 'none';
    document.getElementById('mainApp').style.display = 'block';
    
    // Oppdater logo
    updateLogo();
}

// === PASSORD FUNKSJONER ===
function checkLoginStatus() {
    const isLoggedIn = localStorage.getItem('fotballLoggedIn');
    const loginTime = localStorage.getItem('fotballLoginTime');
    
    if (isLoggedIn === 'true' && loginTime) {
        const hoursSinceLogin = (Date.now() - parseInt(loginTime)) / (1000 * 60 * 60);
        if (hoursSinceLogin < 8) {
            // Fortsatt innlogget
            showMainApp();
            initApp();
            return;
        }
    }
    
    // Ikke innlogget eller sesjon utløpt
    showPasswordScreen();
    setupPasswordEvents();
}

function showPasswordScreen() {
    console.log('Viser passordskjerm');
    document.getElementById('passwordProtection').style.display = 'flex';
    document.getElementById('mainApp').style.display = 'none';
    
    // Sett fokus på passordfelt
    setTimeout(() => {
        const passwordInput = document.getElementById('passwordInput');
        if (passwordInput) {
            passwordInput.value = '';
            passwordInput.focus();
        }
    }, 100);
}

function setupPasswordEvents() {
    console.log('Setter opp passord-events');
    
    // Logg inn knapp
    const loginBtn = document.getElementById('loginBtn');
    if (loginBtn) {
        loginBtn.addEventListener('click', function() {
            console.log('Login knapp klikket');
            checkPassword();
        });
    }
    
    // Enter i passordfelt
    const passwordInput = document.getElementById('passwordInput');
    if (passwordInput) {
        passwordInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                console.log('Enter trykket i passordfelt');
                checkPassword();
            }
        });
    }
    
    // Vis/skjul passord
    const showBtn = document.getElementById('showPasswordBtn');
    if (showBtn) {
        showBtn.addEventListener('click', function() {
            const input = document.getElementById('passwordInput');
            if (input.type === 'password') {
                input.type = 'text';
                this.innerHTML = '<i class="fas fa-eye-slash"></i>';
            } else {
                input.type = 'password';
                this.innerHTML = '<i class="fas fa-eye"></i>';
            }
        });
    }
}

function checkPassword() {
    const passwordInput = document.getElementById('passwordInput');
    const password = passwordInput ? passwordInput.value.trim() : '';
    const errorDiv = document.getElementById('passwordError');
    
    console.log('Sjekker passord:', password);
    
    // Passord er "1234"
    if (password === '1234') {
        console.log('Riktig passord!');
        
        // Lagre login
        localStorage.setItem('fotballLoggedIn', 'true');
        localStorage.setItem('fotballLoginTime', Date.now().toString());
        
        // Fjern feilmelding
        if (errorDiv) errorDiv.classList.remove('show');
        
        // Vis hovedapp
        showMainApp();
        initApp();
        
        // Vis velkomst med klubbnavn
        const clubName = currentLogo === 'eggeil' ? 'Egge IL' : 'Sørlia IL';
        showNotification(`Velkommen til ${clubName} Trenerapp!`, 'success');
    } else {
        console.log('Feil passord!');
        
        // Vis feilmelding
        if (errorDiv) errorDiv.classList.add('show');
        
        // Tøm passordfelt
        if (passwordInput) {
            passwordInput.value = '';
            passwordInput.focus();
            
            // Ryst animasjon
            passwordInput.style.animation = 'none';
            setTimeout(() => {
                passwordInput.style.animation = 'shake 0.5s ease';
            }, 10);
        }
    }
}

function logout() {
    const clubName = currentLogo === 'eggeil' ? 'Egge IL' : 'Sørlia IL';
    
    if (confirm(`Logg ut fra ${clubName} Trenerapp?`)) {
        localStorage.removeItem('fotballLoggedIn');
        localStorage.removeItem('fotballLoginTime');
        
        // Tøm passordfelt før visning
        const passwordInput = document.getElementById('passwordInput');
        if (passwordInput) {
            passwordInput.value = '';
        }
        
        showPasswordScreen();
        showNotification('Du er nå logget ut.', 'info');
    }
}

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
    
    // DEBUG: Sjekk at spillere faktisk lastes
    console.log('Spillere i minnet:', players);
}

function savePlayers() {
    localStorage.setItem('fotballPlayers', JSON.stringify(players));
    updateStats();
    // Oppdater spillervelgere i trening og kamp
    renderPlayerSelections();
}

function updateStats() {
    const totalPlayers = document.getElementById('totalPlayers');
    const totalGoalies = document.getElementById('totalGoalies');
    const playerCount = document.getElementById('playerCount');
    
    if (totalPlayers && totalGoalies && playerCount) {
        const goalies = players.filter(p => p.isGoalie).length;
        
        totalPlayers.textContent = players.length;
        totalGoalies.textContent = goalies;
        playerCount.textContent = players.length; // Viser samme som totalt
        
        // DEBUG: Logg til console
        console.log(`Statistikk oppdatert: ${players.length} spillere, ${goalies} målvakter`);
    } else {
        console.error('Finner ikke stat-elementer!');
    }
}

// === SPILLERHÅNDTERING MED NIVÅ VISNING ===
function renderPlayers() {
    const playerList = document.getElementById('playerList');
    if (!playerList) {
        console.error('Finner ikke playerList element!');
        return;
    }
    
    if (players.length === 0) {
        playerList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-users-slash"></i>
                <p>Ingen spillere lagt til ennå</p>
                <p class="small-text">Legg til noen spillere for å komme i gang</p>
            </div>
        `;
        return;
    }
    
    let html = '';
    players.forEach((player, index) => {
        const initials = player.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
        
        // Farge for nivå
        const skillColors = {
            1: '#EF4444', // Rød
            2: '#F97316', // Oransje
            3: '#F59E0B', // Gul
            4: '#10B981', // Grønn
            5: '#3B82F6', // Blå
            6: '#8B5CF6'  // Lilla
        };
        const skillColor = skillColors[player.skill] || '#6B7280';
        
        // Rolle basert på isGoalie
        const role = player.isGoalie ? 'Målvakt' : 'Utespiller';
        
        html += `
            <div class="player-item" data-id="${player.id}">
                <div class="player-avatar" style="background: ${skillColor};">
                    ${initials}
                    ${player.isGoalie ? '<div class="goalie-badge">🧤</div>' : ''}
                </div>
                <div class="player-info">
                    <div class="player-name">${player.name}</div>
                    <div class="player-meta">
                        <span class="position-indicator" style="background: ${skillColor}20; color: ${skillColor}; border: 1px solid ${skillColor}30;">
                            ${role} • Nivå ${player.skill}
                        </span>
                    </div>
                </div>
                <div class="player-actions">
                    <button class="action-btn-edit" onclick="editPlayer(${index})" title="Rediger">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn-delete" onclick="deletePlayer(${index})" title="Slett">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
    });
    
    playerList.innerHTML = html;
    console.log(`Rendret ${players.length} spillere`);
}

// === SPILLERVALG FOR TRENING/KAMP (UTEN NIVÅ) ===
function renderPlayerSelections() {
    const trainingSelection = document.getElementById('trainingPlayerSelection');
    const matchSelection = document.getElementById('matchPlayerSelection');
    
    if (players.length === 0) {
        const emptyHtml = `
            <div class="empty-state">
                <i class="fas fa-user-plus"></i>
                <p>Legg til spillere først i "Spillere"-fanen</p>
            </div>
        `;
        
        if (trainingSelection) trainingSelection.innerHTML = emptyHtml;
        if (matchSelection) matchSelection.innerHTML = emptyHtml;
        updateSelectedCounts();
        return;
    }
    
    let trainingHtml = '';
    let matchHtml = '';
    
    players.forEach((player, index) => {
        // For trening/kamp: Vis kun rolle (Utespiller/Målvakt), ikke nivå
        const role = player.isGoalie ? 'Målvakt' : 'Utespiller';
        
        const playerHtml = `
            <label class="player-checkbox-item selected">
                <input type="checkbox" value="${index}" checked>
                <div class="player-checkbox-info">
                    <div class="player-checkbox-name">${player.name}</div>
                    <div class="player-checkbox-details">
                        <span class="player-role">${player.isGoalie ? '🧤 Målvakt' : '⚽ Utespiller'}</span>
                    </div>
                </div>
            </label>
        `;
        
        trainingHtml += playerHtml;
        matchHtml += playerHtml;
    });
    
    if (trainingSelection) trainingSelection.innerHTML = trainingHtml;
    if (matchSelection) matchSelection.innerHTML = matchHtml;
    
    // Legg til event listeners for checkbox-endringer
    setTimeout(() => {
        document.querySelectorAll('#trainingPlayerSelection input[type="checkbox"]').forEach(cb => {
            cb.addEventListener('change', updateSelectedCounts);
        });
        
        document.querySelectorAll('#matchPlayerSelection input[type="checkbox"]').forEach(cb => {
            cb.addEventListener('change', updateSelectedCounts);
        });
        
        updateSelectedCounts();
    }, 100);
}

function updateSelectedCounts() {
    const trainingSelected = document.querySelectorAll('#trainingPlayerSelection input:checked').length;
    const matchSelected = document.querySelectorAll('#matchPlayerSelection input:checked').length;
    
    const trainingCount = document.getElementById('trainingSelectedCount');
    const matchCount = document.getElementById('matchSelectedCount');
    
    if (trainingCount) trainingCount.textContent = trainingSelected;
    if (matchCount) matchCount.textContent = matchSelected;
}

function addPlayer() {
    const nameInput = document.getElementById('playerName');
    const name = nameInput ? nameInput.value.trim() : '';
    
    if (!name) {
        showNotification('Skriv inn spillerens navn først', 'error');
        if (nameInput) nameInput.focus();
        return;
    }
    
    const skillSelect = document.getElementById('playerSkill');
    const skill = skillSelect ? parseInt(skillSelect.value) : 3;
    
    const goalieCheckbox = document.getElementById('playerGoalie');
    const isGoalie = goalieCheckbox ? goalieCheckbox.checked : false;
    
    const newPlayer = {
        id: Date.now(),
        name: name,
        skill: skill,
        isGoalie: isGoalie
    };
    
    players.push(newPlayer);
    savePlayers();
    renderPlayers();
    
    // Tøm skjema
    if (nameInput) nameInput.value = '';
    if (goalieCheckbox) goalieCheckbox.checked = false;
    
    showNotification(`Spiller "${name}" lagt til!`, 'success');
}

// Globale funksjoner for onclick
window.deletePlayer = function(index) {
    if (index < 0 || index >= players.length) return;
    
    const playerName = players[index].name;
    
    if (confirm(`Slett ${playerName} fra spillerlisten?`)) {
        players.splice(index, 1);
        savePlayers();
        renderPlayers();
        showNotification(`${playerName} er slettet`, 'success');
    }
};

window.editPlayer = function(index) {
    if (index < 0 || index >= players.length) return;
    
    const player = players[index];
    
    const newName = prompt('Endre navn:', player.name);
    if (newName === null) return;
    
    const newNameTrimmed = newName.trim();
    if (!newNameTrimmed) {
        showNotification('Navn kan ikke være tomt', 'error');
        return;
    }
    
    const newSkill = prompt('Ferdighetsnivå (1-6):\n1 = Nybegynner\n6 = Avansert', player.skill);
    if (newSkill === null) return;
    
    const skillNum = parseInt(newSkill);
    if (isNaN(skillNum) || skillNum < 1 || skillNum > 6) {
        showNotification('Skriv et tall mellom 1 og 6', 'error');
        return;
    }
    
    const isGoalie = confirm('Liker å stå i mål?\n\nOK = Målvakt\nAvbryt = Utespiller');
    
    player.name = newNameTrimmed;
    player.skill = skillNum;
    player.isGoalie = isGoalie;
    
    savePlayers();
    renderPlayers();
    showNotification(`${newNameTrimmed} oppdatert`, 'success');
};

// === TABS FUNKSJON ===
function setupTabs() {
    console.log('Setter opp tabs...');
    
    const tabButtons = document.querySelectorAll('.nav-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            console.log('Byttet til tab:', tabId);
            
            // Fjern active fra alle
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Legg til active på valgt
            this.classList.add('active');
            const targetTab = document.getElementById(tabId);
            if (targetTab) {
                targetTab.classList.add('active');
            }
            
            // Oppdater spillervelgere hvis vi går til trening/kamp
            if (tabId === 'training' || tabId === 'match') {
                setTimeout(() => {
                    renderPlayerSelections();
                }, 50);
            }
            
            // Oppdater liga team names hvis vi går til liga
            if (tabId === 'liga') {
                setTimeout(() => {
                    renderLigaTeamNames();
                }, 50);
            }
        });
    });
    
    console.log('Tabs satt opp:', tabButtons.length, 'stk');
}

// === TRENINGSGRUPPER === (BESTE SPILLERE SAMMEN MED ROTASJON - UTEN NIVÅ VISNING)
function createTrainingGroups() {
    const selectedCheckboxes = document.querySelectorAll('#trainingPlayerSelection input:checked');
    const selectedIndexes = Array.from(selectedCheckboxes).map(input => parseInt(input.value));
    
    if (selectedIndexes.length < 2) {
        showNotification('Velg minst 2 spillere for trening', 'error');
        return;
    }
    
    const groupsInput = document.getElementById('trainingGroups');
    const numGroups = groupsInput ? parseInt(groupsInput.value) : 2;
    
    if (numGroups < 2 || numGroups > 6) {
        showNotification('Velg mellom 2 og 6 grupper', 'error');
        return;
    }
    
    if (selectedIndexes.length < numGroups) {
        showNotification(`For få spillere for ${numGroups} grupper`, 'error');
        return;
    }
    
    const selectedPlayers = selectedIndexes.map(index => players[index]);
    
    // SORTER spillere etter ferdighet (BESTE FØRST)
    selectedPlayers.sort((a, b) => b.skill - a.skill);
    
    console.log('Sorterte spillere (beste først):', selectedPlayers.map(p => `${p.name} (${p.skill})`));
    
    // GRUPPER SPILLERE ETTER FERDIGHETSNIVÅ
    const playersBySkill = {};
    selectedPlayers.forEach(player => {
        if (!playersBySkill[player.skill]) {
            playersBySkill[player.skill] = [];
        }
        playersBySkill[player.skill].push(player);
    });
    
    // BLAND SPILLERE PÅ SAMME NIVÅ FOR ROTASJON
    for (const skillLevel in playersBySkill) {
        if (playersBySkill[skillLevel].length > 1) {
            // Bland spillere på samme nivå
            const shuffled = [...playersBySkill[skillLevel]];
            for (let i = shuffled.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
            }
            playersBySkill[skillLevel] = shuffled;
        }
    }
    
    // BYGG TILBAKE DEN SORTERTE LISTEN MED BLANDEDE SPILLERE PÅ SAMME NIVÅ
    const shuffledSelectedPlayers = [];
    const skillLevels = Object.keys(playersBySkill).sort((a, b) => b - a); // Høyeste først
    
    skillLevels.forEach(skill => {
        shuffledSelectedPlayers.push(...playersBySkill[skill]);
    });
    
    console.log('Blandet spillere på samme nivå:', shuffledSelectedPlayers.map(p => `${p.name} (${p.skill})`));
    
    // Lag grupper
    const groups = Array.from({ length: numGroups }, () => ({
        players: [],
        totalSkill: 0,
        goalies: 0,
        groupQuality: ''
    }));
    
    // ALGORITME: GRUPPE 1 FÅR DE BESTE SPILLERNE (men blandet innenfor nivå)
    // Beregn hvor mange spillere hver gruppe skal ha
    const basePlayersPerGroup = Math.floor(shuffledSelectedPlayers.length / numGroups);
    const remainder = shuffledSelectedPlayers.length % numGroups;
    
    const groupSizes = [];
    for (let i = 0; i < numGroups; i++) {
        groupSizes[i] = basePlayersPerGroup + (i < remainder ? 1 : 0);
    }
    
    console.log('Gruppestørrelser:', groupSizes);
    
    // Fordel spillere - GRUPPE 1 FÅR DE FØRSTE (BESTE) SPILLERNE
    // MEN nå er spillere på samme nivå blandet, så vi får rotasjon
    let playerIndex = 0;
    
    for (let groupNum = 0; groupNum < numGroups; groupNum++) {
        const targetSize = groupSizes[groupNum];
        
        for (let i = 0; i < targetSize && playerIndex < shuffledSelectedPlayers.length; i++) {
            const player = shuffledSelectedPlayers[playerIndex];
            groups[groupNum].players.push(player);
            groups[groupNum].totalSkill += player.skill;
            if (player.isGoalie) groups[groupNum].goalies++;
            playerIndex++;
        }
    }
    
    // Sorter gruppene etter total ferdighet (gruppe 1 vil alltid være øverst)
    groups.sort((a, b) => b.totalSkill - a.totalSkill);
    
    // Sett gruppekvalitet
    groups.forEach((group, index) => {
        if (index === 0) {
            group.groupQuality = 'sterk'; // Denne har de BESTE spillerne
        } else if (index === groups.length - 1) {
            group.groupQuality = 'utvikling'; // Mer positivt enn "svak"
        } else {
            group.groupQuality = 'middels';
        }
    });
    
    // Vis resultater (UTEN NIVÅ)
    displayTrainingResults(groups);
    
    showNotification(`${numGroups} treningsgrupper opprettet!`, 'success');
}

function displayTrainingResults(groups) {
    const resultsDiv = document.getElementById('trainingResults');
    if (!resultsDiv) return;
    
    let html = '<div class="groups-container">';
    
    groups.forEach((group, index) => {
        let qualityIcon = '⚪';
        let qualityText = '';
        
        if (group.groupQuality === 'sterk') {
            qualityIcon = '⭐';
            qualityText = ' Gruppe A';
        } else if (group.groupQuality === 'utvikling') {
            qualityIcon = '🌱';
            qualityText = ' Gruppe C';
        } else if (group.groupQuality === 'middels') {
            qualityIcon = '⚖️';
            qualityText = ' Gruppe B';
        }
        
        html += `
            <div class="group-card">
                <div class="group-header">
                    <span class="group-name">
                        ${qualityIcon}${qualityText}
                    </span>
                    <span class="group-stats">
                        ${group.players.length} spillere • 
                        ${group.goalies > 0 ? group.goalies + ' målvakt' + (group.goalies > 1 ? 'er' : '') : ''}
                    </span>
                </div>
                <ul class="group-players">
        `;
        
        group.players.forEach(player => {
            // Vis kun navn og rolle (ikke nivå)
            html += `
                <li class="group-player">
                    <span>${player.name}</span>
                    <span>
                        ${player.isGoalie ? '<span style="font-size: 1.2em;">🧤</span>' : '<span style="font-size: 1.2em;">⚽</span>'}
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

// === KAMPOPPSETT === (JEVE LAG MED BALANSERT FORDELING - UTEN NIVÅ)
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
        showNotification(`For få spillere for ${numTeams} lag`, 'error');
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
        showNotification(`Trenger minst ${numTeams} målvakter`, 'error');
        return;
    }
    
    // ALGORITME FOR JEVE LAG
    // 1. Beregn hvor mange spillere per lag (minimum 2 per lag om mulig)
    const basePlayersPerTeam = Math.floor(selectedPlayers.length / numTeams);
    const remainder = selectedPlayers.length % numTeams;
    
    console.log(`Spillere per lag: ${basePlayersPerTeam}, rest: ${remainder}`);
    
    // Sjekk at vi ikke får for få spillere på noen lag
    if (basePlayersPerTeam < 1) {
        showNotification('For mange lag i forhold til antall spillere', 'error');
        return;
    }
    
    // 2. Lag lag
    const teams = Array.from({ length: numTeams }, () => ({
        players: [],
        totalSkill: 0,
        hasGoalie: false
    }));
    
    // 3. Sorter spillere etter ferdighet (høyeste først)
    const sortedPlayers = [...selectedPlayers].sort((a, b) => b.skill - a.skill);
    
    // 4. Beregn målgruppestørrelser - JEVE FORDELING
    const targetSizes = [];
    for (let i = 0; i < numTeams; i++) {
        targetSizes[i] = basePlayersPerTeam + (i < remainder ? 1 : 0);
    }
    
    console.log('Målgruppestørrelser:', targetSizes);
    
    // 5. Fordel målvakter jevnt først
    if (goalies.length > 0) {
        // Bland målvaktene for jevn fordeling
        const shuffledGoalies = [...goalies];
        for (let i = shuffledGoalies.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffledGoalies[i], shuffledGoalies[j]] = [shuffledGoalies[j], shuffledGoalies[i]];
        }
        
        // Fordel en målvakt til hvert lag om mulig
        for (let i = 0; i < Math.min(shuffledGoalies.length, numTeams); i++) {
            const goalie = shuffledGoalies[i];
            teams[i].players.push(goalie);
            teams[i].totalSkill += goalie.skill;
            teams[i].hasGoalie = true;
            
            // Fjern fra sortedPlayers
            const playerIndex = sortedPlayers.findIndex(p => p.id === goalie.id);
            if (playerIndex > -1) {
                sortedPlayers.splice(playerIndex, 1);
            }
        }
    }
    
    // 6. JEVE FORDELING AV RESTEN - "SNAKE DRAFT"
    // Dette gir både jevne lag og balansert ferdighet
    
    let currentTeam = 0;
    let direction = 1; // 1 = fremover, -1 = bakover
    
    while (sortedPlayers.length > 0) {
        // Ta neste spiller
        const player = sortedPlayers[0];
        
        // Finn et lag med plass
        let teamFound = false;
        
        // Prøv å finne et lag som har plass og som vil forbedre balansen
        for (let attempts = 0; attempts < numTeams * 2; attempts++) {
            // Sjekk om dette laget har plass
            if (teams[currentTeam].players.length < targetSizes[currentTeam]) {
                // Legg til spilleren
                teams[currentTeam].players.push(player);
                teams[currentTeam].totalSkill += player.skill;
                sortedPlayers.shift(); // Fjern fra listen
                teamFound = true;
                break;
            }
            
            // Gå til neste lag
            if (direction === 1) {
                currentTeam++;
                if (currentTeam >= numTeams) {
                    currentTeam = numTeams - 1;
                    direction = -1;
                }
            } else {
                currentTeam--;
                if (currentTeam < 0) {
                    currentTeam = 0;
                    direction = 1;
                }
            }
        }
        
        // Hvis vi ikke fant et lag med plass (skal ikke skje), legg til i det med færrest spillere
        if (!teamFound) {
            let smallestTeamIndex = 0;
            for (let i = 1; i < numTeams; i++) {
                if (teams[i].players.length < teams[smallestTeamIndex].players.length) {
                    smallestTeamIndex = i;
                }
            }
            
            teams[smallestTeamIndex].players.push(player);
            teams[smallestTeamIndex].totalSkill += player.skill;
            sortedPlayers.shift();
        }
        
        // Gå til neste lag for neste spiller (snake pattern)
        if (direction === 1) {
            currentTeam++;
            if (currentTeam >= numTeams) {
                currentTeam = numTeams - 1;
                direction = -1;
            }
        } else {
            currentTeam--;
            if (currentTeam < 0) {
                currentTeam = 0;
                direction = 1;
            }
        }
    }
    
    // 7. SJEKK OG FIKS ULIKE STØRRELSER
    const teamSizes = teams.map(t => t.players.length);
    const maxSize = Math.max(...teamSizes);
    const minSize = Math.min(...teamSizes);
    const sizeDifference = maxSize - minSize;
    
    // Hvis forskjellen er for stor (> 1), juster
    if (sizeDifference > 1) {
        console.log('Justerer lagstørrelser for jevnere fordeling...');
        
        for (let adjustment = 0; adjustment < 3; adjustment++) {
            const largestTeamIndex = teamSizes.indexOf(maxSize);
            const smallestTeamIndex = teamSizes.indexOf(minSize);
            
            if (largestTeamIndex !== -1 && smallestTeamIndex !== -1 && 
                teams[largestTeamIndex].players.length > 1) {
                
                // Finn en spiller å flytte (helst en som ikke er målvakt)
                let playerToMoveIndex = -1;
                
                for (let i = 0; i < teams[largestTeamIndex].players.length; i++) {
                    const player = teams[largestTeamIndex].players[i];
                    if (!player.isGoalie) {
                        playerToMoveIndex = i;
                        break;
                    }
                }
                
                // Hvis alle er målvakter, ta den første
                if (playerToMoveIndex === -1) {
                    playerToMoveIndex = 0;
                }
                
                const playerToMove = teams[largestTeamIndex].players[playerToMoveIndex];
                
                // Flytt spilleren
                teams[largestTeamIndex].players.splice(playerToMoveIndex, 1);
                teams[largestTeamIndex].totalSkill -= playerToMove.skill;
                
                teams[smallestTeamIndex].players.push(playerToMove);
                teams[smallestTeamIndex].totalSkill += playerToMove.skill;
                
                // Oppdater størrelser
                teamSizes[largestTeamIndex]--;
                teamSizes[smallestTeamIndex]++;
                
                console.log(`Flyttet ${playerToMove.name} for jevnere lagstørrelse`);
            }
            
            // Oppdater størrelser
            const newMaxSize = Math.max(...teamSizes);
            const newMinSize = Math.min(...teamSizes);
            
            if (newMaxSize - newMinSize <= 1) break; // God nok jevnhet
        }
    }
    
    // 8. SJEKK AT ALLE LAG HAR MINST 1 SPILLER
    for (let i = 0; i < teams.length; i++) {
        if (teams[i].players.length === 0) {
            // Finn et lag med flest spillere og flytt en
            let largestTeamIndex = 0;
            for (let j = 1; j < teams.length; j++) {
                if (teams[j].players.length > teams[largestTeamIndex].players.length) {
                    largestTeamIndex = j;
                }
            }
            
            if (teams[largestTeamIndex].players.length > 1) {
                const playerToMove = teams[largestTeamIndex].players.pop();
                teams[largestTeamIndex].totalSkill -= playerToMove.skill;
                
                teams[i].players.push(playerToMove);
                teams[i].totalSkill += playerToMove.skill;
            }
        }
    }
    
    // 9. Sorter spillere i hvert lag etter ferdighet
    teams.forEach(team => {
        team.players.sort((a, b) => b.skill - a.skill);
    });
    
    // 10. Vis resultater (UTEN NIVÅ)
    displayMatchResults(teams);
    
    showNotification(`${numTeams} balanserte lag opprettet!`, 'success');
}

function displayMatchResults(teams) {
    const resultsDiv = document.getElementById('matchResults');
    if (!resultsDiv) {
        console.error('Finner ikke matchResults div!');
        return;
    }
    
    console.log('Viser kampresultater for', teams.length, 'lag');
    
    // Beregn balanse-statistikk
    const teamSizes = teams.map(t => t.players.length);
    const maxSize = Math.max(...teamSizes);
    const minSize = Math.min(...teamSizes);
    const sizeDifference = maxSize - minSize;
    
    let html = `
        <div style="margin-bottom: 15px; padding: 10px; background: #f8fafc; border-radius: 4px;">
            <strong>📊 Lagbalanse:</strong><br>
            • Spillerfordeling: ${sizeDifference <= 1 ? 'Godt balansert ⚖️' : 'Noe ubalansert ⚠️'} 
            (forskjell: ${sizeDifference} spiller${sizeDifference !== 1 ? 'e' : ''})
        </div>
        <div class="groups-container">
    `;
    
    teams.forEach((team, index) => {
        const teamGoalies = team.players.filter(p => p.isGoalie).length;
        
        html += `
            <div class="group-card">
                <div class="group-header">
                    <span class="group-name">
                        <i class="fas fa-tshirt"></i> Lag ${String.fromCharCode(65 + index)}
                    </span>
                    <span class="group-stats">
                        ${team.players.length} spillere
                        ${teamGoalies > 0 ? ' • ' + teamGoalies + ' målvakt' + (teamGoalies > 1 ? 'er' : '') : ''}
                    </span>
                </div>
                <ul class="group-players">
        `;
        
        team.players.forEach(player => {
            // Vis kun navn og rolle (ikke nivå)
            html += `
                <li class="group-player">
                    <span>${player.name}</span>
                    <span>
                        ${player.isGoalie ? '<span style="font-size: 1.2em;">🧤</span>' : '<span style="font-size: 1.2em;">⚽</span>'}
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

// === LIGA FUNKSJONER (UFØRENDRET) ===
function loadLigaData() {
    const saved = localStorage.getItem('fotballLiga');
    ligaData = saved ? JSON.parse(saved) : null;
    console.log('Lastet ligadata:', ligaData);
}

function saveLigaData() {
    if (ligaData) {
        localStorage.setItem('fotballLiga', JSON.stringify(ligaData));
    }
}

function renderLigaTeamNames() {
    const container = document.getElementById('ligaTeamNames');
    if (!container) return;
    
    const numTeams = parseInt(document.getElementById('ligaTeams').value) || 3;
    
    let html = '';
    const defaultNames = ['Blått', 'Rødt', 'Gult', 'Grønt', 'Lilla'];
    
    for (let i = 0; i < numTeams; i++) {
        const currentName = ligaData && ligaData.teams && ligaData.teams[i] 
            ? ligaData.teams[i].navn 
            : defaultNames[i] || `Lag ${i + 1}`;
        
        html += `
            <div class="team-name-input">
                <label>Lag ${i + 1}:</label>
                <input type="text" id="ligaTeam${i}" value="${currentName}" placeholder="Lag ${i + 1} navn" maxlength="20">
            </div>
        `;
    }
    
    container.innerHTML = html;
}

function startLiga() {
    const numTeams = parseInt(document.getElementById('ligaTeams').value);
    const rounds = parseInt(document.getElementById('ligaRounds').value);
    
    if (numTeams < 2 || numTeams > 5) {
        showNotification('Velg mellom 2 og 5 lag', 'error');
        return;
    }
    
    if (rounds < 1 || rounds > 5) {
        showNotification('Velg mellom 1 og 5 kamper per lagpar', 'error');
        return;
    }
    
    // Samle lag-navn
    const teams = [];
    for (let i = 0; i < numTeams; i++) {
        const input = document.getElementById(`ligaTeam${i}`);
        const navn = input ? input.value.trim() : `Lag ${i + 1}`;
        teams.push({
            navn: navn || `Lag ${i + 1}`,
            kamper: 0,
            seier: 0,
            uavgjort: 0,
            tap: 0,
            scoret: 0,
            innsluppet: 0,
            poeng: 0,
            målforskjell: 0
        });
    }
    
    // Generer kamper (alle mot alle, hjemme/borte)
    const matches = [];
    let matchId = 1;
    
    for (let round = 0; round < rounds; round++) {
        for (let i = 0; i < numTeams; i++) {
            for (let j = i + 1; j < numTeams; j++) {
                // Hjemmekamp
                matches.push({
                    id: matchId++,
                    hjemme: i,
                    borte: j,
                    ferdig: false,
                    resultat: null,
                    hjemmeScore: null,
                    borteScore: null
                });
                
                // Bortekamp (kun hvis rounds > 1)
                if (rounds > 1) {
                    matches.push({
                        id: matchId++,
                        hjemme: j,
                        borte: i,
                        ferdig: false,
                        resultat: null,
                        hjemmeScore: null,
                        borteScore: null
                    });
                }
            }
        }
    }
    
    // Lag liga data
    ligaData = {
        antallLag: numTeams,
        antallRunder: rounds,
        teams: teams,
        matches: matches,
        opprettet: new Date().toISOString()
    };
    
    saveLigaData();
    renderLigaMatches();
    renderLigaTable();
    
    showNotification(`Ligaspill startet med ${numTeams} lag!`, 'success');
}

function renderLigaMatches() {
    const container = document.getElementById('ligaMatches');
    if (!container) return;
    
    if (!ligaData || !ligaData.matches || ligaData.matches.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-futbol"></i>
                <p>Start et ligaspill for å se kampprogram</p>
            </div>
        `;
        return;
    }
    
    let html = '';
    ligaData.matches.forEach(match => {
        const hjemmeLag = ligaData.teams[match.hjemme];
        const bortelag = ligaData.teams[match.borte];
        
        const statusClass = match.ferdig ? 'completed' : 'pending';
        const statusText = match.ferdig ? 'Ferdig' : 'Ikke spilt';
        
        const hjemmeResultat = match.hjemmeScore !== null ? match.hjemmeScore : '';
        const borteResultat = match.borteScore !== null ? match.borteScore : '';
        
        html += `
            <div class="match-item" data-match="${match.id}">
                <div class="match-info">
                    <span>${hjemmeLag.navn} vs ${bortelag.navn}</span>
                    <span class="match-status ${statusClass}">${statusText}</span>
                </div>
                <div class="match-result">
                    <input type="number" class="result-input" id="hjemme${match.id}" 
                           value="${hjemmeResultat}" placeholder="0" min="0">
                    <span>-</span>
                    <input type="number" class="result-input" id="borte${match.id}" 
                           value="${borteResultat}" placeholder="0" min="0">
                    <button class="btn-small" onclick="registerMatchResult(${match.id})">
                        ${match.ferdig ? '<i class="fas fa-edit"></i>' : '<i class="fas fa-save"></i>'}
                    </button>
                    ${match.ferdig ? `
                    <button class="btn-small btn-danger" onclick="deleteMatchResult(${match.id})" style="margin-left: 5px;">
                        <i class="fas fa-trash"></i>
                    </button>` : ''}
                </div>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

function registerMatchResult(matchId) {
    if (!ligaData) return;
    
    const matchIndex = ligaData.matches.findIndex(m => m.id === matchId);
    if (matchIndex === -1) return;
    
    const hjemmeInput = document.getElementById(`hjemme${matchId}`);
    const borteInput = document.getElementById(`borte${matchId}`);
    
    const hjemmeScore = parseInt(hjemmeInput.value) || 0;
    const borteScore = parseInt(borteInput.value) || 0;
    
    if (hjemmeInput.value === '' || borteInput.value === '') {
        showNotification('Fyll inn begge resultatene', 'error');
        return;
    }
    
    const match = ligaData.matches[matchIndex];
    const hjemmeLag = ligaData.teams[match.hjemme];
    const bortelag = ligaData.teams[match.borte];
    
    // Hvis vi redigerer et eksisterende resultat, fjern først de gamle statene
    if (match.ferdig && match.hjemmeScore !== null && match.borteScore !== null) {
        // Trekk fra gamle resultater
        hjemmeLag.kamper--;
        bortelag.kamper--;
        
        hjemmeLag.scoret -= match.hjemmeScore;
        hjemmeLag.innsluppet -= match.borteScore;
        bortelag.scoret -= match.borteScore;
        bortelag.innsluppet -= match.hjemmeScore;
        
        // Trekk fra gamle poeng
        if (match.hjemmeScore > match.borteScore) {
            // Var hjemmeseier
            hjemmeLag.seier--;
            hjemmeLag.poeng -= 3;
            bortelag.tap--;
        } else if (match.hjemmeScore < match.borteScore) {
            // Var borteseier
            bortelag.seier--;
            bortelag.poeng -= 3;
            hjemmeLag.tap--;
        } else {
            // Var uavgjort
            hjemmeLag.uavgjort--;
            hjemmeLag.poeng -= 1;
            bortelag.uavgjort--;
            bortelag.poeng -= 1;
        }
    }
    
    // Oppdater kampen
    match.hjemmeScore = hjemmeScore;
    match.borteScore = borteScore;
    match.resultat = `${hjemmeScore}-${borteScore}`;
    match.ferdig = true;
    
    // Oppdater lag-statistikken (legg til nye)
    hjemmeLag.kamper++;
    bortelag.kamper++;
    
    hjemmeLag.scoret += hjemmeScore;
    hjemmeLag.innsluppet += borteScore;
    bortelag.scoret += borteScore;
    bortelag.innsluppet += hjemmeScore;
    
    // Beregn målforskjell
    hjemmeLag.målforskjell = hjemmeLag.scoret - hjemmeLag.innsluppet;
    bortelag.målforskjell = bortelag.scoret - bortelag.innsluppet;
    
    // Bestem resultat og poeng
    if (hjemmeScore > borteScore) {
        // Hjemmeseier
        hjemmeLag.seier++;
        hjemmeLag.poeng += 3;
        bortelag.tap++;
    } else if (hjemmeScore < borteScore) {
        // Borteseier
        bortelag.seier++;
        bortelag.poeng += 3;
        hjemmeLag.tap++;
    } else {
        // Uavgjort
        hjemmeLag.uavgjort++;
        hjemmeLag.poeng += 1;
        bortelag.uavgjort++;
        bortelag.poeng += 1;
    }
    
    saveLigaData();
    renderLigaMatches();
    renderLigaTable();
    
    showNotification('Kampresultat registrert!', 'success');
}

function deleteMatchResult(matchId) {
    if (!ligaData) return;
    
    const matchIndex = ligaData.matches.findIndex(m => m.id === matchId);
    if (matchIndex === -1) return;
    
    const match = ligaData.matches[matchIndex];
    
    if (!match.ferdig) {
        showNotification('Denne kampen har ingen resultat å slette', 'info');
        return;
    }
    
    if (confirm('Slett dette kampresultatet?')) {
        const hjemmeLag = ligaData.teams[match.hjemme];
        const bortelag = ligaData.teams[match.borte];
        
        // Trekk fra statistikken
        hjemmeLag.kamper--;
        bortelag.kamper--;
        
        hjemmeLag.scoret -= match.hjemmeScore;
        hjemmeLag.innsluppet -= match.borteScore;
        bortelag.scoret -= match.borteScore;
        bortelag.innsluppet -= match.hjemmeScore;
        
        // Trekk fra poeng
        if (match.hjemmeScore > match.borteScore) {
            // Var hjemmeseier
            hjemmeLag.seier--;
            hjemmeLag.poeng -= 3;
            bortelag.tap--;
        } else if (match.hjemmeScore < match.borteScore) {
            // Var borteseier
            bortelag.seier--;
            bortelag.poeng -= 3;
            hjemmeLag.tap--;
        } else {
            // Var uavgjort
            hjemmeLag.uavgjort--;
            hjemmeLag.poeng -= 1;
            bortelag.uavgjort--;
            bortelag.poeng -= 1;
        }
        
        // Beregn målforskjell på nytt
        hjemmeLag.målforskjell = hjemmeLag.scoret - hjemmeLag.innsluppet;
        bortelag.målforskjell = bortelag.scoret - bortelag.innsluppet;
        
        // Nullstill kampen
        match.ferdig = false;
        match.resultat = null;
        match.hjemmeScore = null;
        match.borteScore = null;
        
        saveLigaData();
        renderLigaMatches();
        renderLigaTable();
        
        showNotification('Resultat slettet', 'info');
    }
}

function renderLigaTable() {
    const container = document.getElementById('ligaTable');
    if (!container) return;
    
    if (!ligaData || !ligaData.teams) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-trophy"></i>
                <p>Ingen aktiv liga</p>
            </div>
        `;
        return;
    }
    
    // Sorter lag etter: Poeng → Målforskjell → Scorede mål → Flest seire
    const sortedTeams = [...ligaData.teams].sort((a, b) => {
        if (b.poeng !== a.poeng) return b.poeng - a.poeng;
        if (b.målforskjell !== a.målforskjell) return b.målforskjell - a.målforskjell;
        if (b.scoret !== a.scoret) return b.scoret - a.scoret;
        return b.seier - a.seier;
    });
    
    let html = `
        <div class="table-container">
            <table class="liga-table">
                <thead>
                    <tr>
                        <th>#</th>
                        <th style="text-align: left;">Lag</th>
                        <th>K</th>
                        <th>S</th>
                        <th>U</th>
                        <th>T</th>
                        <th>MF</th>
                        <th>P</th>
                    </tr>
                </thead>
                <tbody>
    `;
    
    sortedTeams.forEach((team, index) => {
        // Farge for plassering
        let positionColor = '#666';
        if (index === 0) positionColor = '#F59E0B'; // Gull
        else if (index === 1) positionColor = '#9CA3AF'; // Sølv
        else if (index === 2) positionColor = '#B45309'; // Bronse
        
        html += `
            <tr>
                <td class="position-cell" style="color: ${positionColor}; font-weight: 700;">${index + 1}</td>
                <td class="team-cell">${team.navn}</td>
                <td class="stats-cell">${team.kamper}</td>
                <td class="stats-cell win">${team.seier}</td>
                <td class="stats-cell draw">${team.uavgjort}</td>
                <td class="stats-cell loss">${team.tap}</td>
                <td class="stats-cell">${team.målforskjell > 0 ? '+' : ''}${team.målforskjell}</td>
                <td class="stats-cell" style="font-weight: 700; color: ${currentLogo === 'eggeil' ? '#0d47a1' : '#d32f2f'};">${team.poeng}</td>
            </tr>
        `;
    });
    
    html += `
                </tbody>
            </table>
        </div>
    `;
    
    container.innerHTML = html;
}

function resetLiga() {
    const clubName = currentLogo === 'eggeil' ? 'Egge IL' : 'Sørlia IL';
    
    if (confirm(`Nullstille ${clubName} ligaen? Alle resultater slettes.`)) {
        ligaData = null;
        localStorage.removeItem('fotballLiga');
        renderLigaTeamNames();
        renderLigaMatches();
        renderLigaTable();
        showNotification('Liga nullstilt', 'info');
    }
}

// === ALLE EVENT LISTENERS ===
function setupAllEventListeners() {
    console.log('Setter opp alle event listeners...');
    
    // Logout
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logout);
    }
    
    // Legg til spiller
    const addPlayerBtn = document.getElementById('addPlayerBtn');
    if (addPlayerBtn) {
        addPlayerBtn.addEventListener('click', addPlayer);
    }
    
    // Enter i navnefelt
    const playerNameInput = document.getElementById('playerName');
    if (playerNameInput) {
        playerNameInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') addPlayer();
        });
    }
    
    // Slett alle spillere
    const clearAllBtn = document.getElementById('clearAllBtn');
    if (clearAllBtn) {
        clearAllBtn.addEventListener('click', function() {
            if (players.length === 0) {
                showNotification('Ingen spillere å slette', 'error');
                return;
            }
            
            if (confirm(`Slett alle ${players.length} spillere?`)) {
                players = [];
                savePlayers();
                renderPlayers();
                showNotification('Alle spillere slettet', 'info');
            }
        });
    }
    
    // Eksport
    const exportBtn = document.getElementById('exportBtn');
    if (exportBtn) {
        exportBtn.addEventListener('click', function() {
            if (players.length === 0) {
                showNotification('Ingen spillere å eksportere', 'error');
                return;
            }
            
            const dataStr = JSON.stringify(players, null, 2);
            const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
            
            const link = document.createElement('a');
            link.setAttribute('href', dataUri);
            link.setAttribute('download', `fotball-spillere-${new Date().toISOString().split('T')[0]}.json`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            showNotification(`${players.length} spillere eksportert`, 'success');
        });
    }
    
    // Import
    const importBtn = document.getElementById('importBtn');
    const importFile = document.getElementById('importFile');
    
    if (importBtn && importFile) {
        importBtn.addEventListener('click', function() {
            importFile.click();
        });
        
        importFile.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (!file) return;
            
            const reader = new FileReader();
            reader.onload = function(event) {
                try {
                    const importedData = JSON.parse(event.target.result);
                    const importedPlayers = importedData.players || importedData;
                    
                    if (!Array.isArray(importedPlayers)) {
                        throw new Error('Ugyldig filformat');
                    }
                    
                    players.push(...importedPlayers);
                    savePlayers();
                    renderPlayers();
                    
                    showNotification(`${importedPlayers.length} spillere importert`, 'success');
                    
                    e.target.value = '';
                } catch (error) {
                    showNotification('Feil ved import: ' + error.message, 'error');
                }
            };
            reader.readAsText(file);
        });
    }
    
    // Trening - velg alle/fjern alle
    const selectAllTraining = document.getElementById('selectAllTraining');
    const deselectAllTraining = document.getElementById('deselectAllTraining');
    
    if (selectAllTraining) {
        selectAllTraining.addEventListener('click', function() {
            document.querySelectorAll('#trainingPlayerSelection input').forEach(cb => {
                cb.checked = true;
            });
            updateSelectedCounts();
        });
    }
    
    if (deselectAllTraining) {
        deselectAllTraining.addEventListener('click', function() {
            document.querySelectorAll('#trainingPlayerSelection input').forEach(cb => {
                cb.checked = false;
            });
            updateSelectedCounts();
        });
    }
    
    // Trening - lag grupper
    const createTrainingBtn = document.getElementById('createTrainingGroupsBtn');
    if (createTrainingBtn) {
        createTrainingBtn.addEventListener('click', createTrainingGroups);
    }
    
    // Kamp - velg alle/fjern alle
    const selectAllMatch = document.getElementById('selectAllMatch');
    const deselectAllMatch = document.getElementById('deselectAllMatch');
    
    if (selectAllMatch) {
        selectAllMatch.addEventListener('click', function() {
            document.querySelectorAll('#matchPlayerSelection input').forEach(cb => {
                cb.checked = true;
            });
            updateSelectedCounts();
        });
    }
    
    if (deselectAllMatch) {
        deselectAllMatch.addEventListener('click', function() {
            document.querySelectorAll('#matchPlayerSelection input').forEach(cb => {
                cb.checked = false;
            });
            updateSelectedCounts();
        });
    }
    
    // Kamp - lag lag
    const createMatchBtn = document.getElementById('createMatchTeamsBtn');
    if (createMatchBtn) {
        console.log('Setter opp kampoppsett-knapp');
        createMatchBtn.addEventListener('click', createMatchTeams);
    } else {
        console.error('Finner ikke createMatchTeamsBtn!');
    }
    
    // Liga - start liga
    const startLigaBtn = document.getElementById('startLigaBtn');
    if (startLigaBtn) {
        startLigaBtn.addEventListener('click', startLiga);
    }
    
    // Liga - nullstill
    const resetLigaBtn = document.getElementById('resetLigaBtn');
    if (resetLigaBtn) {
        resetLigaBtn.addEventListener('click', resetLiga);
    }
    
    // Number buttons (for alle tabs)
    document.querySelectorAll('.number-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const targetId = this.getAttribute('data-for');
            const input = document.getElementById(targetId);
            if (!input) return;
            
            let value = parseInt(input.value) || 0;
            
            if (this.classList.contains('minus')) {
                value = Math.max(parseInt(input.min) || 2, value - 1);
            } else {
                value = Math.min(parseInt(input.max) || 6, value + 1);
            }
            
            input.value = value;
            
            // Hvis det er liga antall lag, oppdater team names
            if (targetId === 'ligaTeams') {
                renderLigaTeamNames();
            }
        });
    });
    
    // Refresh
    const refreshBtn = document.getElementById('refreshBtn');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', function() {
            loadPlayers();
            loadLigaData();
            renderPlayers();
            renderPlayerSelections();
            renderLigaTeamNames();
            renderLigaMatches();
            renderLigaTable();
            showNotification('App oppdatert', 'info');
        });
    }
    
    console.log('Event listeners satt opp');
}

// === HJELPEFUNKSJONER ===
function showNotification(message, type = 'success') {
    const notification = document.getElementById('notification');
    if (!notification) {
        // Lag en hvis den ikke finnes
        const newNotification = document.createElement('div');
        newNotification.id = 'notification';
        newNotification.className = 'notification';
        document.body.appendChild(newNotification);
    }
    
    const notif = document.getElementById('notification');
    notif.textContent = message;
    
    // Sett farge basert på klubb
    if (currentLogo === 'eggeil') {
        notif.style.background = type === 'success' ? '#0d47a1' : 
                                 type === 'error' ? '#d32f2f' : 
                                 type === 'info' ? '#1976d2' : '#F59E0B';
    } else {
        notif.style.background = type === 'success' ? '#d32f2f' : 
                                 type === 'error' ? '#0d47a1' : 
                                 type === 'info' ? '#f44336' : '#F59E0B';
    }
    
    notif.className = `notification ${type} show`;
    
    setTimeout(() => {
        notif.classList.remove('show');
    }, 3000);
}

// === AUTO-LOGOUT SJEKK ===
setInterval(() => {
    const loginTime = localStorage.getItem('fotballLoginTime');
    if (loginTime) {
        const hoursSinceLogin = (Date.now() - parseInt(loginTime)) / (1000 * 60 * 60);
        if (hoursSinceLogin >= 8) {
            localStorage.removeItem('fotballLoggedIn');
            localStorage.removeItem('fotballLoginTime');
            
            // Hvis hovedappen er synlig, logg ut
            const mainApp = document.getElementById('mainApp');
            if (mainApp && mainApp.style.display !== 'none') {
                showPasswordScreen();
                showNotification('Sesjonen har utløpt. Logg inn på nytt.', 'info');
            }
        }
    }
}, 60000); // Sjekk hvert minutt

// Debug info
console.log('Fotball Trener App lastet - Med ekte logoer og alle fikser!');
console.log('Passord: 1234');
