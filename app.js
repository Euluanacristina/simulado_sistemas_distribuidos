const STORAGE_KEY = "simulados-software-v1";
const ROUND_KEY = "simulados-software-active-round";
const app = document.querySelector("#app");
const themeToggle = document.querySelector("#themeToggle");

const state = {
  subjectId: null,
  view: "home",
  round: null,
  data: loadStore()
};

function loadStore() {
  const initial = {
    version: STUDY_DATA.version,
    theme: null,
    stats: {},
    rounds: []
  };
  try {
    return { ...initial, ...(JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}) };
  } catch {
    return initial;
  }
}

function saveStore() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.data));
}

function saveRound() {
  if (state.round) localStorage.setItem(ROUND_KEY, JSON.stringify(state.round));
  else localStorage.removeItem(ROUND_KEY);
}

function initTheme() {
  const preferred = state.data.theme || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
  document.documentElement.dataset.theme = preferred;
}

function toggleTheme() {
  const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  document.documentElement.dataset.theme = next;
  state.data.theme = next;
  saveStore();
}

function byId(id) {
  return document.getElementById(id);
}

function getSubject(id = state.subjectId) {
  return STUDY_DATA.subjects[id];
}

function statsFor(subjectId) {
  state.data.stats[subjectId] ||= { questions: {}, topics: {} };
  return state.data.stats[subjectId];
}

function questionById(subjectId, qid) {
  return STUDY_DATA.subjects[subjectId].questions.find(q => q.id === qid);
}

function pct(n, d) {
  return d ? Math.round((n / d) * 1000) / 10 : 0;
}

function seededRandom(seed) {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return () => {
    h += h << 13; h ^= h >>> 7;
    h += h << 3; h ^= h >>> 17;
    h += h << 5;
    return ((h >>> 0) % 1000000) / 1000000;
  };
}

function shuffle(items, seed = `${Date.now()}-${Math.random()}`) {
  const arr = [...items];
  const rnd = seededRandom(seed);
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function weightedQuestions(subject, mode, topic = "todos") {
  const stats = statsFor(subject.id);
  let qs = subject.questions.filter(q => topic === "todos" || q.topic === topic);

  if (mode === "errors") {
    qs = qs.filter(q => (stats.questions[q.id]?.errors || 0) > 0);
  }

  return qs.flatMap(q => {
    const st = stats.questions[q.id] || {};
    const topicSt = stats.topics[q.topic] || {};
    const errorWeight = (st.errors || 0) * 3 + (topicSt.errors || 0);
    const weight = mode === "errors" ? Math.max(2, errorWeight + 1) : Math.max(1, 1 + Math.min(5, errorWeight));
    return Array.from({ length: weight }, () => q);
  });
}

function balancedPick(subject, count, mode, topic = "todos") {
  const weighted = shuffle(weightedQuestions(subject, mode, topic), `${Date.now()}-${mode}-${topic}`);
  const picked = [];
  const used = new Set();
  const topicCounts = {};

  for (const q of weighted) {
    if (used.has(q.id)) continue;
    const minTopic = Math.min(0, ...Object.values(topicCounts));
    if (topic !== "todos" || (topicCounts[q.topic] || 0) <= minTopic + 1 || picked.length < 3) {
      picked.push(q);
      used.add(q.id);
      topicCounts[q.topic] = (topicCounts[q.topic] || 0) + 1;
    }
    if (picked.length === count) break;
  }

  for (const q of shuffle(subject.questions, `${Date.now()}-fill`)) {
    if (picked.length === count) break;
    if (!used.has(q.id) && (topic === "todos" || q.topic === topic)) {
      picked.push(q);
      used.add(q.id);
    }
  }

  return picked;
}

function startRound({ subjectId, mode, count, topic = "todos", label }) {
  const subject = STUDY_DATA.subjects[subjectId];
  const fixedPart = subject.parts?.[mode];
  if (fixedPart) {
    const selected = fixedPart.map(id => questionById(subjectId, id)).filter(Boolean);
    const seed = `${Date.now()}-${subjectId}-${mode}`;
    state.subjectId = subjectId;
    state.round = {
      id: seed,
      subjectId,
      mode: "exam",
      label,
      topic,
      current: 0,
      submitted: false,
      questions: selected.map((q, i) => ({
        id: q.id,
        optionOrder: shuffle(q.options.map(o => o.id), `${seed}-${q.id}-${i}`)
      })),
      answers: {}
    };
    saveRound();
    renderRound();
    return;
  }

  const pool = topic === "todos" ? subject.questions : subject.questions.filter(q => q.topic === topic);
  const effectiveCount = Math.min(count, mode === "errors" ? weightedQuestions(subject, mode, topic).filter((q, i, arr) => arr.findIndex(x => x.id === q.id) === i).length : pool.length);

  if (!effectiveCount) {
    alert(mode === "errors" ? "Ainda não há questões erradas para refazer." : "Não há questões disponíveis para esse filtro.");
    return;
  }
  if (effectiveCount < count) alert(`Há apenas ${effectiveCount} questões disponíveis para esta rodada.`);

  const selected = balancedPick(subject, effectiveCount, mode, topic);
  const seed = `${Date.now()}-${subjectId}-${mode}`;
  const roundQuestions = selected.map((q, i) => ({
    id: q.id,
    optionOrder: shuffle(q.options.map(o => o.id), `${seed}-${q.id}-${i}`)
  }));

  state.subjectId = subjectId;
  state.round = {
    id: seed,
    subjectId,
    mode,
    label,
    topic,
    current: 0,
    submitted: false,
    questions: roundQuestions,
    answers: {}
  };
  saveRound();
  renderRound();
}

function startRoundFromIds({ subjectId, ids, label }) {
  const subject = STUDY_DATA.subjects[subjectId];
  const selected = ids.map(id => questionById(subjectId, id)).filter(Boolean);
  if (!selected.length) return alert("Não há erros da última rodada para refazer.");
  const seed = `${Date.now()}-${subjectId}-last-errors`;
  state.subjectId = subjectId;
  state.round = {
    id: seed,
    subjectId,
    mode: "training",
    label,
    topic: "erros",
    current: 0,
    submitted: false,
    questions: shuffle(selected, seed).map((q, i) => ({
      id: q.id,
      optionOrder: shuffle(q.options.map(o => o.id), `${seed}-${q.id}-${i}`)
    })),
    answers: {}
  };
  saveRound();
  renderRound();
}

function recordAnswer(q, selectedId, correct) {
  const stats = statsFor(state.round.subjectId);
  stats.questions[q.id] ||= { attempts: 0, correct: 0, errors: 0, last: null, streak: 0 };
  stats.topics[q.topic] ||= { attempts: 0, correct: 0, errors: 0 };
  const qs = stats.questions[q.id];
  const ts = stats.topics[q.topic];
  qs.attempts += 1;
  ts.attempts += 1;
  qs.last = correct ? "Acertou" : "Errou";
  qs.lastAt = new Date().toLocaleString("pt-BR");
  if (correct) {
    qs.correct += 1;
    ts.correct += 1;
    qs.streak = Math.max(1, (qs.streak || 0) + 1);
  } else {
    qs.errors += 1;
    ts.errors += 1;
    qs.streak = Math.min(-1, (qs.streak || 0) - 1);
  }
  saveStore();
}

function submitAnswer() {
  const rq = state.round.questions[state.round.current];
  const q = questionById(state.round.subjectId, rq.id);
  const selectedId = state.round.answers[q.id]?.selectedId;
  if (!selectedId) return alert("Escolha uma alternativa antes de confirmar.");
  if (state.round.answers[q.id].confirmed) return;
  const correct = selectedId === q.correctOptionId;
  state.round.answers[q.id] = { selectedId, confirmed: true, correct };
  recordAnswer(q, selectedId, correct);
  saveRound();
  renderRound();
}

function finishExam() {
  if (!confirm("Entregar o simulado agora? Questões em branco serão contadas como não respondidas.")) return;
  state.round.submitted = true;
  state.round.questions.forEach(rq => {
    const q = questionById(state.round.subjectId, rq.id);
    const ans = state.round.answers[q.id];
    if (ans?.selectedId && !ans.confirmed) {
      const correct = ans.selectedId === q.correctOptionId;
      state.round.answers[q.id] = { ...ans, confirmed: true, correct };
      recordAnswer(q, ans.selectedId, correct);
    }
  });
  const summary = roundSummary();
  state.data.rounds.unshift({
    id: state.round.id,
    subjectId: state.round.subjectId,
    label: state.round.label,
    date: new Date().toLocaleString("pt-BR"),
    wrongIds: state.round.questions
      .map(rq => questionById(state.round.subjectId, rq.id))
      .filter(q => !state.round.answers[q.id]?.correct)
      .map(q => q.id),
    ...summary
  });
  state.data.rounds = state.data.rounds.slice(0, 30);
  saveStore();
  saveRound();
  renderRound();
}

function roundSummary() {
  const total = state.round.questions.length;
  let correct = 0, wrong = 0, blank = 0;
  state.round.questions.forEach(rq => {
    const ans = state.round.answers[rq.id];
    if (!ans?.selectedId) blank++;
    else if (ans.correct) correct++;
    else if (ans.confirmed || state.round.submitted) wrong++;
  });
  return { total, correct, wrong, blank, percent: pct(correct, total) };
}

function answerText(q, id) {
  return q.options.find(o => o.id === id)?.text || "Não respondida";
}

function renderHome() {
  state.view = "home";
  state.round = null;
  saveRound();
  const cards = Object.values(STUDY_DATA.subjects).map(subject => {
    const s = statsFor(subject.id);
    const attempts = Object.values(s.questions).reduce((n, q) => n + q.attempts, 0);
    const correct = Object.values(s.questions).reduce((n, q) => n + q.correct, 0);
    return `
      <article class="card subject-card">
        <div>
          <h2>${subject.name}</h2>
          <p class="muted">${subject.description}</p>
          <p><strong>${subject.questions.length}</strong> questões cadastradas</p>
          <p class="muted">Respondidas: ${attempts} | Acertos: ${pct(correct, attempts)}%</p>
        </div>
        <button class="btn primary" data-open="${subject.id}" type="button">Estudar ${subject.shortName}</button>
      </article>`;
  }).join("");

  app.innerHTML = `
    <section class="panel">
      <h2>Escolha a matéria</h2>
      <p class="muted">As estatísticas, dificuldades e históricos ficam separadas para cada prova.</p>
      <div class="grid subject-grid">${cards}</div>
    </section>`;
  app.querySelectorAll("[data-open]").forEach(btn => btn.addEventListener("click", () => renderSubject(btn.dataset.open)));
}

function renderSubject(subjectId, tab = "dashboard") {
  state.subjectId = subjectId;
  state.view = tab;
  const subject = getSubject(subjectId);
  const tabs = [
    ["dashboard", "Início"],
    ["simulados", "Simulados"],
    ["revisao", "Revisão rápida"],
    ["dificuldades", "Minhas dificuldades"],
    ["historico", "Histórico"]
  ];
  app.innerHTML = `
    <button class="btn" id="backHome" type="button">← Matérias</button>
    <section class="panel">
      <p class="eyebrow">${subject.questions.length} questões</p>
      <h2>${subject.name}</h2>
      <p class="muted">${subject.description}</p>
      <div class="tabs">${tabs.map(([id, name]) => `<button class="tab ${id === tab ? "active" : ""}" data-tab="${id}" type="button">${name}</button>`).join("")}</div>
      <div id="subjectContent"></div>
    </section>`;
  byId("backHome").addEventListener("click", renderHome);
  app.querySelectorAll("[data-tab]").forEach(btn => btn.addEventListener("click", () => renderSubject(subjectId, btn.dataset.tab)));
  renderTab(tab);
}

function renderTab(tab) {
  const subject = getSubject();
  const container = byId("subjectContent");
  if (tab === "dashboard") container.innerHTML = dashboardHtml(subject);
  if (tab === "simulados") container.innerHTML = simuladosHtml(subject);
  if (tab === "revisao") container.innerHTML = revisaoHtml(subject);
  if (tab === "dificuldades") container.innerHTML = dificuldadesHtml(subject);
  if (tab === "historico") container.innerHTML = historicoHtml(subject);
  wireCommon(subject);
}

function dashboardHtml(subject) {
  const s = statsFor(subject.id);
  const attempts = Object.values(s.questions).reduce((n, q) => n + q.attempts, 0);
  const correct = Object.values(s.questions).reduce((n, q) => n + q.correct, 0);
  const errors = Object.values(s.questions).reduce((n, q) => n + q.errors, 0);
  const worst = worstQuestions(subject).slice(0, 3);
  return `
    <div class="grid dash-grid">
      ${stat("Respondidas", attempts)}
      ${stat("Acertos", correct)}
      ${stat("Erros", errors)}
      ${stat("Aproveitamento", `${pct(correct, attempts)}%`)}
    </div>
    <div class="actions">
      <button class="btn primary" data-start="part1" type="button">Parte 1 - 15 questões</button>
      <button class="btn primary" data-start="part2" type="button">Parte 2 - 14 questões</button>
      <button class="btn" data-start="training" type="button">Treino com correção imediata</button>
      <button class="btn" data-tab-short="revisao" type="button">Revisão de última hora</button>
      <button class="btn" data-tab-short="dificuldades" type="button">Revisar erros</button>
    </div>
    <h3>Questões mais difíceis</h3>
    <div class="list">${worst.length ? worst.map(worstItem).join("") : "<p class='muted'>Ainda não há erros registrados.</p>"}</div>`;
}

function stat(label, value) {
  return `<div class="stat"><span class="muted">${label}</span><strong>${value}</strong></div>`;
}

function simuladosHtml(subject) {
  const topics = [...new Set(subject.questions.map(q => q.topic))].sort();
  return `
    <h3>Modos de estudo</h3>
    <div class="grid">
      <div class="card">
        <h3>Simulado - Parte 1</h3>
        <p class="muted">Questões 1 a 15 do arquivo completo. Correção ao entregar.</p>
        <div class="actions"><button class="btn primary" data-start="part1" type="button">Fazer Parte 1</button></div>
      </div>
      <div class="card">
        <h3>Simulado - Parte 2</h3>
        <p class="muted">Questões 16 a 29 do arquivo completo. Correção ao entregar.</p>
        <div class="actions"><button class="btn primary" data-start="part2" type="button">Fazer Parte 2</button></div>
      </div>
      <div class="card">
        <h3>Simulado completo</h3>
        <p class="muted">Todas as 29 questões em uma rodada, para revisão final.</p>
        <div class="actions">
          <button class="btn primary" data-start="full29" type="button">29 questões</button>
        </div>
      </div>
      <div class="card">
        <h3>Treino por assunto</h3>
        <div class="select-row">
          <label>Assunto
            <select id="topicSelect">${topics.map(t => `<option>${t}</option>`).join("")}</select>
          </label>
          <button class="btn primary" data-start="topic" type="button">Treinar assunto</button>
        </div>
      </div>
      <div class="card">
        <h3>Treino com correção imediata</h3>
        <p class="muted">Você responde, confirma e lê a explicação antes de avançar.</p>
        <div class="actions"><button class="btn primary" data-start="training" type="button">Começar treino</button></div>
      </div>
    </div>`;
}

function revisaoHtml(subject) {
  return `
    <h3>Revisão de última hora</h3>
    <p class="muted">Pontos centrais dos materiais e da revisão conjunta, sem afirmar exatamente o que cairá na prova.</p>
    ${subject.review.map(item => `
      <details>
        <summary>${item.topic}</summary>
        <p>${item.body}</p>
        <p><strong>Exemplo:</strong> ${item.example}</p>
        <p><strong>O que lembrar:</strong> ${item.remember}</p>
        <button class="btn" data-topic-practice="${item.practiceTopic || item.topic}" type="button">Praticar esse assunto</button>
      </details>`).join("")}`;
}

function worstQuestions(subject) {
  const s = statsFor(subject.id);
  return subject.questions.map(q => {
    const st = s.questions[q.id] || { attempts: 0, correct: 0, errors: 0, streak: 0 };
    const score = st.attempts < 2 ? st.errors * .6 : (st.errors / st.attempts) * 10 + st.errors;
    return { q, st, score };
  }).filter(x => x.st.errors > 0).sort((a, b) => b.score - a.score);
}

function worstItem(x) {
  return `<div class="list-item">
    <strong>${x.q.id} — ${x.q.topic}</strong>
    <p class="muted">Tentativas: ${x.st.attempts} | Acertos: ${x.st.correct} | Erros: ${x.st.errors} | Taxa de erro: ${pct(x.st.errors, x.st.attempts)}%</p>
    <p>${x.st.streak > 0 ? "<span class='ok'>Melhorando</span>" : "<span class='bad'>Precisa revisar</span>"}</p>
  </div>`;
}

function dificuldadesHtml(subject) {
  const topics = [...new Set(subject.questions.map(q => q.topic))].sort();
  const worst = worstQuestions(subject);
  const s = statsFor(subject.id);
  const topicStats = Object.entries(s.topics).sort((a, b) => pct(b[1].errors, b[1].attempts) - pct(a[1].errors, a[1].attempts));
  return `
    <div class="actions">
      <button class="btn primary" data-start="errors" type="button">Treinar minhas dificuldades</button>
      <button class="btn" data-last-errors type="button">Refazer erros da última rodada</button>
      <label>Filtro por assunto
        <select id="difficultyTopic"><option value="todos">Todos</option>${topics.map(t => `<option>${t}</option>`).join("")}</select>
      </label>
    </div>
    <h3>Desempenho por assunto</h3>
    <div class="list">${topicStats.length ? topicStats.map(([topic, st]) => `<div class="list-item"><strong>${topic}</strong><p class="muted">Tentativas: ${st.attempts} | Acertos: ${st.correct} | Erros: ${st.errors} | Erro: ${pct(st.errors, st.attempts)}%</p></div>`).join("") : "<p class='muted'>Ainda não há tentativas.</p>"}</div>
    <h3>Questões que mais errei</h3>
    <div class="list" id="worstList">${worst.length ? worst.map(worstItem).join("") : "<p class='muted'>Ainda não há erros registrados.</p>"}</div>`;
}

function historicoHtml(subject) {
  const rounds = state.data.rounds.filter(r => r.subjectId === subject.id);
  return `
    <div class="actions">
      <button class="danger-btn" id="resetProgress" type="button">Zerar progresso desta matéria</button>
      <button class="danger-btn" id="resetAll" type="button">Zerar tudo</button>
    </div>
    <div class="list">${rounds.length ? rounds.map(r => `<div class="list-item"><strong>${r.label}</strong><p class="muted">${r.date} — ${r.correct}/${r.total} acertos (${r.percent}%), erros: ${r.wrong}, em branco: ${r.blank}</p></div>`).join("") : "<p class='muted'>Nenhum simulado finalizado ainda.</p>"}</div>`;
}

function wireCommon(subject) {
  app.querySelectorAll("[data-start]").forEach(btn => btn.addEventListener("click", () => {
    const type = btn.dataset.start;
    if (type === "part1") startRound({ subjectId: subject.id, mode: "part1", count: 15, label: "Simulado - Parte 1 (15 questões)" });
    if (type === "part2") startRound({ subjectId: subject.id, mode: "part2", count: 14, label: "Simulado - Parte 2 (14 questões)" });
    if (type === "full29") startRound({ subjectId: subject.id, mode: "full29", count: 29, label: "Simulado completo - 29 questões" });
    if (type === "training") startRound({ subjectId: subject.id, mode: "training", count: 10, label: "Treino com correção imediata" });
    if (type === "exam10") startRound({ subjectId: subject.id, mode: "exam", count: 10, label: "Simulado de prova - 10 questões" });
    if (type === "exam20") startRound({ subjectId: subject.id, mode: "exam", count: 20, label: "Simulado de prova - 20 questões" });
    if (type === "exam30") startRound({ subjectId: subject.id, mode: "exam", count: 30, label: "Simulado de prova - 30 questões" });
    if (type === "topic") startRound({ subjectId: subject.id, mode: "training", count: 10, topic: byId("topicSelect").value, label: `Treino por assunto - ${byId("topicSelect").value}` });
    if (type === "errors") startRound({ subjectId: subject.id, mode: "errors", count: 15, label: "Refazer erros" });
  }));
  app.querySelectorAll("[data-tab-short]").forEach(btn => btn.addEventListener("click", () => renderSubject(subject.id, btn.dataset.tabShort)));
  app.querySelectorAll("[data-topic-practice]").forEach(btn => btn.addEventListener("click", () => startRound({ subjectId: subject.id, mode: "training", count: 10, topic: btn.dataset.topicPractice, label: `Revisão - ${btn.dataset.topicPractice}` })));
  const diffTopic = byId("difficultyTopic");
  if (diffTopic) diffTopic.addEventListener("change", () => {
    const filtered = worstQuestions(subject).filter(x => diffTopic.value === "todos" || x.q.topic === diffTopic.value);
    byId("worstList").innerHTML = filtered.length ? filtered.map(worstItem).join("") : "<p class='muted'>Sem erros nesse assunto.</p>";
  });
  const lastErrors = app.querySelector("[data-last-errors]");
  if (lastErrors) lastErrors.addEventListener("click", () => {
    const last = state.data.rounds.find(r => r.subjectId === subject.id);
    startRoundFromIds({ subjectId: subject.id, ids: last?.wrongIds || [], label: "Erros da última rodada" });
  });
  const reset = byId("resetProgress");
  if (reset) reset.addEventListener("click", () => {
    if (confirm("Apagar o progresso desta matéria neste navegador?")) {
      delete state.data.stats[subject.id];
      state.data.rounds = state.data.rounds.filter(r => r.subjectId !== subject.id);
      saveStore();
      renderSubject(subject.id, "historico");
    }
  });
  const resetAll = byId("resetAll");
  if (resetAll) resetAll.addEventListener("click", () => {
    if (confirm("Apagar todo o progresso local deste site?")) {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(ROUND_KEY);
      state.data = loadStore();
      initTheme();
      renderHome();
    }
  });
}

function renderRound() {
  const round = state.round;
  const subject = STUDY_DATA.subjects[round.subjectId];
  const rq = round.questions[round.current];
  const q = questionById(round.subjectId, rq.id);
  const ans = round.answers[q.id] || {};
  const showFeedback = round.mode !== "exam" ? ans.confirmed : round.submitted;
  const summary = roundSummary();
  const orderedOptions = rq.optionOrder.map(id => q.options.find(o => o.id === id));
  const progress = pct(round.current + 1, round.questions.length);

  app.innerHTML = `
    <section class="question-box">
      <div class="question-head">
        <span>${subject.name}</span>
        <span>Questão ${round.current + 1} de ${round.questions.length}</span>
      </div>
      <div class="progress" aria-label="Progresso" style="--value:${progress}%"><span></span></div>
      <div class="grid dash-grid">
        ${stat("Acertos", summary.correct)}
        ${stat("Erros", summary.wrong)}
        ${stat("Em branco", summary.blank)}
        ${stat("Total", summary.total)}
      </div>
      <p class="eyebrow">${q.topic} · ${q.difficulty}</p>
      <div class="question-text">${q.prompt}</div>
      <div class="choices">
        ${orderedOptions.map((op, idx) => {
          const cls = [
            ans.selectedId === op.id ? "selected" : "",
            showFeedback && op.id === q.correctOptionId ? "correct" : "",
            showFeedback && ans.selectedId === op.id && op.id !== q.correctOptionId ? "wrong" : ""
          ].join(" ");
          return `<button class="choice ${cls}" data-choice="${op.id}" type="button" ${ans.confirmed && round.mode !== "exam" ? "disabled" : ""}>
            <span class="letter">${String.fromCharCode(65 + idx)}</span><span>${op.text}</span>
          </button>`;
        }).join("")}
      </div>
      ${showFeedback ? feedbackHtml(q, ans) : ""}
      <p class="source">Referência: ${q.reference}</p>
      <div class="actions">
        <button class="btn" id="prevQ" type="button">← Anterior</button>
        ${round.mode !== "exam" ? `<button class="btn primary" id="confirmQ" type="button">Confirmar resposta</button>` : ""}
        <button class="btn" id="nextQ" type="button">Próxima →</button>
        ${round.mode === "exam" && !round.submitted ? `<button class="btn primary" id="finishRound" type="button">Entregar simulado</button>` : ""}
        ${round.submitted ? `<button class="btn primary" id="finishView" type="button">Ver resultado final</button>` : ""}
        <button class="btn" id="exitRound" type="button">Sair</button>
      </div>
    </section>`;

  app.querySelectorAll("[data-choice]").forEach(btn => btn.addEventListener("click", () => {
    if (ans.confirmed && round.mode !== "exam") return;
    round.answers[q.id] = { ...(round.answers[q.id] || {}), selectedId: btn.dataset.choice };
    saveRound();
    renderRound();
  }));
  byId("prevQ").addEventListener("click", () => { round.current = Math.max(0, round.current - 1); saveRound(); renderRound(); });
  byId("nextQ").addEventListener("click", () => { round.current = Math.min(round.questions.length - 1, round.current + 1); saveRound(); renderRound(); });
  const confirmBtn = byId("confirmQ");
  if (confirmBtn) confirmBtn.addEventListener("click", submitAnswer);
  const finishBtn = byId("finishRound");
  if (finishBtn) finishBtn.addEventListener("click", finishExam);
  const resultBtn = byId("finishView");
  if (resultBtn) resultBtn.addEventListener("click", renderResult);
  byId("exitRound").addEventListener("click", () => {
    if (confirm("Sair da rodada? Ela ficará salva para continuar depois.")) renderSubject(round.subjectId);
  });
}

function feedbackHtml(q, ans) {
  if (!ans?.selectedId) return `<div class="feedback"><span class="warn">Não respondida.</span></div>`;
  const ok = ans.selectedId === q.correctOptionId;
  return `<div class="feedback">
    <p>${ok ? "<span class='ok'>✓ Acertei</span>" : "<span class='bad'>✗ Errei</span>"}</p>
    <p><strong>Sua resposta:</strong> ${answerText(q, ans.selectedId)}</p>
    <p><strong>Resposta correta:</strong> ${answerText(q, q.correctOptionId)}</p>
    <p><strong>Explicação:</strong> ${q.explanation}</p>
    <p><strong>O que lembrar:</strong> ${q.remember}</p>
    <p><strong>Assunto:</strong> ${q.topic}</p>
  </div>`;
}

function renderResult() {
  const subject = getSubject(state.round.subjectId);
  const summary = roundSummary();
  const difficultTopics = {};
  state.round.questions.forEach(rq => {
    const q = questionById(subject.id, rq.id);
    const ans = state.round.answers[q.id];
    if (!ans?.correct) difficultTopics[q.topic] = (difficultTopics[q.topic] || 0) + 1;
  });
  app.innerHTML = `
    <section class="panel">
      <p class="eyebrow">${subject.name}</p>
      <h2>Resultado da rodada</h2>
      <div class="grid dash-grid">
        ${stat("Acertos", summary.correct)}
        ${stat("Erros", summary.wrong)}
        ${stat("Em branco", summary.blank)}
        ${stat("Aproveitamento", `${summary.percent}%`)}
      </div>
      <p>${summary.percent >= 80 ? "Bom desempenho. Mantenha revisão dos pontos errados." : summary.percent >= 60 ? "Desempenho mediano. Revise os assuntos com erro antes da prova." : "Revise a teoria e refaça as questões com calma."}</p>
      <h3>Assuntos com maior dificuldade</h3>
      <div class="list">${Object.keys(difficultTopics).length ? Object.entries(difficultTopics).map(([t, n]) => `<div class="list-item"><strong>${t}</strong><p class="muted">${n} erro(s) ou em branco nesta rodada.</p></div>`).join("") : "<p class='muted'>Nenhum assunto com erro nesta rodada.</p>"}</div>
      <h3>Correção completa</h3>
      <div class="list">${state.round.questions.map((rq, i) => {
        const q = questionById(subject.id, rq.id);
        const ans = state.round.answers[q.id] || {};
        return `<div class="list-item"><strong>${i + 1}. ${q.topic} — ${ans.correct ? "<span class='ok'>Acertou</span>" : ans.selectedId ? "<span class='bad'>Errou</span>" : "<span class='warn'>Não respondeu</span>"}</strong>${feedbackHtml(q, ans)}</div>`;
      }).join("")}</div>
      <div class="actions">
        <button class="btn primary" data-result-errors type="button">Refazer erros</button>
        <button class="btn" data-new-round type="button">Iniciar outra rodada</button>
        <button class="btn" data-open-review type="button">Abrir revisão</button>
      </div>
    </section>`;
  app.querySelector("[data-result-errors]").addEventListener("click", () => startRound({ subjectId: subject.id, mode: "errors", count: 15, label: "Refazer erros" }));
  app.querySelector("[data-new-round]").addEventListener("click", () => renderSubject(subject.id, "simulados"));
  app.querySelector("[data-open-review]").addEventListener("click", () => renderSubject(subject.id, "revisao"));
}

function restoreRound() {
  try {
    const saved = JSON.parse(localStorage.getItem(ROUND_KEY));
    if (saved?.subjectId && confirm("Existe uma rodada em andamento. Deseja continuar de onde parou?")) {
      state.round = saved;
      state.subjectId = saved.subjectId;
      renderRound();
      return true;
    }
  } catch {
    localStorage.removeItem(ROUND_KEY);
  }
  return false;
}

themeToggle.addEventListener("click", toggleTheme);
initTheme();
if (!restoreRound()) renderHome();
