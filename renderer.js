const noteInput = document.getElementById('note');
const savedAt = document.getElementById('savedAt');
const status = document.getElementById('status');
const launchAtLoginInput = document.getElementById('launchAtLogin');
const hourHand = document.getElementById('hourHand');
const minuteHand = document.getElementById('minuteHand');
const secondHand = document.getElementById('secondHand');

let saveTimer = null;

const previewFallbackApi = {
  isElectron: false,
  async loadNotes() {
    return { content: '', updatedAt: null, launchAtLogin: true };
  },
  async saveNotes() {
    return { ok: true };
  }
};

const notesApi = window.notesApi || previewFallbackApi;

const formatTime = (date) => {
  const pad = (value) => value.toString().padStart(2, '0');
  return `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
};

const updateSavedAt = (date) => {
  savedAt.textContent = `已保存 ${formatTime(date)}`;
};

const updateClock = () => {
  const now = new Date();
  const seconds = now.getSeconds();
  const minutes = now.getMinutes() + seconds / 60;
  const hours = (now.getHours() % 12) + minutes / 60;

  hourHand.style.transform = `translateX(-50%) rotate(${hours * 30}deg)`;
  minuteHand.style.transform = `translateX(-50%) rotate(${minutes * 6}deg)`;
  secondHand.style.transform = `translateX(-50%) rotate(${seconds * 6}deg)`;
};

const saveNow = async () => {
  const payload = {
    content: noteInput.value,
    updatedAt: new Date().toISOString(),
    launchAtLogin: launchAtLoginInput.checked
  };
  await notesApi.saveNotes(payload);
  status.textContent = '自动保存已开启';
  updateSavedAt(new Date());
};

const scheduleSave = () => {
  status.textContent = '正在保存...';
  if (saveTimer) {
    clearTimeout(saveTimer);
  }
  saveTimer = setTimeout(saveNow, 500);
};

const loadNotes = async () => {
  try {
    const data = await notesApi.loadNotes();
    noteInput.value = data.content || '';
    launchAtLoginInput.checked = data.launchAtLogin !== false;
    if (data.updatedAt) {
      updateSavedAt(new Date(data.updatedAt));
    }
    if (!notesApi.isElectron) {
      status.textContent = '预览模式（未连接 Electron）';
    }
  } catch (error) {
    status.textContent = '加载失败';
    console.error(error);
  }
};

noteInput.addEventListener('input', scheduleSave);
launchAtLoginInput.addEventListener('change', scheduleSave);

updateClock();
setInterval(updateClock, 1000);
loadNotes();
