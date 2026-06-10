// ===== DATA STORE (localStorage with JSON) =====
const DB = {
  get: k => { try { return JSON.parse(localStorage.getItem(k)) || []; } catch { return []; } },
  set: (k,v) => localStorage.setItem(k, JSON.stringify(v)),
  getObj: k => { try { return JSON.parse(localStorage.getItem(k)) || {}; } catch { return {}; } },
  setObj: (k,v) => localStorage.setItem(k, JSON.stringify(v))
};

// ===== THEME SYSTEM =====
const themes = ['dark','light','neon'];
let themeIdx = 0;
function setTheme(t) {
  document.documentElement.setAttribute('data-theme', t);
  localStorage.setItem('arenaTheme', t);
  themeIdx = themes.indexOf(t);
  updateThemeChips();
}
function cycleTheme() {
  themeIdx = (themeIdx + 1) % themes.length;
  setTheme(themes[themeIdx]);
}
function updateThemeChips() {
  document.querySelectorAll('.theme-chip').forEach(c => c.classList.remove('active'));
  const curr = document.documentElement.getAttribute('data-theme');
  document.querySelectorAll('.theme-chip').forEach(c => {
    if (c.textContent.toLowerCase().includes(curr)) c.classList.add('active');
  });
}
(function initTheme() {
  const saved = localStorage.getItem('arenaTheme') || 'dark';
  setTheme(saved);
  themeIdx = themes.indexOf(saved);
})();

// ===== NAVIGATION =====
function showPage(page) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('active'));
  document.getElementById('page-' + page).classList.add('active');
  const navEl = document.getElementById('nav-' + page);
  if (navEl) navEl.classList.add('active');
  window.scrollTo(0,0);
  if (page === 'players') renderPlayers();
  if (page === 'tournament') { renderTournaments(); renderParticipants(); }
  if (page === 'leaderboard') renderLeaderboard();
  if (page === 'admin') renderAdminStats();
  if (page === 'profile') renderProfile();
}

// ===== TOAST =====
function showToast(msg, type='success') {
  const t = document.getElementById('toast');
  document.getElementById('toastMsg').textContent = msg;
  document.getElementById('toastIcon').textContent = type === 'success' ? '✅' : '❌';
  t.className = 'toast show ' + type;
  setTimeout(() => t.classList.remove('show'), 3500);
}

// ===== PLAYERS DATA =====
const playersData = [
  { name:'ShadowPro', game:'Valorant', rank:'Diamond', score:2500, emoji:'🎯' },
  { name:'NinjaX', game:'PUBG', rank:'Ace', score:3200, emoji:'🔫' },
  { name:'BlazeFire', game:'Fortnite', rank:'Elite', score:2800, emoji:'🔥' },
  { name:'CyberHawk', game:'Call of Duty', rank:'Platinum', score:2200, emoji:'🦅' },
  { name:'StormKing', game:'PUBG', rank:'Diamond', score:2900, emoji:'⚡' },
  { name:'IronGhost', game:'Valorant', rank:'Gold', score:1800, emoji:'👻' },
  { name:'ZeroX', game:'Fortnite', rank:'Silver', score:1400, emoji:'❄️' },
  { name:'AceNova', game:'Call of Duty', rank:'Ace', score:3100, emoji:'🌟' },
  { name:'PhantomGG', game:'FIFA', rank:'Gold', score:1900, emoji:'⚽' },
  { name:'DragonFist', game:'Apex Legends', rank:'Platinum', score:2400, emoji:'🐉' },
  { name:'QuantumX', game:'Valorant', rank:'Diamond', score:2700, emoji:'⚛️' },
  { name:'BladeRunner', game:'PUBG', rank:'Elite', score:2600, emoji:'⚔️' }
];

function getRankClass(rank) {
  const map = {Diamond:'rank-diamond',Gold:'rank-gold',Silver:'rank-silver',Platinum:'rank-platinum',Ace:'rank-ace',Elite:'rank-elite'};
  return map[rank] || 'rank-silver';
}

function filterPlayers() {
  const search = document.getElementById('searchInput').value.toLowerCase();
  const game = document.getElementById('gameFilter').value;
  const rank = document.getElementById('rankFilter').value;
  let filtered = playersData.filter(p => {
    const matchName = p.name.toLowerCase().includes(search);
    const matchGame = !game || p.game === game;
    const matchRank = !rank || p.rank === rank;
    return matchName && matchGame && matchRank;
  });
  filtered.sort((a,b) => b.score - a.score);
  renderFilteredPlayers(filtered);
}

function renderFilteredPlayers(players) {
  const grid = document.getElementById('playersGrid');
  if (!players.length) {
    grid.innerHTML = '<div class="no-results"><div class="nr-icon">🔍</div><p>No players found</p></div>';
    return;
  }
  grid.innerHTML = players.map((p,i) => `
    <div class="player-card" style="animation-delay:${i*0.05}s">
      <div class="player-avatar">
        ${p.emoji}
        ${['Diamond','Ace','Elite'].includes(p.rank) ? '<div class="diamond-badge">💎 Top</div>' : ''}
      </div>
      <div class="player-info">
        <div class="player-name">${p.name}</div>
        <div class="player-game">🎮 ${p.game}</div>
        <div class="player-meta">
          <span class="rank-badge ${getRankClass(p.rank)}">${p.rank}</span>
          <span class="player-score">${p.score.toLocaleString()}</span>
        </div>
      </div>
    </div>
  `).join('');
}

function renderPlayers() { filterPlayers(); }

// ===== TOURNAMENTS =====
const tournamentsData = [
  { id:1, name:'ArenaX Season 5', game:'Valorant', prize:'$5,000', date:'Jun 20', slots:10, filled:7, icon:'🎯' },
  { id:2, name:'PUBG Battle Royale Cup', game:'PUBG', prize:'$3,000', date:'Jun 22', slots:10, filled:4, icon:'🔫' },
  { id:3, name:'Fortnite Frenzy Open', game:'Fortnite', prize:'$2,000', date:'Jun 25', slots:10, filled:9, icon:'🔥' },
  { id:4, name:'CoD Warzone Championship', game:'Call of Duty', prize:'$4,000', date:'Jun 28', slots:10, filled:2, icon:'💥' },
  { id:5, name:'FIFA 25 Ultimate Cup', game:'FIFA 25', prize:'$1,500', date:'Jul 1', slots:10, filled:5, icon:'⚽' },
];

function renderTournaments() {
  document.getElementById('tournamentGrid').innerHTML = tournamentsData.map(t => `
    <div class="tournament-card">
      <div class="t-card-header">
        <div class="t-icon">${t.icon}</div>
        <div><h3>${t.name}</h3><p>${t.game}</p></div>
      </div>
      <div class="t-card-body">
        <div class="t-meta">
          <div class="t-meta-item"><label>Prize Pool</label><span class="t-prize">${t.prize}</span></div>
          <div class="t-meta-item"><label>Date</label><span>${t.date}</span></div>
          <div class="t-meta-item"><label>Entry Fee</label><span>$25</span></div>
          <div class="t-meta-item"><label>Slots</label><span>${t.filled}/${t.slots}</span></div>
        </div>
        <div class="progress-bar"><div class="progress-fill" style="width:${(t.filled/t.slots)*100}%"></div></div>
        <div class="t-slots-text">${t.slots - t.filled} slots remaining</div>
        <button class="btn-register" onclick="prefillTournament('${t.name}')">Register Now</button>
      </div>
    </div>
  `).join('');
}

function prefillTournament(name) {
  document.getElementById('regTournament').value = name;
  document.getElementById('regForm').scrollIntoView({behavior:'smooth'});
}

// ===== PAYMENT =====
let selectedPaymentMethod = '';
function selectPayment(el, method) {
  document.querySelectorAll('.pay-option').forEach(e => e.classList.remove('selected'));
  el.classList.add('selected');
  selectedPaymentMethod = method;
  document.getElementById('selectedPayment').value = method;
  document.getElementById('paymentDetails').style.display = 'block';
  const labels = {jazzcash:'JazzCash Transaction ID *',easypaisa:'EasyPaisa Transaction ID *',stripe:'Stripe Reference ID *',usdt:'USDT Transaction Hash *'};
  document.getElementById('payDetailLabel').textContent = labels[method];
}

// ===== TOURNAMENT REGISTRATION =====
function submitRegistration(e) {
  e.preventDefault();
  let valid = true;
  const fields = [
    ['regFname','err-regFname','First name required'],
    ['regLname','err-regLname','Last name required'],
    ['regEmail','err-regEmail','Valid email required'],
    ['regGame','err-regGame','Select a game'],
    ['regTournament','err-regTournament','Select a tournament']
  ];
  fields.forEach(([id,err,msg]) => {
    const v = document.getElementById(id).value.trim();
    const errEl = document.getElementById(err);
    if (!v) { errEl.textContent=msg; errEl.classList.add('show'); valid=false; }
    else { errEl.classList.remove('show'); }
  });
  if (!selectedPaymentMethod) {
    document.getElementById('err-payment').classList.add('show'); valid=false;
  } else { document.getElementById('err-payment').classList.remove('show'); }
  if (selectedPaymentMethod) {
    const tx = document.getElementById('transactionId').value.trim();
    if (!tx) { document.getElementById('err-transaction').classList.add('show'); valid=false; }
    else document.getElementById('err-transaction').classList.remove('show');
  }
  if (!valid) return;

  const parts = DB.get('arenaParticipants');
  if (parts.length >= 10) { showToast('Tournament is full! (10/10 slots)', 'error'); return; }

  const email = document.getElementById('regEmail').value.trim();
  if (parts.find(p => p.email === email)) { showToast('You are already registered!', 'error'); return; }

  const newPart = {
    id: Date.now(),
    name: document.getElementById('regFname').value + ' ' + document.getElementById('regLname').value,
    email,
    game: document.getElementById('regGame').value,
    tournament: document.getElementById('regTournament').value,
    payment: selectedPaymentMethod.toUpperCase(),
    txId: document.getElementById('transactionId').value,
    paymentStatus: 'Paid',
    status: 'Confirmed',
    date: new Date().toLocaleDateString()
  };
  parts.push(newPart);
  DB.set('arenaParticipants', parts);
  document.getElementById('regForm').reset();
  selectedPaymentMethod = '';
  document.querySelectorAll('.pay-option').forEach(e => e.classList.remove('selected'));
  document.getElementById('paymentDetails').style.display = 'none';
  renderParticipants();
  showToast('🎉 Registration successful! Payment confirmed.');
}

function renderParticipants() {
  const parts = DB.get('arenaParticipants');
  document.getElementById('participantCount').textContent = parts.length;
  document.getElementById('participantProgress').style.width = (parts.length/10*100)+'%';
  const tbody = document.getElementById('participantsList');
  tbody.innerHTML = parts.map((p,i) => `
    <tr>
      <td>${i+1}</td><td>${p.name}</td><td>${p.game}</td>
      <td>${p.tournament}</td>
      <td><span class="badge badge-live">${p.payment} ✓</span></td>
      <td><span class="badge badge-live">Confirmed</span></td>
      <td><button class="btn-sm btn-delete" onclick="removeParticipant(${p.id})">Remove</button></td>
    </tr>
  `).join('') || '<tr><td colspan="7" style="text-align:center;color:var(--text2)">No registrations yet</td></tr>';
}

function removeParticipant(id) {
  const parts = DB.get('arenaParticipants').filter(p => p.id !== id);
  DB.set('arenaParticipants', parts);
  renderParticipants();
  showToast('Registration removed');
}

// ===== LEADERBOARD =====
function getLeaderboard() {
  const stored = DB.get('arenaLeaderboard');
  if (stored.length) return stored;
  const defaults = [
    {id:1,name:'NinjaX',game:'PUBG',score:3200,wins:15,losses:3},
    {id:2,name:'AceNova',game:'Call of Duty',score:3100,wins:14,losses:4},
    {id:3,name:'StormKing',game:'PUBG',score:2900,wins:12,losses:5},
    {id:4,name:'QuantumX',game:'Valorant',score:2700,wins:11,losses:6},
    {id:5,name:'BladeRunner',game:'PUBG',score:2600,wins:10,losses:7},
    {id:6,name:'BlazeFire',game:'Fortnite',score:2800,wins:13,losses:4},
  ];
  DB.set('arenaLeaderboard', defaults);
  return defaults;
}

function renderLeaderboard() {
  const entries = getLeaderboard().sort((a,b) => b.score - a.score);
  const medals = ['🥇','🥈','🥉'];
  document.getElementById('leaderboardBody').innerHTML = entries.map((e,i) => `
    <tr class="${i < 3 ? 'rank-'+(i+1) : ''}">
      <td><span class="rank-medal">${medals[i] || (i+1)}</span></td>
      <td><strong>${e.name}</strong></td>
      <td>${e.game}</td>
      <td><span class="score-val">${e.score.toLocaleString()}</span></td>
      <td>${e.wins}W / ${e.losses}L</td>
    </tr>
  `).join('');
}

function addLeaderboardEntry() {
  const name = document.getElementById('lbName').value.trim();
  const game = document.getElementById('lbGame').value.trim();
  const score = parseInt(document.getElementById('lbScore').value);
  if (!name || !game || isNaN(score)) { showToast('Fill all fields correctly','error'); return; }
  const entries = getLeaderboard();
  entries.push({id:Date.now(),name,game,score,wins:0,losses:0});
  DB.set('arenaLeaderboard',entries);
  document.getElementById('lbName').value='';
  document.getElementById('lbGame').value='';
  document.getElementById('lbScore').value='';
  renderLeaderboard();
  showToast('Player added to leaderboard!');
}

// ===== CONTACT =====
function submitContact(e) {
  e.preventDefault();
  let valid = true;
  const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const chk = (id,err,check) => {
    const v = document.getElementById(id).value.trim();
    const el = document.getElementById(err);
    if (!check(v)) { el.classList.add('show'); valid=false; }
    else el.classList.remove('show');
  };
  chk('cName','err-cName',v=>v.length>1);
  chk('cEmail','err-cEmail',v=>emailRx.test(v));
  chk('cSubject','err-cSubject',v=>v.length>2);
  chk('cMessage','err-cMessage',v=>v.length>5);
  if (!valid) return;

  const msgs = DB.get('arenaContacts');
  msgs.push({
    id:Date.now(),
    name:document.getElementById('cName').value,
    email:document.getElementById('cEmail').value,
    subject:document.getElementById('cSubject').value,
    message:document.getElementById('cMessage').value,
    date:new Date().toLocaleDateString()
  });
  DB.set('arenaContacts',msgs);
  e.target.reset();
  showToast('📩 Message sent! We\'ll reply within 24 hours.');
}

// ===== AUTH — SIGNUP =====
function validateEmailRealTime() {
  const rx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const v = document.getElementById('semail').value;
  if (v.length < 3) { hideEl('err-semail'); hideEl('ok-semail'); return; }
  if (rx.test(v)) {
    document.getElementById('err-semail').classList.remove('show');
    document.getElementById('ok-semail').classList.add('show');
  } else {
    document.getElementById('err-semail').textContent = '❌ Invalid email format';
    document.getElementById('err-semail').classList.add('show');
    document.getElementById('ok-semail').classList.remove('show');
  }
}

function checkStrength() {
  const pw = document.getElementById('spw').value;
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[a-z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[@#$%!^&*]/.test(pw)) score++;
  const fill = document.getElementById('strengthFill');
  const text = document.getElementById('strengthText');
  const levels = [
    {w:'0%',c:'#ef4444',t:''},
    {w:'20%',c:'#ef4444',t:'Very Weak'},
    {w:'40%',c:'#f59e0b',t:'Weak'},
    {w:'60%',c:'#f59e0b',t:'Fair'},
    {w:'80%',c:'#06b6d4',t:'Strong'},
    {w:'100%',c:'#10b981',t:'Very Strong ✅'}
  ];
  fill.style.width = levels[score].w;
  fill.style.background = levels[score].c;
  text.textContent = levels[score].t;
  text.style.color = levels[score].c;
}

function checkConfirm() {
  const pw1 = document.getElementById('spw').value;
  const pw2 = document.getElementById('spw2').value;
  if (pw2.length === 0) { hideEl('err-spw2'); hideEl('ok-spw2'); return; }
  if (pw1 === pw2) {
    document.getElementById('err-spw2').classList.remove('show');
    document.getElementById('ok-spw2').classList.add('show');
  } else {
    document.getElementById('err-spw2').textContent = '❌ Passwords do not match';
    document.getElementById('err-spw2').classList.add('show');
    document.getElementById('ok-spw2').classList.remove('show');
  }
}

function togglePw(inputId, toggleId) {
  const inp = document.getElementById(inputId);
  const tog = document.getElementById(toggleId);
  if (inp.type === 'password') { inp.type = 'text'; tog.textContent = '👁️'; }
  else { inp.type = 'password'; tog.textContent = '🙈'; }
}

function hideEl(...ids) { ids.forEach(id => { const el=document.getElementById(id); if(el) el.classList.remove('show'); }); }

function handleSignup(e) {
  e.preventDefault();
  let valid = true;
  const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const pwRx = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%!^&*]).{8,}$/;

  const fname = document.getElementById('sfname').value.trim();
  const lname = document.getElementById('slname').value.trim();
  const age = parseInt(document.getElementById('sage').value);
  const email = document.getElementById('semail').value.trim();
  const pw = document.getElementById('spw').value;
  const pw2 = document.getElementById('spw2').value;

  if (!fname) { showErr('err-sfname','First name required'); valid=false; } else hideErr('err-sfname');
  if (!lname) { showErr('err-slname','Last name required'); valid=false; } else hideErr('err-slname');
  if (!age || age < 13 || age > 99) { showErr('err-sage','Valid age required (13–99)'); valid=false; } else hideErr('err-sage');
  if (!emailRx.test(email)) { showErr('err-semail','❌ Invalid email format'); valid=false; } else hideErr('err-semail');
  if (!pwRx.test(pw)) {
    showErr('err-spw','Must have 8+ chars, uppercase, lowercase, number, special char');
    valid=false;
  } else hideErr('err-spw');
  if (pw !== pw2) { showErr('err-spw2','❌ Passwords do not match'); valid=false; } else hideErr('err-spw2');

  if (!valid) return;

  const users = DB.get('arenaUsers');
  if (users.find(u => u.email === email)) {
    showErr('err-semail','Email already registered');
    return;
  }
  users.push({ id:Date.now(), fname, lname, age, email, pw, joined: new Date().toLocaleDateString() });
  DB.set('arenaUsers', users);
  DB.setObj('arenaSession', { loggedIn:true, email, name:fname+' '+lname, fname });
  updateAuthNav();
  showToast('🎉 Account created! Welcome to ArenaX.');
  showPage('profile');
}

// ===== AUTH — LOGIN =====
function handleLogin(e) {
  e.preventDefault();
  const email = document.getElementById('lemail').value.trim();
  const pw = document.getElementById('lpw').value;
  let valid = true;
  if (!email) { showErr('err-lemail','Email required'); valid=false; } else hideErr('err-lemail');
  if (!pw) { showErr('err-lpw','Password required'); valid=false; } else hideErr('err-lpw');
  if (!valid) return;

  const users = DB.get('arenaUsers');
  const user = users.find(u => u.email === email && u.pw === pw);
  if (!user) { showErr('err-lpw','Invalid email or password'); return; }

  DB.setObj('arenaSession', { loggedIn:true, email, name:user.fname+' '+user.lname, fname:user.fname });
  updateAuthNav();
  showToast('👋 Welcome back, ' + user.fname + '!');
  showPage('profile');
}

function logout() {
  DB.setObj('arenaSession', { loggedIn:false });
  updateAuthNav();
  showPage('home');
  showToast('Logged out successfully');
}

function updateAuthNav() {
  const sess = DB.getObj('arenaSession');
  const area = document.getElementById('authNavArea');
  if (sess.loggedIn) {
    area.innerHTML = `
      <span style="font-size:0.85rem;color:var(--text2);margin-right:0.5rem">👤 ${sess.fname}</span>
      <button class="btn-nav" onclick="showPage('profile')">Profile</button>
    `;
  } else {
    area.innerHTML = `
      <button class="btn-nav" onclick="showPage('signup')">Sign Up</button>
      <button class="btn-nav" onclick="showPage('login')" style="margin-left:0.3rem">Login</button>
    `;
  }
}

// ===== PROFILE =====
function renderProfile() {
  const sess = DB.getObj('arenaSession');
  if (!sess.loggedIn) { showPage('login'); return; }
  const users = DB.get('arenaUsers');
  const user = users.find(u => u.email === sess.email);
  if (!user) return;
  document.getElementById('profileName').textContent = user.fname + ' ' + user.lname;
  document.getElementById('profileEmail').textContent = user.email;
  document.getElementById('profileAvatar').textContent = user.fname[0].toUpperCase();
  const parts = DB.get('arenaParticipants').filter(p => p.email === user.email);
  document.getElementById('pTournaments').textContent = parts.length;
  const lb = DB.get('arenaLeaderboard');
  const lbEntry = lb.find(e => e.name.toLowerCase().includes(user.fname.toLowerCase()));
  document.getElementById('pScore').textContent = lbEntry ? lbEntry.score.toLocaleString() : '—';
  const sorted = [...lb].sort((a,b)=>b.score-a.score);
  const rank = sorted.findIndex(e => e.name.toLowerCase().includes(user.fname.toLowerCase()));
  document.getElementById('pRank').textContent = rank >= 0 ? '#'+(rank+1) : '—';
  document.getElementById('pWins').textContent = lbEntry ? lbEntry.wins : '0';
  updateThemeChips();
}

// ===== HELPERS =====
function showErr(id,msg) { const el=document.getElementById(id); if(el){el.textContent=msg; el.classList.add('show');} }
function hideErr(id) { const el=document.getElementById(id); if(el) el.classList.remove('show'); }

// ===== ADMIN PANEL =====
function adminLogin(e) {
  e.preventDefault();
  const email = document.getElementById('adminEmail').value;
  const pw = document.getElementById('adminPw').value;
  if (email === 'admin@arenax.pk' && pw === 'admin123') {
    document.getElementById('adminLoginGate').style.display = 'none';
    document.getElementById('adminDashboard').style.display = 'block';
    renderAdminStats();
    adminSection('users');
    showToast('🔐 Admin access granted');
  } else {
    showToast('Invalid admin credentials','error');
  }
}

function adminLogout() {
  document.getElementById('adminLoginGate').style.display = 'block';
  document.getElementById('adminDashboard').style.display = 'none';
}

function adminSection(sec) {
  ['users','participants','contacts','leaderboard'].forEach(s => {
    const el = document.getElementById('admin-'+s);
    if(el) el.style.display = s===sec ? 'block':'none';
  });
  document.querySelectorAll('.admin-nav-item').forEach(el => el.classList.remove('active'));
  const items = document.querySelectorAll('.admin-nav-item');
  const map = {users:0,participants:1,contacts:2,leaderboard:3};
  if(items[map[sec]]) items[map[sec]].classList.add('active');
  if (sec==='users') renderAdminUsers();
  if (sec==='participants') renderAdminParticipants();
  if (sec==='contacts') renderAdminContacts();
  if (sec==='leaderboard') renderAdminLeaderboard();
}

function renderAdminStats() {
  document.getElementById('aStatUsers').textContent = DB.get('arenaUsers').length;
  document.getElementById('aStatPart').textContent = DB.get('arenaParticipants').length;
  document.getElementById('aStatMsg').textContent = DB.get('arenaContacts').length;
  document.getElementById('aStatLb').textContent = DB.get('arenaLeaderboard').length;
}

function renderAdminUsers() {
  const users = DB.get('arenaUsers');
  document.getElementById('adminUsersTable').innerHTML = users.map((u,i) => `
    <tr>
      <td>${i+1}</td><td>${u.fname} ${u.lname}</td>
      <td>${u.email}</td><td>${u.age}</td><td>${u.joined}</td>
      <td>
        <button class="btn-sm btn-edit" onclick="editUser(${u.id})">Edit</button>
        <button class="btn-sm btn-delete" onclick="deleteUser(${u.id})">Delete</button>
      </td>
    </tr>
  `).join('') || '<tr><td colspan="6" style="text-align:center;color:var(--text2)">No users yet</td></tr>';
}

function renderAdminParticipants() {
  const parts = DB.get('arenaParticipants');
  document.getElementById('adminPartTable').innerHTML = parts.map((p,i) => `
    <tr>
      <td>${i+1}</td><td>${p.name}</td><td>${p.email}</td>
      <td>${p.game}</td><td>${p.tournament}</td>
      <td><span class="badge badge-live">${p.payment}</span></td>
      <td><button class="btn-sm btn-delete" onclick="adminDeletePart(${p.id})">Delete</button></td>
    </tr>
  `).join('') || '<tr><td colspan="7" style="text-align:center;color:var(--text2)">No participants</td></tr>';
}

function renderAdminContacts() {
  const msgs = DB.get('arenaContacts');
  document.getElementById('adminContactTable').innerHTML = msgs.map((m,i) => `
    <tr>
      <td>${i+1}</td><td>${m.name}</td><td>${m.email}</td>
      <td>${m.subject}</td>
      <td style="max-width:200px;overflow:hidden;text-overflow:ellipsis">${m.message.substring(0,50)}...</td>
      <td><button class="btn-sm btn-delete" onclick="adminDeleteContact(${m.id})">Delete</button></td>
    </tr>
  `).join('') || '<tr><td colspan="6" style="text-align:center;color:var(--text2)">No messages</td></tr>';
}

function renderAdminLeaderboard() {
  const entries = getLeaderboard().sort((a,b)=>b.score-a.score);
  document.getElementById('adminLbTable').innerHTML = entries.map((e,i) => `
    <tr>
      <td>${i+1}</td><td>${e.name}</td><td>${e.game}</td>
      <td>${e.score}</td>
      <td>
        <button class="btn-sm btn-edit" onclick="editLbEntry(${e.id})">Edit</button>
        <button class="btn-sm btn-delete" onclick="deleteLbEntry(${e.id})">Delete</button>
      </td>
    </tr>
  `).join('');
}

// ===== ADMIN CRUD =====
function deleteUser(id) {
  if (!confirm('Delete this user?')) return;
  DB.set('arenaUsers', DB.get('arenaUsers').filter(u=>u.id!==id));
  renderAdminUsers(); renderAdminStats();
  showToast('User deleted');
}
function adminDeletePart(id) {
  DB.set('arenaParticipants', DB.get('arenaParticipants').filter(p=>p.id!==id));
  renderAdminParticipants(); renderAdminStats();
  showToast('Participant removed');
}
function adminDeleteContact(id) {
  DB.set('arenaContacts', DB.get('arenaContacts').filter(m=>m.id!==id));
  renderAdminContacts(); renderAdminStats();
  showToast('Message deleted');
}
function deleteLbEntry(id) {
  DB.set('arenaLeaderboard', DB.get('arenaLeaderboard').filter(e=>e.id!==id));
  renderAdminLeaderboard(); renderAdminStats();
  showToast('Entry deleted');
}

function editUser(id) {
  const user = DB.get('arenaUsers').find(u=>u.id===id);
  if (!user) return;
  document.getElementById('modalTitle').textContent = 'Edit User';
  document.getElementById('modalBody').innerHTML = `
    <div class="form-group"><label>First Name</label><input id="eu_fname" value="${user.fname}"></div>
    <div class="form-group"><label>Last Name</label><input id="eu_lname" value="${user.lname}"></div>
    <div class="form-group"><label>Age</label><input type="number" id="eu_age" value="${user.age}"></div>
    <div class="form-group"><label>Email</label><input id="eu_email" value="${user.email}"></div>
    <button class="btn-primary" style="width:100%" onclick="saveUser(${id})">Save Changes</button>
  `;
  document.getElementById('modalOverlay').classList.add('open');
}

function saveUser(id) {
  const users = DB.get('arenaUsers');
  const idx = users.findIndex(u=>u.id===id);
  users[idx].fname = document.getElementById('eu_fname').value;
  users[idx].lname = document.getElementById('eu_lname').value;
  users[idx].age = document.getElementById('eu_age').value;
  users[idx].email = document.getElementById('eu_email').value;
  DB.set('arenaUsers',users);
  closeModal(); renderAdminUsers();
  showToast('User updated');
}

function editLbEntry(id) {
  const entry = DB.get('arenaLeaderboard').find(e=>e.id===id);
  if (!entry) return;
  document.getElementById('modalTitle').textContent = 'Edit Score';
  document.getElementById('modalBody').innerHTML = `
    <div class="form-group"><label>Player Name</label><input id="el_name" value="${entry.name}"></div>
    <div class="form-group"><label>Game</label><input id="el_game" value="${entry.game}"></div>
    <div class="form-group"><label>Score</label><input type="number" id="el_score" value="${entry.score}"></div>
    <button class="btn-primary" style="width:100%" onclick="saveLbEntry(${id})">Save</button>
  `;
  document.getElementById('modalOverlay').classList.add('open');
}

function saveLbEntry(id) {
  const entries = DB.get('arenaLeaderboard');
  const idx = entries.findIndex(e=>e.id===id);
  entries[idx].name = document.getElementById('el_name').value;
  entries[idx].game = document.getElementById('el_game').value;
  entries[idx].score = parseInt(document.getElementById('el_score').value);
  DB.set('arenaLeaderboard',entries);
  closeModal(); renderAdminLeaderboard();
  showToast('Score updated');
}

function openAddUserModal() {
  document.getElementById('modalTitle').textContent = 'Add New User';
  document.getElementById('modalBody').innerHTML = `
    <div class="form-group"><label>First Name</label><input id="au_fname" placeholder="Ahmad"></div>
    <div class="form-group"><label>Last Name</label><input id="au_lname" placeholder="Khan"></div>
    <div class="form-group"><label>Age</label><input type="number" id="au_age" placeholder="20"></div>
    <div class="form-group"><label>Email</label><input id="au_email" placeholder="email@example.com"></div>
    <div class="form-group"><label>Password</label><input type="password" id="au_pw" placeholder="password"></div>
    <button class="btn-primary" style="width:100%" onclick="addUserFromAdmin()">Add User</button>
  `;
  document.getElementById('modalOverlay').classList.add('open');
}

function addUserFromAdmin() {
  const fname=document.getElementById('au_fname').value.trim();
  const lname=document.getElementById('au_lname').value.trim();
  const age=document.getElementById('au_age').value;
  const email=document.getElementById('au_email').value.trim();
  const pw=document.getElementById('au_pw').value;
  if(!fname||!lname||!email||!pw){showToast('All fields required','error');return;}
  const users=DB.get('arenaUsers');
  users.push({id:Date.now(),fname,lname,age,email,pw,joined:new Date().toLocaleDateString()});
  DB.set('arenaUsers',users);
  closeModal(); renderAdminUsers(); renderAdminStats();
  showToast('User added successfully');
}

function closeModal() { document.getElementById('modalOverlay').classList.remove('open'); }
document.getElementById('modalOverlay').addEventListener('click', function(e) {
  if(e.target===this) closeModal();
});

// ===== INIT =====
updateAuthNav();
renderParticipants();