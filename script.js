const EC_MAX=4,QN=8,QK=5,QMAX=2,APLUS=305,AQ=5;
const GRADES=[["A+",APLUS],["A",285],["A-",270],["B+",255],["B",230],["B-",210],["C+",190],["C",180],["C-",175],["D+",170],["D",165],["D-",160]];
const EXAMS=[["m1","Midterm 1",20],["m2","Midterm 2",20],["m3","Midterm 3",45],["fin","Final",75]];
const PART=[["hw","Homework",10],["lab","Lab",10],["disc","Discussion",10]];
const PROJ=4,PMAX=25;
const PROJROW=`<div class="row pj"><label>Projects<small>total out of ${PMAX*PROJ}, add 1 to a project if you got the early-submission bonus</small></label><div class="quizzes">${Array.from({length:PROJ},(_,i)=>`<input type="number" id="p${i}" min="0" step="any" inputmode="decimal" aria-label="Project ${i+1}" placeholder="P${i+1}">`).join("")}</div></div>`;
const $=id=>document.getElementById(id);
const letter=p=>{for(const[g,c]of GRADES.slice(1))if(p>=c)return g;return "F"};
const fmt=x=>(Math.round(x*10)/10).toString();
const num=id=>{const s=$(id).value.trim();return s===""?null:Number(s)};
let grp="A";try{grp=localStorage.getItem("cs61a-grp")||"A"}catch(e){}
const sync=()=>document.querySelectorAll(".pill").forEach(b=>b.setAttribute("aria-pressed",String(b.dataset.g===grp)));
$("chips").innerHTML=["A","B","C","D","All"].map(g=>`<button type="button" class="pill" data-g="${g}">${g==="All"?"All grades":g}</button>`).join("");
$("chips").onclick=e=>{const b=e.target.closest("button");if(!b)return;grp=b.dataset.g;try{localStorage.setItem("cs61a-grp",grp)}catch(x){}sync();render()};

let repl=true;try{repl=localStorage.getItem("cs61a-repl")!=="0"}catch(e){}
const syncRepl=()=>$("sw").setAttribute("aria-checked",String(repl));
$("sw").onclick=()=>{repl=!repl;try{localStorage.setItem("cs61a-repl",repl?"1":"0")}catch(x){}syncRepl();render()};
$("qb").onclick=()=>{const t=$("qtxt");t.hidden=!t.hidden;$("qb").setAttribute("aria-expanded",String(!t.hidden))};

const FILL={
  exams:()=>EXAMS.map(([k,,m])=>[k,m]),
  quizzes:()=>Array.from({length:QN},(_,i)=>["q"+i,QMAX]),
  coursework:()=>PART.flatMap(([k,,m])=>[[k+"e",m],[k+"d",m]])
};
const undo={};
document.querySelectorAll(".mx").forEach(b=>b.onclick=()=>{
  const s=b.dataset.s,list=FILL[s]();
  if(undo[s]){undo[s].forEach(([id,v])=>$(id).value=v);delete undo[s];b.setAttribute("aria-pressed","false")}
  else{undo[s]=list.map(([id])=>[id,$(id).value]);list.forEach(([id,v])=>$(id).value=v);b.setAttribute("aria-pressed","true")}
  save();render();
});

$("examsIn").innerHTML=EXAMS.map(([k,n,m])=>`<div class="row"><label for="${k}">${n}<small>out of ${m}</small></label><div class="pair"><span class="apm" id="am_${k}" aria-hidden="true"></span><input type="number" id="${k}" min="0" step="any" inputmode="decimal" placeholder="—"><span class="nt" id="nt_${k}" aria-hidden="true"></span></div></div>`).join("");
$("quizIn").innerHTML=Array.from({length:QN},(_,i)=>`<input type="number" id="q${i}" min="0" step="any" inputmode="decimal" aria-label="Quiz ${i+1}" placeholder="Q${i+1}">`).join("");
$("parts").innerHTML=PART.map(([k,n,m])=>`<div class="row"><label>${n}<small>out of ${m}</small></label><div class="pair"><input type="number" id="${k}e" min="0" step="any" inputmode="decimal" aria-label="${n} earned" placeholder="earned"> / <input type="number" id="${k}d" min="0" step="any" inputmode="decimal" aria-label="${n} graded so far" placeholder="graded"></div></div>`).join("")+PROJROW+`<div class="row opt"><label for="ct">Contest A+ points<small>optional contests</small></label><input type="number" id="ct" min="0" step="any" inputmode="decimal" placeholder="0"></div>`;

const ids=()=>[...document.querySelectorAll("input")].map(i=>i.id);
function save(){try{const o={};ids().forEach(i=>o[i]=$(i).type==="checkbox"?$(i).checked:$(i).value);localStorage.setItem("cs61a-grade-v3",JSON.stringify(o))}catch(e){}}
function load(){try{const o=JSON.parse(localStorage.getItem("cs61a-grade-v3")||localStorage.getItem("cs61a-grade-v2")||"{}");ids().forEach(i=>{if(o[i]!==undefined){if($(i).type==="checkbox")$(i).checked=!!o[i];else $(i).value=o[i]}})}catch(e){}}

function calc(){
  const err=[],earned={},rem={};let aqn=0;
  const bad=v=>Number.isNaN(v)||(v!==null&&v<0);
  for(const[k,n,m]of EXAMS){const v=num(k);if(bad(v)){err.push(`${n}: enter a number, 0 or more.`);continue}
    const a=v!==null&&v>=m+AQ;if(a)aqn++;earned[k]=(v??0)-(a?AQ:0);rem[k]=v===null?m:0}
  let recov=0;const gains={};
  if(repl&&rem.fin===0&&earned.fin!==undefined){
    const fp=Math.min(1,earned.fin/EXAMS[3][2]);
    for(const[k,,m]of EXAMS.slice(0,3)){if(rem[k]===0&&earned[k]!==undefined){const g=Math.max(0,0.9*fp*m-earned[k]);earned[k]+=g;recov+=g;gains[k]=g}}
  }
  const sc=[];
  for(let i=0;i<QN;i++){const v=num("q"+i);if(bad(v)){err.push(`Quiz ${i+1}: enter a number, 0 or more.`);continue}if(v!==null)sc.push(v)}
  const best=[...sc].sort((a,b)=>b-a).slice(0,QK);
  const pool=[...best,...Array(QN-sc.length).fill(QMAX)].sort((a,b)=>b-a).slice(0,QK);
  earned.q=best.reduce((a,b)=>a+b,0);rem.q=Math.max(0,pool.reduce((a,b)=>a+b,0)-earned.q);
  for(const[k,n,m]of PART){const e=num(k+"e"),d=num(k+"d");
    if(bad(e)||bad(d)){err.push(`${n}: enter numbers, 0 or more.`);continue}
    if(e===null&&d===null){earned[k]=0;rem[k]=m}
    else if(e===null)err.push(`${n}: enter the points earned.`);
    else if(d===null){earned[k]=e;rem[k]=0}
    else if(d>m)err.push(`${n}: graded so far can’t exceed ${m}.`);
    else{earned[k]=e;rem[k]=Math.max(0,m-d)}}
  let pg=0,pn=0;
  for(let i=0;i<PROJ;i++){const v=num("p"+i);if(bad(v)){err.push(`Project ${i+1}: enter a number, 0 or more.`);continue}if(v===null)pn++;else pg+=v}
  earned.pr=pg;rem.pr=pn*PMAX;
  const ct=num("ct");
  const aq=aqn;
  
  if(bad(ct))err.push("Contest points: enter a number, 0 or more.");
  return err.length?{err}:{earned,rem,aq,ct:ct??0,gains};
}

function render(){
  const pct=Number($("pct").value)/100;$("pctv").textContent=Math.round(pct*100)+"%";
  EXAMS.forEach(([k,,m])=>{const v=num(k),a=v!==null&&v>=m+AQ,el=$("am_"+k);el.textContent=a?"A+":"";el.className="apm"+(a?" on":"");$("nt_"+k).textContent=""});
  const r=calc();
  if(r.err){$("hero").innerHTML=r.err.map(e=>`<p class="err">${e}</p>`).join("");$("needList").innerHTML="";$("note").textContent="";return}
  const{earned,rem,aq,ct,gains}=r;
  EXAMS.forEach(([k,,m])=>{const g=gains[k];if(g>0.05){const el=$("am_"+k);el.textContent="+"+fmt(g);el.className="apm on soft";$("nt_"+k).textContent="→ "+fmt(earned[k])}});
  const cur=Object.values(earned).reduce((a,b)=>a+b,0);
  const ap=cur+aq*AQ+ct;
  const finalLeft=rem.fin;
  const otherLeft=Object.entries(rem).filter(([k])=>k!=="fin").reduce((a,[,v])=>a+v,0);
  const ecLeft=rem.pr/PMAX;
  const mids=EXAMS.slice(0,3).filter(([k])=>rem[k]===0);
  const useRepl=repl&&finalLeft>0;
  const midBest=useRepl?mids.reduce((s,[k,,m])=>s+Math.max(0,0.9*m-earned[k]),0):0;
  const gainAt=x=>x+(useRepl?mids.reduce((s,[k,,m])=>s+Math.max(0,0.9*Math.min(x/finalLeft,1)*m-earned[k]),0):0);
  const solveFinal=t=>{if(t<=0)return 0;let lo=0,hi=400;for(let i=0;i<50;i++){const mid=(lo+hi)/2;if(gainAt(mid)>=t)hi=mid;else lo=mid}return hi};
  const maxAp=ap+finalLeft+otherLeft+ecLeft+midBest;
  const exp=otherLeft*pct;
  const grade=ap>=APLUS?"A+":letter(cur);
  const nxt=[...GRADES].reverse().find(([g,c])=>c>(g==="A+"?ap:cur));
  const nxtNeed=nxt?nxt[1]-(nxt[0]==="A+"?ap:cur):0;
  const best=maxAp>=APLUS?"A+":letter(maxAp-aq*AQ-ct);
  const p=v=>Math.min(100,Math.max(0,v/APLUS*100));
  const lost=maxAp<APLUS;
  const ticks=[["A+",APLUS],["A",285],["B",230],["C",180],["D",165]].map(([g,c])=>{const have=g==="A+"?ap:cur,need=c-have;const tip=`${g} needs ${c} ${g==="A+"?"A+ ":""}points`+(need>0?` · ${fmt(need)} more`:` · secured`);return `<div class="tick${p(c)>75?" r":""}" style="left:${p(c)}%"><span tabindex="0" data-tip="${tip}" aria-label="${tip}">${g}</span></div>`}).join("");
  $("hero").innerHTML=`<div class="hero"><p class="letter" aria-label="Current grade ${grade}">${grade}</p>
    <div class="facts"><b>${fmt(cur)}</b> points<br>${nxt?`${fmt(nxtNeed)} more for ${nxt[0]}`:"Top grade reached"}${finalLeft+otherLeft>0?`<br>Best case: ${best}`:""}</div></div>
    <div class="bar${lost?" cap":""}" role="img" aria-label="${fmt(ap)} points, best case ${fmt(maxAp)}, of ${APLUS} for A+"><div class="poss" style="width:${p(maxAp)}%"></div><div class="got" style="width:${p(ap)}%"></div>${lost?`<div class="ceil" style="left:${Math.min(92,Math.max(8,p(maxAp)))}%"><span>max ${fmt(maxAp)}</span></div>`:""}${ticks}</div>
    <div class="legend"><span><i style="background:var(--matcha)"></i>Earned</span><span><i style="background:var(--soft);border:1px solid var(--matcha)"></i>Still possible</span>${lost?`<span><i class="lostdot"></i>Out of reach</span>`:""}${aq||ct?`<span class="apx"><span class="apsum">(${fmt(cur)} + ${fmt(aq*AQ+ct)})</span><b>${fmt(ap)}</b> A+</span>`:""}</div>`;
  $("miniL").textContent=grade;$("miniR").textContent=fmt(cur)+" pts";
  $("needList").innerHTML=GRADES.filter(([g])=>grp==="All"||g[0]===grp).map(([g,c])=>{
    const have=g==="A+"?ap:cur,need=c-have,w=Math.min(100,Math.max(0,have/c*100));
    if(need<=0)return `<div class="need done"><div class="g">${g}</div><div><div class="meter"><i style="width:100%"></i></div><p class="ok">Secured</p></div></div>`;
    let t;
    if(finalLeft>0){const f=solveFinal(need-exp);
      t=f<=0?`<b>${fmt(need)}</b> more &middot; <span class="ok">any final score works</span>`:`<b>${fmt(need)}</b> more &middot; final <b class="${f>finalLeft?"bad":""}">${fmt(f)}+</b>`}
    else{const avail=otherLeft+ecLeft;t=`<b>${fmt(need)}</b> more &middot; ${need>avail?`<span class="bad">out of reach</span>`:`${Math.round(need/avail*100)}% of what’s left`}`}
    return `<div class="need"><div class="g">${g}</div><div><div class="meter"><i style="width:${w}%"></i></div><p>${t}</p></div></div>`}).join("");
  $("note").textContent=finalLeft>0?`The final is out of ${fmt(finalLeft)}. A red final score means that grade needs more than a full mark, so you’d need extra credit or A+ points.`:"The final is in, so this shows how much of your remaining work you’d need to earn.";
}
document.addEventListener("input",()=>{save();render()});
document.addEventListener("change",()=>{save();render()});
$("reset").onclick=()=>{ids().forEach(i=>{if(i==="pct")return;if($(i).type==="checkbox")$(i).checked=false;else $(i).value=""});Object.keys(undo).forEach(k=>delete undo[k]);document.querySelectorAll(".mx").forEach(b=>b.setAttribute("aria-pressed","false"));save();render()};
load();sync();syncRepl();render();