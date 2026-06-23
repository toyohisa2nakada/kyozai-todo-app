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

export default {
  title: 'ソートロジックの実装',
  instruction:
    'ソートボタンが押された際、現在のデータ属性（data-order）の状態（昇順/降順）に基づいて、画面に表示されているタスクのリスト（li要素群）を「締切日」の順序でソートして並び替えるロジックを実装してください。',

  check: async (frame) => {
    const doc = frame.contentDocument;
    if (!doc) return { success: false, message: 'プレビューが読み込まれていません。' };

    const list = doc.getElementById('todo-list');
    const sortButton = doc.getElementById('sort-button');
    if (!list || !sortButton) {
      return { success: false, message: '必要な要素（todo-list / sort-button）が見つかりません。' };
    }

    addTask(doc, { name: 'ソート確認C', deadline: '2026-08-30' });
    await new Promise((r) => setTimeout(r, 60));
    addTask(doc, { name: 'ソート確認A', deadline: '2026-08-10' });
    await new Promise((r) => setTimeout(r, 60));
    addTask(doc, { name: 'ソート確認B', deadline: '2026-08-20' });
    await new Promise((r) => setTimeout(r, 60));

    sortButton.click();
    await new Promise((r) => setTimeout(r, 80));

    const order = sortButton.dataset.order;
    const items = Array.from(list.querySelectorAll('li')).filter((li) =>
      /ソート確認[ABC]/.test(li.textContent)
    );
    if (items.length < 3) {
      return { success: false, message: 'テスト用のタスクが正しく追加されませんでした。' };
    }

    const deadlines = items.map((li) => li.dataset.deadline);
    const sortedAsc = [...deadlines].sort();
    const sortedDesc = [...sortedAsc].reverse();

    const isAsc = JSON.stringify(deadlines) === JSON.stringify(sortedAsc);
    const isDesc = JSON.stringify(deadlines) === JSON.stringify(sortedDesc);

    if (order === 'asc' && !isAsc) {
      return {
        success: false,
        message: '昇順(asc)状態のはずですが、締切日順に正しく並び替えられていません。',
      };
    }
    if (order === 'desc' && !isDesc) {
      return {
        success: false,
        message: '降順(desc)状態のはずですが、締切日順に正しく並び替えられていません。',
      };
    }
    if (!isAsc && !isDesc) {
      return {
        success: false,
        message: '締切日に基づいた並び替えが行われていません。',
      };
    }

    return { success: true, message: '締切日に基づいたソートが正しく機能しています。' };
  },
};
