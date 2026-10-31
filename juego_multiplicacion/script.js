const app = document.getElementById('app');

const ASSET = (name) => `assets/${name}`;
const bagSrc = (n) => ASSET(`${String(n).padStart(2, '0')}.png`);
const mascot = {
  pensando: ASSET('personaje_pensando.png'),
  correcto: ASSET('personaje_correcto.png'),
  duda: ASSET('personaje_duda.png')
};

let state = {
  screen: 'home',
  modeLabel: '',
  sectionLabel: '',
  exercises: [],
  index: 0,
  score: 0,
  afterFinish: null,
  game: null,
  fragment: null
};

const understandLevels = {
  iguales: {
    label: 'Grupos iguales',
    intro: 'Reconocer si todas las bolsas tienen la misma cantidad.'
  },
  suma: {
    label: 'Suma repetida',
    intro: 'Relacionar una imagen con la suma que corresponde.'
  },
  multiplicacion: {
    label: 'Multiplicación con dibujos',
    intro: 'Elegir la multiplicación que representa mejor una escena.'
  },
  sumaOMultiplicacion: {
    label: '¿Suma o multiplicación?',
    intro: 'Decidir si conviene sumar cantidades distintas o multiplicar grupos iguales.'
  },
  completar: {
    label: 'Completar cálculos',
    intro: 'Completar factores o resultados sin que la respuesta aparezca en pantalla.'
  }
};

function shuffle(array) {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function sample(array, count) {
  return shuffle(array).slice(0, Math.min(count, array.length));
}

function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function choice(array) {
  return array[rand(0, array.length - 1)];
}

function uniqueOptions(options) {
  const map = new Map();
  options.forEach(opt => {
    const key = String(opt.label);
    if (!map.has(key)) {
      map.set(key, opt);
      return;
    }
    const current = map.get(key);
    if (!current.correct && opt.correct) {
      map.set(key, opt);
    } else if (current.correct && opt.correct && current.nuanced && !opt.nuanced) {
      map.set(key, opt);
    }
  });
  return [...map.values()];
}

function pushUniqueOption(options, used, option) {
  const key = String(option.label);
  if (used.has(key)) return false;
  used.add(key);
  options.push(option);
  return true;
}

function allEqual(values) {
  return values.every(v => v === values[0]);
}

function mult(a, b) {
  return `${a} × ${b}`;
}

function repeatedAdd(n, times) {
  return Array(times).fill(n).join(' + ');
}

function globalNavHTML() {
  if (state.screen === 'home') return '';
  const sectionLabel = globalSectionLabel();
  return `
    <div class="global-nav desktop-nav" aria-label="Navegación del juego">
      <button class="nav-button home" id="globalHomeBtn" type="button">Inicio</button>
      <button class="nav-button section" id="globalSectionBtn" type="button">${sectionLabel}</button>
    </div>
    <details class="mobile-nav">
      <summary class="nav-menu-button" aria-label="Abrir menú de navegación">☰ Menú</summary>
      <div class="mobile-nav-panel" aria-label="Menú de navegación">
        <button class="nav-button home" id="mobileHomeBtn" type="button">Inicio</button>
        <button class="nav-button section" id="mobileSectionBtn" type="button">${sectionLabel}</button>
        <button class="nav-button" id="mobileCloseBtn" type="button">Seguir jugando</button>
      </div>
    </details>
  `;
}

function globalSectionLabel() {
  if (state.modeLabel === 'Recorrido completo') return 'Volver al recorrido';
  if (state.screen === 'understandMenu' || state.afterFinish === renderUnderstandMenu) return 'Volver a Comprender';
  if (state.screen === 'tablesSetup' || state.afterFinish === renderTablesSetup || state.sectionLabel === 'Tablas' || state.sectionLabel === 'Practicar tablas') return 'Volver a Tablas';
  if (state.screen === 'pitMenu' || state.afterFinish === renderPitagoricaMenu || ['Tabla pitagórica', 'Relaciones', 'Verdadero o falso', 'Fragmentos'].includes(state.sectionLabel)) return 'Volver a Tabla pitagórica';
  return 'Volver a la sección';
}

function headerHTML(progress = 0) {
  if (state.screen === 'home') return '';
  const safeProgress = Math.max(0, Math.min(100, progress));
  const scoreHTML = state.exercises.length || state.screen === 'fragment' ? `<span class="chip green">Puntaje: ${state.score}</span>` : '';
  return `
    <div class="topbar">
      <div class="chips">
        ${state.modeLabel ? `<span class="chip orange">${state.modeLabel}</span>` : ''}
        ${state.sectionLabel ? `<span class="chip blue">${state.sectionLabel}</span>` : ''}
        ${state.exercises.length ? `<span class="chip">Desafío ${state.index + 1} de ${state.exercises.length}</span>` : ''}
      </div>
      <div class="top-actions">
        ${scoreHTML}
        ${globalNavHTML()}
      </div>
    </div>
    <div class="progress-wrap"><div class="progress-bar" style="width:${safeProgress}%"></div></div>
  `;
}

function setHTML(html) {
  app.className = `app ${state.screen === 'home' ? 'home-screen' : ''}`.trim();
  app.innerHTML = html;
  wireGlobalNav();
}

function wireGlobalNav() {
  app.querySelectorAll('#globalHomeBtn, #mobileHomeBtn').forEach(btn => {
    btn.addEventListener('click', renderHome);
  });
  app.querySelectorAll('#globalSectionBtn, #mobileSectionBtn').forEach(btn => {
    btn.addEventListener('click', goToCurrentSectionStart);
  });
  const closeBtn = app.querySelector('#mobileCloseBtn');
  if (closeBtn) closeBtn.addEventListener('click', () => {
    const menu = app.querySelector('.mobile-nav');
    if (menu) menu.removeAttribute('open');
  });
}

function goToCurrentSectionStart() {
  if (state.modeLabel === 'Recorrido completo') {
    if (state.game) showLevelTransition();
    else startFullGame();
    return;
  }
  if (state.afterFinish) {
    state.afterFinish();
    return;
  }
  if (state.screen === 'understandMenu') renderUnderstandMenu();
  else if (state.screen === 'tablesSetup' || state.sectionLabel === 'Tablas' || state.sectionLabel === 'Practicar tablas') renderTablesSetup();
  else if (state.screen === 'pitMenu' || ['Tabla pitagórica', 'Relaciones', 'Verdadero o falso', 'Fragmentos'].includes(state.sectionLabel)) renderPitagoricaMenu();
  else renderHome();
}

function renderHome() {
  state = { ...state, screen: 'home', modeLabel: '', sectionLabel: '', exercises: [], index: 0, score: 0, afterFinish: null, game: null, fragment: null };
  setHTML(`
    ${headerHTML(0)}
    <section class="card hero">
      <div>
        <h1>¿Suma o multiplicación?</h1>
        <p class="lead">Un juego para reconocer grupos iguales, practicar tablas y explorar relaciones en la tabla pitagórica.</p>
        <div class="menu-grid">
          <button class="menu-button" data-action="understandMenu">
            <strong>Comprender suma y multiplicación</strong>
            <span>Bolsas, caramelos, sumas repetidas y situaciones que se pueden o no se pueden resolver multiplicando.</span>
          </button>
          <button class="menu-button" data-action="tablesSetup">
            <strong>Practicar tablas</strong>
            <span>Elegí si querés responder escribiendo, con opciones o mezclado.</span>
          </button>
          <button class="menu-button" data-action="pitMenu">
            <strong>Tabla pitagórica</strong>
            <span>Relaciones entre tablas, “si sabés que…” y fragmentos para completar.</span>
          </button>
          <button class="menu-button" data-action="fullGame">
            <strong>Jugar recorrido completo</strong>
            <span>Un recorrido con varios niveles y desafíos aleatorios.</span>
          </button>
        </div>
      </div>
      <img class="hero-mascot" src="${mascot.correcto}" alt="Mascota del juego" />
    </section>
  `);
  app.querySelector('[data-action="understandMenu"]').addEventListener('click', renderUnderstandMenu);
  app.querySelector('[data-action="tablesSetup"]').addEventListener('click', renderTablesSetup);
  app.querySelector('[data-action="pitMenu"]').addEventListener('click', renderPitagoricaMenu);
  app.querySelector('[data-action="fullGame"]').addEventListener('click', startFullGame);
}

function renderUnderstandMenu() {
  state = { ...state, screen: 'understandMenu', modeLabel: 'Modo práctica', sectionLabel: 'Comprender', exercises: [], index: 0, score: 0, afterFinish: null, fragment: null };
  const items = Object.entries(understandLevels).map(([key, data]) => `
    <button class="menu-button" data-level="${key}">
      <strong>${data.label}</strong>
      <span>${data.intro}</span>
    </button>
  `).join('');
  setHTML(`
    ${headerHTML(0)}
    <section class="card">
      <h2>Comprender suma y multiplicación</h2>
      <p class="lead">Elegí una práctica. Cada práctica propone 10 desafíos al azar.</p>
      <div class="menu-grid">${items}</div>
      <div class="footer-row"><button class="ghost-button" data-action="home">Volver al inicio</button></div>
    </section>
  `);
  app.querySelector('[data-action="home"]').addEventListener('click', renderHome);
  app.querySelectorAll('[data-level]').forEach(btn => {
    btn.addEventListener('click', () => startUnderstandPractice(btn.dataset.level, 10));
  });
}

function startUnderstandPractice(levelKey, count = 10) {
  const bank = buildUnderstandBank(levelKey, 24);
  state = {
    ...state,
    screen: 'exercise',
    modeLabel: 'Modo práctica',
    sectionLabel: understandLevels[levelKey].label,
    exercises: sample(bank, count),
    index: 0,
    score: 0,
    afterFinish: renderUnderstandMenu,
    fragment: null
  };
  renderCurrentExercise();
}

function buildUnderstandBank(levelKey, targetCount = 24) {
  const bank = [];
  let guard = 0;
  while (bank.length < targetCount && guard < 300) {
    guard++;
    const groups = rand(2, 8);
    const amount = rand(2, 10);
    if (levelKey === 'iguales') {
      const equal = Math.random() < 0.55;
      const counts = equal ? Array(groups).fill(amount) : makeMixedCounts(groups, amount);
      bank.push(makeEqualGroupsExercise(counts));
    }
    if (levelKey === 'suma') {
      bank.push(makeRepeatedSumExercise(groups, amount));
    }
    if (levelKey === 'multiplicacion') {
      bank.push(makeMultiplicationSceneExercise(groups, amount));
    }
    if (levelKey === 'sumaOMultiplicacion') {
      const equal = Math.random() < 0.52;
      const counts = equal ? Array(groups).fill(amount) : makeMixedCounts(groups, amount);
      bank.push(makeSumOrMultiplicationExercise(counts));
    }
    if (levelKey === 'completar') {
      bank.push(makeCompleteExercise(groups, amount));
    }
  }
  return bank;
}

function makeMixedCounts(groups, base) {
  const counts = Array(groups).fill(base);
  const changes = rand(1, Math.max(1, Math.min(3, groups - 1)));
  const positions = sample([...Array(groups).keys()], changes);
  positions.forEach(pos => {
    let next = rand(1, 10);
    while (next === base) next = rand(1, 10);
    counts[pos] = next;
  });
  if (allEqual(counts)) counts[0] = base === 10 ? 9 : base + 1;
  return counts;
}

function makeEqualGroupsExercise(counts) {
  const isEqual = allEqual(counts);
  return {
    question: '¿Todas las bolsas tienen la misma cantidad de caramelos?',
    hint: 'Mirá si se repite la misma cantidad en cada bolsa.',
    visual: { type: 'bags', counts },
    response: {
      type: 'choice',
      heading: 'Elegí una respuesta',
      options: shuffle([
        {
          label: 'Sí',
          correct: isEqual,
          feedback: isEqual
            ? `Correcto. Todas las bolsas tienen ${counts[0]} caramelos.`
            : 'Revisá: hay al menos una bolsa con una cantidad diferente.'
        },
        {
          label: 'No',
          correct: !isEqual,
          feedback: !isEqual
            ? 'Correcto. No todas las bolsas tienen la misma cantidad.'
            : `Revisá: todas las bolsas tienen ${counts[0]} caramelos.`
        }
      ])
    }
  };
}

function makeRepeatedSumExercise(groups, amount) {
  const correct = repeatedAdd(amount, groups);
  const options = [];
  const used = new Set();

  pushUniqueOption(options, used, {
    label: correct,
    correct: true,
    feedback: `Bien. Hay ${groups} bolsas y cada una tiene ${amount}; por eso se suma ${amount}, ${groups} veces.`
  });

  const distractors = [
    {
      label: `${groups} + ${amount}`,
      feedback: `Eso solo suma los dos números que aparecen. Para representar las bolsas hay que sumar ${amount}, ${groups} veces.`
    },
    {
      label: repeatedAdd(groups, amount),
      feedback: `Esa suma repite ${groups}, pero en la imagen se repite ${amount}.`
    },
    {
      label: repeatedAdd(amount, 2),
      feedback: `Esa suma usa solo dos bolsas. En la imagen hay ${groups} bolsas.`
    },
    {
      label: repeatedAdd(amount, Math.max(2, groups - 1)),
      feedback: `Esa suma repite ${amount}, pero una vez menos de lo necesario. En la imagen hay ${groups} bolsas.`
    },
    {
      label: repeatedAdd(amount, groups + 1),
      feedback: `Esa suma repite ${amount}, pero una vez más de lo necesario. En la imagen hay ${groups} bolsas.`
    },
    {
      label: repeatedAdd(Math.max(1, amount - 1), groups),
      feedback: `Esa suma repite la cantidad de bolsas, pero cambia los caramelos de cada bolsa. En cada bolsa hay ${amount}.`
    },
    {
      label: repeatedAdd(Math.min(10, amount + 1), groups),
      feedback: `Esa suma repite la cantidad de bolsas, pero cambia los caramelos de cada bolsa. En cada bolsa hay ${amount}.`
    }
  ];

  shuffle(distractors).forEach(item => {
    if (options.length < 4) {
      pushUniqueOption(options, used, { label: item.label, correct: false, feedback: item.feedback });
    }
  });

  let safety = 0;
  while (options.length < 4 && safety < 30) {
    safety++;
    const altAmount = rand(1, 10);
    const altTimes = rand(2, 9);
    const label = repeatedAdd(altAmount, altTimes);
    pushUniqueOption(options, used, {
      label,
      correct: false,
      feedback: `Esa suma no representa esta imagen. La suma correcta repite ${amount}, ${groups} veces.`
    });
  }

  return {
    question: 'Elegí la suma que representa la imagen.',
    hint: 'La suma tiene que repetir la cantidad de caramelos que hay en cada bolsa.',
    visual: { type: 'bags', counts: Array(groups).fill(amount) },
    response: { type: 'choice', heading: 'Suma repetida', options: shuffle(options) }
  };
}

function makeMultiplicationSceneExercise(groups, amount) {
  const exact = mult(groups, amount);
  const commuted = mult(amount, groups);
  const options = [];
  const used = new Set();

  pushUniqueOption(options, used, {
    label: exact,
    correct: true,
    feedback: `Correcto. ${exact} representa ${groups} bolsas con ${amount} caramelos en cada una.`
  });

  if (commuted !== exact) {
    pushUniqueOption(options, used, {
      label: commuted,
      correct: true,
      nuanced: true,
      feedback: `Matemáticamente está bien: ${commuted} da el mismo resultado que ${exact}. Para representar esta imagen de manera más ajustada, conviene escribir ${exact}.`
    });
  }

  const distractors = [
    {
      label: mult(groups, Math.max(1, amount - 1)),
      feedback: `Revisá la cantidad de caramelos de cada bolsa. En cada una hay ${amount}.`
    },
    {
      label: mult(groups, Math.min(10, amount + 1)),
      feedback: `Revisá la cantidad de caramelos de cada bolsa. En cada una hay ${amount}.`
    },
    {
      label: mult(Math.max(1, groups - 1), amount),
      feedback: `Revisá la cantidad de bolsas. Hay ${groups} bolsas.`
    },
    {
      label: mult(Math.min(10, groups + 1), amount),
      feedback: `Revisá la cantidad de bolsas. Hay ${groups} bolsas.`
    },
    {
      label: `${groups} + ${amount}`,
      feedback: `Eso suma los dos números que aparecen, pero acá hay ${groups} grupos iguales de ${amount}.`
    }
  ];

  shuffle(distractors).forEach(item => {
    if (options.length < 4) {
      pushUniqueOption(options, used, { label: item.label, correct: false, feedback: item.feedback });
    }
  });

  let safety = 0;
  while (options.length < 4 && safety < 30) {
    safety++;
    const label = mult(rand(1, 10), rand(1, 10));
    pushUniqueOption(options, used, {
      label,
      correct: false,
      feedback: `Esa multiplicación no representa esta imagen. Hay ${groups} bolsas con ${amount} caramelos en cada una.`
    });
  }

  return {
    question: 'Elegí la multiplicación que representa mejor la imagen.',
    hint: 'Pensá: cantidad de bolsas × caramelos en cada bolsa.',
    visual: { type: 'bags', counts: Array(groups).fill(amount) },
    response: { type: 'choice', heading: 'Multiplicación', options: shuffle(options) }
  };
}

function makeSumOrMultiplicationExercise(counts) {
  const isEqual = allEqual(counts);
  const total = counts.reduce((a, b) => a + b, 0);
  return {
    question: '¿Suma o multiplicación?',
    hint: 'Si todas las bolsas tienen la misma cantidad, podés multiplicar. Si no, conviene sumar las cantidades.',
    visual: { type: 'bags', counts },
    response: {
      type: 'choice',
      heading: '¿Qué conviene usar?',
      options: shuffle([
        {
          label: 'Multiplicación',
          correct: isEqual,
          feedback: isEqual
            ? `Correcto. Hay ${counts.length} bolsas iguales de ${counts[0]} caramelos: ${mult(counts.length, counts[0])}.`
            : `No conviene una multiplicación directa porque las cantidades son distintas. En este caso se suma: ${counts.join(' + ')} = ${total}.`
        },
        {
          label: 'Suma',
          correct: !isEqual,
          feedback: !isEqual
            ? `Correcto. Como las cantidades son distintas, se suma: ${counts.join(' + ')} = ${total}.`
            : `Se podría sumar ${repeatedAdd(counts[0], counts.length)}, pero como todos los grupos son iguales también conviene multiplicar.`
        }
      ])
    }
  };
}

function makeCompleteExercise(groups, amount) {
  const product = groups * amount;
  const missingAmount = Math.random() < 0.5;
  const equation = missingAmount ? `${groups} × ___ = ${product}` : `___ × ${amount} = ${product}`;
  const visualText = missingAmount ? `${groups} × ___` : `___ × ${amount}`;
  const answer = missingAmount ? amount : groups;
  return {
    question: 'Completá el factor que falta.',
    hint: equation,
    visual: { type: 'equation', text: visualText, note: 'No aparece la respuesta: usá la tabla o una relación que conozcas.' },
    response: {
      type: 'choice',
      heading: 'Elegí el número que falta',
      options: numberOptions(answer, { a: groups, b: amount }).map(value => ({
        label: String(value),
        correct: value === answer,
        feedback: value === answer
          ? `Correcto. ${equation.replace('___', answer)}.`
          : `Revisá: el número que falta es ${answer}, porque ${groups} × ${amount} = ${product}.`
      }))
    }
  };
}

function numberOptions(correct, context = {}) {
  const set = new Set([correct]);
  const a = context.a || rand(2, 10);
  const b = context.b || rand(1, 10);
  const candidates = [
    correct + 1,
    correct - 1,
    a,
    b,
    a + 1,
    b + 1,
    Math.max(1, correct + 2),
    Math.max(1, correct - 2),
    rand(1, 10)
  ];
  shuffle(candidates).forEach(v => {
    if (set.size < 4 && v > 0 && v <= 100) set.add(v);
  });
  while (set.size < 4) {
    const v = rand(1, Math.max(12, correct + 5));
    if (v > 0) set.add(v);
  }
  return shuffle([...set]);
}

function productOptions(correct, a, b) {
  const set = new Set([correct]);
  const candidates = [
    a * Math.max(1, b - 1),
    a * Math.min(10, b + 1),
    Math.max(1, a - 1) * b,
    Math.min(10, a + 1) * b,
    correct + a,
    correct - a,
    correct + b,
    correct - b,
    rand(2, 10) * rand(1, 10)
  ];
  shuffle(candidates).forEach(v => {
    if (set.size < 4 && v > 0 && v <= 100 && v !== correct) set.add(v);
  });
  while (set.size < 4) {
    const v = rand(2, 10) * rand(1, 10);
    if (v !== correct) set.add(v);
  }
  return shuffle([...set]);
}

function renderVisual(visual) {
  if (!visual) return '';
  if (visual.type === 'bags') {
    const manyClass = visual.counts.length > 5 ? 'many' : '';
    const imgs = visual.counts.map(count => `<img class="bag-img" src="${bagSrc(count)}" alt="Bolsa con ${count} caramelos" />`).join('');
    return `<div class="scene-panel"><div class="bag-row ${manyClass}">${imgs}</div></div>`;
  }
  if (visual.type === 'equation' || visual.type === 'vf') {
    const extraClass = visual.type === 'vf' ? ' vf-panel' : '';
    return `<div class="scene-panel${extraClass}"><div class="equation-card"><div class="big-equation">${visual.text}</div>${visual.note ? `<p class="visual-note">${visual.note}</p>` : ''}</div></div>`;
  }
  if (visual.type === 'relation') {
    return `
      <div class="scene-panel">
        <div class="equation-card">
          <div class="big-equation medium">${visual.known}</div>
          <p class="visual-note">${visual.note || 'Usá la relación entre los cálculos.'}</p>
          <div class="big-equation medium">${visual.ask}</div>
        </div>
      </div>
    `;
  }
  return '';
}

function renderCurrentExercise() {
  const ex = state.exercises[state.index];
  if (!ex) return renderFinish();
  if (ex.kind === 'fragment') return renderFragmentExercise(ex);
  const progress = state.exercises.length ? (state.index / state.exercises.length) * 100 : 0;
  const sectionClasses = ['screen-grid', 'exercise-screen'];
  if (ex.visual && ex.visual.type) sectionClasses.push(`visual-${ex.visual.type}`);
  if (ex.response?.type === 'choice' && ex.response.options?.some(opt => opt.label === 'Verdadero') && ex.response.options?.some(opt => opt.label === 'Falso')) sectionClasses.push('true-false-screen');
  setHTML(`
    ${headerHTML(progress)}
    <section class="${sectionClasses.join(' ')}">
      <div class="card soft">
        <h2 class="question-title">${ex.question}</h2>
        ${ex.hint ? `<p class="question-hint">${ex.hint}</p>` : ''}
        ${renderVisual(ex.visual)}
      </div>
      <div class="card options-panel">
        <h3>${ex.response.heading || 'Respuesta'}</h3>
        ${renderResponse(ex)}
        <div id="feedbackSlot"></div>
      </div>
    </section>
  `);
  wireResponse(ex);
}

function renderResponse(ex) {
  if (ex.response.type === 'choice') {
    return `<div class="options-list">${ex.response.options.map((opt, i) => `
      <button class="option-button" data-option="${i}">${opt.label}</button>
    `).join('')}</div>`;
  }
  if (ex.response.type === 'input') {
    return `
      <div class="input-row">
        <input class="answer-input" id="answerInput" inputmode="numeric" type="number" autocomplete="off" placeholder="Escribí el número" />
        <button class="primary-button" id="sendAnswer">Responder</button>
      </div>
    `;
  }
  return '';
}

function wireResponse(ex) {
  if (ex.response.type === 'choice') {
    app.querySelectorAll('[data-option]').forEach(btn => {
      btn.addEventListener('click', () => {
        const opt = ex.response.options[Number(btn.dataset.option)];
        const matchingCorrect = ex.response.options.some(candidate => candidate.correct && String(candidate.label) === String(opt.label));
        const ok = Boolean(opt.correct || matchingCorrect);
        if (ok) state.score++;
        app.querySelectorAll('[data-option]').forEach((b, i) => {
          const candidate = ex.response.options[i];
          b.disabled = true;
          if (candidate.correct || ex.response.options.some(correctOpt => correctOpt.correct && String(correctOpt.label) === String(candidate.label))) b.classList.add('correct');
        });
        if (!ok) btn.classList.add('wrong');
        showFeedback(ok, opt.feedback || (ok ? 'Correcto.' : 'Revisá la respuesta.'));
      });
    });
  }
  if (ex.response.type === 'input') {
    const input = app.querySelector('#answerInput');
    const send = app.querySelector('#sendAnswer');
    const submit = () => {
      const raw = input.value.trim();
      if (!raw) return;
      const value = Number(raw);
      const ok = value === ex.response.answer;
      if (ok) state.score++;
      input.disabled = true;
      send.disabled = true;
      const text = ok ? ex.response.correctFeedback : ex.response.wrongFeedback;
      showFeedback(ok, text);
    };
    send.addEventListener('click', submit);
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') submit();
    });
    input.focus();
  }
}

function showFeedback(ok, text) {
  const slot = app.querySelector('#feedbackSlot');
  if (!slot) return;
  slot.innerHTML = `
    <div class="feedback ${ok ? 'good' : 'bad'}">
      <img src="${ok ? mascot.correcto : mascot.duda}" alt="${ok ? 'Correcto' : 'Para revisar'}" />
      <div>
        <strong>${ok ? '¡Bien!' : 'Revisemos'}</strong>
        <p>${text}</p>
        <div class="footer-row"><button class="primary-button" id="nextExercise">Siguiente</button></div>
      </div>
    </div>
  `;
  app.querySelector('#nextExercise').addEventListener('click', nextExercise);
  if (window.matchMedia('(max-width: 720px)').matches) {
    slot.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
}

function nextExercise() {
  state.index++;
  if (state.index >= state.exercises.length) renderFinish();
  else renderCurrentExercise();
}

function renderFinish() {
  const total = state.sectionLabel === 'Fragmentos'
    ? state.exercises.reduce((acc, ex) => acc + (ex.blanks ? ex.blanks.length : 0), 0)
    : (state.exercises.length || 1);
  const percent = Math.round((state.score / Math.max(1, total)) * 100);

  if (state.modeLabel === 'Recorrido completo') {
    setHTML(`
      ${headerHTML(100)}
      <section class="notice-card">
        <div>
          <h2>Nivel terminado</h2>
          <p class="lead">Puntaje de este nivel: ${state.score} de ${state.exercises.length}.</p>
          <div class="footer-row">
            <button class="primary-button" id="continueBtn">Continuar recorrido</button>
            <button class="ghost-button" id="homeBtn">Inicio</button>
          </div>
        </div>
        <img src="${percent >= 70 ? mascot.correcto : mascot.pensando}" alt="Mascota" />
      </section>
    `);
    app.querySelector('#continueBtn').addEventListener('click', () => state.afterFinish ? state.afterFinish() : renderHome());
    app.querySelector('#homeBtn').addEventListener('click', renderHome);
    return;
  }

  const label = state.sectionLabel === 'Fragmentos' ? 'casilleros correctos' : `${total}`;
  const scoreText = state.sectionLabel === 'Fragmentos'
    ? `Puntaje: ${state.score} ${state.score === 1 ? 'casillero correcto' : 'casilleros correctos'} de ${total}.`
    : `Puntaje: ${state.score} de ${total}.`;

  setHTML(`
    ${headerHTML(100)}
    <section class="notice-card">
      <div>
        <h2>Práctica terminada</h2>
        <p class="lead">${scoreText} ${percent >= 80 ? 'Muy buen trabajo.' : 'Podés volver a practicar para seguir mejorando.'}</p>
        <div class="footer-row">
          <button class="primary-button" id="repeatBtn">Repetir</button>
          <button class="ghost-button" id="menuBtn">Volver</button>
          <button class="ghost-button" id="homeBtn">Inicio</button>
        </div>
      </div>
      <img src="${percent >= 80 ? mascot.correcto : mascot.pensando}" alt="Mascota" />
    </section>
  `);
  app.querySelector('#homeBtn').addEventListener('click', renderHome);
  app.querySelector('#menuBtn').addEventListener('click', () => state.afterFinish ? state.afterFinish() : renderHome());
  app.querySelector('#repeatBtn').addEventListener('click', () => {
    const oldSection = state.sectionLabel;
    if (oldSection === 'Practicar tablas') renderTablesSetup();
    else if (oldSection === 'Relaciones') startPitagoricaRelations(10);
    else if (oldSection === 'Verdadero o falso') startTrueFalse(10);
    else if (oldSection === 'Fragmentos') startFragments(5);
    else renderUnderstandMenu();
  });
}

function renderTablesSetup() {
  state = { ...state, screen: 'tablesSetup', modeLabel: 'Modo práctica', sectionLabel: 'Tablas', exercises: [], index: 0, score: 0, afterFinish: null, fragment: null };
  setHTML(`
    ${headerHTML(0)}
    <section class="card hero">
      <div>
        <h2>Practicar tablas</h2>
        <p class="lead">Configurá la práctica. Después aparecen multiplicaciones al azar de las tablas que elijas.</p>
      </div>
      <img class="hero-mascot" src="${mascot.correcto}" alt="Mascota" />
    </section>
    <section class="setup-grid" style="margin-top:20px;">
      <div class="setup-block">
        <h3>¿Cómo querés responder?</h3>
        <div class="choice-row" id="modeGroup">
          <button class="small-button selected" data-mode="write">Escribiendo</button>
          <button class="small-button" data-mode="choice">Eligiendo opciones</button>
          <button class="small-button" data-mode="mixed">Mezclado</button>
        </div>
      </div>
      <div class="setup-block">
        <h3>¿Cuántas multiplicaciones querés responder?</h3>
        <div class="choice-row" id="countGroup">
          <button class="small-button selected" data-count="10">10</button>
          <button class="small-button" data-count="15">15</button>
          <button class="small-button" data-count="20">20</button>
        </div>
      </div>
      <div class="setup-block" style="grid-column:1/-1;">
        <h3>¿Qué tablas querés practicar?</h3>
        <div class="choice-row" id="tablesPresetGroup">
          <button class="small-button selected" data-preset="all">Todas</button>
          <button class="small-button" data-preset="low">Del 2 al 5</button>
          <button class="small-button" data-preset="high">Del 6 al 10</button>
          <button class="small-button" data-preset="custom">Elegir tablas</button>
        </div>
        <div class="checkbox-grid hidden" id="customTables">
          ${[2,3,4,5,6,7,8,9,10].map(n => `<label class="table-check"><input type="checkbox" value="${n}" checked />${n}</label>`).join('')}
        </div>
      </div>
    </section>
    <div class="footer-row">
      <button class="ghost-button" id="homeBtn">Volver al inicio</button>
      <button class="primary-button" id="startTablesBtn">Empezar práctica</button>
    </div>
  `);

  let responseMode = 'write';
  let amount = 10;
  let preset = 'all';

  function selectButton(groupSelector, attr, value) {
    app.querySelectorAll(`${groupSelector} [data-${attr}]`).forEach(btn => {
      btn.classList.toggle('selected', btn.dataset[attr] === String(value));
    });
  }

  app.querySelectorAll('[data-mode]').forEach(btn => btn.addEventListener('click', () => {
    responseMode = btn.dataset.mode;
    selectButton('#modeGroup', 'mode', responseMode);
  }));
  app.querySelectorAll('[data-count]').forEach(btn => btn.addEventListener('click', () => {
    amount = Number(btn.dataset.count);
    selectButton('#countGroup', 'count', amount);
  }));
  app.querySelectorAll('[data-preset]').forEach(btn => btn.addEventListener('click', () => {
    preset = btn.dataset.preset;
    selectButton('#tablesPresetGroup', 'preset', preset);
    app.querySelector('#customTables').classList.toggle('hidden', preset !== 'custom');
  }));
  app.querySelector('#homeBtn').addEventListener('click', renderHome);
  app.querySelector('#startTablesBtn').addEventListener('click', () => {
    const tables = selectedTables(preset);
    if (!tables.length) return;
    startPureTables(responseMode, amount, tables);
  });
}

function selectedTables(preset) {
  if (preset === 'low') return [2,3,4,5];
  if (preset === 'high') return [6,7,8,9,10];
  if (preset === 'custom') {
    return [...app.querySelectorAll('#customTables input:checked')].map(input => Number(input.value));
  }
  return [2,3,4,5,6,7,8,9,10];
}

function startPureTables(responseMode, count, tables) {
  const exercises = [];
  for (let i = 0; i < count; i++) {
    const a = choice(tables);
    const b = rand(1, 10);
    const mode = responseMode === 'mixed' ? choice(['write', 'choice']) : responseMode;
    exercises.push(makePureTableExercise(a, b, mode));
  }
  state = {
    ...state,
    screen: 'exercise',
    modeLabel: 'Modo práctica',
    sectionLabel: 'Practicar tablas',
    exercises,
    index: 0,
    score: 0,
    afterFinish: renderTablesSetup,
    fragment: null
  };
  renderCurrentExercise();
}

function makePureTableExercise(a, b, mode) {
  const answer = a * b;
  const base = {
    question: 'Resolvé la multiplicación.',
    hint: 'Podés usar una tabla que ya conozcas, dobles o descomposiciones.',
    visual: { type: 'equation', text: `${a} × ${b} = ___`, note: 'Escribí o elegí el resultado.' }
  };
  if (mode === 'write') {
    return {
      ...base,
      response: {
        type: 'input',
        heading: 'Escribí el resultado',
        answer,
        correctFeedback: `Correcto. ${a} × ${b} = ${answer}.`,
        wrongFeedback: `No era ese resultado. ${a} × ${b} = ${answer}. ${strategyHint(a, b)}`
      }
    };
  }
  return {
    ...base,
    response: {
      type: 'choice',
      heading: 'Elegí el resultado',
      options: productOptions(answer, a, b).map(value => ({
        label: String(value),
        correct: value === answer,
        feedback: value === answer
          ? `Correcto. ${a} × ${b} = ${answer}.`
          : `No era ${value}. ${a} × ${b} = ${answer}. ${strategyHint(a, b)}`
      }))
    }
  };
}

function strategyHint(a, b) {
  if (a === 10 || b === 10) return 'La tabla del 10 termina en cero.';
  if (a === 5 || b === 5) return 'La tabla del 5 puede pensarse como la mitad de la tabla del 10.';
  if (a % 2 === 0 && a / 2 >= 2) return `Podés pensar ${a} × ${b} como el doble de ${a / 2} × ${b}.`;
  if (b % 2 === 0 && b / 2 >= 2) return `Podés pensar ${a} × ${b} como el doble de ${a} × ${b / 2}.`;
  if (a > 5) return `También podés separar ${a} en 5 + ${a - 5}.`;
  return 'Podés apoyarte en una suma repetida o en una tabla cercana.';
}

function renderPitagoricaMenu() {
  state = { ...state, screen: 'pitMenu', modeLabel: 'Modo práctica', sectionLabel: 'Tabla pitagórica', exercises: [], index: 0, score: 0, afterFinish: null, fragment: null };
  setHTML(`
    ${headerHTML(0)}
    <section class="card">
      <h2>Tabla pitagórica</h2>
      <p class="lead">Practicá relaciones entre tablas y completá fragmentos de la tabla pitagórica.</p>
      <div class="menu-grid">
        <button class="menu-button" id="relBtn"><strong>Si sabés que...</strong><span>Usar dobles, mitades, conmutativa y un grupo más.</span></button>
        <button class="menu-button" id="fragBtn"><strong>Completar fragmentos</strong><span>Completar partes de la tabla pitagórica con casilleros vacíos.</span></button>
        <button class="menu-button" id="vfBtn"><strong>Verdadero o falso</strong><span>Decidir si una relación entre tablas es verdadera o falsa.</span></button>
        <button class="menu-button" id="mixedPitBtn"><strong>Práctica mixta</strong><span>Combina relaciones y verdadero/falso.</span></button>
      </div>
      <div class="footer-row"><button class="ghost-button" id="homeBtn">Volver al inicio</button></div>
    </section>
  `);
  app.querySelector('#homeBtn').addEventListener('click', renderHome);
  app.querySelector('#relBtn').addEventListener('click', () => startPitagoricaRelations(10));
  app.querySelector('#fragBtn').addEventListener('click', () => startFragments(5));
  app.querySelector('#vfBtn').addEventListener('click', () => startTrueFalse(10));
  app.querySelector('#mixedPitBtn').addEventListener('click', () => startPitagoricaMixed(10));
}

function startPitagoricaRelations(count) {
  const exercises = Array.from({ length: count }, () => makeRelationExercise());
  state = { ...state, screen: 'exercise', modeLabel: 'Modo práctica', sectionLabel: 'Relaciones', exercises, index: 0, score: 0, afterFinish: renderPitagoricaMenu, fragment: null };
  renderCurrentExercise();
}

function startPitagoricaMixed(count) {
  const exercises = Array.from({ length: count }, () => Math.random() < 0.65 ? makeRelationExercise() : makeTrueFalseExercise());
  state = { ...state, screen: 'exercise', modeLabel: 'Modo práctica', sectionLabel: 'Tabla pitagórica', exercises, index: 0, score: 0, afterFinish: renderPitagoricaMenu, fragment: null };
  renderCurrentExercise();
}

function makeRelationExercise() {
  const type = choice(['doubleA', 'doubleB', 'halfA', 'commutative', 'oneMore', 'sumTables']);
  let a, b, c, known, ask, answer, note, explanation;

  if (type === 'doubleA') {
    a = choice([2,3,4,5]); b = rand(2, 10);
    answer = (a * 2) * b;
    known = `${mult(a, b)} = ${a * b}`;
    ask = `${mult(a * 2, b)} = ___`;
    note = `La primera tabla se duplica: ${a} pasa a ${a * 2}.`;
    explanation = `${mult(a * 2, b)} es el doble de ${mult(a, b)}. Entonces ${a * b} × 2 = ${answer}.`;
  } else if (type === 'doubleB') {
    a = rand(2, 10); b = choice([2,3,4,5]);
    answer = a * (b * 2);
    known = `${mult(a, b)} = ${a * b}`;
    ask = `${mult(a, b * 2)} = ___`;
    note = `El segundo factor se duplica: ${b} pasa a ${b * 2}.`;
    explanation = `${mult(a, b * 2)} es el doble de ${mult(a, b)}. Entonces ${a * b} × 2 = ${answer}.`;
  } else if (type === 'halfA') {
    a = choice([4,6,8,10]); b = rand(2, 10);
    answer = (a / 2) * b;
    known = `${mult(a, b)} = ${a * b}`;
    ask = `${mult(a / 2, b)} = ___`;
    note = `La tabla buscada es la mitad de la conocida.`;
    explanation = `${mult(a / 2, b)} es la mitad de ${mult(a, b)}. Entonces ${a * b} ÷ 2 = ${answer}.`;
  } else if (type === 'commutative') {
    a = rand(2, 10); b = rand(2, 10);
    while (a === b) b = rand(2, 10);
    answer = a * b;
    known = `${mult(a, b)} = ${answer}`;
    ask = `${mult(b, a)} = ___`;
    note = `Cambia el orden de los factores.`;
    explanation = `${mult(a, b)} y ${mult(b, a)} dan el mismo resultado, aunque pueden representar situaciones distintas.`;
  } else if (type === 'oneMore') {
    a = rand(2, 9); b = rand(2, 10);
    answer = (a + 1) * b;
    known = `${mult(a, b)} = ${a * b}`;
    ask = `${mult(a + 1, b)} = ___`;
    note = `Se agrega un grupo más de ${b}.`;
    explanation = `Si agregás un grupo más de ${b}, sumás ${b}: ${a * b} + ${b} = ${answer}.`;
  } else {
    a = rand(2, 5); c = rand(1, 4);
    if (a + c > 10) c = 10 - a;
    b = rand(2, 10);
    answer = (a + c) * b;
    known = `${mult(a, b)} = ${a * b}  y  ${mult(c, b)} = ${c * b}`;
    ask = `${mult(a + c, b)} = ___`;
    note = `Se pueden sumar dos tablas para formar otra.`;
    explanation = `${mult(a + c, b)} puede pensarse como ${mult(a, b)} + ${mult(c, b)}: ${a * b} + ${c * b} = ${answer}.`;
  }

  return {
    question: `Si sabés que ${known}, ¿cuánto es ${ask.replace(' = ___', '')}?`,
    hint: 'Usá la relación entre los cálculos, sin empezar de cero.',
    visual: { type: 'relation', known, ask, note },
    response: {
      type: 'input',
      heading: 'Escribí el resultado',
      answer,
      correctFeedback: `Correcto. ${ask.replace('___', answer)}. ${explanation}`,
      wrongFeedback: `La respuesta correcta es ${answer}. ${explanation}`
    }
  };
}

function startTrueFalse(count) {
  const exercises = Array.from({ length: count }, () => makeTrueFalseExercise());
  state = { ...state, screen: 'exercise', modeLabel: 'Modo práctica', sectionLabel: 'Verdadero o falso', exercises, index: 0, score: 0, afterFinish: renderPitagoricaMenu, fragment: null };
  renderCurrentExercise();
}

function makeTrueFalseExercise() {
  const type = choice(['comm', 'half10', 'double', 'sumColumns', 'falseDouble']);
  let statement, truth, explanation;
  if (type === 'comm') {
    const a = rand(2,10), b = rand(2,10);
    statement = `Para saber el resultado de ${mult(a, b)}, se puede buscar el resultado de ${mult(b, a)}.`;
    truth = true;
    explanation = `Verdadero. ${mult(a, b)} y ${mult(b, a)} dan el mismo resultado.`;
  } else if (type === 'half10') {
    const n = rand(1,10);
    statement = `El resultado de ${mult(5, n)} es la mitad del resultado de ${mult(10, n)}.`;
    truth = true;
    explanation = `Verdadero. ${mult(10, n)} = ${10*n} y ${mult(5, n)} = ${5*n}. ${5*n} es la mitad de ${10*n}.`;
  } else if (type === 'double') {
    const a = choice([2,3,4,5]), n = rand(1,10);
    statement = `El resultado de ${mult(a * 2, n)} es el doble del resultado de ${mult(a, n)}.`;
    truth = true;
    explanation = `Verdadero. ${mult(a, n)} = ${a*n}; el doble es ${a*n*2}, que coincide con ${mult(a*2, n)}.`;
  } else if (type === 'sumColumns') {
    const a = rand(1,4), c = rand(1,5), n = rand(1,10);
    statement = `Si se suma el resultado de ${mult(a, n)} con el de ${mult(c, n)}, se obtiene el resultado de ${mult(a + c, n)}.`;
    truth = true;
    explanation = `Verdadero. ${a*n} + ${c*n} = ${(a+c)*n}.`;
  } else {
    const n = rand(1,10);
    statement = `El resultado de ${mult(8, n)} es el doble del resultado de ${mult(2, n)}.`;
    truth = false;
    explanation = `Falso. ${mult(8, n)} = ${8*n} y ${mult(2, n)} = ${2*n}. ${8*n} es cuatro veces ${2*n}, no el doble.`;
  }
  return {
    question: '¿Verdadero o falso?',
    hint: statement,
    visual: { type: 'vf', text: 'V o F', note: 'Pensá si la afirmación se cumple en la tabla pitagórica.' },
    response: {
      type: 'choice',
      heading: 'Elegí una opción',
      options: shuffle([
        { label: 'Verdadero', correct: truth, feedback: explanation },
        { label: 'Falso', correct: !truth, feedback: explanation }
      ])
    }
  };
}

function startFragments(count) {
  const exercises = Array.from({ length: count }, () => makeFragmentExercise());
  state = { ...state, screen: 'fragment', modeLabel: 'Modo práctica', sectionLabel: 'Fragmentos', exercises, index: 0, score: 0, afterFinish: renderPitagoricaMenu, fragment: null };
  renderCurrentExercise();
}

function makeFragmentExercise() {
  const size = Math.random() < 0.55 ? 3 : 4;
  const maxStart = 10 - size + 1;
  const rowStart = rand(2, maxStart);
  const colStart = rand(2, maxStart);
  const rows = Array.from({ length: size }, (_, i) => rowStart + i);
  const cols = Array.from({ length: size }, (_, i) => colStart + i);
  const allCells = [];
  rows.forEach(r => cols.forEach(c => allCells.push(`${r}-${c}`)));
  const blankCount = size === 3 ? rand(4, 5) : rand(6, 8);
  const blanks = new Set(sample(allCells, blankCount));
  return { kind: 'fragment', rows, cols, blanks: [...blanks], attempts: {}, filled: {}, selected: null };
}

function renderFragmentExercise(ex) {
  const progress = state.exercises.length ? (state.index / state.exercises.length) * 100 : 0;
  state.fragment = ex;
  const tableHTML = `
    <div class="pit-table-wrap">
      <table class="pit-table" aria-label="Fragmento de tabla pitagórica">
        <thead><tr><th>×</th>${ex.cols.map(c => `<th>${c}</th>`).join('')}</tr></thead>
        <tbody>
          ${ex.rows.map(r => `<tr><th>${r}</th>${ex.cols.map(c => renderFragmentCell(ex, r, c)).join('')}</tr>`).join('')}
        </tbody>
      </table>
    </div>
  `;
  setHTML(`
    ${headerHTML(progress)}
    <section class="screen-grid">
      <div class="card soft">
        <h2 class="question-title">Completá el fragmento.</h2>
        <p class="question-hint">Tocá un casillero vacío y elegí el resultado correcto.</p>
        <div class="scene-panel">${tableHTML}</div>
      </div>
      <div class="card options-panel">
        <h3>Tabla pitagórica</h3>
        <div id="fragmentSide">
          <p class="lead">Elegí un casillero vacío para empezar.</p>
        </div>
        <div id="feedbackSlot"></div>
      </div>
    </section>
  `);
  wireFragmentCells(ex);
}

function renderFragmentCell(ex, r, c) {
  const key = `${r}-${c}`;
  const isBlank = ex.blanks.includes(key);
  if (!isBlank) return `<td class="known-cell">${r * c}</td>`;
  if (ex.filled[key]) return `<td class="blank-cell filled">${r * c}</td>`;
  const selected = ex.selected === key ? 'selected' : '';
  return `<td class="blank-cell ${selected}" data-frag-cell="${key}">___</td>`;
}

function wireFragmentCells(ex) {
  app.querySelectorAll('[data-frag-cell]').forEach(cell => {
    cell.addEventListener('click', () => {
      ex.selected = cell.dataset.fragCell;
      renderFragmentQuestion(ex);
      app.querySelectorAll('[data-frag-cell]').forEach(c => c.classList.toggle('selected', c.dataset.fragCell === ex.selected));
    });
  });
}

function renderFragmentQuestion(ex) {
  const [r, c] = ex.selected.split('-').map(Number);
  const answer = r * c;
  const side = app.querySelector('#fragmentSide');
  side.innerHTML = `
    <p class="lead">Casillero: <strong>${mult(r, c)}</strong></p>
    <div class="fragment-options">
      ${productOptions(answer, r, c).map(value => `<button class="option-button" data-frag-option="${value}">${value}</button>`).join('')}
    </div>
  `;
  app.querySelectorAll('[data-frag-option]').forEach(btn => {
    btn.addEventListener('click', () => {
      const value = Number(btn.dataset.fragOption);
      const key = ex.selected;
      const ok = value === answer;
      ex.attempts[key] = (ex.attempts[key] || 0) + 1;
      if (ok) {
        if (ex.attempts[key] === 1) state.score++;
        ex.filled[key] = true;
        showMiniFeedback(true, `Correcto. ${mult(r, c)} = ${answer}.`);
        if (Object.keys(ex.filled).length === ex.blanks.length) {
          renderFragmentComplete(ex);
        } else {
          setTimeout(() => renderFragmentExercise(ex), 650);
        }
      } else {
        showMiniFeedback(false, `Revisá ese casillero. ${value} no corresponde a ${mult(r, c)}.`);
      }
    });
  });
}

function showMiniFeedback(ok, text) {
  const slot = app.querySelector('#feedbackSlot');
  slot.innerHTML = `
    <div class="feedback ${ok ? 'good' : 'bad'}">
      <img src="${ok ? mascot.correcto : mascot.duda}" alt="${ok ? 'Correcto' : 'Para revisar'}" />
      <div><strong>${ok ? '¡Bien!' : 'Revisemos'}</strong><p>${text}</p></div>
    </div>
  `;
  if (window.matchMedia('(max-width: 720px)').matches) {
    slot.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
}

function renderFragmentComplete(ex) {
  const side = app.querySelector('#fragmentSide');
  side.innerHTML = `
    <div class="feedback good">
      <img src="${mascot.correcto}" alt="Correcto" />
      <div>
        <strong>Fragmento completo</strong>
        <p>Completaste todos los casilleros vacíos de este fragmento.</p>
        <div class="footer-row"><button class="primary-button" id="nextFragment">Siguiente</button></div>
      </div>
    </div>
  `;
  app.querySelector('#feedbackSlot').innerHTML = '';
  app.querySelector('#nextFragment').addEventListener('click', nextExercise);
}

function startFullGame() {
  state.game = {
    levels: [
      { key: 'iguales', label: 'Nivel 1: Grupos iguales', intro: 'Primero miramos si los grupos tienen la misma cantidad.' },
      { key: 'suma', label: 'Nivel 2: Suma repetida', intro: 'Ahora relacionamos las imágenes con sumas repetidas.' },
      { key: 'multiplicacion', label: 'Nivel 3: Multiplicación con dibujos', intro: 'Pasamos de los grupos iguales a la multiplicación.' },
      { key: 'sumaOMultiplicacion', label: 'Nivel 4: ¿Suma o multiplicación?', intro: 'Decidimos si conviene sumar o multiplicar.' },
      { key: 'tables', label: 'Nivel 5: Tablas', intro: 'Practicamos resultados de multiplicaciones.' },
      { key: 'pit', label: 'Nivel 6: Tabla pitagórica', intro: 'Usamos relaciones entre cálculos para no empezar de cero.' }
    ],
    levelIndex: 0,
    totalScore: 0,
    totalQuestions: 0
  };
  showLevelTransition();
}

function showLevelTransition() {
  const game = state.game;
  const level = game.levels[game.levelIndex];
  if (!level) return renderFullGameFinish();
  state = { ...state, screen: 'transition', modeLabel: 'Recorrido completo', sectionLabel: level.label, exercises: [], index: 0, score: game.totalScore, afterFinish: null, fragment: null };
  const progress = (game.levelIndex / game.levels.length) * 100;
  setHTML(`
    ${headerHTML(progress)}
    <section class="notice-card">
      <div>
        <h2>${level.label}</h2>
        <p class="lead">${level.intro}</p>
        <button class="primary-button" id="startLevelBtn">Empezar nivel</button>
      </div>
      <img src="${mascot.pensando}" alt="Mascota pensando" />
    </section>
  `);
  app.querySelector('#startLevelBtn').addEventListener('click', startCurrentGameLevel);
}

function startCurrentGameLevel() {
  const game = state.game;
  const level = game.levels[game.levelIndex];
  let exercises;
  if (level.key === 'tables') {
    exercises = Array.from({ length: 8 }, () => makePureTableExercise(rand(2, 10), rand(1, 10), choice(['write', 'choice'])));
  } else if (level.key === 'pit') {
    exercises = Array.from({ length: 8 }, () => makeRelationExercise());
  } else {
    exercises = sample(buildUnderstandBank(level.key, 24), 8);
  }
  state = {
    ...state,
    screen: 'exercise',
    modeLabel: 'Recorrido completo',
    sectionLabel: level.label,
    exercises,
    index: 0,
    score: 0,
    afterFinish: finishGameLevel,
    fragment: null
  };
  renderCurrentExercise();
}

function finishGameLevel() {
  const game = state.game;
  game.totalScore += state.score;
  game.totalQuestions += state.exercises.length;
  game.levelIndex++;
  showLevelTransition();
}

function renderFullGameFinish() {
  const game = state.game;
  const percent = game.totalQuestions ? Math.round((game.totalScore / game.totalQuestions) * 100) : 0;
  state = { ...state, modeLabel: 'Recorrido completo', sectionLabel: 'Final', exercises: [], index: 0, score: game.totalScore };
  setHTML(`
    ${headerHTML(100)}
    <section class="notice-card">
      <div>
        <h2>Recorrido terminado</h2>
        <p class="lead">Puntaje total: ${game.totalScore} de ${game.totalQuestions}. ${percent >= 80 ? 'Excelente recorrido.' : 'Podés volver a jugar: los desafíos aparecerán en otro orden.'}</p>
        <div class="footer-row">
          <button class="primary-button" id="againBtn">Jugar otra vez</button>
          <button class="ghost-button" id="homeBtn">Inicio</button>
        </div>
      </div>
      <img src="${percent >= 80 ? mascot.correcto : mascot.pensando}" alt="Mascota" />
    </section>
  `);
  app.querySelector('#againBtn').addEventListener('click', startFullGame);
  app.querySelector('#homeBtn').addEventListener('click', renderHome);
}

renderHome();
