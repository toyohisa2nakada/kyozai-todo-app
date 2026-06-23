function addTask(doc, { name, type, deadline = '2026-08-01' }) {
  const input = doc.getElementById('todo-input');
  const deadlineInput = doc.getElementById('todo-deadline');
  const addButton = doc.getElementById('add-button');
  const cb = doc.querySelector(`.type-checkbox[value="${type}"]`);

  doc.querySelectorAll('.type-checkbox').forEach((c) => (c.checked = false));
  input.value = name;
  if (cb) cb.checked = true;
  deadlineInput.value = deadline;
  addButton.click();
}

function isVisible(win, el) {
  if (!el) return false;
  if (el.classList.contains('hidden')) return false;
  const style = win.getComputedStyle(el);
  return style.display !== 'none' && style.visibility !== 'hidden' && parseFloat(style.opacity) > 0;
}

export default {
  title: 'フィルター機能のロジック実装',
  instruction:
    'フィルター用のチェックボックスの状態が変化（changeイベント）したとき、チェックが入っている種類（type）のタスクだけを画面に表示し、チェックが外れている種類のタスクを非表示にするJavaScriptロジックを実装してください。非表示の表現には、CSSで非表示にするためのクラス（例: .hidden ）を各li要素に着脱する方式、または配列から再描画する方式のいずれかを使用してください。',

  check: async (frame) => {
    const win = frame.contentWindow;
    const doc = frame.contentDocument;
    if (!doc || !win) return { success: false, message: 'プレビューが読み込まれていません。' };

    const filterCheckboxes = Array.from(doc.querySelectorAll('.filter-checkbox'));
    if (filterCheckboxes.length !== 3) {
      return { success: false, message: 'フィルター用チェックボックスが見つかりません。前の課題が未完了の可能性があります。' };
    }

    // すべてのフィルターを一旦チェック済みにしておく
    filterCheckboxes.forEach((cb) => {
      cb.checked = true;
      cb.dispatchEvent(new win.Event('change', { bubbles: true }));
    });
    await new Promise((r) => setTimeout(r, 60));

    addTask(doc, { name: 'フィルター確認work', type: 'work' });
    await new Promise((r) => setTimeout(r, 60));
    addTask(doc, { name: 'フィルター確認private', type: 'private' });
    await new Promise((r) => setTimeout(r, 60));

    const list = doc.getElementById('todo-list');
    const workItem = Array.from(list.querySelectorAll('li')).find((li) =>
      li.textContent.includes('フィルター確認work')
    );
    const privateItem = Array.from(list.querySelectorAll('li')).find((li) =>
      li.textContent.includes('フィルター確認private')
    );
    if (!workItem || !privateItem) {
      return { success: false, message: 'テスト用タスクの追加に失敗しました。' };
    }

    // private のチェックを外す
    const privateFilter = filterCheckboxes.find((cb) => cb.value === 'private');
    privateFilter.checked = false;
    privateFilter.dispatchEvent(new win.Event('change', { bubbles: true }));
    await new Promise((r) => setTimeout(r, 200));

    const workVisible = isVisible(win, workItem);
    const privateVisible = isVisible(win, privateItem);

    if (!workVisible) {
      return { success: false, message: '仕事(work)のタスクが表示されたままになっていません（誤って消えています）。' };
    }
    if (privateVisible) {
      return {
        success: false,
        message: 'プライベート(private)のフィルターを外しても、対象のタスクが非表示になりませんでした。',
      };
    }

    return { success: true, message: 'フィルターによる表示・非表示の切り替えが正しく機能しています。' };
  },
};
