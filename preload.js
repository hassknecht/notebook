const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('notesApi', {
  loadNotes: () => ipcRenderer.invoke('load-notes'),
  saveNotes: (payload) => ipcRenderer.invoke('save-notes', payload),
  isElectron: true
});
