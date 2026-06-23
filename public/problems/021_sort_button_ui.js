export default {
  title: 'ソートボタンのUI状態切り替え',
  instruction:
    'ソートボタンがクリックされるたびに、昇順（asc）と降順（desc）の状態が交互に入れ替わることが見た目でわかるようにします。ボタンが押されるたびに、ボタン自身のカスタムデータ属性（data-order="asc" と data-order="desc"）が切り替わるようにJavaScriptとCSSを調整してください。',

  check: async (frame) => {
    const doc = frame.contentDocument;
    if (!doc) return { success: false, message: 'プレビューが読み込まれていません。' };

    const sortButton = doc.getElementById('sort-button');
    if (!sortButton) {
      return { success: false, message: 'sort-buttonが見つかりません。前の課題が未完了の可能性があります。' };
    }

    sortButton.click();
    await new Promise((r) => setTimeout(r, 50));
    const order1 = sortButton.dataset.order;

    sortButton.click();
    await new Promise((r) => setTimeout(r, 50));
    const order2 = sortButton.dataset.order;

    const validValues = ['asc', 'desc'];
    if (!validValues.includes(order1) || !validValues.includes(order2)) {
      return {
        success: false,
        message: 'data-order属性に "asc" または "desc" が設定されていません。',
      };
    }

    if (order1 === order2) {
      return {
        success: false,
        message: 'ボタンをクリックしても data-order の値が切り替わりませんでした。',
      };
    }

    return { success: true, message: 'クリックごとにdata-order属性が正しくトグルしています。' };
  },
};
