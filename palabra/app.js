const LEVELS = {
    1: [
        { file: '00_pato.png', words: ['pato'] },
        { file: '01_gato.png', words: ['gato'] },
        { file: '02_mano.png', words: ['mano'] },
        { file: '03_mono.png', words: ['mono'] },
        { file: '04_sapo.png', words: ['sapo', 'rana'] },
        { file: '05_sopa.png', words: ['sopa'] },
        { file: '06_pelota.png', words: ['pelota', 'balón'] },
        { file: '07_tomate.png', words: ['tomate'] },
        { file: '08_corona.png', words: ['corona'] },
        { file: '10_mariposa.png', words: ['mariposa'] }
    ],
    2: [
        { file: '11_oso.png', words: ['oso'] },
        { file: '12_ojo.png', words: ['ojo'] },
        { file: '14_abeja.png', words: ['abeja'] },
        { file: '15_oveja.png', words: ['oveja'] },
        { file: '16_aguja.png', words: ['aguja'] },
        { file: '27_ajo.png', words: ['ajo'] },
        { file: '28_alas.png', words: ['ala', 'alas'] },
        { file: '29_oreja.png', words: ['oreja'] }
    ],
    3: [
        { file: '13_uvas.png', words: ['uvas', 'uva'] },
        { file: '30_sol.png', words: ['sol'] },
        { file: '31_pan.png', words: ['pan', 'panes'] },
        { file: '32_pulpo.png', words: ['pulpo'] },
        { file: '33_carpa.png', words: ['carpa'] },
        { file: '34_torta.png', words: ['torta'] },
        { file: '35_mosca.png', words: ['mosca'] },
        { file: '36_arco.png', words: ['arco'] },
        { file: '37_peine.png', words: ['peine'] },
        { file: '38_jaula.png', words: ['jaula'] }
    ],
    4: [
        { file: '09_jirafa.png', words: ['jirafa'] },
        { file: '17_clavos.png', words: ['clavos', 'clavo'] },
        { file: '18_globo.png', words: ['globo'] },
        { file: '19_flauta.png', words: ['flauta'] },
        { file: '20_plato.png', words: ['plato'] },
        { file: '21_pluma.png', words: ['pluma'] },
        { file: '22_bruja.png', words: ['bruja'] },
        { file: '23_dragon.png', words: ['dragón'] },
        { file: '24_cocodrilo.png', words: ['cocodrilo', 'lagarto'] },
        { file: '25_grillo.png', words: ['grillo', 'langosta', 'saltamontes'] },
        { file: '26_princesa.png', words: ['princesa'] }
    ]
};

const STORAGE_KEY = 'juegoPalabrasEscolar';
const STATE_VERSION = 3;
const LAST_LEVEL = 4;

const SCREEN = {
    PLAY: 'play',
    PENDING_CHOICE: 'pending-choice',
    LEVEL_COMPLETE: 'level-complete',
    REVIEW_LEVEL: 'review-level',
    GAME_COMPLETE: 'game-complete',
    FINAL_RESULTS: 'final-results'
};

const ITEM_STATUS = {
    WAITING: 'waiting',
    CORRECT: 'correct',
    INCORRECT: 'incorrect'
};

let state;

const elImage = document.getElementById('current-image');
const elInput = document.getElementById('word-input');
const elBtnValidate = document.getElementById('btn-validate');
const elFeedbackArea = document.getElementById('feedback-area');
const elFeedbackMessage = document.getElementById('feedback-message');
const elFeedbackControls = document.getElementById('feedback-controls');
const elCountCorrect = document.getElementById('count-correct');
const elCountIncorrect = document.getElementById('count-incorrect');
const elCurrentLevelTitle = document.getElementById('current-level-title');
const elGameArea = document.getElementById('game-area');
const elEndScreen = document.getElementById('end-screen');
const elSummaryScreen = document.getElementById('summary-screen');
const elSummaryTitle = elSummaryScreen.querySelector('h2');
const elSummaryGallery = document.getElementById('summary-gallery');
const elBtnSummaryAction = document.getElementById('btn-play-again');
const elEndTitle = document.getElementById('end-title');
const elEndMessage = document.getElementById('end-message');
const elBtnPrimaryEndAction = document.getElementById('btn-retry-errors');
const elBtnSecondaryEndAction = document.getElementById('btn-finish');

function cloneQueueItems(items) {
    return items.map(item => ({ file: item.file, words: [...item.words] }));
}

function shuffleItems(items) {
    const mixed = cloneQueueItems(items);
    for (let index = mixed.length - 1; index > 0; index--) {
        const randomIndex = Math.floor(Math.random() * (index + 1));
        [mixed[index], mixed[randomIndex]] = [mixed[randomIndex], mixed[index]];
    }
    return mixed;
}

function createNewState() {
    return {
        version: STATE_VERSION,
        currentLevel: 1,
        completedLevels: [],
        roundType: 'level',
        activeQueue: shuffleItems(LEVELS[1]),
        currentIndex: 0,
        pendingItems: [],
        finalIncorrectItems: [],
        correctFiles: [],
        screen: SCREEN.PLAY,
        itemStatus: ITEM_STATUS.WAITING,
        inputText: ''
    };
}

function isQueueItem(item) {
    return item && typeof item.file === 'string' && Array.isArray(item.words);
}

function isPendingItem(item) {
    return isQueueItem(item) && typeof item.userTyped === 'string';
}

function isFinalIncorrectItem(item) {
    return isPendingItem(item) && Number.isInteger(item.level);
}

function isValidSavedState(savedState) {
    return savedState &&
        savedState.version === STATE_VERSION &&
        Number.isInteger(savedState.currentLevel) &&
        savedState.currentLevel >= 1 &&
        savedState.currentLevel <= LAST_LEVEL &&
        Array.isArray(savedState.completedLevels) &&
        Array.isArray(savedState.activeQueue) &&
        savedState.activeQueue.every(isQueueItem) &&
        Array.isArray(savedState.pendingItems) &&
        savedState.pendingItems.every(isPendingItem) &&
        Array.isArray(savedState.finalIncorrectItems) &&
        savedState.finalIncorrectItems.every(isFinalIncorrectItem) &&
        Array.isArray(savedState.correctFiles) &&
        savedState.correctFiles.every(file => typeof file === 'string') &&
        Number.isInteger(savedState.currentIndex) &&
        savedState.currentIndex >= 0 &&
        Object.values(SCREEN).includes(savedState.screen) &&
        Object.values(ITEM_STATUS).includes(savedState.itemStatus) &&
        typeof savedState.inputText === 'string';
}

function saveProgress() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
        console.warn('No se pudo guardar el progreso del juego.', error);
    }
}

function loadProgress() {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            const recoveredState = JSON.parse(saved);
            if (isValidSavedState(recoveredState)) {
                return recoveredState;
            }
        }
    } catch (error) {
        console.warn('No se pudo recuperar el progreso guardado.', error);
    }

    return createNewState();
}

function normalizeString(text) {
    return text
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .trim();
}

function getCurrentItem() {
    return state.activeQueue[state.currentIndex];
}

function findPendingIndex(file) {
    return state.pendingItems.findIndex(item => item.file === file);
}

function savePendingAttempt(item, userTyped) {
    const index = findPendingIndex(item.file);
    const pendingItem = {
        file: item.file,
        words: [...item.words],
        userTyped
    };

    if (index >= 0) {
        state.pendingItems[index] = pendingItem;
    } else {
        state.pendingItems.push(pendingItem);
    }
}

function removePendingItem(file) {
    state.pendingItems = state.pendingItems.filter(item => item.file !== file);
}

function addCorrectItem(file) {
    if (!state.correctFiles.includes(file)) {
        state.correctFiles.push(file);
    }
}

function getIncorrectCountVisible() {
    return state.finalIncorrectItems.length + state.pendingItems.length;
}

function updateScoreBoard() {
    elCountCorrect.innerText = state.correctFiles.length;
    elCountIncorrect.innerText = getIncorrectCountVisible();
}

function hideAllScreens() {
    elGameArea.classList.add('hidden');
    elEndScreen.classList.add('hidden');
    elSummaryScreen.classList.add('hidden');
}

function renderPlayScreen() {
    const currentItem = getCurrentItem();
    if (!currentItem) {
        finishRound();
        return;
    }

    hideAllScreens();
    elGameArea.classList.remove('hidden');
    elCurrentLevelTitle.innerText = `Nivel ${state.currentLevel}`;
    elImage.src = `images/${currentItem.file}`;
    elInput.value = state.inputText;

    if (state.itemStatus === ITEM_STATUS.WAITING) {
        elInput.disabled = false;
        elBtnValidate.classList.remove('hidden');
        elFeedbackArea.classList.add('hidden');
        elFeedbackControls.innerHTML = '';
        elInput.focus();
        return;
    }

    elInput.disabled = true;
    elBtnValidate.classList.add('hidden');
    elFeedbackArea.classList.remove('hidden');

    if (state.itemStatus === ITEM_STATUS.CORRECT) {
        elFeedbackMessage.innerText = '¡Bien!';
        elFeedbackMessage.style.color = 'var(--green)';
        elFeedbackControls.innerHTML = '<button id="btn-next" class="btn btn-green">Siguiente</button>';
        document.getElementById('btn-next').addEventListener('click', nextItem);
        return;
    }

    elFeedbackMessage.innerText = 'Probá nuevamente.';
    elFeedbackMessage.style.color = 'var(--red)';
    elFeedbackControls.innerHTML = `
        <button id="btn-retry" class="btn btn-blue">Volver a intentar</button>
        <button id="btn-continue" class="btn btn-orange">Continuar</button>
    `;
    document.getElementById('btn-retry').addEventListener('click', retryItem);
    document.getElementById('btn-continue').addEventListener('click', nextItem);
}

function resetEndButtons() {
    elBtnPrimaryEndAction.classList.add('hidden');
    elBtnSecondaryEndAction.classList.add('hidden');
    elBtnPrimaryEndAction.onclick = null;
    elBtnSecondaryEndAction.onclick = null;
}

function renderEndScreen() {
    hideAllScreens();
    elEndScreen.classList.remove('hidden');
    resetEndButtons();
    elEndMessage.innerText = '';

    if (state.screen === SCREEN.PENDING_CHOICE) {
        const count = state.pendingItems.length;
        const pendingText = count === 1 ? 'palabra pendiente' : 'palabras pendientes';
        elEndTitle.innerText = `Nivel ${state.currentLevel}`;
        elEndMessage.innerText = `Tenés ${count} ${pendingText}.`;
        elBtnPrimaryEndAction.innerText = 'Volver a escribir';
        elBtnPrimaryEndAction.onclick = startPendingRound;
        elBtnPrimaryEndAction.classList.remove('hidden');
        elBtnSecondaryEndAction.innerText = 'Ver respuestas y continuar';
        elBtnSecondaryEndAction.onclick = reviewAnswersAndCloseLevel;
        elBtnSecondaryEndAction.classList.remove('hidden');
        return;
    }

    if (state.screen === SCREEN.LEVEL_COMPLETE) {
        elEndTitle.innerText = `Nivel ${state.currentLevel} completado`;
        elBtnPrimaryEndAction.innerText = `Comenzar Nivel ${state.currentLevel + 1}`;
        elBtnPrimaryEndAction.onclick = startNextLevel;
        elBtnPrimaryEndAction.classList.remove('hidden');
        return;
    }

    elEndTitle.innerText = 'Juego completado';
    elEndMessage.innerText = `Correctas: ${state.correctFiles.length} | Incorrectas: ${state.finalIncorrectItems.length}`;
    elBtnPrimaryEndAction.innerText = 'Ver resultado final';
    elBtnPrimaryEndAction.onclick = showFinalResults;
    elBtnPrimaryEndAction.classList.remove('hidden');
    elBtnSecondaryEndAction.innerText = 'Volver a comenzar';
    elBtnSecondaryEndAction.onclick = requestRestart;
    elBtnSecondaryEndAction.classList.remove('hidden');
}

function createSummaryCard(item) {
    const card = document.createElement('div');
    card.className = 'summary-item';

    const image = document.createElement('img');
    image.src = `images/${item.file}`;
    image.alt = 'Imagen';

    const text = document.createElement('div');
    text.className = 'summary-text';

    const typed = document.createElement('p');
    typed.className = 'txt-red';
    typed.textContent = `Escribiste: ${item.userTyped}`;

    const expected = document.createElement('p');
    expected.className = 'txt-green';
    expected.textContent = `Era: ${item.words.join(' o ')}`;

    text.appendChild(typed);
    text.appendChild(expected);
    card.appendChild(image);
    card.appendChild(text);
    return card;
}

function renderSummaryScreen() {
    hideAllScreens();
    elSummaryScreen.classList.remove('hidden');
    elSummaryGallery.innerHTML = '';

    if (state.screen === SCREEN.REVIEW_LEVEL) {
        elSummaryTitle.innerText = `Nivel ${state.currentLevel}`;
        const levelIncorrectItems = state.finalIncorrectItems.filter(item => item.level === state.currentLevel);
        levelIncorrectItems.forEach(item => {
            elSummaryGallery.appendChild(createSummaryCard(item));
        });

        if (state.currentLevel < LAST_LEVEL) {
            elBtnSummaryAction.innerText = `Comenzar Nivel ${state.currentLevel + 1}`;
            elBtnSummaryAction.onclick = startNextLevel;
        } else {
            elBtnSummaryAction.innerText = 'Ver resultado final';
            elBtnSummaryAction.onclick = showFinalResults;
        }
        return;
    }

    elSummaryTitle.innerText = 'Resultado final';
    const totals = document.createElement('p');
    totals.textContent = `Correctas: ${state.correctFiles.length} | Incorrectas: ${state.finalIncorrectItems.length}`;
    elSummaryGallery.appendChild(totals);

    if (state.finalIncorrectItems.length === 0) {
        const withoutErrors = document.createElement('p');
        withoutErrors.textContent = '¡Sin errores que mostrar!';
        elSummaryGallery.appendChild(withoutErrors);
    } else {
        state.finalIncorrectItems.forEach(item => {
            elSummaryGallery.appendChild(createSummaryCard(item));
        });
    }

    elBtnSummaryAction.innerText = 'Volver a comenzar';
    elBtnSummaryAction.onclick = requestRestart;
}

function render() {
    updateScoreBoard();

    if (state.screen === SCREEN.PLAY) {
        renderPlayScreen();
    } else if (state.screen === SCREEN.REVIEW_LEVEL || state.screen === SCREEN.FINAL_RESULTS) {
        renderSummaryScreen();
    } else {
        renderEndScreen();
    }
}

function validateWord() {
    if (state.screen !== SCREEN.PLAY || state.itemStatus !== ITEM_STATUS.WAITING) {
        return;
    }

    const userWord = elInput.value;
    if (userWord.trim() === '') {
        return;
    }

    const currentItem = getCurrentItem();
    const normalizedUserWord = normalizeString(userWord);
    const isCorrect = currentItem.words.some(word => normalizeString(word) === normalizedUserWord);

    state.inputText = userWord;

    if (isCorrect) {
        state.itemStatus = ITEM_STATUS.CORRECT;
        addCorrectItem(currentItem.file);
        removePendingItem(currentItem.file);
    } else {
        state.itemStatus = ITEM_STATUS.INCORRECT;
        savePendingAttempt(currentItem, userWord);
    }

    saveProgress();
    render();
}

function nextItem() {
    state.currentIndex++;
    state.itemStatus = ITEM_STATUS.WAITING;
    state.inputText = '';

    if (state.currentIndex >= state.activeQueue.length) {
        finishRound();
        return;
    }

    saveProgress();
    render();
}

function retryItem() {
    state.itemStatus = ITEM_STATUS.WAITING;
    state.inputText = '';
    saveProgress();
    render();
}

function markCurrentLevelCompleted() {
    if (!state.completedLevels.includes(state.currentLevel)) {
        state.completedLevels.push(state.currentLevel);
    }
}

function finishRound() {
    state.itemStatus = ITEM_STATUS.WAITING;
    state.inputText = '';

    if (state.pendingItems.length > 0) {
        state.screen = SCREEN.PENDING_CHOICE;
    } else {
        markCurrentLevelCompleted();
        state.screen = state.currentLevel === LAST_LEVEL ? SCREEN.GAME_COMPLETE : SCREEN.LEVEL_COMPLETE;
    }

    saveProgress();
    render();
}

function startPendingRound() {
    state.roundType = 'pending';
    state.activeQueue = shuffleItems(state.pendingItems);
    state.currentIndex = 0;
    state.screen = SCREEN.PLAY;
    state.itemStatus = ITEM_STATUS.WAITING;
    state.inputText = '';
    saveProgress();
    render();
}

function reviewAnswersAndCloseLevel() {
    state.pendingItems.forEach(item => {
        state.finalIncorrectItems.push({
            file: item.file,
            words: [...item.words],
            userTyped: item.userTyped,
            level: state.currentLevel
        });
    });

    state.pendingItems = [];
    markCurrentLevelCompleted();
    state.screen = SCREEN.REVIEW_LEVEL;
    state.itemStatus = ITEM_STATUS.WAITING;
    state.inputText = '';
    saveProgress();
    render();
}

function startNextLevel() {
    if (state.currentLevel >= LAST_LEVEL) {
        return;
    }

    state.currentLevel++;
    state.roundType = 'level';
    state.activeQueue = shuffleItems(LEVELS[state.currentLevel]);
    state.currentIndex = 0;
    state.pendingItems = [];
    state.screen = SCREEN.PLAY;
    state.itemStatus = ITEM_STATUS.WAITING;
    state.inputText = '';
    saveProgress();
    render();
}

function showFinalResults() {
    state.screen = SCREEN.FINAL_RESULTS;
    saveProgress();
    render();
}

function requestRestart() {
    const confirmed = window.confirm(
        '¿Querés reiniciar todo el juego?\n\nSe perderá todo el progreso y volverás al Nivel 1.'
    );

    if (!confirmed) {
        return;
    }

    localStorage.removeItem(STORAGE_KEY);
    state = createNewState();
    saveProgress();
    render();
}

function init() {
    state = loadProgress();
    saveProgress();
    render();
}

elBtnValidate.addEventListener('click', validateWord);
elInput.addEventListener('input', function () {
    if (state.screen === SCREEN.PLAY && state.itemStatus === ITEM_STATUS.WAITING) {
        state.inputText = elInput.value;
        saveProgress();
    }
});
document.getElementById('btn-restart').addEventListener('click', requestRestart);
elBtnSummaryAction.addEventListener('click', function () {});

document.addEventListener('keydown', function (event) {
    if (event.key !== 'Enter' || state.screen !== SCREEN.PLAY) {
        return;
    }

    if (state.itemStatus === ITEM_STATUS.WAITING && document.activeElement === elInput) {
        event.preventDefault();
        validateWord();
    } else if (state.itemStatus === ITEM_STATUS.CORRECT) {
        event.preventDefault();
        nextItem();
    }
});

init();
