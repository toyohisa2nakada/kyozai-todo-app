export default {
  title: '削除アニメーションの追加',
  instruction:
    '削除ボタンが押されて要素が消える際、急に消えるのではなく、CSSのアニメーションやトランジションを利用して、フェードアウトや縮小しながら滑らかに消える演出（クラスの追加と setTimeout や transitionend イベントの組み合わせなど）を実装してください。',

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

    input.value = 'アニメーション確認用タスク';
    addButton.click();
    await new Promise((r) => setTimeout(r, 80));

    const items = Array.from(list.querySelectorAll('li'));
    const target = items.find((li) => li.textContent.includes('アニメーション確認用タスク'));
    if (!target) {
      return { success: false, message: 'タスクの追加自体に失敗しています。' };
    }

    const delBtn = target.querySelector('.delete-btn');
    if (!delBtn) {
      return { success: false, message: '削除ボタンが見つかりません。前の課題が未完了の可能性があります。' };
    }

    win.confirm = () => true;
    delBtn.click();

    // クリック直後（アニメーション中）の状態をチェック
    await new Promise((r) => setTimeout(r, 60));

    const stillInDom = doc.body.contains(target);
    let animating = false;
    if (stillInDom) {
      const style = win.getComputedStyle(target);
      const hasAnimClass = Array.from(target.classList).some((c) =>
        /fade|out|hide|leave|remove|shrink/i.test(c)
      );
      const hasTransitionOrOpacity =
        (style.transitionDuration && style.transitionDuration !== '0s') ||
        parseFloat(style.opacity) < 1 ||
        style.animationName !== 'none';
      animating = hasAnimClass || hasTransitionOrOpacity;
    }

    // 最終的に削除されるかも確認（アニメーション完了後）
    await new Promise((r) => setTimeout(r, 800));
    const finallyRemoved = !doc.body.contains(target);

    if (!finallyRemoved) {
      return {
        success: false,
        message: '一定時間待ってもタスクが最終的にDOMから削除されませんでした。',
      };
    }

    if (!animating) {
      return {
        success: false,
        message: 'クリック直後にアニメーション用のクラスやopacity/transitionの変化が確認できませんでした。フェードアウトなどの演出を追加してください。',
      };
    }

    return { success: true, message: 'アニメーションを伴って正しく削除されています。' };
  },
};
