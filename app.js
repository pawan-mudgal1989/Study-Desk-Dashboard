const timeEl = document.querySelector('#time');
const secondsEl = document.querySelector('#seconds');
const secondsCards = [...document.querySelectorAll('#seconds .flip-card')];
const meridiemEl = document.querySelector('#meridiem');
const dateEl = document.querySelector('#date');
const soloTimeEl = document.querySelector('#soloTime');
const soloFlipCards = [...document.querySelectorAll('#soloTime .flip-card')];
const fullTimeEl = document.querySelector('#fullTime');
const fullFlipCards = [...document.querySelectorAll('#fullTime .flip-card')];
const monthTitle = document.querySelector('#monthTitle');
const calendarGrid = document.querySelector('#calendarGrid');
const weatherCondition = document.querySelector('#weatherCondition');
const temperature = document.querySelector('#temperature');
const feelsLike = document.querySelector('#feelsLike');
const highTemperature = document.querySelector('#highTemperature');
const lowTemperature = document.querySelector('#lowTemperature');
const airQuality = document.querySelector('#airQuality');
const airQualityLabel = document.querySelector('#airQualityLabel');
const airQualityDot = document.querySelector('#airQualityDot');
const weatherLocation = document.querySelector('#weatherLocation');
const weatherCard = document.querySelector('.weather-card');
const weatherTitle = document.querySelector('.weather-title');
const sunIcon = document.querySelector('.sun-icon');
const background = document.querySelector('.background');
const wallpaperShuffle = document.querySelector('#wallpaperShuffle');
const dailyQuote = document.querySelector('#dailyQuote');
const focusTimer = document.querySelector('#focusTimer');
const timerRing = document.querySelector('#timerRing');
const timerToggle = document.querySelector('#timerToggle');
const timerReset = document.querySelector('#timerReset');
const focusTitle = document.querySelector('#focusTitle');
const priorityCheckboxes = [...document.querySelectorAll('[data-priority]')];
const priorityInputs = [...document.querySelectorAll('[data-priority-text]')];
const priorityCount = document.querySelector('#priorityCount');
const progressLabel = document.querySelector('#progressLabel');
const progressFill = document.querySelector('#progressFill');
const compactTime = document.querySelector('#compactTime');
const compactMeridiem = document.querySelector('#compactMeridiem');
const compactFlipCards = [...document.querySelectorAll('.compact-flip-card')];
const timerPresetButtons = [...document.querySelectorAll('[data-timer-preset]')];
const timelineTimeInputs = [...document.querySelectorAll('[data-timeline-time]')];
const timelineTextInputs = [...document.querySelectorAll('[data-timeline-text]')];
const now = new Date();
let calendarDate = new Date(now.getFullYear(), now.getMonth(), 1);
const flipCards = [...document.querySelectorAll('#time .flip-card')];
const allFlipCards = [...document.querySelectorAll('.flip-card')];
const worldClockCards = [...document.querySelectorAll('.world-clock')];

const WALLPAPERS = {
  morning: [
    'assets/wallpaper-morning-01.png',
    'assets/wallpaper-morning-02.png',
    'assets/wallpaper-morning-03.png',
    'assets/wallpaper-morning-04.png'
  ],
  afternoon: [
    'assets/wallpaper-afternoon-01.png',
    'assets/wallpaper-afternoon-02.png',
    'assets/wallpaper-afternoon-03.png',
    'assets/wallpaper-afternoon-04.png'
  ],
  evening: [
    'assets/wallpaper-evening-01.png',
    'assets/wallpaper-evening-02.png',
    'assets/wallpaper-evening-03.png',
    'assets/wallpaper-evening-04.png'
  ],
  night: [
    'assets/wallpaper-night-01.png',
    'assets/wallpaper-night-02.png',
    'assets/wallpaper-night-03.png',
    'assets/wallpaper-night-04.png'
  ]
};

const DAILY_REFLECTIONS = [
  'A focused mind\nbuilds an extraordinary life.',
  'Protect the hour\nthat protects your future.',
  'Small promises kept\nbecome a strong life.',
  'Attention is the beginning\nof every meaningful result.',
  'Begin before you feel\ncompletely ready.',
  'Discipline makes room\nfor the life you want.',
  'One honest hour\ncan change the shape of a day.',
  'Let consistency speak\nlouder than motivation.',
  'Quiet progress\nis still progress.',
  'Your focus is a vote\nfor what matters most.',
  'Make the next action\nsimple enough to begin now.',
  'A calm mind can carry\na great ambition.',
  'Do less, with\nmore intention.',
  'The habit you return to\nbecomes your direction.',
  'There is strength in\nfinishing the small things.',
  'Build the day you will be\nproud to repeat.',
  'Your future is shaped by\nordinary focused moments.',
  'Patience turns effort\ninto mastery.',
  'Progress asks for presence,\nnot perfection.',
  'Keep the promise you made\nto yourself this morning.',
  'The best momentum\nis earned in silence.',
  'Give important work\nyour first attention.',
  'Choose depth\nover noise.',
  'Let today be useful,\nnot merely busy.',
  'Your standards appear in\nyour smallest choices.',
  'A meaningful life is built\none deliberate day at a time.',
  'Focus is a decision made\nagain and again.',
  'Make room for the work\nthat matters.',
  'Steady effort\nchanges everything.',
  'Finish today knowing\nyou moved something forward.',
  'Clarity grows when\ndistractions lose their place.'
];

let activeWallpaperPeriod = '';
let activeWallpaper = '';
let activeQuoteDate = '';
const DEFAULT_FOCUS_DURATION = 50 * 60;
let focusDuration = DEFAULT_FOCUS_DURATION;
let focusSeconds = focusDuration;
let focusRunning = false;
let focusEndsAt = null;

function setTimeAwareWallpaper(force = false) {
  const hour = new Date().getHours();
  const period = hour >= 5 && hour < 11 ? 'morning' : hour < 16 ? 'afternoon' : hour < 20 ? 'evening' : 'night';
  if (!force && period === activeWallpaperPeriod) return;
  const choices = WALLPAPERS[period];
  const alternatives = choices.filter((wallpaper) => wallpaper !== activeWallpaper);
  const wallpaper = (alternatives.length ? alternatives : choices)[Math.floor(Math.random() * (alternatives.length || choices.length))];
  background.style.setProperty('--wallpaper', `url("${wallpaper}")`);
  background.setAttribute('data-period', period);
  activeWallpaperPeriod = period;
  activeWallpaper = wallpaper;
}

function renderDailyQuote() {
  const date = new Date();
  const dateKey = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
  if (dateKey === activeQuoteDate) return;
  const startOfYear = new Date(date.getFullYear(), 0, 0);
  const dayOfYear = Math.floor((date - startOfYear) / 86400000);
  dailyQuote.textContent = DAILY_REFLECTIONS[(date.getFullYear() + dayOfYear) % DAILY_REFLECTIONS.length];
  activeQuoteDate = dateKey;
}

function getFocusData() {
  try { return JSON.parse(localStorage.getItem('focus-dashboard-focus') || '{}'); } catch { return {}; }
}

function saveFocusData() {
  localStorage.setItem('focus-dashboard-focus', JSON.stringify({
    seconds: focusSeconds,
    duration: focusDuration,
    running: focusRunning,
    endsAt: focusEndsAt,
    title: focusTitle.value,
    priorities: priorityCheckboxes.map((checkbox, index) => ({ done: checkbox.checked, text: priorityInputs[index].value })),
    timeline: timelineTimeInputs.map((input, index) => ({ time: input.value, text: timelineTextInputs[index].value }))
  }));
}

function renderPriorities() {
  const completed = priorityCheckboxes.filter(({ checked }) => checked).length;
  priorityCount.textContent = `${completed} / ${priorityCheckboxes.length}`;
  progressLabel.textContent = `${completed} of ${priorityCheckboxes.length} priorities complete`;
  progressFill.style.width = `${completed / priorityCheckboxes.length * 100}%`;
}

function renderFocusTimer() {
  const minutes = Math.floor(focusSeconds / 60);
  const seconds = String(focusSeconds % 60).padStart(2, '0');
  focusTimer.textContent = `${minutes}:${seconds}`;
  focusTimer.dateTime = `PT${focusSeconds}S`;
  timerRing.style.setProperty('--timer-progress', `${(1 - focusSeconds / focusDuration) * 360}deg`);
  const actionLabel = focusRunning ? 'Pause focus' : focusSeconds === 0 ? 'Start focus again' : 'Start focus';
  timerToggle.setAttribute('aria-label', actionLabel);
  timerToggle.innerHTML = focusRunning
    ? '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 5h4v14H7zm6 0h4v14h-4z"/></svg>'
    : '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 5 10 7-10 7z"/></svg>';
}

function renderTimerPresets() {
  timerPresetButtons.forEach((button) => {
    const selected = Number(button.dataset.timerPreset) === focusDuration;
    button.classList.toggle('active', selected);
    button.setAttribute('aria-pressed', String(selected));
  });
}

function tickFocusTimer() {
  if (!focusRunning || !focusEndsAt) return;
  focusSeconds = Math.max(0, Math.ceil((focusEndsAt - Date.now()) / 1000));
  if (focusSeconds === 0) {
    focusRunning = false;
    focusEndsAt = null;
  }
  renderFocusTimer();
  saveFocusData();
}

function loadFocusData() {
  const saved = getFocusData();
  if (saved.title) focusTitle.value = saved.title;
  if (Array.isArray(saved.priorities)) saved.priorities.forEach((priority, index) => {
    if (!priorityCheckboxes[index]) return;
    priorityCheckboxes[index].checked = Boolean(priority.done);
    if (priority.text) priorityInputs[index].value = priority.text;
  });
  if (Array.isArray(saved.timeline)) saved.timeline.forEach((item, index) => {
    if (!timelineTimeInputs[index]) return;
    if (item.time) timelineTimeInputs[index].value = item.time;
    if (item.text) timelineTextInputs[index].value = item.text;
  });
  if (timerPresetButtons.some((button) => Number(button.dataset.timerPreset) === saved.duration)) focusDuration = saved.duration;
  if (Number.isFinite(saved.seconds)) focusSeconds = Math.max(0, Math.min(focusDuration, saved.seconds));
  if (saved.running && Number.isFinite(saved.endsAt) && saved.endsAt > Date.now()) {
    focusRunning = true;
    focusEndsAt = saved.endsAt;
    tickFocusTimer();
  }
  renderPriorities();
  renderTimerPresets();
  renderFocusTimer();
}

function setFlipDigit(card, digit) {
  const previous = card.dataset.digit;
  if (previous === digit) return;
  const top = card.querySelector('.flip-top');
  const bottom = card.querySelector('.flip-bottom');
  const leaf = card.querySelector('.flip-leaf');
  const bottomLeaf = card.querySelector('.flip-bottom-leaf');
  const setValue = (face, value) => { face.querySelector('.flip-value').textContent = value; };

  // The old upper flap falls away first. At the hinge, the new lower flap rises.
  setValue(top, digit);
  setValue(bottom, previous || digit);
  setValue(leaf, previous || digit);
  setValue(bottomLeaf, digit);
  card.dataset.digit = digit;
  card.classList.remove('flipping', 'bottom-flipping');
  void card.offsetWidth;
  card.classList.add('flipping');
  window.setTimeout(() => {
    setValue(bottom, digit);
    card.classList.add('bottom-flipping');
  }, 290);
  window.setTimeout(() => {
    card.classList.remove('flipping', 'bottom-flipping');
  }, 580);
}

function prepareFlipCards() {
  allFlipCards.forEach((card) => {
    card.querySelectorAll('.flip-top, .flip-bottom, .flip-leaf, .flip-bottom-leaf').forEach((face) => {
      const digit = document.createElement('span');
      digit.className = 'flip-value';
      digit.textContent = face.textContent;
      face.textContent = '';
      face.append(digit);
    });
  });
}

function prepareWorldClockFaces() {
  worldClockCards.forEach((card) => {
    const face = card.querySelector('.analog-face');
    for (let hour = 1; hour <= 12; hour++) {
      const angle = (hour * 30 - 90) * Math.PI / 180;
      const number = document.createElement('span');
      number.className = 'clock-number';
      number.textContent = hour;
      number.style.left = `${50 + Math.cos(angle) * 35}%`;
      number.style.top = `${50 + Math.sin(angle) * 35}%`;
      face.append(number);
    }
  });
}

function getTimeInZone(date, timeZone) {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h12'
  }).formatToParts(date);
  return Object.fromEntries(parts.filter(({ type }) => type !== 'literal').map(({ type, value }) => [type, type === 'dayPeriod' ? value : Number(value)]));
}

function updateWorldClocks(date) {
  worldClockCards.forEach((card) => {
    const { hour, minute, second, dayPeriod } = getTimeInZone(date, card.dataset.timeZone);
    card.querySelector('time').textContent = `${hour}:${String(minute).padStart(2, '0')} ${dayPeriod.toUpperCase()}`;
    card.querySelector('.hour-hand').style.setProperty('--angle', `${(hour % 12) * 30 + minute * .5}deg`);
    card.querySelector('.minute-hand').style.setProperty('--angle', `${minute * 6 + second * .1}deg`);
    card.querySelector('.second-hand').style.setProperty('--angle', `${second * 6}deg`);
  });
}

function updateClock() {
  const date = new Date();
  const hour = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  const clockValue = `${String(hour % 12 || 12).padStart(2, '0')}${minutes}`;
  timeEl.dateTime = `${String(hour).padStart(2, '0')}:${minutes}`;
  timeEl.setAttribute('aria-label', `${String(hour % 12 || 12)}:${minutes} ${hour >= 12 ? 'PM' : 'AM'}`);
  clockValue.split('').forEach((digit, index) => setFlipDigit(flipCards[index], digit));
  soloTimeEl.dateTime = `${String(hour).padStart(2, '0')}:${minutes}`;
  soloTimeEl.setAttribute('aria-label', `${String(hour % 12 || 12)}:${minutes} ${hour >= 12 ? 'PM' : 'AM'}`);
  clockValue.split('').forEach((digit, index) => setFlipDigit(soloFlipCards[index], digit));
  fullTimeEl.dateTime = `${String(hour).padStart(2, '0')}:${minutes}`;
  fullTimeEl.setAttribute('aria-label', `${String(hour % 12 || 12)}:${minutes} ${hour >= 12 ? 'PM' : 'AM'}`);
  clockValue.split('').forEach((digit, index) => setFlipDigit(fullFlipCards[index], digit));
  compactTime.dateTime = `${String(hour).padStart(2, '0')}:${minutes}`;
  compactTime.setAttribute('aria-label', `${String(hour % 12 || 12)}:${minutes} ${hour >= 12 ? 'PM' : 'AM'}`);
  clockValue.split('').forEach((digit, index) => setFlipDigit(compactFlipCards[index], digit));
  compactMeridiem.textContent = hour >= 12 ? 'PM' : 'AM';
  secondsEl.dateTime = `PT${seconds}S`;
  seconds.split('').forEach((digit, index) => setFlipDigit(secondsCards[index], digit));
  meridiemEl.textContent = hour >= 12 ? 'PM' : 'AM';
  dateEl.textContent = new Intl.DateTimeFormat('en-GB', { weekday: 'long', day: 'numeric', month: 'long' }).format(date);
  updateWorldClocks(date);
}

function renderCalendar() {
  const year = calendarDate.getFullYear();
  const month = calendarDate.getMonth();
  monthTitle.textContent = new Intl.DateTimeFormat('en-GB', { month: 'long', year: 'numeric' }).format(calendarDate);
  const firstDay = new Date(year, month, 1);
  const start = (firstDay.getDay() + 6) % 7;
  const daysThisMonth = new Date(year, month + 1, 0).getDate();
  const daysPreviousMonth = new Date(year, month, 0).getDate();
  calendarGrid.innerHTML = '';
  const totalCells = start + daysThisMonth > 35 ? 42 : 35;
  for (let cell = 0; cell < totalCells; cell++) {
    const day = cell - start + 1;
    const label = document.createElement('time');
    if (day < 1) { label.textContent = daysPreviousMonth + day; label.className = 'outside'; }
    else if (day > daysThisMonth) { label.textContent = day - daysThisMonth; label.className = 'outside'; }
    else {
      label.textContent = day;
      label.dateTime = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      if (year === now.getFullYear() && month === now.getMonth() && day === now.getDate()) label.className = 'today';
    }
    calendarGrid.append(label);
  }
}

document.querySelector('#previousMonth').addEventListener('click', () => { calendarDate.setMonth(calendarDate.getMonth() - 1); renderCalendar(); });
document.querySelector('#nextMonth').addEventListener('click', () => { calendarDate.setMonth(calendarDate.getMonth() + 1); renderCalendar(); });

let activeScreen = 0, startX = 0;
const track = document.querySelector('#screenTrack');
const screens = [...track.querySelectorAll('.screen')];
const dots = [...document.querySelectorAll('.screen-pagination button')];
function setScreen(index) { activeScreen = Math.max(0, Math.min(screens.length - 1, index)); track.style.transform = `translateX(-${activeScreen * 100}%)`; dots.forEach((dot, i) => dot.classList.toggle('active', i === activeScreen)); }
dots.forEach((dot, i) => dot.addEventListener('click', () => setScreen(i)));
window.addEventListener('keydown', event => { if (event.key === 'ArrowRight') setScreen(activeScreen + 1); if (event.key === 'ArrowLeft') setScreen(activeScreen - 1); });
track.addEventListener('pointerdown', event => { startX = event.clientX; });
track.addEventListener('pointerup', event => { if (Math.abs(event.clientX - startX) > 60) setScreen(activeScreen + (event.clientX < startX ? 1 : -1)); });

const NEW_DELHI = { latitude: 28.6139, longitude: 77.209, name: 'New Delhi' };
const WEATHER_CODES = {
  0: 'Clear Sky', 1: 'Mostly Clear', 2: 'Partly Cloudy', 3: 'Overcast',
  45: 'Foggy', 48: 'Icy Fog', 51: 'Light Drizzle', 53: 'Drizzle', 55: 'Heavy Drizzle',
  61: 'Light Rain', 63: 'Rain', 65: 'Heavy Rain', 71: 'Light Snow', 73: 'Snow',
  75: 'Heavy Snow', 80: 'Rain Showers', 81: 'Rain Showers', 82: 'Heavy Showers',
  95: 'Thunderstorm', 96: 'Storm with Hail', 99: 'Storm with Hail'
};

function aqiStatus(value) {
  if (value <= 50) return 'Good';
  if (value <= 100) return 'Fair';
  if (value <= 150) return 'Unhealthy';
  if (value <= 200) return 'Poor';
  return 'Very Poor';
}

function renderWeatherSymbol(code, isDay) {
  const cloudy = [2, 3, 45, 48].includes(code);
  const wet = code >= 51;
  if (wet) {
    sunIcon.innerHTML = '<path d="M32 43c3-13 14-22 28-22 16 0 29 13 29 29 10 1 18 9 18 20 0 12-9 21-21 21H33c-12 0-21-9-21-21 0-14 10-25 23-27Z" fill="#92aabd" opacity=".9"/><path d="m42 98-5 12m25-12-5 12m25-12-5 12" stroke="#8bc9ec" stroke-width="5" stroke-linecap="round"/>';
  } else if (!isDay) {
    sunIcon.innerHTML = '<path d="M74 19a35 35 0 1 0 28 52A31 31 0 1 1 74 19Z" fill="#f3dd96"/><circle cx="91" cy="27" r="3" fill="#fff7d4"/><circle cx="102" cy="43" r="2" fill="#fff7d4"/>';
  } else if (cloudy) {
    sunIcon.innerHTML = '<circle cx="48" cy="43" r="23" fill="#ffd35e"/><path d="M36 90c-13 0-23-10-23-23s10-23 23-23c3-13 14-22 28-22 16 0 29 13 29 29 10 1 18 9 18 20 0 11-9 19-20 19H36Z" fill="#c6d1d9" opacity=".95"/>';
  } else {
    sunIcon.innerHTML = '<g stroke="#ffd15c" stroke-width="5" stroke-linecap="round"><path d="M60 8v14"/><path d="M60 98v14"/><path d="M8 60h14"/><path d="M98 60h14"/><path d="m23 23 10 10"/><path d="m87 87 10 10"/><path d="m97 23-10 10"/><path d="m33 87-10 10"/></g><circle cx="60" cy="60" r="30" fill="#ffd15c"/>';
  }
}

async function loadLiveWeather(location = NEW_DELHI) {
  const weatherUrl = new URL('https://api.open-meteo.com/v1/forecast');
  weatherUrl.search = new URLSearchParams({
    latitude: location.latitude, longitude: location.longitude, timezone: 'auto',
    current: 'temperature_2m,apparent_temperature,weather_code,is_day',
    daily: 'temperature_2m_max,temperature_2m_min', forecast_days: '1'
  });
  const airUrl = new URL('https://air-quality-api.open-meteo.com/v1/air-quality');
  airUrl.search = new URLSearchParams({ latitude: location.latitude, longitude: location.longitude, current: 'us_aqi' });

  try {
    const [weatherResponse, airResponse] = await Promise.all([fetch(weatherUrl), fetch(airUrl)]);
    if (!weatherResponse.ok || !airResponse.ok) throw new Error('Weather service unavailable');
    const [weather, air] = await Promise.all([weatherResponse.json(), airResponse.json()]);
    const current = weather.current;
    const aqi = Math.round(air.current.us_aqi);
    temperature.textContent = `${Math.round(current.temperature_2m)}°C`;
    feelsLike.textContent = `Feels like ${Math.round(current.apparent_temperature)}°`;
    weatherCondition.textContent = WEATHER_CODES[current.weather_code] || 'Current Conditions';
    renderWeatherSymbol(current.weather_code, current.is_day);
    highTemperature.textContent = `${Math.round(weather.daily.temperature_2m_max[0])}°`;
    lowTemperature.textContent = `${Math.round(weather.daily.temperature_2m_min[0])}°`;
    airQuality.textContent = aqi;
    airQualityLabel.textContent = aqiStatus(aqi);
    airQualityDot.style.background = aqi <= 100 ? '#9ed88f' : aqi <= 150 ? '#edc45d' : '#eb8b76';
  } catch (error) {
    weatherCondition.textContent = 'Unable to update';
    feelsLike.textContent = 'Check your connection';
  }
}

let activeWeatherLocation = NEW_DELHI;
const weatherLocationIcon = weatherTitle.querySelector('.pin');

async function getLocationName({ latitude, longitude }) {
  const url = new URL('https://api.bigdatacloud.net/data/reverse-geocode-client');
  url.search = new URLSearchParams({ latitude, longitude, localityLanguage: 'en' });
  const response = await fetch(url);
  if (!response.ok) throw new Error('City lookup unavailable');
  const place = await response.json();
  return place.city || place.locality || place.principalSubdivision || 'Your location';
}

function displayLocation(location) {
  weatherLocation.textContent = location.name || 'Your location';
  if (weatherLocationIcon) weatherLocationIcon.textContent = '🧭';
  weatherCard.setAttribute('aria-label', `Live weather at ${weatherLocation.textContent}`);
}

function useSavedLocation() {
  const saved = localStorage.getItem('focus-dashboard-location');
  if (!saved) return false;
  const location = JSON.parse(saved);
  displayLocation(location);
  activeWeatherLocation = location;
  return true;
}

if (!useSavedLocation()) {
  const locationButton = document.createElement('button');
  locationButton.type = 'button';
  locationButton.textContent = '⌖';
  locationButton.title = 'Use my location';
  locationButton.setAttribute('aria-label', 'Use my location for weather');
  locationButton.style.cssText = 'margin-left:auto;border:0;background:transparent;color:inherit;font:inherit;font-size:18px;cursor:pointer;padding:0 2px;opacity:.85';
  weatherTitle.append(locationButton);
  locationButton.addEventListener('click', () => {
  if (!navigator.geolocation) { weatherCondition.textContent = 'Location unavailable'; return; }
  weatherCondition.textContent = 'Finding your location…';
  navigator.geolocation.getCurrentPosition(
    async ({ coords }) => {
      const location = { latitude: coords.latitude, longitude: coords.longitude };
      try { location.name = await getLocationName(location); } catch { location.name = 'Your location'; }
      localStorage.setItem('focus-dashboard-location', JSON.stringify(location));
      activeWeatherLocation = location;
      locationButton.remove();
      displayLocation(location);
      loadLiveWeather(location);
    },
    () => { weatherCondition.textContent = 'Location permission denied'; },
    { enableHighAccuracy: false, timeout: 10000, maximumAge: 900000 }
  );
  });
}

timerToggle.addEventListener('click', () => {
  if (focusRunning) {
    tickFocusTimer();
    focusRunning = false;
    focusEndsAt = null;
  } else {
    if (focusSeconds === 0) focusSeconds = focusDuration;
    focusRunning = true;
    focusEndsAt = Date.now() + focusSeconds * 1000;
  }
  renderFocusTimer();
  saveFocusData();
});

timerReset.addEventListener('click', () => {
  focusSeconds = focusDuration;
  focusRunning = false;
  focusEndsAt = null;
  renderFocusTimer();
  saveFocusData();
});

timerPresetButtons.forEach((button) => button.addEventListener('click', () => {
  focusDuration = Number(button.dataset.timerPreset);
  focusSeconds = focusDuration;
  focusRunning = false;
  focusEndsAt = null;
  renderTimerPresets();
  renderFocusTimer();
  saveFocusData();
}));

priorityCheckboxes.forEach((checkbox) => checkbox.addEventListener('change', () => { renderPriorities(); saveFocusData(); }));
priorityInputs.forEach((input) => input.addEventListener('input', saveFocusData));
timelineTimeInputs.forEach((input) => input.addEventListener('change', saveFocusData));
timelineTextInputs.forEach((input) => input.addEventListener('input', saveFocusData));
focusTitle.addEventListener('input', saveFocusData);

setTimeAwareWallpaper(); renderDailyQuote(); prepareFlipCards(); prepareWorldClockFaces(); loadFocusData(); updateClock(); renderCalendar(); loadLiveWeather(activeWeatherLocation); setInterval(updateClock, 1000); setInterval(tickFocusTimer, 1000); setInterval(setTimeAwareWallpaper, 60 * 1000); setInterval(renderDailyQuote, 60 * 1000); setInterval(() => loadLiveWeather(activeWeatherLocation), 20 * 60 * 1000);
wallpaperShuffle.addEventListener('click', () => setTimeAwareWallpaper(true));
