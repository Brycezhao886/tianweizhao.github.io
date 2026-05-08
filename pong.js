// Canvas and context setup
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const menuScreen = document.getElementById('menuScreen');
const primaryMenu = document.getElementById('primaryMenu');
const gameScreen = document.getElementById('gameScreen');
const submenuPages = document.querySelectorAll('.submenu-page');
const singlePlayerBtn = document.getElementById('singlePlayerBtn');
const twoPlayerBtn = document.getElementById('twoPlayerBtn');
const startGameBtn = document.getElementById('startGameBtn');
const backToMenuBtn = document.getElementById('backToMenuBtn');
const leftLabel = document.getElementById('leftLabel');
const rightLabel = document.getElementById('rightLabel');
const controlText = document.getElementById('controlText');
const restartBtn = document.getElementById('restartBtn');
const playerRoundsEl = document.getElementById('playerRounds');
const computerRoundsEl = document.getElementById('computerRounds');
const roundLabel = document.getElementById('roundLabel');
const matchStatus = document.getElementById('matchStatus');
const pauseOverlay = document.getElementById('pauseOverlay');
const arenaChoices = document.getElementById('arenaChoices');
const playerSkinChoices = document.getElementById('playerSkinChoices');
const playerTwoSkinChoices = document.getElementById('playerTwoSkinChoices');
const playerTwoSkinGroup = document.getElementById('playerTwoSkinGroup');
const unlockStatus = document.getElementById('unlockStatus');
const soundToggle = document.getElementById('soundToggle');
const musicToggle = document.getElementById('musicToggle');
const fighterHud = document.getElementById('fighterHud');
const p1Portrait = document.getElementById('p1Portrait');
const p2Portrait = document.getElementById('p2Portrait');
const p1CharacterLevel = document.getElementById('p1CharacterLevel');
const p2CharacterLevel = document.getElementById('p2CharacterLevel');
const characterWinStatus = document.getElementById('characterWinStatus');
const playerCharacterChoices = document.getElementById('playerCharacterChoices');
const playerTwoCharacterChoices = document.getElementById('playerTwoCharacterChoices');

// Game constants
const PADDLE_WIDTH = 12;
const PADDLE_HEIGHT = 82;
const BALL_SIZE = 8;
const BALL_SPEED = 5;
const PADDLE_SPEED = 6;
const AI_SPEED = 4.5;
const ROUND_TARGET_SCORE = 6;
const ROUND_WIN_MARGIN = 2;
const MATCH_ROUNDS = 3;
const PERFECT_ZONE = 0.3;
const SAVE_KEYS = {
    arena: 'pongArena',
    playerSkin: 'pongPlayerSkin',
    playerTwoSkin: 'pongPlayerTwoSkin',
    playerCharacter: 'pongPlayerCharacter',
    playerTwoCharacter: 'pongPlayerTwoCharacter',
    sound: 'pongHitSound',
    music: 'pongBattleMusic',
    wins: 'pongHumanMatchWins',
    playerOneWins: 'pongPlayerOneWins',
    playerTwoWins: 'pongPlayerTwoWins'
};
const ARENAS = [
    { id: 'rooftop', name: 'Rooftop Night' },
    { id: 'beach', name: 'Sunset Beach' },
    { id: 'dojo', name: 'Lantern Dojo' },
    { id: 'stadium', name: 'Neo Stadium' }
];
const PADDLE_SKINS = [
    { id: 'neon', name: 'Neon Blade', unlockAt: 0, length: 82, left: '#00ffc3', right: '#ff2bd6', accent: '#ffffff', kind: 'beam' },
    { id: 'flame', name: 'Flame Katana', unlockAt: 0, length: 92, left: '#ff7a18', right: '#ff3864', accent: '#ffd166', kind: 'fire' },
    { id: 'plasma', name: 'Plasma Rail', unlockAt: 1, length: 100, left: '#4cc9f0', right: '#f72585', accent: '#ffe66d', kind: 'rail' },
    { id: 'moon', name: 'Moon Fang', unlockAt: 2, length: 88, left: '#d7f9ff', right: '#c77dff', accent: '#ffffff', kind: 'crescent' },
    { id: 'ion', name: 'Ion Saber', unlockAt: 3, length: 108, left: '#b8f7ff', right: '#c77dff', accent: '#80ffdb', kind: 'beam' },
    { id: 'void', name: 'Void Core', unlockAt: 5, length: 118, left: '#ffd166', right: '#ef476f', accent: '#0b1020', kind: 'void' }
];
const CHARACTERS = [
    { id: 'moss', name: 'Moss Byte Ronin', hair: '#45f56d', suit: '#0b1220', accent: '#00ffc3', weapon: '#75f2ff' },
    { id: 'nova', name: 'Nova Cat Captain', hair: '#ff70d8', suit: '#20112f', accent: '#ff2bd6', weapon: '#ffd166' },
    { id: 'bolt', name: 'Bolt Panda Hacker', hair: '#f8fafc', suit: '#102a43', accent: '#4cc9f0', weapon: '#80ffdb' },
    { id: 'ember', name: 'Ember Fox Idol', hair: '#ff9f1c', suit: '#2b1010', accent: '#ff3864', weapon: '#ffd166' },
    { id: 'luna', name: 'Luna Mecha Mage', hair: '#c77dff', suit: '#101827', accent: '#b8f7ff', weapon: '#ffffff' }
];

// Game objects
const player = {
    x: 12,
    y: canvas.height / 2 - PADDLE_HEIGHT / 2,
    width: PADDLE_WIDTH,
    height: PADDLE_HEIGHT,
    dy: 0,
    score: 0,
    swing: 0
};

const opponent = {
    x: canvas.width - PADDLE_WIDTH - 12,
    y: canvas.height / 2 - PADDLE_HEIGHT / 2,
    width: PADDLE_WIDTH,
    height: PADDLE_HEIGHT,
    dy: 0,
    score: 0,
    swing: 0
};

const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    dx: BALL_SPEED,
    dy: BALL_SPEED,
    size: BALL_SIZE
};

const keys = {};
const feedbacks = [];
const fireworks = [];
let appState = 'menu';
let gameMode = 'single';
let mouseTargetY = canvas.height / 2 - PADDLE_HEIGHT / 2;
let playerInput = 'mouse';
let currentRound = 1;
let playerRoundWins = 0;
let opponentRoundWins = 0;
let roundPauseUntil = 0;
let matchOver = false;
let isPaused = false;
let humanMatchWins = readSavedNumber(SAVE_KEYS.wins);
let playerOneWins = readSavedNumber(SAVE_KEYS.playerOneWins);
let playerTwoWins = readSavedNumber(SAVE_KEYS.playerTwoWins);
let selectedArena = readSavedChoice(SAVE_KEYS.arena, ARENAS, 'rooftop');
let selectedPlayerSkin = readSavedChoice(SAVE_KEYS.playerSkin, PADDLE_SKINS, 'neon');
let selectedPlayerTwoSkin = readSavedChoice(SAVE_KEYS.playerTwoSkin, PADDLE_SKINS, 'neon');
let selectedPlayerCharacter = readSavedChoice(SAVE_KEYS.playerCharacter, CHARACTERS, 'moss');
let selectedPlayerTwoCharacter = readSavedChoice(SAVE_KEYS.playerTwoCharacter, CHARACTERS, 'nova');
let soundEnabled = localStorage.getItem(SAVE_KEYS.sound) !== 'off';
let musicEnabled = localStorage.getItem(SAVE_KEYS.music) !== 'off';
let audioContext;
let musicTimer;
let musicStep = 0;
let musicFilter;
let musicGain;
let frameCount = 0;

soundToggle.checked = soundEnabled;
musicToggle.checked = musicEnabled;

window.addEventListener('keydown', (e) => {
    keys[e.key] = true;

    if (['ArrowUp', 'ArrowDown', ' ', 'w', 's', 'W', 'S'].includes(e.key)) {
        e.preventDefault();
    }

    if (e.key === ' ' && appState === 'game' && !matchOver) {
        togglePause();
        return;
    }

    if (['w', 's', 'W', 'S'].includes(e.key)) {
        playerInput = 'keyboard';
    }
});

window.addEventListener('keyup', (e) => {
    keys[e.key] = false;
});

canvas.addEventListener('mousemove', (e) => {
    if (gameMode !== 'single' || appState !== 'game' || isPaused) {
        return;
    }

    const rect = canvas.getBoundingClientRect();
    const scaledY = (e.clientY - rect.top) * (canvas.height / rect.height);
    mouseTargetY = clamp(scaledY - PADDLE_HEIGHT / 2, 0, canvas.height - PADDLE_HEIGHT);
    playerInput = 'mouse';
});

singlePlayerBtn.addEventListener('click', () => setGameMode('single'));
twoPlayerBtn.addEventListener('click', () => setGameMode('two'));
startGameBtn.addEventListener('click', startGame);
document.querySelectorAll('[data-menu-target]').forEach((button) => {
    button.addEventListener('click', () => showSubmenu(button.dataset.menuTarget));
});
document.querySelectorAll('.submenu-back').forEach((button) => {
    button.addEventListener('click', showMenuHome);
});
backToMenuBtn.addEventListener('click', showMenu);
restartBtn.addEventListener('click', () => resetMatch());
soundToggle.addEventListener('change', () => {
    soundEnabled = soundToggle.checked;
    localStorage.setItem(SAVE_KEYS.sound, soundEnabled ? 'on' : 'off');
    if (soundEnabled) {
        unlockAudio();
    }
});
musicToggle.addEventListener('change', () => {
    musicEnabled = musicToggle.checked;
    localStorage.setItem(SAVE_KEYS.music, musicEnabled ? 'on' : 'off');
    if (musicEnabled && appState === 'game' && !isPaused) {
        startMusic();
    } else {
        stopMusic();
    }
});

function startGame() {
    unlockAudio();
    applyWeaponLengths();
    appState = 'game';
    menuScreen.classList.remove('active');
    showMenuHome();
    gameScreen.classList.add('active');
    isPaused = false;
    pauseOverlay.classList.remove('active');
    fighterHud.classList.toggle('active', gameMode === 'two');
    if (musicEnabled) {
        startMusic();
    }
    resetMatch();
}

function showMenu() {
    appState = 'menu';
    isPaused = true;
    stopMusic();
    gameScreen.classList.remove('active');
    menuScreen.classList.add('active');
    showMenuHome();
    pauseOverlay.classList.remove('active');
}

function showMenuHome() {
    primaryMenu.classList.add('active');
    submenuPages.forEach((page) => page.classList.remove('active'));
}

function showSubmenu(pageId) {
    primaryMenu.classList.remove('active');
    submenuPages.forEach((page) => page.classList.toggle('active', page.id === pageId));
    if (pageId === 'characterPage') {
        updateCharacterCards();
    }
}

function togglePause() {
    isPaused = !isPaused;
    pauseOverlay.classList.toggle('active', isPaused);
    matchStatus.textContent = isPaused ? 'Paused' : 'First to 6, win by 2';
    if (isPaused) {
        stopMusic();
    } else if (musicEnabled) {
        startMusic();
    }
}

function update() {
    if (appState !== 'game' || isPaused) {
        return;
    }

    updateEffects();

    if (matchOver || performance.now() < roundPauseUntil) {
        return;
    }

    if (gameMode === 'single' && (keys.ArrowUp || keys.ArrowDown)) {
        playerInput = 'keyboard';
    }

    if (playerInput === 'mouse') {
        player.y = mouseTargetY;
        player.dy = 0;
    } else {
        movePaddleWithKeys(player, keys.w || keys.W || (gameMode === 'single' && keys.ArrowUp), keys.s || keys.S || (gameMode === 'single' && keys.ArrowDown));
    }

    player.y = clamp(player.y, 0, canvas.height - player.height);

    if (gameMode === 'two') {
        movePaddleWithKeys(opponent, keys.ArrowUp, keys.ArrowDown);
    } else {
        moveComputerPaddle();
    }

    opponent.y = clamp(opponent.y, 0, canvas.height - opponent.height);
    moveBall();
}

function moveBall() {
    ball.x += ball.dx;
    ball.y += ball.dy;

    if (ball.y - ball.size < 0 || ball.y + ball.size > canvas.height) {
        ball.dy = -ball.dy;
        ball.y = clamp(ball.y, ball.size, canvas.height - ball.size);
    }

    if (ball.x - ball.size < player.x + player.width &&
        ball.y > player.y &&
        ball.y < player.y + player.height) {
        ball.dx = Math.abs(ball.dx);
        ball.x = player.x + player.width + ball.size;
        const hitPos = (ball.y - (player.y + player.height / 2)) / (player.height / 2);
        ball.dy += hitPos * 3;
        player.swing = 12;
        showHitFeedback(hitPos, player.x + player.width + 44, ball.y, 'left');
    }

    if (ball.x + ball.size > opponent.x &&
        ball.y > opponent.y &&
        ball.y < opponent.y + opponent.height) {
        ball.dx = -Math.abs(ball.dx);
        ball.x = opponent.x - ball.size;
        const hitPos = (ball.y - (opponent.y + opponent.height / 2)) / (opponent.height / 2);
        ball.dy += hitPos * 3;
        opponent.swing = 12;
        showHitFeedback(hitPos, opponent.x - 44, ball.y, 'right');
    }

    if (ball.x < 0) {
        addFeedback('Bad', 72, ball.y, '#ff4d6d', 42);
        playHitSound('bad');
        opponent.score++;
        handlePointScored();
    } else if (ball.x > canvas.width) {
        addFeedback('Bad', canvas.width - 72, ball.y, '#ff4d6d', 42);
        playHitSound('bad');
        player.score++;
        handlePointScored();
    }

    const maxSpeed = BALL_SPEED * 1.6;
    if (Math.abs(ball.dy) > maxSpeed) {
        ball.dy = Math.sign(ball.dy) * maxSpeed;
    }
}

function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.dx = BALL_SPEED * (Math.random() > 0.5 ? 1 : -1);
    ball.dy = BALL_SPEED * (Math.random() > 0.5 ? 1 : -1) * 0.5;
}

function showHitFeedback(hitPos, x, y, side) {
    if (Math.abs(hitPos) <= PERFECT_ZONE) {
        addFeedback('Perfect', x, y, '#ffd166', 48);
        addFirework(x, y);
        playHitSound('perfect');
        speakCuteCue();
    } else {
        const skin = getSkinForSide(side);
        const color = side === 'left' ? skin.left : skin.right;
        addFeedback('Nice', x, y, color || '#70e000', 38);
        playHitSound('nice');
    }
}

function handlePointScored() {
    if (hasWonRound(player.score, opponent.score)) {
        finishRound('player');
    } else if (hasWonRound(opponent.score, player.score)) {
        finishRound('opponent');
    } else {
        resetBall();
    }
}

function hasWonRound(leaderScore, otherScore) {
    return leaderScore >= ROUND_TARGET_SCORE && leaderScore - otherScore >= ROUND_WIN_MARGIN;
}

function finishRound(winner) {
    if (winner === 'player') {
        playerRoundWins++;
    } else {
        opponentRoundWins++;
    }

    const winnerName = winner === 'player' ? leftLabel.textContent : rightLabel.textContent;
    addFeedback(`${winnerName} wins Round ${currentRound}`, canvas.width / 2, canvas.height / 2, '#ffd166', 34, 130);
    addFirework(canvas.width / 2, canvas.height / 2);

    if (currentRound >= MATCH_ROUNDS) {
        finishMatch();
        return;
    }

    currentRound++;
    startNextRound(`${winnerName} wins the round`);
}

function startNextRound(statusText) {
    player.score = 0;
    opponent.score = 0;
    player.y = canvas.height / 2 - PADDLE_HEIGHT / 2;
    opponent.y = canvas.height / 2 - PADDLE_HEIGHT / 2;
    player.swing = 0;
    opponent.swing = 0;
    mouseTargetY = player.y;
    resetBall();
    roundPauseUntil = performance.now() + 1600;
    matchStatus.textContent = statusText;
}

function finishMatch() {
    matchOver = true;
    resetBall();

    const playerName = leftLabel.textContent;
    const opponentName = rightLabel.textContent;
    const winnerName = playerRoundWins > opponentRoundWins ? playerName : opponentName;
    matchStatus.textContent = `${winnerName} wins match`;
    addFeedback(`${winnerName} wins!`, canvas.width / 2, canvas.height / 2 - 32, '#00ffc3', 54, 180);
    addFirework(canvas.width / 2, canvas.height / 2);
    playVictorySound();
    speakCue('Victory');

    if (winnerName !== 'Computer') {
        humanMatchWins++;
        if (winnerName === leftLabel.textContent) {
            playerOneWins++;
            localStorage.setItem(SAVE_KEYS.playerOneWins, String(playerOneWins));
        } else {
            playerTwoWins++;
            localStorage.setItem(SAVE_KEYS.playerTwoWins, String(playerTwoWins));
        }
        localStorage.setItem(SAVE_KEYS.wins, String(humanMatchWins));
        renderCustomization();
        updateCharacterCards();
    }
}

function setGameMode(mode) {
    gameMode = mode;
    const isSinglePlayer = gameMode === 'single';

    singlePlayerBtn.classList.toggle('active', isSinglePlayer);
    twoPlayerBtn.classList.toggle('active', !isSinglePlayer);
    singlePlayerBtn.setAttribute('aria-pressed', String(isSinglePlayer));
    twoPlayerBtn.setAttribute('aria-pressed', String(!isSinglePlayer));
    playerTwoSkinGroup.style.display = isSinglePlayer ? 'none' : 'block';
    fighterHud.classList.toggle('active', !isSinglePlayer && appState === 'game');
    rightLabel.textContent = isSinglePlayer ? 'Computer' : 'Player 2';
    leftLabel.textContent = 'Player 1';
    controlText.innerHTML = isSinglePlayer
        ? '<strong>Controls:</strong> Move mouse up/down, or use W/S or Arrow Keys for Player 1'
        : '<strong>Controls:</strong> Player 1 uses W/S, Player 2 uses Arrow Keys';
    renderCustomization();
    applyWeaponLengths();
}

function resetMatch() {
    applyWeaponLengths();
    player.score = 0;
    opponent.score = 0;
    playerRoundWins = 0;
    opponentRoundWins = 0;
    currentRound = 1;
    matchOver = false;
    roundPauseUntil = 0;
    isPaused = false;
    pauseOverlay.classList.remove('active');
    feedbacks.length = 0;
    fireworks.length = 0;
    player.y = canvas.height / 2 - PADDLE_HEIGHT / 2;
    opponent.y = canvas.height / 2 - PADDLE_HEIGHT / 2;
    mouseTargetY = player.y;
    playerInput = gameMode === 'single' ? 'mouse' : 'keyboard';
    resetBall();
    matchStatus.textContent = 'First to 6, win by 2';
    updateScore();
}

function applyWeaponLengths() {
    const playerLength = getWeaponLength('left');
    const opponentLength = getWeaponLength('right');
    player.height = playerLength;
    opponent.height = gameMode === 'single' ? PADDLE_HEIGHT : opponentLength;
    player.y = clamp(player.y, 0, canvas.height - player.height);
    opponent.y = clamp(opponent.y, 0, canvas.height - opponent.height);
}

function movePaddleWithKeys(paddle, upPressed, downPressed) {
    if (upPressed) {
        paddle.dy = -PADDLE_SPEED;
    } else if (downPressed) {
        paddle.dy = PADDLE_SPEED;
    } else {
        paddle.dy = 0;
    }

    paddle.y += paddle.dy;
}

function moveComputerPaddle() {
    const computerCenter = opponent.y + opponent.height / 2;
    const ballCenter = ball.y;

    if (ballCenter < computerCenter - 30) {
        opponent.y -= AI_SPEED;
    } else if (ballCenter > computerCenter + 30) {
        opponent.y += AI_SPEED;
    }
}

function unlockAudio() {
    if (!soundEnabled && !musicEnabled) {
        return;
    }

    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!audioContext && AudioContextClass) {
        audioContext = new AudioContextClass();
    }

    if (audioContext && audioContext.state === 'suspended') {
        audioContext.resume();
    }
}

function playHitSound(type) {
    if (!soundEnabled) {
        return;
    }

    unlockAudio();
    if (!audioContext) {
        return;
    }

    const now = audioContext.currentTime;
    const settings = {
        perfect: { pitch: 920, slap: 0.13, noise: 0.08, volume: 0.12 },
        nice: { pitch: 520, slap: 0.09, noise: 0.06, volume: 0.1 },
        bad: { pitch: 120, slap: 0.18, noise: 0.1, volume: 0.09 }
    }[type];

    const oscillator = audioContext.createOscillator();
    const hitGain = audioContext.createGain();
    oscillator.type = type === 'bad' ? 'sawtooth' : 'square';
    oscillator.frequency.setValueAtTime(settings.pitch, now);
    oscillator.frequency.exponentialRampToValueAtTime(Math.max(50, settings.pitch * 0.42), now + settings.slap);
    hitGain.gain.setValueAtTime(settings.volume, now);
    hitGain.gain.exponentialRampToValueAtTime(0.001, now + settings.slap);
    oscillator.connect(hitGain);
    hitGain.connect(audioContext.destination);
    oscillator.start(now);
    oscillator.stop(now + settings.slap);

    const noiseBuffer = audioContext.createBuffer(1, audioContext.sampleRate * settings.noise, audioContext.sampleRate);
    const noiseData = noiseBuffer.getChannelData(0);
    for (let i = 0; i < noiseData.length; i++) {
        noiseData[i] = (Math.random() * 2 - 1) * (1 - i / noiseData.length);
    }
    const noise = audioContext.createBufferSource();
    const noiseFilter = audioContext.createBiquadFilter();
    const noiseGain = audioContext.createGain();
    noise.buffer = noiseBuffer;
    noiseFilter.type = 'highpass';
    noiseFilter.frequency.value = type === 'bad' ? 500 : 1300;
    noiseGain.gain.setValueAtTime(type === 'perfect' ? 0.09 : 0.06, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + settings.noise);
    noise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(audioContext.destination);
    noise.start(now);
}

function startMusic() {
    unlockAudio();
    if (!audioContext || musicTimer) {
        return;
    }

    musicFilter = audioContext.createBiquadFilter();
    musicFilter.type = 'lowpass';
    musicFilter.frequency.value = 950;
    musicGain = audioContext.createGain();
    musicGain.gain.value = 0.08;
    musicFilter.connect(musicGain);
    musicGain.connect(audioContext.destination);
    musicStep = 0;
    scheduleMusicStep();
    musicTimer = window.setInterval(scheduleMusicStep, 132);
}

function stopMusic() {
    if (musicTimer) {
        window.clearInterval(musicTimer);
        musicTimer = undefined;
    }

    if (musicGain && audioContext) {
        musicGain.gain.setTargetAtTime(0, audioContext.currentTime, 0.08);
    }
}

function scheduleMusicStep() {
    if (!audioContext || !musicFilter || !musicGain) {
        return;
    }

    const now = audioContext.currentTime;
    const bassPattern = [55, 55, 82, 55, 110, 82, 55, 147];
    const leadPattern = [220, 0, 330, 0, 440, 392, 330, 0, 494, 0, 440, 330, 392, 0, 330, 0];
    const bassFreq = bassPattern[musicStep % bassPattern.length];
    const leadFreq = leadPattern[musicStep % leadPattern.length];

    playMusicTone(bassFreq, 0.11, 0.08, 'sawtooth', now);
    if (leadFreq) {
        playMusicTone(leadFreq, 0.07, 0.035, 'square', now + 0.01);
    }

    if (musicStep % 4 === 0) {
        playKick(now);
    }

    musicFilter.frequency.setTargetAtTime(720 + (musicStep % 8) * 80, now, 0.04);
    musicStep++;
}

function playMusicTone(frequency, duration, volume, wave, time) {
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();
    oscillator.type = wave;
    oscillator.frequency.setValueAtTime(frequency, time);
    gain.gain.setValueAtTime(volume, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + duration);
    oscillator.connect(gain);
    gain.connect(musicFilter);
    oscillator.start(time);
    oscillator.stop(time + duration);
}

function playKick(time) {
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(130, time);
    oscillator.frequency.exponentialRampToValueAtTime(48, time + 0.11);
    gain.gain.setValueAtTime(0.12, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.12);
    oscillator.connect(gain);
    gain.connect(audioContext.destination);
    oscillator.start(time);
    oscillator.stop(time + 0.12);
}

function speakCue(text) {
    if (!soundEnabled || !window.speechSynthesis) {
        return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = text === 'Victory' ? 0.92 : 1.18;
    utterance.pitch = text === 'Victory' ? 0.9 : 1.55;
    utterance.volume = 0.82;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
}

function speakCuteCue() {
    const cues = ['Woo wow', 'Oh yeah', 'Yatta', 'Kira hit'];
    speakCue(cues[Math.floor(Math.random() * cues.length)]);
}

function playVictorySound() {
    if (!soundEnabled) {
        return;
    }

    unlockAudio();
    if (!audioContext) {
        return;
    }

    const now = audioContext.currentTime;
    [392, 523, 659, 784, 1046].forEach((frequency, index) => {
        const time = now + index * 0.08;
        const oscillator = audioContext.createOscillator();
        const gain = audioContext.createGain();
        oscillator.type = index % 2 ? 'triangle' : 'square';
        oscillator.frequency.setValueAtTime(frequency, time);
        gain.gain.setValueAtTime(0.11, time);
        gain.gain.exponentialRampToValueAtTime(0.001, time + 0.28);
        oscillator.connect(gain);
        gain.connect(audioContext.destination);
        oscillator.start(time);
        oscillator.stop(time + 0.3);
    });
}

function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
}

function readSavedNumber(key) {
    const saved = Number(localStorage.getItem(key));
    return Number.isFinite(saved) ? saved : 0;
}

function readSavedChoice(key, options, fallback) {
    const saved = localStorage.getItem(key);
    return options.some((option) => option.id === saved) ? saved : fallback;
}

function renderCustomization() {
    selectedPlayerSkin = getUnlockedSkinId(selectedPlayerSkin, 'neon');
    selectedPlayerTwoSkin = getUnlockedSkinId(selectedPlayerTwoSkin, 'neon');
    applyWeaponLengths();

    arenaChoices.innerHTML = ARENAS.map((arena) => (
        `<button type="button" class="choice-button ${arena.id === selectedArena ? 'active' : ''}" data-arena="${arena.id}">${arena.name}</button>`
    )).join('');

    playerSkinChoices.innerHTML = renderSkinButtons(selectedPlayerSkin, 'player');
    playerTwoSkinChoices.innerHTML = renderSkinButtons(selectedPlayerTwoSkin, 'playerTwo');
    playerCharacterChoices.innerHTML = renderCharacterButtons(selectedPlayerCharacter, 'player');
    playerTwoCharacterChoices.innerHTML = renderCharacterButtons(selectedPlayerTwoCharacter, 'playerTwo');
    unlockStatus.textContent = `Unlocked by match wins: ${humanMatchWins}`;
    updateCharacterCards();

    arenaChoices.querySelectorAll('[data-arena]').forEach((button) => {
        button.addEventListener('click', () => {
            selectedArena = button.dataset.arena;
            localStorage.setItem(SAVE_KEYS.arena, selectedArena);
            renderCustomization();
        });
    });

    playerSkinChoices.querySelectorAll('[data-skin]:not(:disabled)').forEach((button) => {
        button.addEventListener('click', () => {
            selectedPlayerSkin = button.dataset.skin;
            localStorage.setItem(SAVE_KEYS.playerSkin, selectedPlayerSkin);
            renderCustomization();
        });
    });

    playerTwoSkinChoices.querySelectorAll('[data-skin]:not(:disabled)').forEach((button) => {
        button.addEventListener('click', () => {
            selectedPlayerTwoSkin = button.dataset.skin;
            localStorage.setItem(SAVE_KEYS.playerTwoSkin, selectedPlayerTwoSkin);
            renderCustomization();
        });
    });

    playerCharacterChoices.querySelectorAll('[data-character]').forEach((button) => {
        button.addEventListener('click', () => {
            selectedPlayerCharacter = button.dataset.character;
            localStorage.setItem(SAVE_KEYS.playerCharacter, selectedPlayerCharacter);
            renderCustomization();
        });
    });

    playerTwoCharacterChoices.querySelectorAll('[data-character]').forEach((button) => {
        button.addEventListener('click', () => {
            selectedPlayerTwoCharacter = button.dataset.character;
            localStorage.setItem(SAVE_KEYS.playerTwoCharacter, selectedPlayerTwoCharacter);
            renderCustomization();
        });
    });
}

function renderSkinButtons(selectedId, owner) {
    return PADDLE_SKINS.map((skin) => {
        const locked = humanMatchWins < skin.unlockAt;
        const active = skin.id === selectedId;
        const label = locked ? `${skin.name} (${skin.unlockAt} wins)` : skin.name;
        return `<button type="button" class="choice-button ${active ? 'active' : ''} ${locked ? 'locked' : ''}" data-owner="${owner}" data-skin="${skin.id}" ${locked ? 'disabled' : ''}>${label}</button>`;
    }).join('');
}

function renderCharacterButtons(selectedId, owner) {
    return CHARACTERS.map((character) => (
        `<button type="button" class="choice-button ${character.id === selectedId ? 'active' : ''}" data-owner="${owner}" data-character="${character.id}">${character.name}</button>`
    )).join('');
}

function getUnlockedSkinId(skinId, fallback) {
    const skin = PADDLE_SKINS.find((item) => item.id === skinId);
    if (!skin || humanMatchWins < skin.unlockAt) {
        return fallback;
    }

    return skinId;
}

function getSkinForSide(side) {
    const skinId = side === 'left' ? selectedPlayerSkin : selectedPlayerTwoSkin;
    return PADDLE_SKINS.find((skin) => skin.id === skinId) || PADDLE_SKINS[0];
}

function getCharacterForSide(side) {
    const characterId = side === 'left' ? selectedPlayerCharacter : selectedPlayerTwoCharacter;
    return CHARACTERS.find((character) => character.id === characterId) || CHARACTERS[0];
}

function getWeaponLength(side) {
    return getSkinForSide(side).length || PADDLE_HEIGHT;
}

function updateCharacterCards() {
    const p1Level = getCharacterLevel(playerOneWins);
    const p2Level = getCharacterLevel(playerTwoWins);
    characterWinStatus.textContent = `P1 wins: ${playerOneWins} | P2 wins: ${playerTwoWins}`;
    p1CharacterLevel.textContent = `Level ${p1Level} - ${getLevelTitle(p1Level)}`;
    p2CharacterLevel.textContent = `Level ${p2Level} - ${getLevelTitle(p2Level)}`;
    setLevelClass(p1Portrait, p1Level);
    setLevelClass(p2Portrait, p2Level);
    applyPortraitTheme(p1Portrait, getCharacterForSide('left'));
    applyPortraitTheme(p2Portrait, getCharacterForSide('right'));
}

function applyPortraitTheme(element, character) {
    element.style.setProperty('--hair', character.hair);
    element.style.setProperty('--suit', character.suit);
    element.style.setProperty('--accent', character.accent);
    element.style.setProperty('--weapon', character.weapon);
}

function getCharacterLevel(wins) {
    if (wins >= 5) {
        return 4;
    }

    if (wins >= 3) {
        return 3;
    }

    if (wins >= 1) {
        return 2;
    }

    return 1;
}

function getLevelTitle(level) {
    return ['Rookie', 'Spark Edge', 'Overdrive', 'Arena Legend'][level - 1];
}

function setLevelClass(element, level) {
    element.classList.remove('level-1', 'level-2', 'level-3', 'level-4');
    element.classList.add(`level-${level}`);
}

function addFeedback(text, x, y, color, size, life = 70) {
    feedbacks.push({ text, x, y, color, size, life, maxLife: life });
}

function addFirework(x, y) {
    const colors = ['#ffd166', '#00ffc3', '#ff2bd6', '#75f2ff', '#ffffff'];

    for (let i = 0; i < 38; i++) {
        const angle = (Math.PI * 2 * i) / 38;
        const speed = 1.5 + Math.random() * 4.1;
        fireworks.push({
            x,
            y,
            dx: Math.cos(angle) * speed,
            dy: Math.sin(angle) * speed,
            color: colors[Math.floor(Math.random() * colors.length)],
            life: 44 + Math.random() * 22,
            maxLife: 66,
            size: 2 + Math.random() * 2
        });
    }
}

function updateEffects() {
    for (let i = feedbacks.length - 1; i >= 0; i--) {
        feedbacks[i].life--;
        feedbacks[i].y -= 0.45;
        if (feedbacks[i].life <= 0) {
            feedbacks.splice(i, 1);
        }
    }

    for (let i = fireworks.length - 1; i >= 0; i--) {
        const particle = fireworks[i];
        particle.life--;
        particle.x += particle.dx;
        particle.y += particle.dy;
        particle.dy += 0.04;
        particle.dx *= 0.985;

        if (particle.life <= 0) {
            fireworks.splice(i, 1);
        }
    }

    player.swing = Math.max(0, player.swing - 1);
    opponent.swing = Math.max(0, opponent.swing - 1);
}

function draw() {
    frameCount++;
    drawArena();

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.42)';
    ctx.setLineDash([10, 10]);
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.stroke();
    ctx.setLineDash([]);

    drawPaddle(player, 'left');
    drawPaddle(opponent, 'right');
    drawBall();
    drawEffects();
}

function drawArena() {
    if (selectedArena === 'beach') {
        drawBeachArena();
    } else if (selectedArena === 'dojo') {
        drawDojoArena();
    } else if (selectedArena === 'stadium') {
        drawStadiumArena();
    } else {
        drawRooftopArena();
    }

    ctx.fillStyle = 'rgba(0, 0, 0, 0.12)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawRooftopArena() {
    const sky = ctx.createLinearGradient(0, 0, 0, canvas.height);
    sky.addColorStop(0, '#7bdff2');
    sky.addColorStop(0.56, '#f7a072');
    sky.addColorStop(1, '#2f4858');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    drawBuildings(28, 210, '#264653');
    drawBuildings(0, 245, '#1d3557');
    const court = ctx.createLinearGradient(0, 260, 0, canvas.height);
    court.addColorStop(0, '#506b59');
    court.addColorStop(1, '#273c36');
    ctx.fillStyle = court;
    ctx.fillRect(0, 260, canvas.width, 140);
    drawCrowd(238, ['#00ffc3', '#ffd166', '#ff2bd6', '#75f2ff']);
    drawCourtLines('rgba(255,255,255,0.25)');
}

function drawBeachArena() {
    const sky = ctx.createLinearGradient(0, 0, 0, canvas.height);
    sky.addColorStop(0, '#77c8e8');
    sky.addColorStop(0.48, '#ffe1a8');
    sky.addColorStop(1, '#e9c46a');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#2a9d8f';
    ctx.fillRect(0, 205, canvas.width, 95);
    ctx.fillStyle = 'rgba(255,255,255,0.35)';
    for (let i = 0; i < 7; i++) {
        ctx.beginPath();
        ctx.ellipse(75 + i * 130, 230 + (i % 2) * 22, 52, 8, 0, 0, Math.PI * 2);
        ctx.fill();
    }
    ctx.fillStyle = '#f4d35e';
    ctx.fillRect(0, 300, canvas.width, 100);
    drawCrowd(286, ['#ff9f1c', '#2a9d8f', '#ffffff', '#ff70d8']);
    drawCourtLines('rgba(92,64,51,0.3)');
}

function drawDojoArena() {
    const wall = ctx.createLinearGradient(0, 0, 0, canvas.height);
    wall.addColorStop(0, '#b08968');
    wall.addColorStop(0.62, '#ddb892');
    wall.addColorStop(1, '#7f5539');
    ctx.fillStyle = wall;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'rgba(255,255,255,0.2)';
    ctx.fillRect(0, 58, canvas.width, 48);
    ctx.fillStyle = '#6f1d1b';
    ctx.fillRect(0, 108, canvas.width, 10);
    ctx.fillStyle = '#9c6644';
    for (let x = 0; x < canvas.width; x += 80) {
        ctx.fillRect(x, 260, 42, 140);
    }
    drawCrowd(238, ['#6f1d1b', '#ffd166', '#3a86ff', '#f1c6a8']);
    drawCourtLines('rgba(70,40,25,0.32)');
}

function drawStadiumArena() {
    const grass = ctx.createLinearGradient(0, 0, 0, canvas.height);
    grass.addColorStop(0, '#8ecae6');
    grass.addColorStop(0.45, '#457b9d');
    grass.addColorStop(0.46, '#588157');
    grass.addColorStop(1, '#344e41');
    ctx.fillStyle = grass;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'rgba(255,255,255,0.7)';
    for (let x = 40; x < canvas.width; x += 80) {
        ctx.beginPath();
        ctx.arc(x, 70, 12, 0, Math.PI * 2);
        ctx.fill();
    }
    ctx.fillStyle = 'rgba(0,0,0,0.25)';
    ctx.fillRect(0, 105, canvas.width, 34);
    drawCrowd(152, ['#00ffc3', '#ff2bd6', '#ffd166', '#75f2ff']);
    drawCourtLines('rgba(255,255,255,0.24)');
}

function drawCrowd(baseY, colors) {
    for (let i = 0; i < 26; i++) {
        const x = 20 + i * 31;
        const bounce = Math.sin(frameCount * 0.12 + i * 0.7) * 4;
        ctx.fillStyle = colors[i % colors.length];
        ctx.beginPath();
        ctx.arc(x, baseY + bounce, 7, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = 'rgba(8, 17, 31, 0.74)';
        ctx.fillRect(x - 8, baseY + 8 + bounce, 16, 16);
        ctx.strokeStyle = colors[(i + 1) % colors.length];
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x - 12, baseY + 12 + bounce);
        ctx.lineTo(x - 19, baseY + 4 + Math.sin(frameCount * 0.18 + i) * 5);
        ctx.moveTo(x + 12, baseY + 12 + bounce);
        ctx.lineTo(x + 19, baseY + 4 + Math.cos(frameCount * 0.18 + i) * 5);
        ctx.stroke();
    }
}

function drawBuildings(offset, baseY, color) {
    ctx.fillStyle = color;
    for (let x = -offset; x < canvas.width; x += 64) {
        const height = 70 + ((x + offset) % 5) * 18;
        ctx.fillRect(x, baseY - height, 48, height);
        ctx.fillStyle = 'rgba(255, 221, 118, 0.45)';
        ctx.fillRect(x + 10, baseY - height + 22, 8, 8);
        ctx.fillRect(x + 28, baseY - height + 46, 8, 8);
        ctx.fillStyle = color;
    }
}

function drawCourtLines(color) {
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.strokeRect(34, 34, canvas.width - 68, canvas.height - 68);
    ctx.beginPath();
    ctx.moveTo(34, canvas.height / 2);
    ctx.lineTo(canvas.width - 34, canvas.height / 2);
    ctx.stroke();
    ctx.lineWidth = 1;
}

function drawPaddle(paddle, side) {
    const skin = getSkinForSide(side);
    const character = getCharacterForSide(side);
    const mainColor = side === 'left' ? skin.left : skin.right;
    const glowColor = hexToRgba(mainColor, 0.78);
    const facing = side === 'left' ? 1 : -1;
    const bodyX = side === 'left' ? paddle.x + 34 : paddle.x - 34;
    const centerY = paddle.y + paddle.height / 2;
    const level = getCharacterLevel(side === 'left' ? playerOneWins : playerTwoWins);
    const swing = paddle.swing / 12;

    ctx.save();
    ctx.translate(bodyX, centerY + 8);
    ctx.scale(facing, 1);

    // Original anime-inspired battle avatar, drawn directly into the arena.
    ctx.shadowColor = glowColor;
    ctx.shadowBlur = 14 + level * 3;
    ctx.strokeStyle = glowColor;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, -8, 38 + level * 2, 0, Math.PI * 2);
    ctx.stroke();
    ctx.shadowBlur = 0;

    ctx.fillStyle = character.hair;
    ctx.beginPath();
    ctx.ellipse(0, -50, 18, 16, -0.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillRect(-17, -54, 34, 14);

    ctx.fillStyle = '#f1c6a8';
    ctx.beginPath();
    ctx.ellipse(0, -38, 15, 17, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#101827';
    ctx.fillRect(-7, -40, 4, 3);
    ctx.fillRect(5, -40, 4, 3);

    ctx.fillStyle = character.suit;
    drawRoundedRect(-18, -20, 36, 48, 11);
    ctx.fillStyle = character.accent;
    ctx.fillRect(-4, -15, 8, 38);

    ctx.strokeStyle = character.accent;
    ctx.lineWidth = 5;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(-12, -8);
    ctx.lineTo(-28, 14);
    ctx.moveTo(12, -8);
    ctx.lineTo(28, 14);
    ctx.stroke();

    ctx.strokeStyle = character.suit;
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(-10, 26);
    ctx.lineTo(-18, 45);
    ctx.moveTo(10, 26);
    ctx.lineTo(18, 45);
    ctx.stroke();

    const swordX = -facing * (Math.abs(bodyX - paddle.x) - 2);
    const swordTop = paddle.y - centerY - 2;
    const swordBottom = swordTop + paddle.height + 4;
    const swingAngle = -0.34 * swing;
    ctx.save();
    ctx.translate(swordX, 0);
    ctx.rotate(swingAngle);
    drawWeaponBlade(skin, mainColor, glowColor, swordTop, swordBottom, level);
    ctx.restore();

    if (swing > 0) {
        ctx.globalAlpha = swing * 0.65;
        ctx.strokeStyle = glowColor;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(swordX + 10, 0, 54, -1.1, 1.1);
        ctx.stroke();
        ctx.globalAlpha = 1;
    }

    if (level >= 3) {
        ctx.strokeStyle = hexToRgba(mainColor, 0.55);
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(-31, -30);
        ctx.lineTo(-54, 30);
        ctx.moveTo(31, -30);
        ctx.lineTo(54, 30);
        ctx.stroke();
    }

    ctx.restore();
}

function drawWeaponBlade(skin, mainColor, glowColor, top, bottom, level) {
    ctx.shadowColor = glowColor;
    ctx.shadowBlur = 18 + level * 4;
    ctx.lineCap = 'round';

    if (skin.kind === 'fire') {
        ctx.strokeStyle = mainColor;
        ctx.lineWidth = 10 + level;
        ctx.beginPath();
        for (let y = top; y <= bottom; y += 12) {
            const wave = Math.sin(frameCount * 0.22 + y * 0.09) * 6;
            if (y === top) {
                ctx.moveTo(wave, y);
            } else {
                ctx.lineTo(wave, y);
            }
        }
        ctx.stroke();
        ctx.strokeStyle = '#ffd166';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(0, top + 8);
        ctx.lineTo(0, bottom - 8);
        ctx.stroke();
    } else if (skin.kind === 'crescent') {
        ctx.strokeStyle = mainColor;
        ctx.lineWidth = 8 + level;
        ctx.beginPath();
        ctx.moveTo(0, top);
        ctx.quadraticCurveTo(26, (top + bottom) / 2, 0, bottom);
        ctx.stroke();
        ctx.strokeStyle = 'rgba(255,255,255,0.72)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(4, top + 12);
        ctx.quadraticCurveTo(20, (top + bottom) / 2, 4, bottom - 12);
        ctx.stroke();
    } else if (skin.kind === 'void') {
        ctx.strokeStyle = '#0b1020';
        ctx.lineWidth = 13 + level;
        ctx.beginPath();
        ctx.moveTo(0, top);
        ctx.lineTo(0, bottom);
        ctx.stroke();
        ctx.strokeStyle = mainColor;
        ctx.lineWidth = 4;
        ctx.setLineDash([8, 8]);
        ctx.beginPath();
        ctx.moveTo(0, top + 4);
        ctx.lineTo(0, bottom - 4);
        ctx.stroke();
        ctx.setLineDash([]);
    } else if (skin.kind === 'rail') {
        ctx.strokeStyle = mainColor;
        ctx.lineWidth = 5 + level;
        ctx.beginPath();
        ctx.moveTo(-5, top);
        ctx.lineTo(-5, bottom);
        ctx.moveTo(5, top);
        ctx.lineTo(5, bottom);
        ctx.stroke();
        ctx.strokeStyle = skin.accent;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, top + 10);
        ctx.lineTo(0, bottom - 10);
        ctx.stroke();
    } else {
        ctx.strokeStyle = mainColor;
        ctx.lineWidth = 8 + level;
        ctx.beginPath();
        ctx.moveTo(0, top);
        ctx.lineTo(0, bottom);
        ctx.stroke();
        ctx.strokeStyle = 'rgba(255,255,255,0.8)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, top + 8);
        ctx.lineTo(0, bottom - 8);
        ctx.stroke();
    }
}

function drawRoundedRect(x, y, width, height, radius) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.fill();
}

function drawBall() {
    ctx.fillStyle = '#fff';
    ctx.shadowColor = 'rgba(255, 255, 255, 0.85)';
    ctx.shadowBlur = 12;
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
}

function hexToRgba(hex, alpha) {
    const value = hex.replace('#', '');
    const red = parseInt(value.slice(0, 2), 16);
    const green = parseInt(value.slice(2, 4), 16);
    const blue = parseInt(value.slice(4, 6), 16);
    return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
}

function drawEffects() {
    fireworks.forEach((particle) => {
        const alpha = Math.max(particle.life / particle.maxLife, 0);
        ctx.globalAlpha = alpha;
        ctx.fillStyle = particle.color;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
    });

    feedbacks.forEach((feedback) => {
        const alpha = Math.max(feedback.life / feedback.maxLife, 0);
        ctx.globalAlpha = alpha;
        ctx.fillStyle = feedback.color;
        ctx.font = `bold ${feedback.size}px Segoe UI, Arial, sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.shadowColor = feedback.color;
        ctx.shadowBlur = 14;
        const textWidth = ctx.measureText(feedback.text).width;
        const safeX = clamp(feedback.x, textWidth / 2 + 12, canvas.width - textWidth / 2 - 12);
        const safeY = clamp(feedback.y, feedback.size / 2 + 10, canvas.height - feedback.size / 2 - 10);
        ctx.fillText(feedback.text, safeX, safeY);
    });

    ctx.globalAlpha = 1;
    ctx.shadowBlur = 0;
}

function updateScore() {
    document.getElementById('playerScore').textContent = player.score;
    document.getElementById('computerScore').textContent = opponent.score;
    playerRoundsEl.textContent = `Rounds ${playerRoundWins}`;
    computerRoundsEl.textContent = `Rounds ${opponentRoundWins}`;
    roundLabel.textContent = `Round ${currentRound} / ${MATCH_ROUNDS}`;

    if (!matchOver && !isPaused && performance.now() >= roundPauseUntil) {
        matchStatus.textContent = 'First to 6, win by 2';
    }
}

function gameLoop() {
    update();
    draw();
    updateScore();
    requestAnimationFrame(gameLoop);
}

renderCustomization();
setGameMode('single');
draw();
gameLoop();
