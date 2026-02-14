const lists = {
  todo: document.getElementById('todoList'),
  doing: document.getElementById('doingList'),
  done: document.getElementById('doneList')
};

const dialog = document.getElementById('noteDialog');
const form = document.getElementById('noteForm');
const searchInput = document.getElementById('search');
let notes = [];

const nowIso = () => new Date().toISOString();
const uid = () => 'n' + Math.random().toString(36).slice(2, 9);

async function loadNotes() {
  const res = await fetch('./notes.json', { cache: 'no-store' });
  notes = await res.json();
  render();
}

function matchesQuery(note, q) {
  if (!q) return true;
  const hay = [note.title, note.content, ...(note.tags || [])].join(' ').toLowerCase();
  return hay.includes(q.toLowerCase());
}

function render() {
  const q = searchInput.value.trim();
  Object.values(lists).forEach(el => (el.innerHTML = ''));

  notes.filter(n => matchesQuery(n, q)).forEach(note => {
    const card = document.createElement('article');
    card.className = 'card';
    card.draggable = true;
    card.dataset.id = note.id;
    card.innerHTML = `
      <h3>${escapeHtml(note.title)}</h3>
      <p>${escapeHtml(note.content)}</p>
      <div class="tags">${(note.tags || []).map(t => `<span class="tag">#${escapeHtml(t)}</span>`).join('')}</div>
      <div class="meta">
        <span class="small">${new Date(note.updatedAt).toLocaleString()}</span>
        <div class="actions">
          <button data-act="edit">编辑</button>
          <button data-act="del">删除</button>
        </div>
      </div>`;

    card.addEventListener('dragstart', e => e.dataTransfer.setData('text/plain', note.id));
    card.querySelector('[data-act="edit"]').onclick = () => openDialog(note);
    card.querySelector('[data-act="del"]').onclick = () => {
      if (!confirm('确认删除这条便签？')) return;
      notes = notes.filter(n => n.id !== note.id);
      render();
    };

    lists[note.status]?.appendChild(card);
  });
}

function openDialog(note = null) {
  document.getElementById('dialogTitle').textContent = note ? '编辑便签' : '新建便签';
  document.getElementById('noteId').value = note?.id || '';
  document.getElementById('title').value = note?.title || '';
  document.getElementById('content').value = note?.content || '';
  document.getElementById('tags').value = (note?.tags || []).join(', ');
  document.getElementById('status').value = note?.status || 'todo';
  dialog.showModal();
}

form.addEventListener('submit', e => {
  e.preventDefault();
  const id = document.getElementById('noteId').value || uid();
  const payload = {
    id,
    title: document.getElementById('title').value.trim(),
    content: document.getElementById('content').value.trim(),
    tags: document.getElementById('tags').value.split(',').map(s => s.trim()).filter(Boolean),
    status: document.getElementById('status').value,
    updatedAt: nowIso()
  };

  const i = notes.findIndex(n => n.id === id);
  if (i >= 0) notes[i] = payload;
  else notes.unshift(payload);

  dialog.close();
  render();
});

document.getElementById('addBtn').onclick = () => openDialog();
searchInput.addEventListener('input', render);

document.getElementById('exportBtn').onclick = () => {
  const blob = new Blob([JSON.stringify(notes, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'notes.json';
  a.click();
  URL.revokeObjectURL(a.href);
};

for (const [status, list] of Object.entries(lists)) {
  list.addEventListener('dragover', e => {
    e.preventDefault();
    list.closest('.column').classList.add('drag-over');
  });
  list.addEventListener('dragleave', () => list.closest('.column').classList.remove('drag-over'));
  list.addEventListener('drop', e => {
    e.preventDefault();
    list.closest('.column').classList.remove('drag-over');
    const id = e.dataTransfer.getData('text/plain');
    const note = notes.find(n => n.id === id);
    if (!note) return;
    note.status = status;
    note.updatedAt = nowIso();
    render();
  });
}

function escapeHtml(str = '') {
  return str.replace(/[&<>'"]/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[ch]));
}

loadNotes();
