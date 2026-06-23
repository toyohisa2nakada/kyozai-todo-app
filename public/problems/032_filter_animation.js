function addTask(doc, { name, type, deadline = '2026-08-01' }) {
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
  title: 'フィルター切り替え時のアニメーション追加',
  instruction:
    'フィルターによってタスクが表示・非表示される際、パッと切り替わるのではなく、CSSの transition や animation を活用して、要素が滑らかにフェードイン・フェードアウト、あるいは高さが伸縮しながら消長する視覚効果を実装してください。',

  check: async (frame) => {
    const win = frame.contentWindow;
    const doc = frame.contentDocument;
    if (!doc || !win) return { success: false, message: 'プレビューが読み込まれていません。' };

    const filterCheckboxes = Array.from(doc.querySelectorAll('.filter-checkbox'));
    if (filterCheckboxes.length !== 3) {
      return { success: false, message: 'フィルター用チェックボックスが見つかりません。前の課題が未完了の可能性があります。' };
    }

    filterCheckboxes.forEach((cb) => {
      cb.checked = true;
      cb.dispatchEvent(new win.Event('change', { bubbles: true }));
    });
    await new Promise((r) => setTimeout(r, 60));

    addTask(doc, { name: 'アニメフィルター確認', type: 'study' });
    await new Promise((r) => setTimeout(r, 80));

    const list = doc.getElementById('todo-list');
    const target = Array.from(list.querySelectorAll('li')).find((li) =>
      li.textContent.includes('アニメフィルター確認')
    );
    if (!target) {
      return { success: false, message: 'テスト用タスクの追加に失敗しました。' };
    }

    const studyFilter = filterCheckboxes.find((cb) => cb.value === 'study');
    studyFilter.checked = false;
    studyFilter.dispatchEvent(new win.Event('change', { bubbles: true }));

    // 切り替え直後、アニメーション用のスタイル/クラスが付与されているか確認
    await new Promise((r) => setTimeout(r, 60));
    const style = win.getComputedStyle(target);
    const hasAnimClass = Array.from(target.classList).some((c) =>
      /fade|hide|collapse|leave|out/i.test(c)
    );
    const hasTransitionEffect =
      (style.transitionDuration && style.transitionDuration !== '0s') ||
      style.animationName !== 'none' ||
      parseFloat(style.opacity) < 1 ||
      target.style.height === '0px';

    if (!hasAnimClass && !hasTransitionEffect) {
      return {
        success: false,
        message: 'フィルター切り替え時にアニメーション（transition/animation/opacity変化等）が確認できませんでした。',
      };
    }

    await new Promise((r) => setTimeout(r, 700));
    const finallyHidden = !isVisible(win, target);
    if (!finallyHidden) {
      return {
        success: false,
        message: 'アニメーション終了後もタスクが非表示になっていません。',
      };
    }

    return { success: true, message: 'フィルター切り替え時のアニメーションが正しく実装されています。' };
  },
};
