/* ═══════════════════════════════════════════════════════════════
   GRADUATION Q&A GAME — LOGIC
   ═══════════════════════════════════════════════════════════════ */

// ── Questions Bank ────────────────────────────────────────────
const QUESTIONS = [
    {
        q: "What year is Hung graduating?",
        options: ["2024", "2025", "2026", "2027"],
        answer: 2,
        feedback: "🎓 That's right! Class of 2026 — the best class!"
    },
    {
        q: "What time does Hung's graduation ceremony start?",
        options: ["07:00 AM", "08:30 AM", "09:00 AM", "10:00 AM"],
        answer: 1,
        feedback: "⏰ 08:30 AM sharp — don't be late!"
    },
    {
        q: "Where is the graduation ceremony held?",
        options: ["City Hall", "UIT Auditorium", "VNU Stadium", "Landmark 81"],
        answer: 1,
        feedback: "🏛️ UIT Auditorium — see you there!"
    },
    {
        q: "What does UIT stand for?",
        options: [
            "University of International Trade",
            "University of IT & Technology",
            "University of Information Technology",
            "United Institute of Tech"
        ],
        answer: 2,
        feedback: "💻 University of Information Technology — Hung's alma mater!"
    },
    {
        q: "What is the 'Save the Date' for Hung's graduation?",
        options: ["May 25, 2026", "June 9, 2026", "July 4, 2026", "August 1, 2026"],
        answer: 1,
        feedback: "📅 June 9, 2026 — mark your calendar!"
    },
    {
        q: "Which graduation class does Hung belong to?",
        options: ["Class of 2024", "Class of 2025", "Class of 2026", "Class of 2027"],
        answer: 2,
        feedback: "🎉 Class of 2026 — an epic class indeed!"
    },
    {
        q: "What emoji represents graduation? 🤔",
        options: ["🎪", "🎓", "🏅", "📚"],
        answer: 1,
        feedback: "🎓 The mortarboard cap! A universal symbol of achievement!"
    },
    {
        q: "After the ceremony, which app can you use to share your check-in photo?",
        options: ["TikTok", "Twitter", "Instagram Story", "Facebook"],
        answer: 2,
        feedback: "📸 Instagram Story! Share your moment with the world!"
    },
    {
        q: "How many tracks are in Hung's graduation playlist?",
        options: ["3", "5", "7", "10"],
        answer: 2,
        feedback: "🎵 7 carefully curated tracks for the big day!"
    },
    {
        q: "What is the greeting message on Hung's invitation?",
        options: [
            "You are cordially invited",
            "Your presence means the world to me",
            "Please RSVP asap",
            "Black tie required"
        ],
        answer: 1,
        feedback: "💜 \"Your presence means the world to me\" — from the heart!"
    }
];

// ── Game State ────────────────────────────────────────────────
let gState = {
    questions: [],
    current:   0,
    score:     0,
    answered:  false
};

const OPTION_LETTERS = ['A', 'B', 'C', 'D'];

// ── DOM helpers ───────────────────────────────────────────────
const $ = id => document.getElementById(id);

// ── Character SVG template ────────────────────────────────────
function buildCharSVG() {
    return `
    <svg class="char-svg" viewBox="0 0 120 170" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges">

      <!-- Graduation gown body -->
      <rect x="28" y="88" width="64" height="70" rx="4" fill="#1a006e"/>
      <!-- Gown collar/lapels -->
      <polygon points="52,88 60,106 68,88" fill="#2a0090"/>
      <!-- Gown bottom hem pixel line -->
      <rect x="28" y="152" width="64" height="6" rx="2" fill="#130050"/>
      <!-- Arm left -->
      <rect x="14" y="90" width="18" height="44" rx="4" fill="#1a006e"/>
      <!-- Arm right -->
      <rect x="88" y="90" width="18" height="44" rx="4" fill="#1a006e"/>
      <!-- Hand left -->
      <ellipse cx="23" cy="138" rx="8" ry="7" fill="#FBBF7C"/>
      <!-- Hand right -->
      <ellipse cx="97" cy="138" rx="8" ry="7" fill="#FBBF7C"/>
      <!-- Diploma scroll in right hand -->
      <rect x="92" y="128" width="18" height="12" rx="3" fill="#FFF8DC" stroke="#D4A017" stroke-width="1.5"/>
      <line x1="92" y1="134" x2="110" y2="134" stroke="#D4A017" stroke-width="1"/>
      <!-- Tie/sash accent -->
      <polygon points="55,88 60,100 65,88" fill="#FFE57A"/>

      <!-- Neck -->
      <rect x="52" y="80" width="16" height="12" rx="2" fill="#FBBF7C"/>

      <!-- Head -->
      <ellipse cx="60" cy="68" rx="30" ry="26" fill="#FBBF7C"/>
      <!-- Head shading -->
      <ellipse cx="60" cy="56" rx="22" ry="12" fill="rgba(255,255,255,0.12)"/>

      <!-- Ears -->
      <ellipse cx="31" cy="68" rx="6" ry="8" fill="#FBBF7C"/>
      <ellipse cx="89" cy="68" rx="6" ry="8" fill="#FBBF7C"/>

      <!-- Eyes - white base -->
      <ellipse cx="49" cy="66" rx="8" ry="9" fill="white"/>
      <ellipse cx="71" cy="66" rx="8" ry="9" fill="white"/>
      <!-- Eye irises -->
      <ellipse cx="50" cy="67" rx="5" ry="6" fill="#3A1FFF"/>
      <ellipse cx="72" cy="67" rx="5" ry="6" fill="#3A1FFF"/>
      <!-- Eye pupils -->
      <ellipse cx="51" cy="67" rx="2.5" ry="3" fill="#0a0010"/>
      <ellipse cx="73" cy="67" rx="2.5" ry="3" fill="#0a0010"/>
      <!-- Eye shine -->
      <circle cx="52" cy="65" r="1.5" fill="white"/>
      <circle cx="74" cy="65" r="1.5" fill="white"/>

      <!-- Blush cheeks -->
      <ellipse cx="38" cy="75" rx="7" ry="4" fill="rgba(255,158,188,0.55)"/>
      <ellipse cx="82" cy="75" rx="7" ry="4" fill="rgba(255,158,188,0.55)"/>

      <!-- Mouths — toggled by class on parent wrapper -->
      <!-- Happy mouth (big smile) -->
      <path class="char-mouth-happy"
            d="M46 80 Q60 94 74 80"
            fill="none" stroke="#c0392b" stroke-width="2.5"
            stroke-linecap="round"/>
      <path class="char-mouth-happy"
            d="M46 80 Q60 94 74 80 Q70 86 50 86 Z"
            fill="#FF6B8A" opacity="0.6"/>
      <!-- Tongue on happy -->
      <ellipse class="char-mouth-happy" cx="60" cy="86" rx="6" ry="3" fill="#FF9EBC"/>

      <!-- Sad mouth (frown) -->
      <path class="char-mouth-sad"
            d="M46 87 Q60 76 74 87"
            fill="none" stroke="#c0392b" stroke-width="2.5"
            stroke-linecap="round"/>

      <!-- Neutral mouth (slight smile) -->
      <path class="char-mouth-neutral"
            d="M50 82 Q60 88 70 82"
            fill="none" stroke="#c0392b" stroke-width="2"
            stroke-linecap="round"/>

      <!-- Sweat drop (wrong answer) -->
      <ellipse class="char-sweat" cx="84" cy="56" rx="4" ry="5" fill="#82CAFF" opacity="0.85"/>
      <polygon class="char-sweat" points="80,54 88,54 84,44" fill="#82CAFF" opacity="0.85"/>

      <!-- Stars (correct answer) -->
      <g class="char-stars">
        <text class="char-star" x="12" y="30" font-size="16" fill="#FFE57A">★</text>
        <text class="char-star" x="88" y="22" font-size="12" fill="#7AFFCB">★</text>
        <text class="char-star" x="50" y="8"  font-size="10" fill="#FF9EBC">✦</text>
      </g>

      <!-- ── Graduation Cap ── -->
      <!-- Cap base flat board -->
      <rect x="30" y="38" width="60" height="8" rx="2" fill="#111"/>
      <!-- Cap crown -->
      <rect x="40" y="22" width="40" height="18" rx="3" fill="#0d0d0d"/>
      <!-- Cap top flat board -->
      <rect x="24" y="18" width="72" height="8" rx="2" fill="#111"/>
      <!-- Pixel highlight on cap board -->
      <rect x="24" y="18" width="72" height="2" rx="1" fill="rgba(255,255,255,0.12)"/>
      <!-- Tassel string -->
      <line x1="84" y1="22" x2="84" y2="44" stroke="#FFE57A" stroke-width="2"/>
      <!-- Tassel end -->
      <ellipse cx="84" cy="46" rx="5" ry="4" fill="#FFE57A"/>
      <line x1="82" y1="50" x2="82" y2="58" stroke="#FFE57A" stroke-width="1.5"/>
      <line x1="84" y1="50" x2="84" y2="60" stroke="#FFE57A" stroke-width="1.5"/>
      <line x1="86" y1="50" x2="86" y2="57" stroke="#FFE57A" stroke-width="1.5"/>
      <!-- Cap button center -->
      <circle cx="60" cy="22" r="3" fill="#FFE57A"/>

      <!-- Shoes -->
      <ellipse cx="43" cy="162" rx="14" ry="6" fill="#111"/>
      <ellipse cx="77" cy="162" rx="14" ry="6" fill="#111"/>
      <!-- Shoe shine -->
      <ellipse cx="40" cy="159" rx="5" ry="2" fill="rgba(255,255,255,0.2)"/>
      <ellipse cx="74" cy="159" rx="5" ry="2" fill="rgba(255,255,255,0.2)"/>

    </svg>`;
}

// ── Open / Close ──────────────────────────────────────────────
function openGame() {
    const overlay = $('gameModal');
    if (!overlay) return;
    // Dismiss game notif
    const gNotif = $('notifGame');
    if (gNotif) gNotif.classList.remove('show');
    overlay.classList.add('show');
    startGame();
}

function closeGame() {
    const overlay = $('gameModal');
    if (overlay) overlay.classList.remove('show');
}

function closeGameIfOutside(event) {
    if (event.target.id === 'gameModal') closeGame();
}

// ── Game Logic ────────────────────────────────────────────────
function startGame() {
    // Shuffle + pick all questions
    gState.questions = [...QUESTIONS].sort(() => Math.random() - 0.5);
    gState.current  = 0;
    gState.score    = 0;
    gState.answered = false;

    // Build character
    const charWrap = $('gameCharWrap');
    if (charWrap) charWrap.innerHTML = buildCharSVG();

    showQuestion();
    setCharState('idle');
    updateScoreUI();
    updateProgressUI();

    // Hide end screen
    const end = $('gameEndScreen');
    if (end) end.classList.remove('show');
    const qa = $('gameQaArea');
    if (qa) qa.style.display = 'flex';
}

function showQuestion() {
    const q   = gState.questions[gState.current];
    gState.answered = false;

    $('gameQuestionText').textContent = q.q;
    $('gameQCount').textContent = `${gState.current + 1} / ${gState.questions.length}`;

    const opts = $('gameOptions');
    opts.innerHTML = '';
    q.options.forEach((opt, i) => {
        const btn = document.createElement('button');
        btn.className = 'game-option-btn';
        btn.innerHTML = `<span class="option-letter">${OPTION_LETTERS[i]}</span><span>${opt}</span>`;
        btn.addEventListener('click', () => selectAnswer(i));
        opts.appendChild(btn);
    });

    // Reset feedback & next btn
    const fb = $('gameFeedback');
    fb.className = 'game-feedback';
    fb.innerHTML = '';

    const nxt = $('gameNextBtn');
    nxt.className = 'game-next-btn';

    setCharState('idle');
    hideSpeech();
}

function selectAnswer(idx) {
    if (gState.answered) return;
    gState.answered = true;

    const q    = gState.questions[gState.current];
    const btns = $('gameOptions').querySelectorAll('.game-option-btn');
    const correct = idx === q.answer;

    // Mark buttons
    btns.forEach((btn, i) => {
        btn.disabled = true;
        if (i === q.answer) btn.classList.add('correct');
        else if (i === idx && !correct) btn.classList.add('wrong');
    });

    // Update score
    if (correct) gState.score++;
    updateScoreUI();

    // Character reaction
    setCharState(correct ? 'happy' : 'sad');

    // Feedback
    showFeedback(correct, q.feedback);

    // Particles
    if (correct) spawnParticles(['⭐','✨','🌟','💫','🎉']);
    else         spawnParticles(['💦','😅','💭']);

    // Speech bubble
    showSpeech(correct ? '正解！ ✓' : 'ちがう... ✗', 1800);

    // Show next button
    const nxt = $('gameNextBtn');
    nxt.classList.add('show');
    nxt.textContent = gState.current < gState.questions.length - 1
        ? '▶ NEXT'
        : '🏆 SEE RESULTS';
}

function nextQuestion() {
    gState.current++;
    if (gState.current >= gState.questions.length) {
        showEndScreen();
    } else {
        showQuestion();
        updateProgressUI();
    }
}

function showEndScreen() {
    const qa = $('gameQaArea');
    if (qa) qa.style.display = 'none';

    const end = $('gameEndScreen');
    end.classList.add('show');

    const total = gState.questions.length;
    const pct   = Math.round((gState.score / total) * 100);

    let trophy = '🎓', title = 'GREAT JOB!', msg = '';
    if (pct === 100) {
        trophy = '🏆'; title = 'PERFECT!';
        msg = "You know everything about Hung's graduation! You're a true VIP guest! 🌟";
        setCharState('happy');
    } else if (pct >= 70) {
        trophy = '🥇'; title = 'AWESOME!';
        msg = "Excellent knowledge! You're definitely ready for the big day! 🎉";
        setCharState('happy');
    } else if (pct >= 40) {
        trophy = '🥈'; title = 'NOT BAD!';
        msg = "You know the basics! Come to the ceremony to learn more 😊";
        setCharState('idle');
    } else {
        trophy = '📚'; title = 'STUDY UP!';
        msg = "Better brush up before June 9th! Re-read the invitation 😅";
        setCharState('sad');
    }

    $('gameEndTrophy').textContent = trophy;
    $('gameEndTitle').textContent  = title;
    $('gameEndScore').textContent  = `${gState.score} / ${total}  (${pct}%)`;
    $('gameEndMsg').textContent    = msg;

    spawnParticles(['🎓','⭐','🎉','✨','💜','🌸','🎊'], 16);
}

// ── UI Helpers ────────────────────────────────────────────────
function updateScoreUI() {
    const el = $('gameScore');
    if (el) el.textContent = `⭐ ${gState.score}`;
}

function updateProgressUI() {
    const total = gState.questions.length;
    const pct   = ((gState.current) / total) * 100;
    const fill  = $('gameProgressFill');
    if (fill) fill.style.width = pct + '%';
}

function showFeedback(correct, text) {
    const fb = $('gameFeedback');
    fb.className = 'game-feedback show ' + (correct ? 'feedback-correct' : 'feedback-wrong');
    fb.innerHTML = `
        <span class="game-feedback-icon">${correct ? '✅' : '❌'}</span>
        <span class="game-feedback-text">${text}</span>`;
}

function setCharState(state) {
    const wrap  = $('gameCharArea');
    const pchar = $('gameCharWrap');
    if (!wrap || !pchar) return;

    // Remove previous state classes
    wrap.classList.remove('game-char-state-idle','game-char-state-happy','game-char-state-sad');
    pchar.classList.remove('idle','happy','sad','thinking');

    wrap.classList.add(`game-char-state-${state}`);
    pchar.classList.add(state);
}

function showSpeech(text, durationMs) {
    const el = $('gameSpeech');
    if (!el) return;
    el.textContent = text;
    el.classList.add('visible');
    clearTimeout(showSpeech._timer);
    showSpeech._timer = setTimeout(() => el.classList.remove('visible'), durationMs);
}

function hideSpeech() {
    const el = $('gameSpeech');
    if (el) el.classList.remove('visible');
}

function spawnParticles(pool, count = 8) {
    const area = $('gameCharArea');
    if (!area) return;
    const rect = area.getBoundingClientRect();
    const cx   = rect.left + rect.width / 2;
    const cy   = rect.top  + rect.height / 2;

    for (let i = 0; i < count; i++) {
        const p    = document.createElement('div');
        p.className = 'game-particle';
        p.textContent = pool[Math.floor(Math.random() * pool.length)];
        const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.8;
        const dist  = 60 + Math.random() * 80;
        p.style.setProperty('--tx', Math.cos(angle) * dist + 'px');
        p.style.setProperty('--ty', Math.sin(angle) * dist - 30 + 'px');
        p.style.left = (cx - 12) + 'px';
        p.style.top  = (cy - 12) + 'px';
        document.body.appendChild(p);
        p.addEventListener('animationend', () => p.remove());
    }
}
