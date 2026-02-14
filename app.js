const grid = document.getElementById('grid');
const stats = document.getElementById('stats');
const searchInput = document.getElementById('search');
const statusFilter = document.getElementById('statusFilter');
const cardTpl = document.getElementById('cardTpl');

let skills = [];

async function load() {
  const res = await fetch('./skills.json', { cache: 'no-store' });
  skills = await res.json();
  render();
}

function match(skill, q, st) {
  const okStatus = st === 'all' || skill.status === st;
  if (!okStatus) return false;
  if (!q) return true;
  const hay = [skill.name, skill.slug, skill.purpose, skill.usage, skill.notes, skill.category].join(' ').toLowerCase();
  return hay.includes(q.toLowerCase());
}

function render() {
  const q = searchInput.value.trim();
  const st = statusFilter.value;
  const list = skills.filter(s => match(s, q, st));

  stats.innerHTML = '';
  const total = skills.length;
  const enabled = skills.filter(s => s.status === 'enabled').length;
  const configured = skills.filter(s => s.status === 'configured').length;
  const ready = skills.filter(s => s.status === 'ready').length;

  [
    ['总数', total],
    ['已启用', enabled],
    ['已配置', configured],
    ['可直接使用', ready],
    ['筛选结果', list.length],
  ].forEach(([k, v]) => {
    const el = document.createElement('div');
    el.className = 'stat';
    el.innerHTML = `<div class="k">${k}</div><div class="v">${v}</div>`;
    stats.appendChild(el);
  });

  grid.innerHTML = '';
  list.forEach(skill => {
    const card = cardTpl.content.firstElementChild.cloneNode(true);
    card.querySelector('.name').textContent = skill.name;
    card.querySelector('.badge').textContent = skill.status;
    card.querySelector('.purpose').textContent = skill.purpose;
    card.querySelector('.category').textContent = skill.category;
    card.querySelector('.updatedAt').textContent = `更新: ${skill.updatedAt}`;
    card.querySelector('.usage').textContent = skill.usage;
    card.querySelector('.notes').textContent = skill.notes || '';

    card.querySelector('.copyBtn').onclick = async () => {
      try {
        await navigator.clipboard.writeText(skill.usage);
        card.querySelector('.copyBtn').textContent = '已复制';
        setTimeout(() => (card.querySelector('.copyBtn').textContent = '复制命令'), 1000);
      } catch {
        alert('复制失败，请手动复制');
      }
    };

    grid.appendChild(card);
  });
}

searchInput.addEventListener('input', render);
statusFilter.addEventListener('change', render);

document.getElementById('exportBtn').onclick = () => {
  const blob = new Blob([JSON.stringify(skills, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'skills.json';
  a.click();
  URL.revokeObjectURL(a.href);
};

load();
