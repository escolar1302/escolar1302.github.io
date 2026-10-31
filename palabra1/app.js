const db = [
    { file: '00_pato.png', words: ['pato'] },
    { file: '01_gato.png', words: ['gato'] },
    { file: '02_mano.png', words: ['mano'] },
    { file: '03_mono.png', words: ['mono'] },
    { file: '04_sapo.png', words: ['sapo', 'rana'] },
    { file: '05_sopa.png', words: ['sopa'] },
    { file: '06_pelota.png', words: ['pelota', 'balon'] },
    { file: '07_tomate.png', words: ['tomate'] },
    { file: '08_corona.png', words: ['corona'] },
    { file: '09_jirafa.png', words: ['jirafa'] },
    { file: '10_mariposa.png', words: ['mariposa'] },
    { file: '11_oso.png', words: ['oso'] },
    { file: '12_ojo.png', words: ['ojo'] },
    { file: '13_uvas.png', words: ['uvas', 'uva'] },
    { file: '14_abeja.png', words: ['abeja'] },
    { file: '15_oveja.png', words: ['oveja'] },
    { file: '16_aguja.png', words: ['aguja'] },
    { file: '17_clavos.png', words: ['clavos', 'clavo'] },
    { file: '18_globo.png', words: ['globo'] },
    { file: '19_flauta.png', words: ['flauta'] },
    { file: '20_plato.png', words: ['plato'] },
    { file: '21_pluma.png', words: ['pluma'] },
    { file: '22_bruja.png', words: ['bruja'] },
    { file: '23_dragon.png', words: ['dragon'] },
    { file: '24_cocodrilo.png', words: ['cocodrilo', 'lagarto'] },
    { file: '25_grillo.png', words: ['grillo', 'langosta', 'saltamontes'] },
    { file: '26_princesa.png', words: ['princesa'] }
];

let gameQueue = [...db]; 
let errorsList = []; 
let currentIndex = 0;
let correctCount = 0;
let incorrectCount = 0;
let hasFailedCurrent = false;

const elImage = document.getElementById('current-image');
const elInput = document.getElementById('word-input');
const elBtnValidate = document.getElementById('btn-validate');
const elFeedbackArea = document.getElementById('feedback-area');
const elFeedbackMessage = document.getElementById('feedback-message');
const elFeedbackControls = document.getElementById('feedback-controls');
const elCountCorrect = document.getElementById('count-correct');
const elCountIncorrect = document.getElementById('count-incorrect');
const elGameArea = document.getElementById('game-area');
const elEndScreen = document.getElementById('end-screen');
const elSummaryScreen = document.getElementById('summary-screen');

function init() {
    loadProgress();
    loadItem();
}

// --- SISTEMA DE GUARDADO ---
function saveProgress() {
    const gameState = {
        gameQueue, errorsList, currentIndex, correctCount, incorrectCount, hasFailedCurrent
    };
    localStorage.setItem('juegoPalabrasEscolar', JSON.stringify(gameState));
}

function loadProgress() {
    const saved = localStorage.getItem('juegoPalabrasEscolar');
    if (saved) {
        const state = JSON.parse(saved);
        gameQueue = state.gameQueue;
        errorsList = state.errorsList;
        currentIndex = state.currentIndex;
        correctCount = state.correctCount;
        incorrectCount = state.incorrectCount;
        hasFailedCurrent = state.hasFailedCurrent;
        
        elCountCorrect.innerText = correctCount;
        elCountIncorrect.innerText = incorrectCount;
    }
}

function clearProgress() {
    localStorage.removeItem('juegoPalabrasEscolar');
    location.reload(); // Recarga la página desde cero
}
// ---------------------------

function loadItem() {
    if (currentIndex >= gameQueue.length) {
        showEndScreen();
        return;
    }

    const currentItem = gameQueue[currentIndex];
    elImage.src = `images/${currentItem.file}`;
    
    elInput.value = '';
    elInput.disabled = false;
    elInput.focus();
    elBtnValidate.classList.remove('hidden');
    elFeedbackArea.classList.add('hidden');
    hasFailedCurrent = false;
    
    saveProgress(); // Guardamos al iniciar una nueva imagen
}

function normalizeString(str) {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
}

function validateWord() {
    const userWord = elInput.value;
    if (userWord.trim() === '') return;

    const currentItem = gameQueue[currentIndex];
    const normalizedUserWord = normalizeString(userWord);
    const isCorrect = currentItem.words.some(w => normalizeString(w) === normalizedUserWord);

    elInput.disabled = true;
    elBtnValidate.classList.add('hidden');
    elFeedbackArea.classList.remove('hidden');

    if (isCorrect) {
        if (!hasFailedCurrent) {
            // Acierto a la primera
            correctCount++;
        } else {
            // Acierto después de haberse equivocado (lo corrigió)
            correctCount++;
            incorrectCount--; // Le perdonamos el error en el contador
            
            // Lo eliminamos de la lista negra para que no salga al final
            errorsList = errorsList.filter(e => e.file !== currentItem.file);
        }
        
        // Actualizamos los números en pantalla
        elCountCorrect.innerText = correctCount;
        elCountIncorrect.innerText = incorrectCount;
        
        elFeedbackMessage.innerText = "¡Excelente!";
        elFeedbackMessage.style.color = "var(--green)";
        elFeedbackControls.innerHTML = `<button id="btn-next" class="btn btn-green" onclick="nextItem()">Siguiente</button>`;
    } else {
        if (!hasFailedCurrent) {
            // Se equivoca por primera vez en esta imagen
            incorrectCount++;
            elCountIncorrect.innerText = incorrectCount;
            hasFailedCurrent = true;
            
            // Lo agregamos a la lista de errores
            errorsList.push({ file: currentItem.file, correctWords: currentItem.words, userTyped: userWord });
        } else {
            // Se volvió a equivocar intentando corregir. Actualizamos lo que escribió para el resumen final.
            const errorIndex = errorsList.findIndex(e => e.file === currentItem.file);
            if(errorIndex > -1) {
                errorsList[errorIndex].userTyped = userWord;
            }
        }
        
        elFeedbackMessage.innerText = "¡Ups! No es correcto.";
        elFeedbackMessage.style.color = "var(--red)";
        elFeedbackControls.innerHTML = `
            <button class="btn btn-blue" onclick="retryItem()">Volver a intentar</button>
            <button class="btn btn-orange" onclick="nextItem()">Pasar a la próxima</button>
        `;
    }
    
    saveProgress(); // Guardamos los resultados en la memoria
}

function nextItem() {
    currentIndex++;
    loadItem();
}

function retryItem() {
    elInput.disabled = false;
    elInput.value = '';
    elInput.focus();
    elBtnValidate.classList.remove('hidden');
    elFeedbackArea.classList.add('hidden');
}

function showEndScreen() {
    elGameArea.classList.add('hidden');
    elEndScreen.classList.remove('hidden');

    const msg = document.getElementById('end-message');
    const btnRetryErrors = document.getElementById('btn-retry-errors');

    if (errorsList.length === 0) {
        msg.innerText = "¡Felicidades! Completaste todas las palabras sin dejar ningún error pendiente.";
        localStorage.removeItem('juegoPalabrasEscolar'); // Todo listo, limpiamos memoria
    } else {
        msg.innerText = `Has terminado la ronda, pero tienes ${errorsList.length} palabra(s) incorrecta(s). ¿Qué deseas hacer?`;
        btnRetryErrors.classList.remove('hidden');
    }

    document.getElementById('btn-retry-errors').onclick = startErrorRound;
    document.getElementById('btn-finish').onclick = showFinalSummary;
}

function startErrorRound() {
    gameQueue = errorsList.map(item => ({ file: item.file, words: item.correctWords }));
    errorsList = []; 
    currentIndex = 0;
    
    elEndScreen.classList.add('hidden');
    elGameArea.classList.remove('hidden');
    loadItem();
}

function showFinalSummary() {
    localStorage.removeItem('juegoPalabrasEscolar'); // Fin del juego, limpiamos memoria

    elEndScreen.classList.add('hidden');
    elGameArea.classList.add('hidden');
    elSummaryScreen.classList.remove('hidden');

    const gallery = document.getElementById('summary-gallery');
    gallery.innerHTML = '';

    if (errorsList.length === 0) {
        gallery.innerHTML = '<p>¡Sin errores que mostrar!</p>';
        return;
    }

    errorsList.forEach(item => {
        const div = document.createElement('div');
        div.className = 'summary-item';
        const validOptionsText = item.correctWords.join(' o ');

        div.innerHTML = `
            <img src="images/${item.file}" alt="Imagen">
            <div class="summary-text">
                <p class="txt-red">Escribiste: ${item.userTyped}</p>
                <p class="txt-green">Era: ${validOptionsText}</p>
            </div>
        `;
        gallery.appendChild(div);
    });
}

// Botones estáticos
elBtnValidate.addEventListener('click', validateWord);
document.getElementById('btn-restart').addEventListener('click', clearProgress);
document.getElementById('btn-play-again').addEventListener('click', clearProgress);

// Lógica mágica del doble "Enter"
document.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        // 1. Si el input de texto está habilitado, Enter sirve para Validar.
        if (!elInput.disabled && document.activeElement === elInput) {
            validateWord();
        } 
        // 2. Si el input está deshabilitado es porque ya validamos.
        // Si hay un botón verde de "Siguiente" en la pantalla, Enter lo presiona.
        else if (elInput.disabled) {
            const btnSiguiente = document.getElementById('btn-next');
            if (btnSiguiente) {
                btnSiguiente.click();
            }
        }
    }
});

// Arrancamos
init();