export default {
  title: 'ソートボタンの追加',
  instruction:
    'タスクを表示しているリストの上部（ヘッダー領域など適当な場所）に、タスクを締切日順に並び替えるためのソートボタン（button要素、id="sort-button"）をHTMLに追加してください。',

  check: async (frame) => {
    const doc = frame.contentDocument;
    if (!doc) return { success: false, message: 'プレビューが読み込まれていません。' };

    const sortButton = doc.getElementById('sort-button');
    if (!sortButton) {
      return { success: false, message: 'id="sort-button" を持つボタンが見つかりません。' };
    }
    if (sortButton.tagName !== 'BUTTON') {
      return { success: false, message: 'id="sort-button" の要素はbutton要素である必要があります。' };
    }

    return { success: true, message: 'ソートボタンが正しく追加されています。' };
  },
};
