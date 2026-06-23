export default {
  title: '削除ボタンの追加',
  instruction:
    'タスクを追加するJavaScriptのロジック（app.js）を修正し、新しく追加される各タスク（li要素）の中に、削除ボタン（button要素、class="delete-btn"）が含まれるように要素を追加してください。',

  check: async (frame) => {
    const doc = frame.contentDocument;
    if (!doc) return { success: false, message: 'プレビューが読み込まれていません。' };

    const input = doc.getElementById('todo-input');
    const addButton = doc.getElementById('add-button');
    const list = doc.getElementById('todo-list');
    if (!input || !addButton || !list) {
      return { success: false, message: '必要な要素が見つかりません。' };
    }

    input.value = '削除確認用タスク';
    addButton.click();
    await new Promise((r) => setTimeout(r, 80));

    const items = Array.from(list.querySelectorAll('li'));
    const target = items.find((li) => li.textContent.includes('削除確認用タスク'));
    if (!target) {
      return { success: false, message: 'タスクの追加自体に失敗しています。' };
    }

    const delBtn = target.querySelector('.delete-btn');
    if (!delBtn) {
      return {
        success: false,
        message: '追加されたタスクの中に class="delete-btn" を持つ削除ボタンが見つかりません。',
      };
    }

    return { success: true, message: '削除ボタンが正しく追加されています。' };
  },
};
