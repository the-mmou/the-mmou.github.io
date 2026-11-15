/* 共用：導覽列、底部按鈕、作品資料 */
/* 預約系統網址：照「預約系統設定步驟.md」部署後貼在這裡。沒填時，網站不顯示「最近可約」，預約改用 IG 私訊 */
const API="";
const DEMO=new URLSearchParams(location.search).has("demo"); /* 網址加 ?demo=1 可預覽「最近可約」示範資料 */
const SERIES=[
 {id:"flower",name:"手繪花朵・格紋",desc:"小白花與格紋，柔和的灰藍與焦糖色",imgs:["w01","w03","w08","w02"]},
 {id:"glitter",name:"亮粉",desc:"深灰亮粉與裸粉亮粉，閃而不俗",imgs:["w04","w05"]},
 {id:"wash",name:"暈染・酒紅與大地色",desc:"酒紅、粉褐、灰褐的暈染與單色",imgs:["w06","w07"]},
 {id:"dots",name:"點點・酒紅",desc:"裸粉底搭酒紅點點與細線",imgs:["w11","w13"]},
 {id:"cloud",name:"星星・雲朵",desc:"灰藍底的星星、亮片與小雲朵小狗",imgs:["w10"]},
 {id:"set",name:"整組色票",desc:"一次看整組的色彩與款式搭配",imgs:["w12","w09"]}
];
const PAGES=[["index.html","作品"],["slots.html","時段表"],["price.html","價目表"],["book.html","預約"],["info.html","須知"]];
const here=location.pathname.split("/").pop()||"index.html";
const cur=here==="series.html"?"index.html":here;
const content=[...document.body.children].filter(e=>e.tagName!=="SCRIPT"&&e.id!=="lb");
const wrap=document.createElement("div");wrap.className="wrap";
wrap.innerHTML=`<div class="hero2"><div class="t"><div class="kicker">MMOU NAIL STUDIO</div><h1>mmou 美甲工作室</h1></div>
  <a class="mapbox" href="https://www.google.com/maps/search/?api=1&query=竹南火車站東站" target="_blank" rel="noopener"><b>店家位置</b><span>📍 開啟地圖</span></a></div>
  <div class="tabbar" role="tablist">${PAGES.map(p=>`<a class="tabbtn ${p[0]===cur?'on':''}" href="${p[0]}" role="tab" aria-selected="${p[0]===cur}">${p[1]}</a>`).join("")}</div>
  <div class="pane on" id="paneMain"></div>`;
document.body.prepend(wrap);
content.forEach(el=>wrap.querySelector("#paneMain").appendChild(el));
document.body.insertAdjacentHTML("afterbegin",`<header><nav>
  <a class="logo" href="index.html">mmou</a>
  <a class="btn sm" href="book.html">立即預約</a>
  <button class="menu-btn" id="mb" aria-label="選單" aria-expanded="false"><span></span></button></nav></header>
<div class="drawer" id="dr"><a href="index.html">首頁・作品</a>${PAGES.slice(1).map(p=>`<a href="${p[0]}" class="${p[0]===cur?'cur':''}">${p[1]}</a>`).join("")}<a class="btn" href="book.html">立即預約</a></div>`);
document.body.insertAdjacentHTML("beforeend",`<footer>© mmou nail studio ・ <a href="https://www.instagram.com/the.mmou" target="_blank" rel="noopener">Instagram</a></footer>
<div class="bar"><span class="total" id="barTotal"></span><a class="btn ${here==='book.html'?'':'line'}" href="https://ig.me/m/the.mmou" target="_blank" rel="noopener">私訊</a>${here==='book.html'?'':'<a class="btn" href="book.html">預約</a>'}</div>`);
const mb=document.getElementById("mb"),dr=document.getElementById("dr");
function tg(o){if(o)dr.style.top=document.querySelector("header").offsetHeight+"px";dr.classList.toggle("open",o);mb.classList.toggle("open",o);mb.setAttribute("aria-expanded",o);document.body.style.overflow=o?"hidden":""}
mb.onclick=()=>tg(!dr.classList.contains("open"));
dr.addEventListener("click",e=>{if(e.target.closest("a"))tg(false)});
addEventListener("pageshow",()=>tg(false));
addEventListener("resize",()=>{if(innerWidth>860)tg(false)});

/* 可約時段：{ "2026-11-20": ["09:00","13:00"] }；沒接預約系統（也不是示範）時回傳 null */
const START_TIMES=["09:00","13:00","17:00"];
const WDAY="日一二三四五六";
const ymd=d=>d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0");
async function loadSlots(){
  if(API){const j=await (await fetch(API)).json();return j.slots||{}}
  if(DEMO){const m={},t=new Date();
    for(let i=1;i<=14;i++){const d=new Date(t.getFullYear(),t.getMonth(),t.getDate()+i);
      const k=(i*5+d.getDay())%7;
      if(k===0||d.getDay()===1)continue; /* 示範：週一公休、部分日子沒開 */
      m[ymd(d)]=START_TIMES.filter((_,j)=>(i+j+k)%4!==0)}
    return m}
  return null;
}
