function addTask(doc, { name, type = 'work', deadline }) {
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
  title: '締切日期間フィルターのロジック実装',
  instruction:
    '開始日、または終了日の入力が変更されたとき、各タスクの締切日が「開始日（X日）以上」「終了日（Y日）未満」「その間（X日以上Y日未満）」の指定範囲内に収まっているタスクのみを表示し、範囲外のタスクを非表示（.hidden クラスの付与など）にするロジックを実装してください。なお、片方のみ入力されている場合は「X日以上すべて」や「Y日未満すべて」として動作させ、両方空の場合はすべてのタスクを表示するように制御してください。',

  check: async (frame) => {
    const win = frame.contentWindow;
    const doc = frame.contentDocument;
    if (!doc || !win) return { success: false, message: 'プレビューが読み込まれていません。' };

    const startDate = doc.getElementById('filter-start-date');
    const endDate = doc.getElementById('filter-end-date');
    if (!startDate || !endDate) {
      return { success: false, message: '締切日フィルターのUIが見つかりません。前の課題が未完了の可能性があります。' };
    }

    // タイプフィルターが存在する場合は全てチェックしておき、タイプによる非表示を排除する
    const typeFilters = Array.from(doc.querySelectorAll('.filter-checkbox'));
    typeFilters.forEach((cb) => {
      cb.checked = true;
      cb.dispatchEvent(new win.Event('change', { bubbles: true }));
    });
    await new Promise((r) => setTimeout(r, 60));

    addTask(doc, { name: '締切確認0610', deadline: '2026-06-10' });
    await new Promise((r) => setTimeout(r, 60));
    addTask(doc, { name: '締切確認0620', deadline: '2026-06-20' });
    await new Promise((r) => setTimeout(r, 60));
    addTask(doc, { name: '締切確認0630', deadline: '2026-06-30' });
    await new Promise((r) => setTimeout(r, 60));

    const list = doc.getElementById('todo-list');
    const items = Array.from(list.querySelectorAll('li'));
    const task10 = items.find((li) => li.textContent.includes('締切確認0610'));
    const task20 = items.find((li) => li.textContent.includes('締切確認0620'));
    const task30 = items.find((li) => li.textContent.includes('締切確認0630'));
    if (!task10 || !task20 || !task30) {
      return { success: false, message: 'テスト用タスクの追加に失敗しました。' };
    }

    // ステップ1: 開始日のみ 2026-06-15 を設定 → 20日・30日のみ表示
    startDate.value = '2026-06-15';
    startDate.dispatchEvent(new win.Event('change', { bubbles: true }));
    await new Promise((r) => setTimeout(r, 200));

    if (isVisible(win, task10)) {
      return { success: false, message: '開始日を2026-06-15に設定した際、それより前の締切(06-10)のタスクが表示されたままです。' };
    }
    if (!isVisible(win, task20) || !isVisible(win, task30)) {
      return { success: false, message: '開始日を2026-06-15に設定した際、06-20または06-30のタスクが非表示になってしまっています。' };
    }

    // ステップ2: 終了日にも 2026-06-25 を設定 → 20日のみ表示
    endDate.value = '2026-06-25';
    endDate.dispatchEvent(new win.Event('change', { bubbles: true }));
    await new Promise((r) => setTimeout(r, 200));

    if (!isVisible(win, task20)) {
      return { success: false, message: '開始日2026-06-15・終了日2026-06-25の範囲内である06-20のタスクが表示されていません。' };
    }
    if (isVisible(win, task10) || isVisible(win, task30)) {
      return { success: false, message: '開始日2026-06-15・終了日2026-06-25の範囲外のタスクが表示されたままになっています。' };
    }

    // ステップ3: 開始日を空にして終了日のみ 2026-06-25 → 10日・20日のみ表示
    startDate.value = '';
    startDate.dispatchEvent(new win.Event('change', { bubbles: true }));
    await new Promise((r) => setTimeout(r, 200));

    if (!isVisible(win, task10) || !isVisible(win, task20)) {
      return { success: false, message: '終了日のみ2026-06-25を指定した際、06-10・06-20のタスクが表示されていません。' };
    }
    if (isVisible(win, task30)) {
      return { success: false, message: '終了日のみ2026-06-25を指定した際、06-30のタスクが非表示になっていません。' };
    }

    return { success: true, message: '締切日の期間フィルターが正しく機能しています。' };
  },
};
