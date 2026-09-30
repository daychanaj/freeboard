const firebaseConfig = {
  apiKey: 'AIzaSyC8Rv4MS9GX8Gl3RB5kMRyU-DDvPwcMWgA',
  authDomain: 'iot-212-64025.firebaseapp.com',
  databaseURL: 'https://iot-212-64025-default-rtdb.asia-southeast1.firebasedatabase.app',
  projectId: 'iot-212-64025',
  storageBucket: 'iot-212-64025.firebasestorage.app',
  messagingSenderId: '433282901324',
  appId: '1:433282901324:web:ecbce88158584ae9b69be9',
  measurementId: 'G-QY3JNN24KB',
};

const $ = (id) => document.getElementById(id);
const palette = ['#5ce3c5', '#f1d17b', '#ffad70', '#ff8493'];
const levels = ['เหมาะสม', 'เฝ้าสังเกต', 'ควรปรับปรุง', 'สูง / ต่ำมาก'];
const scores = [100, 75, 45, 15];
const metrics = [
  { key: 'temp', name: 'อุณหภูมิ', unit: '°C', decimals: 1, color: '#ffb38a', max: 45, target: 'ช่วงแนะนำ 24–28 °C', rule: '24–28: เขียว · 22–30: เหลือง · 18–34: ส้ม · นอกช่วง: แดง', level: v => v >= 24 && v <= 28 ? 0 : v >= 22 && v <= 30 ? 1 : v >= 18 && v <= 34 ? 2 : 3, icon: '<path d="M10 14.5V5a2 2 0 0 1 4 0v9.5a4 4 0 1 1-4 0Z"/><path d="M12 9v9"/>', advice: 'ปรับอุณหภูมิให้เหมาะกับการเรียน', detail: 'ตรวจระบบปรับอากาศหรือพัดลม แล้วปรับให้ห้องอยู่ในช่วงอุณหภูมิที่สบาย' },
  { key: 'humi', name: 'ความชื้น', unit: '%', decimals: 1, color: '#7dbdff', max: 100, target: 'ช่วงแนะนำ 40–60%', rule: '40–60: เขียว · 30–70: เหลือง · 20–80: ส้ม · นอกช่วง: แดง', level: v => v >= 40 && v <= 60 ? 0 : v >= 30 && v <= 70 ? 1 : v >= 20 && v <= 80 ? 2 : 3, icon: '<path d="M12 3S5 11 5 15a7 7 0 0 0 14 0c0-4-7-12-7-12Z"/><path d="M9 16a3 3 0 0 0 3 3"/>', advice: 'ดูแลความชื้นในห้องเรียน', detail: 'ตรวจความชื้นและปรับการระบายอากาศหรือเครื่องปรับอากาศให้เหมาะสม' },
  { key: 'co2', name: 'คาร์บอนไดออกไซด์', unit: 'ppm', decimals: 0, color: '#5ce3c5', max: 2000, target: 'ช่วงแนะนำ ≤ 800 ppm', rule: '≤800: เขียว · ≤1000: เหลือง · ≤1500: ส้ม · >1500: แดง', level: v => v <= 800 ? 0 : v <= 1000 ? 1 : v <= 1500 ? 2 : 3, icon: '<path d="M3 8h11a3 3 0 1 0-3-3M3 12h15a3 3 0 1 1-3 3M3 16h5"/>', advice: 'เพิ่มการระบายอากาศในห้อง', detail: 'ค่า CO₂ สูงขึ้น ควรตรวจการระบายอากาศ หากอากาศภายนอกสะอาดจึงเปิดประตูหรือหน้าต่างช่วยถ่ายเท' },
  { key: 'pm25', name: 'ฝุ่นละออง PM2.5', unit: 'µg/m³', decimals: 1, color: '#b6a2f9', max: 100, target: 'ช่วงแนะนำ ≤ 15 µg/m³', rule: '≤15: เขียว · ≤25: เหลือง · ≤50: ส้ม · >50: แดง', level: v => v <= 15 ? 0 : v <= 25 ? 1 : v <= 50 ? 2 : 3, icon: '<circle cx="7" cy="7" r="2"/><circle cx="17" cy="8" r="3"/><circle cx="10" cy="17" r="3"/><path d="M19 17h.01M3 14h.01M12 3h.01"/>', advice: 'ตรวจแหล่งฝุ่นและระบบกรองอากาศ', detail: 'ค่าฝุ่นในห้องสูงขึ้น ลองตรวจแหล่งกำเนิดฝุ่นและเปิดเครื่องฟอกอากาศ ตรวจคุณภาพอากาศภายนอกก่อนเปิดหน้าต่าง' },
  { key: 'light', name: 'ความสว่าง', unit: 'lux', decimals: 0, color: '#f1d17b', max: 1200, target: 'ช่วงแนะนำ 300–750 lux', rule: '300–750: เขียว · 200–1000: เหลือง · 100–1200: ส้ม · นอกช่วง: แดง', level: v => v >= 300 && v <= 750 ? 0 : v >= 200 && v <= 1000 ? 1 : v >= 100 && v <= 1200 ? 2 : 3, icon: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5"/>', advice: 'ปรับแสงให้พอดีกับการอ่าน', detail: 'ตรวจแสงบนโต๊ะเรียน ปรับโคมไฟหรือม่านเพื่อลดแสงจ้าและบริเวณที่มืดเกินไป' },
  { key: 'noise', name: 'ระดับเสียง', unit: 'dB', decimals: 1, color: '#f09fc7', max: 100, target: 'ช่วงแนะนำ ≤ 50 dB', rule: '≤50: เขียว · ≤60: เหลือง · ≤70: ส้ม · >70: แดง', level: v => v <= 50 ? 0 : v <= 60 ? 1 : v <= 70 ? 2 : 3, icon: '<path d="M3 10v4h4l5 4V6L7 10H3Zm13-3a7 7 0 0 1 0 10m3-13a11 11 0 0 1 0 16"/>', advice: 'ลดเสียงรบกวน เพิ่มสมาธิ', detail: 'ตรวจแหล่งเสียงใกล้ห้องเรียน ลดเสียงสนทนาหรืออุปกรณ์ที่รบกวนการเรียน' },
];
let latest = null;
let history = [];
let chart = null;
let chartFailed = false;
let connected = false;
let latestLoaded = false;
let historyLoaded = false;
let serverOffset = 0;
const errors = new Map();
const unsubscribers = [];
const thaiTime = new Intl.DateTimeFormat('th-TH', { timeZone: 'Asia/Bangkok', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
const thaiDate = new Intl.DateTimeFormat('th-TH', { timeZone: 'Asia/Bangkok', day: 'numeric', month: 'short', year: 'numeric' });
const fullDate = new Intl.DateTimeFormat('th-TH', { timeZone: 'Asia/Bangkok', day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
const valid = v => typeof v === 'number' && Number.isFinite(v);
const fmt = (v, m) => valid(v) ? v.toLocaleString('en-US', { minimumFractionDigits: m.decimals, maximumFractionDigits: m.decimals }) : '—';
const validTimestamp = v => valid(v) && v > 0 && v < 8640000000000;

// Never substitute demo data. Invalid fields remain visibly unavailable.
function normalize(raw) {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return null;
  const record = { timestamp: validTimestamp(raw.timestamp) ? raw.timestamp : null, device_id: typeof raw.device_id === 'string' ? raw.device_id.slice(0, 80) : 'esp32-01' };
  for (const m of metrics) record[m.key] = valid(raw[m.key]) && (m.key === 'temp' || raw[m.key] >= 0) && (m.key !== 'humi' || raw[m.key] <= 100) ? raw[m.key] : null;
  return record;
}

for (const m of metrics) {
  const card = document.createElement('article');
  card.className = 'sensor-card';
  card.style.setProperty('--accent', m.color);
  card.innerHTML = `<div class="sensor-top"><span class="sensor-icon"><svg viewBox="0 0 24 24" aria-hidden="true">${m.icon}</svg></span><span class="sensor-status" id="status-${m.key}">รอข้อมูล</span></div><h3>${m.name}</h3><div class="sensor-reading"><strong class="sensor-value" id="value-${m.key}">—</strong><span class="sensor-unit">${m.unit}</span></div><div class="sensor-bottom"><div class="meter" aria-hidden="true"><span id="meter-${m.key}"></span></div><span>${m.target}</span></div>`;
  $('sensor-grid').append(card);
  const rule = document.createElement('div');
  rule.className = 'threshold-item';
  rule.innerHTML = `<strong>${m.name} (${m.unit})</strong><br>${m.rule}`;
  $('threshold-details').append(rule);
}

function renderNotice() {
  const messages = [...errors.values()];
  if (latestLoaded && latest && !latest.timestamp) messages.push('ข้อมูลล่าสุดไม่มี timestamp ที่ถูกต้อง จึงยังตรวจสถานะบอร์ดไม่ได้');
  if (latestLoaded && latest && metrics.some(m => !valid(latest[m.key]))) messages.push('เซ็นเซอร์บางค่าขาดหายหรือไม่ถูกต้อง แสดง — สำหรับค่าที่ใช้ไม่ได้');
  $('notice').textContent = messages.join(' • ');
  $('notice').hidden = !messages.length;
}

function renderLatest() {
  for (const m of metrics) {
    const value = latest?.[m.key];
    const el = $(`value-${m.key}`);
    const formatted = fmt(value, m);
    if (el.textContent !== formatted) {
      el.textContent = formatted;
      el.classList.remove('fresh');
      void el.offsetWidth;
      el.classList.add('fresh');
    }
    const level = valid(value) ? m.level(value) : -1;
    $(`status-${m.key}`).textContent = level < 0 ? 'ไม่มีข้อมูล' : levels[level];
    $(`status-${m.key}`).style.color = level < 0 ? 'var(--muted)' : palette[level];
    $(`meter-${m.key}`).style.width = `${valid(value) ? Math.min(100, Math.max(0, value / m.max * 100)) : 0}%`;
  }
  $('device-name').textContent = (latest?.device_id || 'esp32-01').toUpperCase();
  $('last-update').textContent = latest?.timestamp ? thaiTime.format(new Date(latest.timestamp * 1000)) : '—';
  $('last-update').title = latest?.timestamp ? fullDate.format(new Date(latest.timestamp * 1000)) : '';
  renderScore();
  renderFreshness();
  renderNotice();
}

function renderScore() {
  const weights = { co2: .3, pm25: .3, temp: .15, humi: .1, noise: .15 };
  const complete = latest && Object.keys(weights).every(k => valid(latest[k]));
  const score = complete ? Math.round(metrics.filter(m => weights[m.key]).reduce((n, m) => n + weights[m.key] * scores[m.level(latest[m.key])], 0)) : null;
  const level = score === null ? -1 : score >= 85 ? 0 : score >= 65 ? 1 : score >= 40 ? 2 : 3;
  $('score-value').textContent = score ?? '—';
  $('score-label').textContent = level < 0 ? 'รอข้อมูลครบ 5 ปัจจัย' : ['บรรยากาศดี', 'พอใช้ · ปรับได้อีก', 'ควรปรับสภาพแวดล้อม', 'ควรตรวจสอบห้องเรียน'][level];
  $('score-label').style.color = level < 0 ? 'var(--muted)' : palette[level];
  $('score-ring').style.color = level < 0 ? 'var(--muted)' : palette[level];
  $('ring-progress').style.strokeDashoffset = 414.69 * (1 - (score ?? 0) / 100);
  const priority = [...metrics].filter(m => valid(latest?.[m.key])).sort((a, b) => b.level(latest[b.key]) - a.level(latest[a.key]) || (weights[b.key] || 0) - (weights[a.key] || 0));
  const worst = priority[0];
  $('advice-title').textContent = !worst ? 'รอข้อมูลจากห้องเรียน' : worst.level(latest[worst.key]) === 0 ? 'ห้องเรียนพร้อมสำหรับการเรียนรู้' : worst.advice;
  $('advice-text').textContent = !worst ? 'เปิดบอร์ดและเชื่อมต่อ Wi-Fi ข้อมูลจะปรากฏอัตโนมัติเมื่อ Firebase ได้รับค่า' : worst.level(latest[worst.key]) === 0 ? 'ค่าที่ได้รับอยู่ในช่วงแนะนำของโครงงาน รักษาการระบายอากาศ แสงสว่าง และบรรยากาศที่สงบไว้' : worst.detail;
}

function renderFreshness() {
  const now = Date.now() + serverOffset;
  const age = latest?.timestamp ? (now - latest.timestamp * 1000) / 1000 : null;
  const online = age !== null && age >= -5 && age <= 30;
  const status = $('device-status');
  const text = !latestLoaded ? 'กำลังเชื่อมต่อ' : !latest ? 'รอข้อมูลบอร์ด' : age === null ? 'ไม่ทราบสถานะ' : age < -5 ? 'เวลาบอร์ดคลาดเคลื่อน' : online ? 'Online · ส่งข้อมูลอยู่' : 'Offline · ข้อมูลเก่า';
  status.className = `badge ${online ? 'online' : latest && age !== null ? 'bad' : 'neutral'}`;
  status.replaceChildren(Object.assign(document.createElement('i'), { ariaHidden: 'true' }), document.createTextNode(text));
  $('today').textContent = thaiDate.format(new Date(now)) + ' · เวลาไทย';
  $('data-age').textContent = age === null ? '' : age < -5 ? 'ตรวจเวลา SNTP บนบอร์ด' : age < 60 ? `${Math.max(0, Math.floor(age))} วินาทีที่แล้ว` : age < 3600 ? `${Math.floor(age / 60)} นาทีที่แล้ว` : `${Math.floor(age / 3600)} ชั่วโมงที่แล้ว`;
  $('score-caption').textContent = latest && !online ? 'ข้อมูลล่าสุดที่ได้รับ · ยังไม่ใช่ค่าปัจจุบัน' : 'ประเมินจาก 5 ปัจจัย · เกณฑ์สาธิต';
  $('connection-status').textContent = connected ? '● ฐานข้อมูลเชื่อมต่อ' : '○ กำลังเชื่อมต่อใหม่';
  $('connection-status').style.color = connected ? 'var(--teal)' : 'var(--muted)';
}

function renderHistory() {
  const selected = metrics.find(m => m.key === $('sensor-select').value);
  $('history-summary').textContent = !historyLoaded ? 'กำลังโหลดข้อมูลย้อนหลังสูงสุด 50 รายการ' : history.length ? `${history.length} รายการ · ${thaiTime.format(new Date(history[0].timestamp * 1000))} – ${thaiTime.format(new Date(history.at(-1).timestamp * 1000))} น. (เวลาไทย)` : 'ยังไม่มีประวัติที่มี timestamp ถูกต้อง';
  $('chart-label').textContent = `${selected.name} (${selected.unit})`;
  $('chart-dot').style.background = selected.color;
  const numbers = history.map(r => r[selected.key]).filter(valid);
  const chartState = $('chart-state');
  chartState.hidden = !!(chart && numbers.length);
  chartState.textContent = chartFailed ? 'โหลดกราฟไม่สำเร็จ ตรวจอินเทอร์เน็ตแล้วรีเฟรช — ยังดูข้อมูลในตารางได้' : errors.has('history') ? errors.get('history') : !historyLoaded ? 'กำลังโหลดประวัติจาก Firebase…' : !numbers.length ? 'รอข้อมูลย้อนหลังจากบอร์ด' : !chart ? 'กำลังโหลดกราฟ…' : '';
  $('stat-min').textContent = numbers.length ? `${fmt(Math.min(...numbers), selected)} ${selected.unit}` : '—';
  $('stat-max').textContent = numbers.length ? `${fmt(Math.max(...numbers), selected)} ${selected.unit}` : '—';
  $('stat-avg').textContent = numbers.length ? `${fmt(numbers.reduce((a, b) => a + b, 0) / numbers.length, selected)} ${selected.unit}` : '—';
  if (chart) {
    chart.data.datasets[0].label = selected.name;
    chart.data.datasets[0].data = history.map(r => ({ x: r.timestamp * 1000, y: r[selected.key] }));
    chart.data.datasets[0].borderColor = selected.color;
    chart.data.datasets[0].backgroundColor = context => {
      const area = context.chart.chartArea;
      if (!area) return selected.color + '20';
      const gradient = context.chart.ctx.createLinearGradient(0, area.top, 0, area.bottom);
      gradient.addColorStop(0, selected.color + '38'); gradient.addColorStop(1, selected.color + '00');
      return gradient;
    };
    chart.options.scales.y.title.text = selected.unit;
    chart.options.plugins.tooltip.callbacks.label = context => `${selected.name}: ${fmt(context.parsed.y, selected)} ${selected.unit}`;
    chart.update('none');
    $('history-chart').setAttribute('aria-label', `กราฟ${selected.name} ${history.length} รายการ หน่วย ${selected.unit} มีข้อมูลแบบตารางด้านล่าง`);
  }
  const body = $('history-body');
  body.replaceChildren();
  for (const record of history.slice(-10).reverse()) {
    const tr = document.createElement('tr');
    const time = tr.insertCell(); time.textContent = thaiTime.format(new Date(record.timestamp * 1000)); time.title = fullDate.format(new Date(record.timestamp * 1000));
    for (const m of metrics) { const td = tr.insertCell(); td.textContent = fmt(record[m.key], m); }
    body.append(tr);
  }
  if (!history.length) { const tr = body.insertRow(); const td = tr.insertCell(); td.colSpan = 7; td.className = 'empty-cell'; td.textContent = errors.get('history') || (historyLoaded ? 'ยังไม่มีข้อมูลย้อนหลังจากบอร์ด' : 'กำลังโหลดข้อมูล…'); }
  $('table-count').textContent = `แสดง ${Math.min(history.length, 10)} จาก ${history.length} รายการที่โหลด`;
  $('export-button').disabled = !history.length;
}

async function initializeChart() {
  try {
    const { default: Chart } = await import('https://cdn.jsdelivr.net/npm/chart.js@4.4.8/auto/+esm');
    chart = new Chart($('history-chart'), {
      type: 'line', data: { datasets: [{ data: [], borderWidth: 2, pointRadius: 0, pointHoverRadius: 5, pointHitRadius: 14, tension: .28, fill: true, spanGaps: false }] },
      options: { responsive: true, maintainAspectRatio: false, animation: false, interaction: { mode: 'nearest', axis: 'x', intersect: false },
        plugins: { legend: { display: false }, tooltip: { backgroundColor: '#203746', padding: 12, titleFont: { family: 'Noto Sans Thai' }, bodyFont: { family: 'Noto Sans Thai' }, callbacks: { title: items => items.length ? fullDate.format(new Date(items[0].parsed.x)) : '' } } },
        scales: { x: { type: 'linear', grid: { display: false }, border: { display: false }, ticks: { maxTicksLimit: 7, color: '#8fa6b8', font: { size: 10 }, callback: value => thaiTime.format(new Date(value)) } }, y: { grid: { color: '#26374588', drawTicks: false }, border: { display: false }, title: { display: true, color: '#8fa6b8', text: '°C' }, ticks: { color: '#8fa6b8', maxTicksLimit: 5, padding: 12, font: { size: 10 } } } },
      },
    });
  } catch { chartFailed = true; }
  renderHistory();
}

function readError(path, error) {
  const denied = String(error.code).toLowerCase().includes('permission');
  errors.set(path, denied ? `ไม่มีสิทธิ์อ่าน ${path} — ตรวจ Firebase Rules ของ /lab` : `อ่าน ${path} ไม่สำเร็จ — ตรวจการเชื่อมต่ออินเทอร์เน็ตแล้วรีเฟรช`);
  if (path === 'latest') { latestLoaded = true; latest = null; renderLatest(); }
  if (path === 'history') { historyLoaded = true; renderHistory(); }
  renderNotice();
}

async function connectFirebase() {
  try {
    const [{ initializeApp }, { getDatabase, ref, onValue, query, orderByKey, limitToLast }] = await Promise.all([
      import('https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js'),
      import('https://www.gstatic.com/firebasejs/11.6.0/firebase-database.js'),
    ]);
    const db = getDatabase(initializeApp(firebaseConfig));
    unsubscribers.push(onValue(ref(db, '.info/connected'), snap => { connected = snap.val() === true; renderFreshness(); }));
    unsubscribers.push(onValue(ref(db, '.info/serverTimeOffset'), snap => { serverOffset = valid(snap.val()) ? snap.val() : 0; renderFreshness(); }));
    unsubscribers.push(onValue(ref(db, 'lab/esp32-01/latest'), snap => { latestLoaded = true; latest = normalize(snap.val()); errors.delete('latest'); errors.delete('timeout'); renderLatest(); }, error => readError('latest', error)));
    // ESPHome uses REST POST: push keys are chronological and need no custom index.
    const historyQuery = query(ref(db, 'lab/esp32-01/history'), orderByKey(), limitToLast(50));
    unsubscribers.push(onValue(historyQuery, snap => {
      historyLoaded = true; history = [];
      snap.forEach(child => { const record = normalize(child.val()); if (record?.timestamp) history.push({ ...record, key: child.key }); });
      history.sort((a, b) => a.timestamp - b.timestamp || a.key.localeCompare(b.key));
      errors.delete('history'); renderHistory(); renderNotice();
    }, error => readError('history', error)));
  } catch { errors.set('sdk', 'โหลด Firebase ไม่สำเร็จ ตรวจการเชื่อมต่ออินเทอร์เน็ตแล้วรีเฟรชหน้าเว็บ'); latestLoaded = true; historyLoaded = true; renderLatest(); renderHistory(); }
}

$('sensor-select').addEventListener('change', renderHistory);
$('score-info').addEventListener('click', () => $('score-dialog').showModal());
$('close-dialog').addEventListener('click', () => $('score-dialog').close());
$('score-dialog').addEventListener('click', event => { if (event.target === $('score-dialog') && (event.clientX < event.target.getBoundingClientRect().left || event.clientX > event.target.getBoundingClientRect().right || event.clientY < event.target.getBoundingClientRect().top || event.clientY > event.target.getBoundingClientRect().bottom)) event.target.close(); });
$('export-button').addEventListener('click', () => {
  const rows = [['timestamp', 'time_Asia_Bangkok', ...metrics.map(m => `${m.key} (${m.unit})`)], ...history.map(r => [r.timestamp, fullDate.format(new Date(r.timestamp * 1000)), ...metrics.map(m => r[m.key] ?? '')])];
  const csv = '\uFEFF' + rows.map(row => row.map(cell => `"${String(cell).replaceAll('"', '""')}"`).join(',')).join('\r\n');
  const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8;' }));
  const a = document.createElement('a'); a.href = url; a.download = 'classroom-212-history.csv'; a.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
});
const observer = new IntersectionObserver(entries => { for (const entry of entries) if (entry.isIntersecting) document.querySelectorAll('.nav-link').forEach(a => a.classList.toggle('active', a.hash === `#${entry.target.id}`)); }, { rootMargin: '-10% 0px -60% 0px' });
['overview', 'trends', 'history'].forEach(id => observer.observe($(id)));
window.addEventListener('offline', () => { errors.set('network', 'อินเทอร์เน็ตขาดการเชื่อมต่อ กำลังแสดงข้อมูลล่าสุดที่ได้รับ'); renderNotice(); });
window.addEventListener('online', () => { errors.delete('network'); renderNotice(); });
setTimeout(() => { if (!latestLoaded) { errors.set('timeout', 'กำลังรอ Firebase นานกว่าปกติ ตรวจอินเทอร์เน็ตและสิทธิ์อ่านฐานข้อมูล'); renderNotice(); } }, 15000);
setInterval(renderFreshness, 1000);
renderFreshness();
initializeChart();
connectFirebase();
