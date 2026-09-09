let anomalies=[];
let unlocked=JSON.parse(localStorage.getItem("wmUnlocked")||"[]");
let current=Number(localStorage.getItem("wmCurrent")||0);
const $=s=>document.querySelector(s);const screens=["splash","contact","archive","complete"];
function show(id){screens.forEach(x=>document.getElementById(x).classList.toggle("active",x===id))}
function save(){localStorage.setItem("wmUnlocked",JSON.stringify(unlocked));localStorage.setItem("wmCurrent",String(current))}
async function sha256(text){const data=new TextEncoder().encode(text);const hash=await crypto.subtle.digest("SHA-256",data);return [...new Uint8Array(hash)].map(b=>b.toString(16).padStart(2,"0")).join("")}
function norm(s){return s.trim().toUpperCase().replace(/\s+/g,"")}
async function init(){anomalies=await (await fetch("data.json")).json();if(current>=anomalies.length)showComplete();else renderEncounter();updateProgress()}
function updateProgress(){$("#progress").textContent=`Контакты: ${unlocked.length} / ???`}
function renderEncounter(){if(current>=anomalies.length){showComplete();return}const a=anomalies[current];$("#encounterImage").src=a.image+"?v=11";$("#encounterImage").alt=a.code;$("#answer").value="";$("#feedback").textContent="";$("#feedback").className="feedback";show("contact");updateProgress()}
async function checkAnswer(){const a=anomalies[current];const entered=norm($("#answer").value);const h=await sha256(entered);const fb=$("#feedback");if(h===a.answerHash){fb.className="feedback ok";fb.textContent=`КОНТАКТ УСТАНОВЛЕН — ${a.name}`;if(!unlocked.includes(a.code))unlocked.push(a.code);save();updateProgress();setTimeout(()=>{current++;save();renderEncounter()},1300)}else{fb.className="feedback bad";fb.textContent="Ключ не соответствует этой визуальной сигнатуре."}}
function renderArchive(){const grid=$("#archiveGrid");grid.innerHTML="";anomalies.forEach(a=>{const open=unlocked.includes(a.code);const el=document.createElement("article");el.className="archive-card"+(open?"":" locked");el.innerHTML=open?`<img src="${a.image}" alt="${a.code}"><div class="archive-body"><div class="code">${a.code}</div><h3>${a.name}</h3><strong>${a.role}</strong><p>${a.lore}</p><p><b>Способность:</b><br>${a.ability}</p></div>`:`<div style="height:245px;display:grid;place-items:center;font-size:70px;background:#070b12">?</div><div class="archive-body"><div class="code">WM-????</div><h3>НЕИЗВЕСТНО</h3><p>Контакт ещё не установлен.</p></div>`;grid.appendChild(el)})}
function openArchive(){renderArchive();show("archive")}
function showComplete(){show("complete");updateProgress()}
function resetProgress(){if(!confirm("Сбросить прогресс прототипа WM?"))return;unlocked=[];current=0;localStorage.removeItem("wmUnlocked");localStorage.removeItem("wmCurrent");renderEncounter()}
function startGame(){renderEncounter()}
function downloadCurrent(){const a=anomalies[current];if(!a)return;const link=document.createElement("a");link.href=a.image+"?v=11";link.download=(a.code||"wm-card")+".jpg";link.click()}
document.addEventListener("keydown",e=>{if(e.key==="Enter"&&document.getElementById("contact").classList.contains("active"))checkAnswer()});init();