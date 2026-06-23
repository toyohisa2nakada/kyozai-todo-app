export default {
  title: 'フィルター用チェックボックスの追加',
  instruction:
    'タスクの種類（type）で絞り込み（フィルター）を行うため、タスクリストの上部に「仕事」「プライベート」「勉強」の3つの絞り込み用チェックボックスをHTMLに追加してください。それぞれのinput要素には、識別・連動しやすいように class="filter-checkbox" および value 属性（work, private, study）を付与してください。',

  check: async (frame) => {
    const doc = frame.contentDocument;
    if (!doc) return { success: false, message: 'プレビューが読み込まれていません。' };

    const filterCheckboxes = Array.from(doc.querySelectorAll('.filter-checkbox'));
    if (filterCheckboxes.length !== 3) {
      return {
        success: false,
        message: `class="filter-checkbox" を持つ要素が3つ必要ですが、現在 ${filterCheckboxes.length} 個しか見つかりません。`,
      };
    }

    const values = filterCheckboxes.map((cb) => cb.value).sort();
    const expected = ['private', 'study', 'work'];
    if (JSON.stringify(values) !== JSON.stringify(expected)) {
      return {
        success: false,
        message: 'フィルター用チェックボックスの value 属性が work / private / study のいずれかと一致しません。',
      };
    }

    return { success: true, message: 'フィルター用チェックボックスが正しく追加されています。' };
  },
};
