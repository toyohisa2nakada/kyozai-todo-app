(function(){const a=document.createElement("link").relList;if(a&&a.supports&&a.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))f(n);new MutationObserver(n=>{for(const t of n)if(t.type==="childList")for(const o of t.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&f(o)}).observe(document,{childList:!0,subtree:!0});function l(n){const t={};return n.integrity&&(t.integrity=n.integrity),n.referrerPolicy&&(t.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?t.credentials="include":n.crossOrigin==="anonymous"?t.credentials="omit":t.credentials="same-origin",t}function f(n){if(n.ep)return;n.ep=!0;const t=l(n);fetch(n.href,t)}})();const T="modulepreload",M=function(e){return"/kyozai-todo-app/"+e},v={},$=function(a,l,f){let n=Promise.resolve();if(l&&l.length>0){document.getElementsByTagName("link");const o=document.querySelector("meta[property=csp-nonce]"),i=(o==null?void 0:o.nonce)||(o==null?void 0:o.getAttribute("nonce"));n=Promise.allSettled(l.map(c=>{if(c=M(c),c in v)return;v[c]=!0;const s=c.endsWith(".css"),P=s?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${c}"]${P}`))return;const p=document.createElement("link");if(p.rel=s?"stylesheet":T,s||(p.as="script"),p.crossOrigin="",p.href=c,i&&p.setAttribute("nonce",i),document.head.appendChild(p),s)return new Promise((C,j)=>{p.addEventListener("load",C),p.addEventListener("error",()=>j(new Error(`Unable to preload CSS for ${c}`)))})}))}function t(o){const i=new Event("vite:preloadError",{cancelable:!0});if(i.payload=o,window.dispatchEvent(i),!i.defaultPrevented)throw o}return n.then(o=>{for(const i of o||[])i.status==="rejected"&&t(i.reason);return a().catch(t)})},A=["001_initial_add_check.js","010_add_delete_button.js","011_delete_action.js","012_delete_animation.js","020_add_sort_button.js","021_sort_button_ui.js","022_sort_logic.js","030_add_filter_checkbox.js","031_filter_logic.js","032_filter_animation.js","040_add_deadline_filter_ui.js","041_deadline_filter_logic.js"],z=`<div class="app-container">
  <h1>Todoリスト</h1>
  <div class="input-area">
    <input type="text" id="todo-input" placeholder="タスク名を入力" />

    <div class="type-checkboxes">
      <input type="checkbox" id="type-work" class="type-checkbox" value="work">
      <label for="type-work" class="type-label work-label">💼 仕事</label>

      <input type="checkbox" id="type-private" class="type-checkbox" value="private">
      <label for="type-private" class="type-label private-label">🏠 プライベート</label>

      <input type="checkbox" id="type-study" class="type-checkbox" value="study">
      <label for="type-study" class="type-label study-label">📚 勉強</label>
    </div>

    <input type="date" id="todo-deadline" />
    <button id="add-button">追加</button>
  </div>

  <ul id="todo-list"></ul>
</div>
`,O=`body {
  font-family: "Hiragino Kaku Gothic ProN", "Segoe UI", system-ui, sans-serif;
  background: #f4f6f8;
  margin: 0;
  padding: 20px;
  color: #333;
}

.app-container {
  max-width: 520px;
  margin: 0 auto;
  background: #fff;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.08);
}

h1 {
  margin-top: 0;
  font-size: 1.3rem;
  color: #2c3e50;
}

.input-area {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
  margin-bottom: 16px;
}

#todo-input {
  flex: 1;
  min-width: 140px;
  padding: 8px 10px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 0.95rem;
}

#todo-deadline {
  padding: 7px 10px;
  border: 1px solid #ccc;
  border-radius: 6px;
}

#add-button {
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  background: #3a6ea5;
  color: #fff;
  cursor: pointer;
  font-size: 0.95rem;
}

#add-button:hover {
  background: #2f5c8a;
}

/* ---- アイコン風チェックボックス ---- */
.type-checkboxes {
  display: flex;
  gap: 6px;
}

.type-checkbox {
  display: none;
}

.type-label {
  display: inline-block;
  padding: 7px 10px;
  border-radius: 20px;
  background: #eee;
  color: #888;
  cursor: pointer;
  font-size: 0.85rem;
  border: 1px solid #ddd;
  transition: all 0.15s ease;
  user-select: none;
}

.type-checkbox:checked + .type-label {
  color: #fff;
  border-color: transparent;
}

.type-checkbox#type-work:checked + .work-label {
  background: #3a6ea5;
}

.type-checkbox#type-private:checked + .private-label {
  background: #c0784f;
}

.type-checkbox#type-study:checked + .study-label {
  background: #4f9d69;
}

/* ---- リスト ---- */
#todo-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.todo-item {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  align-items: center;
  padding: 10px 12px;
  border: 1px solid #eee;
  border-radius: 8px;
  margin-bottom: 8px;
  background: #fafbfc;
}

.todo-name {
  font-weight: bold;
  flex: 1;
}

.todo-type {
  font-size: 0.85rem;
  color: #555;
}

.todo-deadline {
  font-size: 0.8rem;
  color: #888;
}
`,D=`const addButton = document.getElementById('add-button');
const todoInput = document.getElementById('todo-input');
const todoDeadline = document.getElementById('todo-deadline');
const todoList = document.getElementById('todo-list');

const typeIcons = {
  work: '💼 仕事',
  private: '🏠 プライベート',
  study: '📚 勉強',
};

addButton.addEventListener('click', () => {
  const name = todoInput.value.trim();
  if (!name) return;

  const checkedTypes = Array.from(
    document.querySelectorAll('.type-checkbox:checked')
  ).map((cb) => cb.value);
  const deadline = todoDeadline.value;

  const li = document.createElement('li');
  li.className = 'todo-item';
  li.dataset.name = name;
  li.dataset.type = checkedTypes.join(',');
  li.dataset.deadline = deadline;

  const nameSpan = document.createElement('span');
  nameSpan.className = 'todo-name';
  nameSpan.textContent = name;

  const typeSpan = document.createElement('span');
  typeSpan.className = 'todo-type';
  typeSpan.textContent = checkedTypes.map((t) => typeIcons[t] || t).join(' ');

  const deadlineSpan = document.createElement('span');
  deadlineSpan.className = 'todo-deadline';
  deadlineSpan.textContent = deadline ? \`締切: \${deadline}\` : '締切: 未設定';

  li.appendChild(nameSpan);
  li.appendChild(typeSpan);
  li.appendChild(deadlineSpan);

  todoList.appendChild(li);

  todoInput.value = '';
  document.querySelectorAll('.type-checkbox').forEach((cb) => (cb.checked = false));
  todoDeadline.value = '';
});
`,R=document.getElementById("problem-title"),q=document.getElementById("problem-instruction"),N=document.getElementById("progress-label"),I=document.getElementById("prev-btn"),g=document.getElementById("next-btn"),h=document.getElementById("check-btn"),y=document.getElementById("result-area"),S=document.getElementById("preview-frame"),E=document.getElementById("iframe-cover"),k=document.querySelectorAll("#tabs .tab"),U=document.getElementById("monaco-container"),F=document.getElementById("top-pane"),V=document.getElementById("bottom-pane"),H=document.getElementById("editor-pane");document.getElementById("preview-pane");const K=document.getElementById("h-splitter"),W=document.getElementById("v-splitter"),Y=document.getElementById("app");let m=[],d=0,b=[],u=null,r={},w="html",_=null;function G(){return new Promise(e=>{require.config({paths:{vs:"https://cdn.jsdelivr.net/npm/monaco-editor@0.45.0/min/vs"}}),require(["vs/editor/editor.main"],()=>e())})}function J(){r.html=monaco.editor.createModel(z,"html"),r.css=monaco.editor.createModel(O,"css"),r.js=monaco.editor.createModel(D,"javascript"),u=monaco.editor.create(U,{model:r.html,theme:"vs-dark",automaticLayout:!1,fontSize:14,minimap:{enabled:!1}}),Object.values(r).forEach(e=>{e.onDidChangeContent(()=>{X()})}),k.forEach(e=>{e.addEventListener("click",()=>{k.forEach(a=>a.classList.remove("active")),e.classList.add("active"),w=e.dataset.lang,u.setModel(r[w])})}),B()}function X(){clearTimeout(_),_=setTimeout(B,300)}function B(){const e=r.html.getValue(),a=r.css.getValue(),l=r.js.getValue(),f=`<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="UTF-8" />
<style>${a}</style>
</head>
<body>
${e}
<script>${l}<\/script>
</body>
</html>`;S.srcdoc=f}async function Q(){const e=[];for(const a of A){const l=await $(()=>import(`/kyozai-todo-app/problems/${a}`),[]);e.push(l.default)}return e}function x(){const e=m[d];R.textContent=e.title,q.textContent=e.instruction,N.textContent=`課題 ${d+1} / ${m.length}`,I.disabled=d===0,g.disabled=d===m.length-1||!b[d],Z()}function L(e,a){y.textContent=a,y.classList.add("show"),y.classList.toggle("success",e),y.classList.toggle("fail",!e)}function Z(){y.classList.remove("show","success","fail"),y.textContent=""}async function ee(){const e=m[d];h.disabled=!0,h.textContent="判定中...";try{const a=await e.check(S);L(a.success,a.message),a.success&&(b[d]=!0,g.disabled=d===m.length-1)}catch(a){L(!1,`チェック実行中にエラーが発生しました: ${a.message}`)}finally{h.disabled=!1,h.textContent="チェック"}}function te(){d!==0&&(d-=1,x())}function ne(){d===m.length-1||!b[d]||(d+=1,x())}function oe(){let e=null;function a(n){return t=>{e=n,E.classList.add("active"),t.preventDefault()}}function l(n){if(e){if(e==="h"){const t=Y.getBoundingClientRect();let o=n.clientY-t.top;const i=60,c=t.height-100;o=Math.max(i,Math.min(c,o));const s=o/t.height*100;F.style.height=`${s}%`}else if(e==="v"){const t=V.getBoundingClientRect();let o=n.clientX-t.left;const i=150,c=t.width-150;o=Math.max(i,Math.min(c,o));const s=o/t.width*100;H.style.width=`${s}%`}u&&u.layout()}}function f(){e&&(e=null,E.classList.remove("active"),u&&u.layout())}K.addEventListener("mousedown",a("h")),W.addEventListener("mousedown",a("v")),window.addEventListener("mousemove",l),window.addEventListener("mouseup",f),window.addEventListener("resize",()=>{u&&u.layout()})}async function ae(){oe(),I.addEventListener("click",te),g.addEventListener("click",ne),h.addEventListener("click",ee),m=await Q(),b=new Array(m.length).fill(!1),await G(),J(),x()}ae();
