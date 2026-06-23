export default {
  title: '削除ボタンの動作実装',
  instruction:
    '削除ボタンがクリックされたときの動作を実装します。ボタンが押された際、JavaScriptの confirm() で確認ダイアログ（「本当に削除しますか？」など）を表示し、ユーザーがOKを押したときに対象のタスク要素（li）が画面から削除（.remove()）されるようにロジックを実装してください。',

  check: async (frame) => {
    const win = frame.contentWindow;
    const doc = frame.contentDocument;
    if (!doc || !win) return { success: false, message: 'プレビューが読み込まれていません。' };

    const input = doc.getElementById('todo-input');
    const addButton = doc.getElementById('add-button');
    const list = doc.getElementById('todo-list');
    if (!input || !addButton || !list) {
      return { success: false, message: '必要な要素が見つかりません。' };
    }

    input.value = '削除動作確認用タスク';
    addButton.click();
    await new Promise((r) => setTimeout(r, 80));

    const items = Array.from(list.querySelectorAll('li'));
    const target = items.find((li) => li.textContent.includes('削除動作確認用タスク'));
    if (!target) {
      return { success: false, message: 'タスクの追加自体に失敗しています。' };
    }

    const delBtn = target.querySelector('.delete-btn');
    if (!delBtn) {
      return { success: false, message: '削除ボタン（.delete-btn）が見つかりません。前の課題が未完了の可能性があります。' };
    }

    // confirm() を常にtrueを返すスタブに置き換える
    win.confirm = () => true;
    delBtn.click();

    // アニメーション実装も考慮し、少し長めに待機して最終的な削除を確認する
    await new Promise((r) => setTimeout(r, 700));

    const stillExists = doc.body.contains(target);
    if (stillExists) {
      return {
        success: false,
        message: 'confirm()でOKを選択しても、タスクがDOMから削除されませんでした。',
      };
    }

    return { success: true, message: '確認ダイアログ後にタスクが正しく削除されました。' };
  },
};
