export default {
  title: 'タスクの追加機能の確認',
  instruction:
    '画面下部右側のプレビューにて、入力欄にタスク名と締切を入力し、タスクの種類（アイコン）にチェックを入れて「追加」ボタンを押した際、下のリスト領域にすべての情報（タスク名・種類・締切）を持ったタスクが正しく追加されるか確認してください。\n（※初期状態の動作確認用です。コードを変更せずに、そのまま「チェック」ボタンを押して合格することを確認してください）',

  check: async (frame) => {
    const doc = frame.contentDocument;
    if (!doc) {
      return { success: false, message: 'プレビューが読み込まれていません。' };
    }

    const input = doc.getElementById('todo-input');
    const deadline = doc.getElementById('todo-deadline');
    const workCb = doc.querySelector('.type-checkbox[value="work"]');
    const addButton = doc.getElementById('add-button');
    const list = doc.getElementById('todo-list');

    if (!input || !deadline || !workCb || !addButton || !list) {
      return {
        success: false,
        message: '必要な入力要素（todo-input / todo-deadline / type-checkbox / add-button / todo-list）が見つかりません。',
      };
    }

    input.value = 'テストタスクA';
    workCb.checked = true;
    deadline.value = '2026-07-01';

    addButton.click();
    await new Promise((r) => setTimeout(r, 80));

    const items = Array.from(list.querySelectorAll('li'));
    const found = items.find(
      (li) =>
        li.textContent.includes('テストタスクA') &&
        li.textContent.includes('2026-07-01') &&
        li.textContent.includes('仕事')
    );

    if (found) {
      return {
        success: true,
        message: 'タスクの追加機能は正しく動作しています。次の課題に進みましょう。',
      };
    }
    return {
      success: false,
      message: 'タスク名・種類・締切をすべて含むタスクがリストに追加されませんでした。',
    };
  },
};
