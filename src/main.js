// ============================================================
// 教材システム: Todoリスト演習プロトタイプ
// ============================================================

// ---------- 課題ファイルの定義リスト ----------
const problemFiles = [
  '001_initial_add_check.js',
  '010_add_delete_button.js',
  '011_delete_action.js',
  '012_delete_animation.js',
  '020_add_sort_button.js',
  '021_sort_button_ui.js',
  '022_sort_logic.js',
  '030_add_filter_checkbox.js',
  '031_filter_logic.js',
  '032_filter_animation.js',
  '040_add_deadline_filter_ui.js',
  '041_deadline_filter_logic.js',
];

// ---------- 初期ひな型コード（60%完成のTodoリスト） ----------
const TEMPLATE_HTML = `<div class="app-container">
  <h1>Todoリスト</h1>
  <div class="input-area">
    <input type="text" id="todo-input" placeholder="タスク名を入力" />

    <div class="type-checkboxes">
      <input type="checkbox" id="type-work" class="type-checkbox" value="work">
      <label for="type-work" class="type-label work-label">💼 仕事</label>

      <input type="checkbox" id="type-private" class="type-checkbox" value="private">
      <label for="type-private" class="type-label private-label">🏠 プライベート</label>

      <input type="checkbox" id="type-study" class="type-checkbox" value="study">
      <label for="type-study" class="type-label study-label">📚 勉強</label>
    </div>

    <input type="date" id="todo-deadline" />
    <button id="add-button">追加</button>
  </div>

  <ul id="todo-list"></ul>
</div>
`;

const TEMPLATE_CSS = `body {
  font-family: "Hiragino Kaku Gothic ProN", "Segoe UI", system-ui, sans-serif;
  background: #f4f6f8;
  margin: 0;
  padding: 20px;
  color: #333;
}

.app-container {
  max-width: 520px;
  margin: 0 auto;
  background: #fff;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.08);
}

h1 {
  margin-top: 0;
  font-size: 1.3rem;
  color: #2c3e50;
}

.input-area {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
  margin-bottom: 16px;
}

#todo-input {
  flex: 1;
  min-width: 140px;
  padding: 8px 10px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 0.95rem;
}

#todo-deadline {
  padding: 7px 10px;
  border: 1px solid #ccc;
  border-radius: 6px;
}

#add-button {
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  background: #3a6ea5;
  color: #fff;
  cursor: pointer;
  font-size: 0.95rem;
}

#add-button:hover {
  background: #2f5c8a;
}

/* ---- アイコン風チェックボックス ---- */
.type-checkboxes {
  display: flex;
  gap: 6px;
}

.type-checkbox {
  display: none;
}

.type-label {
  display: inline-block;
  padding: 7px 10px;
  border-radius: 20px;
  background: #eee;
  color: #888;
  cursor: pointer;
  font-size: 0.85rem;
  border: 1px solid #ddd;
  transition: all 0.15s ease;
  user-select: none;
}

.type-checkbox:checked + .type-label {
  color: #fff;
  border-color: transparent;
}

.type-checkbox#type-work:checked + .work-label {
  background: #3a6ea5;
}

.type-checkbox#type-private:checked + .private-label {
  background: #c0784f;
}

.type-checkbox#type-study:checked + .study-label {
  background: #4f9d69;
}

/* ---- リスト ---- */
#todo-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.todo-item {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  align-items: center;
  padding: 10px 12px;
  border: 1px solid #eee;
  border-radius: 8px;
  margin-bottom: 8px;
  background: #fafbfc;
}

.todo-name {
  font-weight: bold;
  flex: 1;
}

.todo-type {
  font-size: 0.85rem;
  color: #555;
}

.todo-deadline {
  font-size: 0.8rem;
  color: #888;
}
`;

const TEMPLATE_JS = `const addButton = document.getElementById('add-button');
const todoInput = document.getElementById('todo-input');
const todoDeadline = document.getElementById('todo-deadline');
const todoList = document.getElementById('todo-list');

const typeIcons = {
  work: '💼 仕事',
  private: '🏠 プライベート',
  study: '📚 勉強',
};

addButton.addEventListener('click', () => {
  const name = todoInput.value.trim();
  if (!name) return;

  const checkedTypes = Array.from(
    document.querySelectorAll('.type-checkbox:checked')
  ).map((cb) => cb.value);
  const deadline = todoDeadline.value;

  const li = document.createElement('li');
  li.className = 'todo-item';
  li.dataset.name = name;
  li.dataset.type = checkedTypes.join(',');
  li.dataset.deadline = deadline;

  const nameSpan = document.createElement('span');
  nameSpan.className = 'todo-name';
  nameSpan.textContent = name;

  const typeSpan = document.createElement('span');
  typeSpan.className = 'todo-type';
  typeSpan.textContent = checkedTypes.map((t) => typeIcons[t] || t).join(' ');

  const deadlineSpan = document.createElement('span');
  deadlineSpan.className = 'todo-deadline';
  deadlineSpan.textContent = deadline ? \`締切: \${deadline}\` : '締切: 未設定';

  li.appendChild(nameSpan);
  li.appendChild(typeSpan);
  li.appendChild(deadlineSpan);

  todoList.appendChild(li);

  todoInput.value = '';
  document.querySelectorAll('.type-checkbox').forEach((cb) => (cb.checked = false));
  todoDeadline.value = '';
});
`;

// ---------- DOM参照 ----------
const titleEl = document.getElementById('problem-title');
const instructionEl = document.getElementById('problem-instruction');
const progressEl = document.getElementById('progress-label');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const checkBtn = document.getElementById('check-btn');
const resultEl = document.getElementById('result-area');
const previewFrame = document.getElementById('preview-frame');
const iframeCover = document.getElementById('iframe-cover');
const tabs = document.querySelectorAll('#tabs .tab');
const monacoContainer = document.getElementById('monaco-container');
const topPane = document.getElementById('top-pane');
const bottomPane = document.getElementById('bottom-pane');
const editorPane = document.getElementById('editor-pane');
const previewPane = document.getElementById('preview-pane');
const hSplitter = document.getElementById('h-splitter');
const vSplitter = document.getElementById('v-splitter');
const appEl = document.getElementById('app');

// ---------- 状態 ----------
let problems = [];
let currentIndex = 0;
let completed = [];
let editor = null;
let models = {};
let currentLang = 'html';
let updateTimer = null;

// ============================================================
// Monaco Editor のロード・初期化
// ============================================================
function loadMonaco() {
  return new Promise((resolve) => {
    require.config({
      paths: { vs: 'https://cdn.jsdelivr.net/npm/monaco-editor@0.45.0/min/vs' },
    });
    require(['vs/editor/editor.main'], () => resolve());
  });
}

function initEditor() {
  models.html = monaco.editor.createModel(TEMPLATE_HTML, 'html');
  models.css = monaco.editor.createModel(TEMPLATE_CSS, 'css');
  models.js = monaco.editor.createModel(TEMPLATE_JS, 'javascript');

  editor = monaco.editor.create(monacoContainer, {
    model: models.html,
    theme: 'vs-dark',
    automaticLayout: false,
    fontSize: 14,
    minimap: { enabled: false },
  });

  Object.values(models).forEach((model) => {
    model.onDidChangeContent(() => {
      scheduleUpdatePreview();
    });
  });

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      tabs.forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');
      currentLang = tab.dataset.lang;
      editor.setModel(models[currentLang]);
    });
  });

  updatePreview();
}

function scheduleUpdatePreview() {
  clearTimeout(updateTimer);
  updateTimer = setTimeout(updatePreview, 300);
}

function updatePreview() {
  const html = models.html.getValue();
  const css = models.css.getValue();
  const js = models.js.getValue();

  const srcDoc = `<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="UTF-8" />
<style>${css}</style>
</head>
<body>
${html}
<script>${js}<\/script>
</body>
</html>`;

  previewFrame.srcdoc = srcDoc;
}

// ============================================================
// 課題の読み込み・進行管理
// ============================================================
async function loadProblems() {
  const loaded = [];
  for (const file of problemFiles) {
    const mod = await import(/* @vite-ignore */ `${import.meta.env.BASE_URL}problems/${file}`);
    loaded.push(mod.default);
  }
  return loaded;
}

function renderProblem() {
  const problem = problems[currentIndex];
  titleEl.textContent = problem.title;
  instructionEl.textContent = problem.instruction;
  progressEl.textContent = `課題 ${currentIndex + 1} / ${problems.length}`;

  prevBtn.disabled = currentIndex === 0;
  nextBtn.disabled = currentIndex === problems.length - 1 || !completed[currentIndex];

  hideResult();
}

function showResult(success, message) {
  resultEl.textContent = message;
  resultEl.classList.add('show');
  resultEl.classList.toggle('success', success);
  resultEl.classList.toggle('fail', !success);
}

function hideResult() {
  resultEl.classList.remove('show', 'success', 'fail');
  resultEl.textContent = '';
}

async function handleCheck() {
  const problem = problems[currentIndex];
  checkBtn.disabled = true;
  checkBtn.textContent = '判定中...';
  try {
    const result = await problem.check(previewFrame);
    showResult(result.success, result.message);
    if (result.success) {
      completed[currentIndex] = true;
      nextBtn.disabled = currentIndex === problems.length - 1;
    }
  } catch (err) {
    showResult(false, `チェック実行中にエラーが発生しました: ${err.message}`);
  } finally {
    checkBtn.disabled = false;
    checkBtn.textContent = 'チェック';
  }
}

function handlePrev() {
  if (currentIndex === 0) return;
  currentIndex -= 1;
  renderProblem();
}

function handleNext() {
  if (currentIndex === problems.length - 1 || !completed[currentIndex]) return;
  currentIndex += 1;
  renderProblem();
}

// ============================================================
// スプリッター（上下・左右）のドラッグ処理
// ============================================================
function setupSplitters() {
  let dragging = null;

  function onMouseDown(type) {
    return (e) => {
      dragging = type;
      iframeCover.classList.add('active');
      e.preventDefault();
    };
  }

  function onMouseMove(e) {
    if (!dragging) return;

    if (dragging === 'h') {
      const appRect = appEl.getBoundingClientRect();
      let topHeight = e.clientY - appRect.top;
      const minTop = 60;
      const maxTop = appRect.height - 100;
      topHeight = Math.max(minTop, Math.min(maxTop, topHeight));
      const topPercent = (topHeight / appRect.height) * 100;
      topPane.style.height = `${topPercent}%`;
    } else if (dragging === 'v') {
      const bottomRect = bottomPane.getBoundingClientRect();
      let leftWidth = e.clientX - bottomRect.left;
      const minLeft = 150;
      const maxLeft = bottomRect.width - 150;
      leftWidth = Math.max(minLeft, Math.min(maxLeft, leftWidth));
      const leftPercent = (leftWidth / bottomRect.width) * 100;
      editorPane.style.width = `${leftPercent}%`;
    }

    if (editor) editor.layout();
  }

  function onMouseUp() {
    if (!dragging) return;
    dragging = null;
    iframeCover.classList.remove('active');
    if (editor) editor.layout();
  }

  hSplitter.addEventListener('mousedown', onMouseDown('h'));
  vSplitter.addEventListener('mousedown', onMouseDown('v'));
  window.addEventListener('mousemove', onMouseMove);
  window.addEventListener('mouseup', onMouseUp);

  window.addEventListener('resize', () => {
    if (editor) editor.layout();
  });
}

// ============================================================
// 初期化
// ============================================================
async function init() {
  setupSplitters();

  prevBtn.addEventListener('click', handlePrev);
  nextBtn.addEventListener('click', handleNext);
  checkBtn.addEventListener('click', handleCheck);

  problems = await loadProblems();
  completed = new Array(problems.length).fill(false);

  await loadMonaco();
  initEditor();

  renderProblem();
}

init();
