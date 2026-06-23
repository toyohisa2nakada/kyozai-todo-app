export default {
  title: '締切日フィルターUIの追加',
  instruction:
    'タスクの締切日（deadline）で期間絞り込みを行うため、タスクリストの上部（既存のフィルター群の近く）に、開始日（id="filter-start-date"）と終了日（id="filter-end-date"）を指定するための2つの input[type="date"] 要素をHTMLに追加してください。',

  check: async (frame) => {
    const doc = frame.contentDocument;
    if (!doc) return { success: false, message: 'プレビューが読み込まれていません。' };

    const startDate = doc.getElementById('filter-start-date');
    const endDate = doc.getElementById('filter-end-date');

    if (!startDate) {
      return { success: false, message: 'id="filter-start-date" を持つ要素が見つかりません。' };
    }
    if (!endDate) {
      return { success: false, message: 'id="filter-end-date" を持つ要素が見つかりません。' };
    }
    if (startDate.type !== 'date' || endDate.type !== 'date') {
      return { success: false, message: 'filter-start-date / filter-end-date は input type="date" である必要があります。' };
    }

    return { success: true, message: '締切日フィルターのUIが正しく追加されています。' };
  },
};
