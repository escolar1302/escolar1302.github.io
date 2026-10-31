
const USED_KEY='escolar_armador_historial_v092';
let ALL=[],seleccionActual=[],criteriosActuales=null,opsActuales=[],numsActuales=[],editando=false;
const $=id=>document.getElementById(id);
const campo=$('campo'),rango=$('rango'),complejidad=$('complejidad'),cantidad=$('cantidad'),warning=$('warning');
function controlValue(id,fallback=''){
  const el=$(id);
  return el ? el.value : fallback;
}
function controlChecked(id,fallback=false){
  const el=$(id);
  return el ? el.checked : fallback;
}

async function loadProblems(){
  if(window.__PROBLEMAS_EMBEBIDOS__){ALL=window.__PROBLEMAS_EMBEBIDOS__;return}
  const r=await fetch('problemas.json');
  if(!r.ok)throw new Error('No se pudo cargar problemas.json');
  const data=await r.json(); ALL=data.problemas||data;
}
function zoneNumber(p){
  const z=String(p.zona_fuente||''),m=z.match(/^Z([1-4])/i);
  if(m)return Number(m[1]);
  if(p.zona_fuente==='banco_60')return 1;
  return null;
}
function sourceLevel(p){
  if(p.nivel_armador)return p.nivel_armador;
  const z=zoneNumber(p);
  return z?(p.campo==='CA'?'CA':'CM')+z:null;
}
function problemZone(p){
  const level=sourceLevel(p),m=String(level||'').match(/([1-4])$/);
  return m?Number(m[1]):zoneNumber(p);
}
function structuralComplexity(p){
  const steps=Number(p.pasos||1);

  if(p.campo==='CA'){
    if(p.categoria==='composicion_de_relaciones'){
      return steps>=3?'alta':'media';
    }
    if(p.categoria==='transformacion'){
      if(p.incognita==='estado_final')return'baja';
      if(p.incognita==='transformacion')return'media';
      if(p.incognita==='estado_inicial')return'alta';
      return'media';
    }
    if(p.categoria==='composicion')return p.incognita==='todo'?'baja':'media';
    if(p.categoria==='comparacion')return p.incognita==='diferencia'?'baja':'alta';
    return'media';
  }

  if(p.campo==='CM'){
    if(p.categoria==='proporcionalidad'){
      if(steps>=2)return'media';
      return p.operacion_base==='multiplicacion'?'baja':'media';
    }
    if(p.categoria==='organizacion_rectangular'){
      if(steps>=2)return'media';
      return p.operacion_base==='multiplicacion'?'baja':'media';
    }
    if(p.categoria==='reparto_particion')return'media';
    if(p.categoria==='combinatoria')return'media';
    if(p.categoria==='resto_iteracion'){
      return['redondeo_hacia_arriba','analisis_resto'].includes(p.interpretacion_resto)?'alta':'media';
    }
  }
  return'media';
}
function setRangeOptions(){
  let opts=[];
  if(campo.value==='CA')opts=[['','Elegí un rango…'],['CA1','Hasta 100'],['CA2','Hasta 1.000'],['CA3','Miles y diez miles'],['CA4','Hasta 100.000'],['todos','Todos los rangos']];
  else if(campo.value==='CM')opts=[['','Elegí un nivel…'],['CM1','Nivel 1 · 2.º factor/divisor de 1 cifra'],['CM2','Nivel 2 · hasta 2 cifras'],['CM3','Nivel 3 · hasta 3 cifras'],['CM4','Nivel 4 · situaciones más amplias/resto'],['todos','Todos los niveles']];
  else opts=[['','Elegí un rango…'],['Z1','Rango 1 · CA hasta 100 / CM nivel 1'],['Z2','Rango 2 · CA hasta 1.000 / CM nivel 2'],['Z3','Rango 3 · CA miles-diez miles / CM nivel 3'],['Z4','Rango 4 · CA hasta 100.000 / CM nivel 4'],['todos','Todos los rangos']];
  rango.innerHTML=opts.map(o=>`<option value="${o[0]}">${o[1]}</option>`).join('');
  renderAdvanced();
}
function renderAdvanced(){
  let h='';
  if(['CA','MIX'].includes(campo.value))h+=`
    <div style="margin-top:14px"><b>Campo aditivo: tipos de situación</b><div class="checks">
    <label><input type="checkbox" class="adv-cat" value="transformacion"> Transformación</label>
    <label><input type="checkbox" class="adv-cat" value="composicion"> Composición</label>
    <label><input type="checkbox" class="adv-cat" value="comparacion"> Comparación</label>
    <label><input type="checkbox" class="adv-cat" value="composicion_de_relaciones"> Más de una relación/paso</label>
    </div></div>
    <div style="margin-top:12px"><b>Dónde está lo desconocido</b><div class="checks">
    <label><input type="checkbox" class="adv-inc" value="estado_inicial"> Estado inicial</label>
    <label><input type="checkbox" class="adv-inc" value="transformacion"> Cambio</label>
    <label><input type="checkbox" class="adv-inc" value="estado_final"> Resultado</label>
    <label><input type="checkbox" class="adv-inc" value="todo"> Total</label>
    <label><input type="checkbox" class="adv-inc" value="parte"> Parte</label>
    <label><input type="checkbox" class="adv-inc" value="diferencia"> Diferencia</label>
    <label><input type="checkbox" class="adv-inc" value="cantidad_comparada"> Cantidad comparada</label>
    <label><input type="checkbox" class="adv-inc" value="cantidad_referente"> Cantidad referente</label>
    </div></div>`;
  if(['CM','MIX'].includes(campo.value))h+=`
    <div style="margin-top:14px"><b>Campo multiplicativo: tipos de situación</b><div class="checks">
    <label><input type="checkbox" class="adv-cat" value="proporcionalidad"> Proporcionalidad</label>
    <label><input type="checkbox" class="adv-cat" value="organizacion_rectangular"> Organización rectangular</label>
    <label><input type="checkbox" class="adv-cat" value="reparto_particion"> Reparto/partición</label>
    <label><input type="checkbox" class="adv-cat" value="resto_iteracion"> Resto/iteración</label>
    <label><input type="checkbox" class="adv-cat" value="combinatoria"> Combinatoria</label>
    </div></div>`;
  h+=`<div style="margin-top:12px"><b>Cantidad de pasos</b><div class="checks">
    <label><input type="checkbox" class="adv-pasos" value="1"> Un paso</label>
    <label><input type="checkbox" class="adv-pasos" value="2"> Dos o más pasos</label>
    </div></div>`;
  $('advancedContent').innerHTML=h;
}
function getChecks(cls){return[...document.querySelectorAll('.'+cls+':checked')].map(x=>x.value)}
function labelCategory(v){return({transformacion:'transformación',composicion:'composición',comparacion:'comparación',composicion_de_relaciones:'más de una relación',proporcionalidad:'proporcionalidad',organizacion_rectangular:'organización rectangular',reparto_particion:'reparto/partición',resto_iteracion:'resto/iteración',combinatoria:'combinatoria'})[v]||v}
function labelIncognita(v){return({estado_inicial:'estado inicial',transformacion:'cambio',estado_final:'resultado',todo:'total',parte:'parte',diferencia:'diferencia',cantidad_comparada:'cantidad comparada',cantidad_referente:'cantidad referente'})[v]||v}
function advancedDescription(){
  const cats=getChecks('adv-cat'),incs=getChecks('adv-inc'),pasos=getChecks('adv-pasos'),bits=[];
  if(cats.length)bits.push('Tipos: '+cats.map(labelCategory).join(', '));
  if(incs.length)bits.push('Incógnita: '+incs.map(labelIncognita).join(', '));
  if(pasos.length)bits.push('Pasos: '+pasos.map(x=>x==='1'?'1':'2 o más').join(', '));
  return bits.join(' · ');
}
function matchAdvanced(p){
  const cats=getChecks('adv-cat'),incs=getChecks('adv-inc'),pasos=getChecks('adv-pasos');
  if(cats.length&&!cats.includes(p.categoria))return false;
  if(incs.length&&p.campo==='CA'&&!incs.includes(p.incognita))return false;
  if(pasos.length){const b=Number(p.pasos||1)>=2?'2':'1';if(!pasos.includes(b))return false}
  return true;
}
function currentCriteria(){return{campo:campo.value,rango:rango.value,complejidad:complejidad.value,cantidad:Number(cantidad.value)}}
function rangeMatches(p,cr){
  if(cr.rango==='todos')return true;
  if(!cr.rango)return false;
  if(cr.campo==='MIX')return cr.rango==='Z'+problemZone(p);
  return sourceLevel(p)===cr.rango;
}
function filterPool(cr){
  return ALL.filter(p=>(cr.campo==='MIX'||p.campo===cr.campo)&&rangeMatches(p,cr)&&(cr.complejidad==='todas'||structuralComplexity(p)===cr.complejidad)&&matchAdvanced(p));
}
function shuffle(a){
  a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}
  return a;
}
function getHistory(){try{return JSON.parse(localStorage.getItem(USED_KEY)||'[]')}catch(e){return[]}}
function setHistory(ids){localStorage.setItem(USED_KEY,JSON.stringify([...new Set(ids)]))}
function remember(ids){setHistory([...getHistory(),...ids])}
function contextFamily(p){
  return String(p.familia_contexto||p.contexto||'sin_familia');
}
function scoreLess(a,b){
  for(let i=0;i<a.length;i++){
    if(a[i]!==b[i])return a[i]<b[i];
  }
  return false;
}
function chooseDiverse(pool,n,seed=[]){
  const candidates=shuffle(pool),chosen=[];
  const famCount=new Map(),fieldCount=new Map(),catCount=new Map();

  function bump(p){
    const fam=contextFamily(p),field=String(p.campo||''),cat=String(p.categoria||'');
    famCount.set(fam,(famCount.get(fam)||0)+1);
    fieldCount.set(field,(fieldCount.get(field)||0)+1);
    catCount.set(cat,(catCount.get(cat)||0)+1);
  }
  seed.forEach(bump);

  while(chosen.length<n&&candidates.length){
    let bestScore=null,bestIndexes=[];
    candidates.forEach((p,i)=>{
      const score=[
        famCount.get(contextFamily(p))||0,
        fieldCount.get(String(p.campo||''))||0,
        catCount.get(String(p.categoria||''))||0
      ];
      if(bestScore===null||scoreLess(score,bestScore)){
        bestScore=score;bestIndexes=[i];
      }else if(!scoreLess(bestScore,score)&&!scoreLess(score,bestScore)){
        bestIndexes.push(i);
      }
    });
    const pickIndex=bestIndexes[Math.floor(Math.random()*bestIndexes.length)];
    const [picked]=candidates.splice(pickIndex,1);
    chosen.push(picked);bump(picked);
  }
  return chosen;
}
function chooseWithoutRepeat(pool,n,exclude=[],seed=[]){
  const hist=new Set(getHistory()),ex=new Set(exclude);
  const freshPool=pool.filter(p=>!hist.has(p.id)&&!ex.has(p.id));
  const fresh=chooseDiverse(freshPool,Math.min(n,freshPool.length),seed);
  if(fresh.length>=n)return{items:fresh,recycled:false,recycledCount:0};

  const oldPool=pool.filter(p=>hist.has(p.id)&&!ex.has(p.id));
  const recycled=chooseDiverse(oldPool,n-fresh.length,seed.concat(fresh));
  return{
    items:fresh.concat(recycled),
    recycled:recycled.length>0,
    recycledCount:recycled.length
  };
}
function showWarning(t){warning.style.display=t?'block':'none';warning.textContent=t||''}
function styleValue(name='estilo'){return document.querySelector(`input[name="${name}"]:checked`)?.value||'box'}
function colorValue(name='colorFicha'){return document.querySelector(`input[name="${name}"]:checked`)?.value||'red'}
function escapeHtml(s){return String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]))}
function fmt(n){return Number(n).toLocaleString('es-AR')}
function randInt(a,b){return Math.floor(Math.random()*(b-a+1))+a}
function pow10Digits(d){return d<=1?[0,9]:[10**(d-1),10**d-1]}

function regroupAdd(a,b){while(a||b){if((a%10)+(b%10)>=10)return true;a=Math.floor(a/10);b=Math.floor(b/10)}return false}
function regroupSub(a,b){let borrow=0;while(a||b){let da=(a%10)-borrow,db=b%10;if(da<db)return true;borrow=0;a=Math.floor(a/10);b=Math.floor(b/10)}return false}
function opRegroupWanted(i,level){
  const mode=controlValue('opRegroup','auto');
  if(mode==='sin'||mode==='con')return mode;
  if(mode==='mixto')return i%2===0?'sin':'con';
  if(level==='baja')return Math.random()<.25?'con':'sin';
  if(level==='media')return Math.random()<.55?'con':'sin';
  return Math.random()<.75?'con':'sin';
}
function genAddSub(type,level,i){
  const d=level==='baja'?2:level==='media'?3:4,want=opRegroupWanted(i,level);
  for(let k=0;k<800;k++){
    let[min,max]=pow10Digits(d),a=randInt(min,max),b=randInt(Math.max(1,min),max);
    if(type==='sub'&&b>a)[a,b]=[b,a];
    const has=type==='sum'?regroupAdd(a,b):regroupSub(a,b);
    if((want==='con'&&has)||(want==='sin'&&!has))return{type,a,b};
  }
  let[min,max]=pow10Digits(d),a=randInt(min,max),b=randInt(min,max);
  if(type==='sub'&&b>a)[a,b]=[b,a];
  return{type,a,b};
}
function genMul(level){
  if(level==='baja')return{type:'mul',a:randInt(12,99),b:randInt(2,9)};
  if(level==='media')return Math.random()<.5?{type:'mul',a:randInt(100,999),b:randInt(2,9)}:{type:'mul',a:randInt(12,99),b:randInt(11,29)};
  return{type:'mul',a:randInt(100,999),b:randInt(11,99)};
}
function genDiv(level){
  let d,q;
  if(level==='baja'){d=randInt(2,9);q=randInt(12,99)}
  else if(level==='media'){d=randInt(2,9);q=randInt(100,399)}
  else{d=randInt(11,25);q=randInt(20,199)}
  return{type:'div',a:d*q,b:d};
}
function generateOperations(){
  if(!controlChecked('addOps'))return[];
  const types=getChecks('op-type');
  if(!types.length)throw new Error('Marcá al menos una operación.');
  const n=Number(controlValue('opCount','6')),level=controlValue('opLevel','media'),out=[];
  for(let i=0;i<n;i++){
    const type=types[i%types.length];
    out.push(type==='sum'||type==='sub'?genAddSub(type,level,i):type==='mul'?genMul(level):genDiv(level));
  }
  return shuffle(out);
}
function operationSymbol(type){return type==='sum'?'+':type==='sub'?'−':type==='mul'?'×':':'}
function operationHtml(op,presentation='vertical'){
  const sym=operationSymbol(op.type);
  if(presentation==='horizontal'){
    return `<div class="op-card"><div class="op-horizontal">${fmt(op.a)} ${sym} ${fmt(op.b)} = <span class="horizontal-answer"></span></div></div>`;
  }
  if(op.type==='div'){
    return `<div class="op-card"><div class="division-algorithm">
      <div class="division-dividend">${fmt(op.a)}</div>
      <div class="division-divisor">${fmt(op.b)}</div>
      <div class="division-quotient"></div>
    </div></div>`;
  }
  return `<div class="op-card"><div class="op-stack">
    <span class="top">${fmt(op.a)}</span>
    <span class="second"><span class="op-symbol">${sym}</span>${fmt(op.b)}</span>
    <span class="result-space"></span>
  </div></div>`;
}
function operationBlockHtml(ops){
  const presentation=controlValue('opPresentation','vertical');
  if(presentation==='horizontal'){
    return `<div class="ops-sheet-block print-block"><div class="ops-grid horizontal">${ops.map(op=>operationHtml(op,'horizontal')).join('')}</div></div>`;
  }
  const n=ops.length;
  const cols=n<=4?4:n<=6?3:n<=8?4:5;
  return `<div class="ops-sheet-block print-block"><div class="ops-grid cols-${cols}">${ops.map(op=>operationHtml(op,'vertical')).join('')}</div></div>`;
}

/* Numeración */
function numberRangeMax(){return Number(controlValue('numRange','1000'))}
function baseStep(max,level){
  const base=max===100?10:max===1000?100:max===10000?1000:10000;
  if(level==='baja')return base;
  if(level==='media')return Math.max(1,Math.floor(base/2));
  return max===100?5:max===1000?25:max===10000?250:2500;
}
function genRecta(max,level){
  const step=baseStep(max,level),count=8,span=step*(count-1),maxStart=Math.max(0,max-span);
  const start=Math.floor(randInt(0,Math.max(step,maxStart))/step)*step;
  const vals=Array.from({length:count},(_,i)=>start+i*step);
  let reveal;
  if(level==='baja')reveal=[0,1,7];
  else if(level==='media')reveal=[0,2,6,7];
  else reveal=[0,4,7];
  return{kind:'recta',vals,reveal,step,start};
}
function genTabla(max,level){
  // Tabla específica de +/− 10 y +/− 100 (o escalas equivalentes según rango).
  const small=max<=100?10:max<=1000?10:max<=10000?100:1000;
  const big=small*10;
  const cols=[-big,-small,0,small,big];
  const margin=big,rows=[];
  for(let r=0;r<3;r++){
    const base=randInt(margin,Math.max(margin,max-margin));
    const shown=[false,false,false,false,false];
    // Alternamos los datos dados para que no sea siempre "Número".
    if(r===0){shown[2]=true;shown[1]=true}
    else if(r===1){shown[2]=true;shown[3]=true}
    else{shown[0]=true;shown[2]=true}
    rows.push({base,shown});
  }
  return{kind:'tabla',cols,rows};
}
function nearestNodeForMax(max){
  if(max<=100)return 10;
  if(max<=1000)return 100;
  if(max<=10000)return 1000;
  return 10000;
}
function genAnterior(max,level){
  const node=nearestNodeForMax(max), vals=[];
  // Dos casos con cambio de nudo y cuatro casos comunes.
  const multiples=[];
  for(let k=1;k*node<max;k++)multiples.push(k*node);
  const chosen=shuffle(multiples).slice(0,2);
  chosen.forEach((m,i)=>{
    const n=i%2===0?m:Math.max(2,m-1);
    if(n>1&&n<max&&!vals.includes(n))vals.push(n);
  });
  while(vals.length<2){
    const m=node;
    const n=vals.length?Math.max(2,m-1):m;
    if(n<max&&!vals.includes(n))vals.push(n);else break;
  }
  while(vals.length<6){
    const n=randInt(2,Math.max(2,max-1));
    const r=n%node;
    if(r!==0&&r!==node-1&&!vals.includes(n))vals.push(n);
  }
  return{kind:'anterior',nums:shuffle(vals).slice(0,6)};
}
function genOrden(max,level){
  let nums=[];
  if(level==='baja'){
    for(let i=0;i<6;i++)nums.push(randInt(1,max));
  }else{
    const band=Math.max(20,Math.floor(max/9)),center=randInt(Math.min(band,max),Math.max(Math.min(band,max),max-band));
    for(let i=0;i<6;i++)nums.push(Math.min(max,Math.max(1,center+randInt(-Math.floor(band/4),Math.floor(band/4)))));
  }
  nums=[...new Set(nums)];
  while(nums.length<6){const n=randInt(1,max);if(!nums.includes(n))nums.push(n)}
  return{kind:'orden',nums:shuffle(nums).slice(0,6),desc:Math.random()<.5};
}
function canonicalDecomp(n){
  const s=String(n),parts=[];
  for(let i=0;i<s.length;i++){
    const d=Number(s[i]);
    if(d)parts.push(String(d*10**(s.length-i-1)));
  }
  return parts.map(Number).map(fmt).join(' + ');
}
function multiplicativeDecomp(n){
  const s=String(n),parts=[];
  for(let i=0;i<s.length;i++){
    const d=Number(s[i]);
    if(!d)continue;
    const place=10**(s.length-i-1);
    parts.push(`${d} × ${fmt(place)}`);
  }
  return parts.join(' + ');
}
function randomDecompNumber(max,level){
  let n=randInt(Math.max(11,Math.floor(max/10)),max);
  if(level!=='baja'&&String(n).length>2&&Math.random()<.5){
    const s=String(n).split('');
    const pos=randInt(1,s.length-2);s[pos]='0';
    const candidate=Number(s.join(''));if(candidate>=11)n=candidate;
  }
  return n;
}
function genDescomp(max,level){
  const nums=[];
  while(nums.length<4){const n=randomDecompNumber(max,level);if(!nums.includes(n))nums.push(n)}
  let example=randomDecompNumber(max,level);while(nums.includes(example))example=randomDecompNumber(max,level);
  const modes=level==='alta'?['add','mult','add','mult']:['add','add','add','add'];
  return{
    kind:'descomp',nums,example,level,modes,
    exampleText:canonicalDecomp(example),
    exampleMult:multiplicativeDecomp(example)
  };
}
function generateNumeration(){
  if(!controlChecked('addNum'))return[];
  const types=getChecks('num-type');
  if(!types.length)throw new Error('Marcá al menos un tipo de actividad de numeración.');
  const max=numberRangeMax(),level=controlValue('numLevel','media'),out=[];
  // Cada tipo seleccionado se genera una sola vez.
  for(const t of types){
    if(t==='recta')out.push(genRecta(max,level));
    else if(t==='tabla')out.push(genTabla(max,level));
    else if(t==='anterior')out.push(genAnterior(max,level));
    else if(t==='orden')out.push(genOrden(max,level));
    else if(t==='descomp')out.push(genDescomp(max,level));
  }
  return out;
}
function numEditControls(index){
  return `<div class="num-edit-controls">
    <button class="ghost" onclick="changeNumActivity(${index-1})">Cambiar</button>
    <button class="ghost" onclick="editNumActivity(${index-1})">Editar</button>
    <button class="danger-lite" onclick="removeNumActivity(${index-1})">Quitar</button>
  </div>`;
}
function numActivityHtml(a,index){
  const badge=`<div class="activity-badge">${index}</div>`;
  const controls=numEditControls(index);
  if(a.kind==='recta'){
    return `<div class="num-activity print-block">${badge}${controls}
      <div class="activity-instruction">Completá la recta numérica.</div>
      <div class="activity-help">Va de ${fmt(a.step)} en ${fmt(a.step)} y comienza en ${fmt(a.start)}.</div>
      <div class="recta-wrap"><div class="recta-scale">
      ${a.vals.map((v,i)=>{const shown=a.reveal.includes(i);return `<div class="recta-point ${i===0||i===a.vals.length-1?'major':''}">
          <div class="recta-box ${shown?'empty-ref':''}"></div><div class="recta-tick"></div><div class="recta-label">${shown?fmt(v):''}</div></div>`}).join('')}
      </div></div></div>`;
  }
  if(a.kind==='tabla'){
    return `<div class="num-activity print-block">${badge}${controls}
      <div class="activity-instruction">Completá la tabla.</div>
      <table class="num-table"><thead><tr>${a.cols.map(c=>`<th>${c===0?'Número':c>0?'+'+fmt(c):'−'+fmt(Math.abs(c))}</th>`).join('')}</tr></thead>
        <tbody>${a.rows.map(r=>`<tr>${a.cols.map((c,i)=>`<td>${r.shown[i]?fmt(r.base+c):'<span class="cell-blank"></span>'}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
  }
  if(a.kind==='anterior'){
    return `<div class="num-activity print-block">${badge}${controls}
      <div class="activity-instruction">Completá el anterior y el posterior.</div>
      <table class="num-table anterior-table"><thead><tr><th>Anterior</th><th>Número</th><th>Posterior</th></tr></thead>
        <tbody>${a.nums.map(n=>`<tr><td><span class="cell-blank"></span></td><td><strong>${fmt(n)}</strong></td><td><span class="cell-blank"></span></td></tr>`).join('')}</tbody></table></div>`;
  }
  if(a.kind==='orden'){
    const sign=a.desc?'&gt;':'&lt;';
    return `<div class="num-activity print-block">${badge}${controls}
      <div class="activity-instruction">Ordená estos números de ${a.desc?'mayor a menor':'menor a mayor'}.</div>
      <div class="number-chips">${a.nums.map(n=>`<div class="number-chip">${fmt(n)}</div>`).join('')}</div>
      <div class="order-answer">${a.nums.map((_,i)=>`${i?`<span class="order-sign">${sign}</span>`:''}<span class="order-slot"></span>`).join('')}</div></div>`;
  }
  const high=a.level==='alta';
  return `<div class="num-activity print-block">${badge}${controls}
    <div class="activity-instruction">${high?'Descomponé según se indica.':'Descomponé aditivamente.'}</div>
    <div class="decomp-example"><strong>Ejemplo:</strong> ${fmt(a.example)} = ${a.exampleText}${high?`<br><strong>También:</strong> ${fmt(a.example)} = ${a.exampleMult}`:''}</div>
    <div class="decomp-card decomp-multi">
      ${a.nums.map((n,i)=>{const mode=(a.modes&&a.modes[i])||'add';return `<div class="decomp-line ${mode==='mult'?'multiplicative':''}">${high?`<span class="decomp-mode-label">${mode==='mult'?'Multiplicativa':'Aditiva'}</span>`:''}<span class="decomp-number">${fmt(n)} =</span><span class="decomp-answer"></span></div>`}).join('')}
    </div></div>`;
}

function validateAndGenerateSupplements(){opsActuales=generateOperations();numsActuales=generateNumeration()}

function rangoLabel(){return rango.options[rango.selectedIndex]?.text||''}
function campoLabel(){return campo.value==='CA'?'Campo aditivo':campo.value==='CM'?'Campo multiplicativo':'Mixto'}
function complexityLabel(){return({baja:'Baja',media:'Media',alta:'Alta',todas:'Mezclada'})[complejidad.value]}
function styleLabel(){return({clean:'Texto',box:'Recuadros','box-space':'Recuadros + espacio para resolver'})[styleValue()]}
function colorLabel(){return({red:'rojo',blue:'azul',green:'verde',violet:'violeta',gray:'gris'})[colorValue()]}
function supplementalSummary(){
  const bits=[];
  if(controlChecked('addOps'))bits.push(`Operaciones: ${controlValue('opCount','6')}, complejidad ${controlValue('opLevel','media')}, ${controlValue('opPresentation','vertical')==='horizontal'?'horizontal':'vertical'}`);
  if(controlChecked('addNum'))bits.push(`Numeración: ${getChecks('num-type').length} tipos, hasta ${fmt(controlValue('numRange','1000'))}, complejidad ${controlValue('numLevel','media')}`);
  return bits;
}
function renderTeacherSummary(poolSize){
  const adv=advancedDescription(),sup=supplementalSummary();
  $('teacherSummary').innerHTML=`<strong>Propuesta elegida</strong><div class="summary-line">
    ${campoLabel()} · ${escapeHtml(rangoLabel())} · Complejidad ${complexityLabel()} · ${criteriosActuales.cantidad} problemas · ${styleLabel()} · Color ${colorLabel()}
    ${adv?'<br>'+escapeHtml(adv):''}${sup.length?'<br>'+escapeHtml(sup.join(' · ')):''}</div>`;
  const hist=new Set(getHistory()),fresh=filterPool(criteriosActuales).filter(p=>!hist.has(p.id)).length;
  $('status').textContent=`Banco compatible: ${poolSize}. Problemas todavía no usados con estos criterios: ${fresh}.`;
}
function generate(){
  if(!rango.value){showWarning('Elegí un rango o nivel numérico antes de generar.');return}
  criteriosActuales=currentCriteria();
  const pool=filterPool(criteriosActuales);
  if(!pool.length){showWarning('No hay problemas que cumplan exactamente estos criterios. Probá ampliar alguna opción.');return}
  try{
    validateAndGenerateSupplements()
  }catch(e){
    console.error('Error al generar complementos:',e);
    showWarning('No se pudieron generar los complementos. Recargá la página con Ctrl+F5. Detalle: '+e.message);
    return
  }
  const r=chooseWithoutRepeat(pool,Math.min(criteriosActuales.cantidad,pool.length),[]);
  seleccionActual=r.items;remember(seleccionActual.map(p=>p.id));
  let msg='';
  if(pool.length<criteriosActuales.cantidad)msg=`Hay ${pool.length} problemas que cumplen exactamente estos criterios; se muestran todos.`;
  else if(r.recycled)msg=`Se agotaron los problemas nuevos para estos criterios y fue necesario reutilizar ${r.recycledCount}.`;
  showWarning(msg);renderAll(pool.length);
}
function problemMarkup(p,n,editable=true){
  return `<div class="problem print-block" data-id="${escapeHtml(p.id)}" data-number="${n}">
    <span class="problem-text">${escapeHtml(p.enunciado)}</span><div class="answer-space"></div>
    ${editable?`<div class="edit-controls"><button class="ghost" onclick="changeOne('${escapeHtml(p.id)}')">Cambiar</button><button class="danger-lite" onclick="removeOne('${escapeHtml(p.id)}')">Quitar</button></div>`:''}
  </div>`;
}
function sectionHeading(text){return`<div class="section-heading print-block">${escapeHtml(text)}</div>`}
function buildItems(editable=true){
  const items=[];
  seleccionActual.forEach((p,i)=>items.push({html:problemMarkup(p,i+1,editable)}));
  if(numsActuales.length){
    items.push({html:sectionHeading('Numeración'),keepNext:true});
    numsActuales.forEach((a,i)=>items.push({html:numActivityHtml(a,i+1)}));
  }
  if(opsActuales.length){
    items.push({html:sectionHeading('Operaciones'),keepNext:true});
    items.push({html:operationBlockHtml(opsActuales)});
  }
  return items;
}
function sheetLicenseFooter(pageNo){
  return `<div class="sheet-footer">
    <div class="footer-brand"><b>Material generado en escolar.com.ar</b></div>
    <div class="footer-license"><img class="cc-logo" alt="CC BY-NC-SA 4.0" src="https://i.creativecommons.org/l/by-nc-sa/4.0/88x31.png"><span>CC BY-NC-SA 4.0</span></div>
    <div class="footer-page">Pág. ${pageNo}</div>
  </div>`;
}
function makePage(pageNo,isFirst){
  const shell=document.createElement('div');shell.className='page-shell';
  const label=document.createElement('div');label.className='page-label';label.textContent='Hoja '+pageNo;
  const page=document.createElement('div');page.className=`a4-page style-${styleValue()} color-${colorValue()}`;page.dataset.page=pageNo;
  if(isFirst)page.innerHTML=`<div class="student-heading"><div class="student-name">Nombre: <span class="write-line"></span></div><div class="student-date">Fecha: <span class="write-line" style="min-width:58%"></span></div></div><div class="sheet-title" style="display:flex;align-items:center;justify-content:space-between;gap:12px;min-height:62px"><span>${escapeHtml($('tituloHoja').value.trim()||'Resolvé los problemas.')}</span><img src="/images/carpi-mat.png" alt="" aria-hidden="true" style="display:block;height:62px;width:auto;max-width:82px;object-fit:contain;flex:0 0 auto" onerror="this.style.display='none'"></div><div class="page-content"></div>${sheetLicenseFooter(pageNo)}`;
  else page.innerHTML=`<div class="page-content"></div>${sheetLicenseFooter(pageNo)}`;
  shell.append(label,page);
  return{shell,page,content:page.querySelector('.page-content')};
}
function availableHeightFor(page,isFirst){
  const cs=getComputedStyle(page),inner=page.clientHeight-parseFloat(cs.paddingTop)-parseFloat(cs.paddingBottom);
  if(!isFirst)return inner;
  const header=page.querySelector('.student-heading'),title=page.querySelector('.sheet-title');
  return inner-(header?.offsetHeight||0)-(title?.offsetHeight||0)-34;
}
function measureHtml(html){
  const zone=$('measureInner');
  zone.className=`measure-inner style-${styleValue()} color-${colorValue()}`;
  zone.innerHTML=html;
  const el=zone.firstElementChild,cs=getComputedStyle(el);
  return el.getBoundingClientRect().height+parseFloat(cs.marginTop||0)+parseFloat(cs.marginBottom||0);
}
function pageFits(page){
  /* Tolerancia mínima para redondeos subpíxel del navegador. */
  return page.scrollHeight <= page.clientHeight + 2;
}
function newPageFor(stage,pageNo,isFirst=false){
  const obj=makePage(pageNo,isFirst);
  stage.appendChild(obj.shell);
  return obj;
}
function paginate(){
  const stage=$('pagesStage');
  stage.innerHTML='';
  if(!seleccionActual.length)return;

  const items=buildItems(true);
  let pageNo=1;
  let pageObj=newPageFor(stage,pageNo,true);

  for(let idx=0;idx<items.length;idx++){
    const it=items[idx];

    /* Para un título de bloque, probamos título + primera actividad juntos. */
    if(it.keepNext && items[idx+1]){
      const marker=document.createElement('div');
      marker.className='pagination-test-pair';
      marker.innerHTML=it.html+items[idx+1].html;
      pageObj.content.appendChild(marker);

      if(!pageFits(pageObj.page) && pageObj.content.children.length>1){
        marker.remove();
        pageNo++;
        pageObj=newPageFor(stage,pageNo,false);
        pageObj.content.insertAdjacentHTML('beforeend',it.html);
      }else{
        /* Solo conservamos el título; la actividad siguiente se procesará normalmente. */
        const titleNode=marker.firstElementChild;
        marker.replaceWith(titleNode);
      }
      continue;
    }

    const holder=document.createElement('div');
    holder.className='pagination-holder';
    holder.innerHTML=it.html;
    const node=holder.firstElementChild;
    pageObj.content.appendChild(node);

    if(!pageFits(pageObj.page) && pageObj.content.children.length>1){
      node.remove();
      pageNo++;
      pageObj=newPageFor(stage,pageNo,false);
      pageObj.content.appendChild(node);
    }
  }
}
function renderAll(poolSize){
  $('previewWrap').style.display='block';$('configPanel').style.display='none';
  document.body.classList.toggle('edit-mode',editando);
  renderTeacherSummary(poolSize);paginate();window.scrollTo({top:0,behavior:'smooth'});
}
window.changeOne=function(id){
  const pool=filterPool(criteriosActuales);
  const otherProblems=seleccionActual.filter(p=>p.id!==id);
  const otherIds=otherProblems.map(p=>p.id);
  const r=chooseWithoutRepeat(pool.filter(p=>p.id!==id),1,otherIds,otherProblems);
  if(!r.items.length){alert('No hay otro problema compatible disponible.');return}
  seleccionActual=seleccionActual.map(p=>p.id===id?r.items[0]:p);remember([r.items[0].id]);renderAll(pool.length);
};
window.removeOne=function(id){seleccionActual=seleccionActual.filter(p=>p.id!==id);renderAll(filterPool(criteriosActuales).length)}

function regenerateNumByKind(kind){
  const max=numberRangeMax(),level=controlValue('numLevel','media');
  if(kind==='recta')return genRecta(max,level);
  if(kind==='tabla')return genTabla(max,level);
  if(kind==='anterior')return genAnterior(max,level);
  if(kind==='orden')return genOrden(max,level);
  return genDescomp(max,level);
}
window.changeNumActivity=function(index){
  const a=numsActuales[index];if(!a)return;
  numsActuales[index]=regenerateNumByKind(a.kind);
  renderAll(filterPool(criteriosActuales).length);
};
window.removeNumActivity=function(index){
  if(index<0||index>=numsActuales.length)return;
  numsActuales.splice(index,1);
  renderAll(filterPool(criteriosActuales).length);
};
function parseNumberList(text,minCount){
  const nums=String(text||'').split(/[;,\s]+/).map(x=>Number(x.replace?.(/\./g,'')??x)).filter(Number.isFinite);
  return nums.length>=minCount?nums:null;
}
window.editNumActivity=function(index){
  const a=numsActuales[index];if(!a)return;
  if(a.kind==='recta'){
    const start=Number(prompt('Inicio de la recta:',a.start));if(!Number.isFinite(start))return;
    const step=Number(prompt('Salto de la recta:',a.step));if(!Number.isFinite(step)||step<=0)return;
    a.start=Math.max(0,start);a.step=step;a.vals=Array.from({length:8},(_,i)=>a.start+i*a.step);
  }else if(a.kind==='tabla'){
    const bases=a.rows.map(r=>r.base).join(', ');
    const nums=parseNumberList(prompt('Números centrales de las 3 filas, separados por comas:',bases),3);if(!nums)return;
    a.rows.forEach((r,i)=>r.base=nums[i]);
  }else if(a.kind==='anterior'){
    const nums=parseNumberList(prompt('Escribí 6 números, separados por comas:',a.nums.join(', ')),6);if(!nums)return;
    a.nums=nums.slice(0,6);
  }else if(a.kind==='orden'){
    const nums=parseNumberList(prompt('Escribí 6 números, separados por comas:',a.nums.join(', ')),6);if(!nums)return;
    a.nums=nums.slice(0,6);
  }else if(a.kind==='descomp'){
    const nums=parseNumberList(prompt('Escribí 4 números para descomponer, separados por comas:',a.nums.join(', ')),4);if(!nums)return;
    const ex=Number(prompt('Número para el ejemplo:',a.example));
    a.nums=nums.slice(0,4);
    if(Number.isFinite(ex)&&ex>0)a.example=ex;
    a.exampleText=canonicalDecomp(a.example);a.exampleMult=multiplicativeDecomp(a.example);
  }
  renderAll(filterPool(criteriosActuales).length);
};

function syncDesignPanel(){
  $('tituloHojaPreview').value=$('tituloHoja').value;
  const s=document.querySelector(`input[name="estiloPreview"][value="${styleValue()}"]`);if(s)s.checked=true;
  const c=document.querySelector(`input[name="colorPreview"][value="${colorValue()}"]`);if(c)c.checked=true;
}
function applyDesignFromPreview(){
  $('tituloHoja').value=$('tituloHojaPreview').value;
  const s=styleValue('estiloPreview'),c=colorValue('colorPreview');
  const os=document.querySelector(`input[name="estilo"][value="${s}"]`),oc=document.querySelector(`input[name="colorFicha"][value="${c}"]`);
  if(os)os.checked=true;if(oc)oc.checked=true;
  $('designPanel').style.display='none';renderAll(filterPool(criteriosActuales).length);
}
function numPlainText(a,index){
  if(a.kind==='recta'){
    const vals=a.vals.map((v,i)=>a.reveal.includes(i)?fmt(v):'________').join('   ');
    return `${index}. Completá la recta numérica.\nVa de ${fmt(a.step)} en ${fmt(a.step)} y comienza en ${fmt(a.start)}.\n${vals}`;
  }
  if(a.kind==='tabla'){
    const head=a.cols.map(c=>c===0?'Número':c>0?'+'+fmt(c):'-'+fmt(Math.abs(c))).join(' | ');
    const rows=a.rows.map(r=>a.cols.map((c,i)=>r.shown[i]?fmt(r.base+c):'______').join(' | ')).join('\n');
    return `${index}. Completá la tabla.\n${head}\n${rows}`;
  }
  if(a.kind==='anterior'){
    const rows=a.nums.map(n=>`______ | ${fmt(n)} | ______`).join('\n');
    return `${index}. Completá el anterior y el posterior.\nAnterior | Número | Posterior\n${rows}`;
  }
  if(a.kind==='orden'){
    const sign=a.desc?'>':'<';
    return `${index}. Ordená estos números de ${a.desc?'mayor a menor':'menor a mayor'}.\n${a.nums.map(fmt).join('   ')}\n${a.nums.map((_,i)=>(i?sign+' ':'')+'________').join(' ')}`;
  }
  const high=a.level==='alta';
  let s=`${index}. ${high?'Descomponé según se indica.':'Descomponé aditivamente.'}\n`;
  s+=`Ejemplo: ${fmt(a.example)} = ${a.exampleText}`;
  if(high)s+=`\nTambién: ${fmt(a.example)} = ${a.exampleMult}`;
  s+='\n';
  s+=a.nums.map((n,i)=>{
    const mode=(a.modes&&a.modes[i])||'add';
    const label=high?(mode==='mult'?'Multiplicativa: ':'Aditiva: '):'';
    return `${label}${fmt(n)} = ______________________________`;
  }).join('\n');
  return s;
}
function compactPlainText(){
  const title=$('tituloHoja').value.trim()||'Resolvé los problemas.';
  return `Nombre: ______________________________    Fecha: ______________\n${title}\n`+
    seleccionActual.map((p,i)=>`${i+1}. ${p.enunciado}`).join('\n');
}
function wordCell(content,opts=''){
  return `<td style="border:1px solid #9da8ae;padding:6px 8px;text-align:center;vertical-align:middle;${opts}">${content}</td>`;
}
function numWordHtml(a,index){
  const titleStyle='margin:8pt 0 4pt 0;line-height:1.15';
  if(a.kind==='recta'){
    const cells=a.vals.map((v,i)=>wordCell(a.reveal.includes(i)?`<b>${fmt(v)}</b>`:'&nbsp;','min-width:52px;height:28px')).join('');
    return `<p style="${titleStyle}"><b>${index}.</b> Completá la recta numérica.</p>
      <p style="margin:0 0 4pt 0;font-size:10pt">Va de ${fmt(a.step)} en ${fmt(a.step)} y comienza en ${fmt(a.start)}.</p>
      <table style="border-collapse:collapse;margin:0 0 10pt 0"><tr>${cells}</tr></table>`;
  }
  if(a.kind==='tabla'){
    const head=a.cols.map(c=>wordCell(`<b>${c===0?'Número':c>0?'+'+fmt(c):'−'+fmt(Math.abs(c))}</b>`,'background:#f2f5f7')).join('');
    const rows=a.rows.map(r=>`<tr>${a.cols.map((c,i)=>wordCell(r.shown[i]?fmt(r.base+c):'&nbsp;','min-width:70px;height:26px')).join('')}</tr>`).join('');
    return `<p style="${titleStyle}"><b>${index}.</b> Completá la tabla.</p>
      <table style="border-collapse:collapse;margin:0 0 10pt 0"><tr>${head}</tr>${rows}</table>`;
  }
  if(a.kind==='anterior'){
    const head=['Anterior','Número','Posterior'].map(h=>wordCell(`<b>${h}</b>`,'background:#f2f5f7;min-width:105px')).join('');
    const rows=a.nums.map(n=>`<tr>${wordCell('&nbsp;','height:25px')}${wordCell(`<b>${fmt(n)}</b>`)}${wordCell('&nbsp;')}</tr>`).join('');
    return `<p style="${titleStyle}"><b>${index}.</b> Completá el anterior y el posterior.</p>
      <table style="border-collapse:collapse;margin:0 0 10pt 0"><tr>${head}</tr>${rows}</table>`;
  }
  if(a.kind==='orden'){
    const sign=a.desc?'&gt;':'&lt;';
    const nums=a.nums.map(n=>wordCell(`<b>${fmt(n)}</b>`,'min-width:72px')).join('');
    const answer=a.nums.map((_,i)=>{
      const slot=`<span style="display:inline-block;min-width:62px;border-bottom:1px solid #666">&nbsp;</span>`;
      return i?`<span style="margin:0 5px"><b>${sign}</b></span>${slot}`:slot;
    }).join('');
    return `<p style="${titleStyle}"><b>${index}.</b> Ordená estos números de ${a.desc?'mayor a menor':'menor a mayor'}.</p>
      <table style="border-collapse:separate;border-spacing:5px;margin:0 0 6pt 0"><tr>${nums}</tr></table>
      <p style="margin:0 0 10pt 0;white-space:nowrap">${answer}</p>`;
  }
  const high=a.level==='alta';
  let ex=`<p style="margin:0 0 5pt 0"><b>Ejemplo:</b> ${fmt(a.example)} = ${escapeHtml(a.exampleText)}`;
  if(high)ex+=`<br><b>También:</b> ${fmt(a.example)} = ${escapeHtml(a.exampleMult)}`;
  ex+='</p>';
  const lines=a.nums.map((n,i)=>{
    const mode=(a.modes&&a.modes[i])||'add';
    const label=high?`<b>${mode==='mult'?'Multiplicativa':'Aditiva'}:</b> `:'';
    return `<p style="margin:0 0 5pt 0">${label}${fmt(n)} = <span style="display:inline-block;min-width:250px;border-bottom:1px solid #666">&nbsp;</span></p>`;
  }).join('');
  return `<p style="${titleStyle}"><b>${index}.</b> ${high?'Descomponé según se indica.':'Descomponé aditivamente.'}</p>${ex}${lines}`;
}
function operationsWordHtml(){
  if(!opsActuales.length)return'';
  const horizontal=controlValue('opPresentation','vertical')==='horizontal';
  if(horizontal){
    return '<p style="margin:10pt 0 5pt 0"><b>Operaciones</b></p>'+
      opsActuales.map(op=>`<p style="margin:0 0 5pt 0;line-height:1.15">${fmt(op.a)} ${operationSymbol(op.type)} ${fmt(op.b)} = <span style="display:inline-block;min-width:80px;border-bottom:1px solid #666">&nbsp;</span></p>`).join('');
  }
  const cells=opsActuales.map(op=>{
    if(op.type==='div'){
      return wordCell(`<div style="font-family:Arial,sans-serif;font-size:11pt;line-height:1.2">${fmt(op.a)}&nbsp;&nbsp;│&nbsp;${fmt(op.b)}<br>&nbsp;&nbsp;&nbsp;&nbsp;│________</div>`,'min-width:105px;height:54px');
    }
    return wordCell(`<div style="font-family:Courier New,monospace;font-size:11pt;line-height:1.1;text-align:right;display:inline-block">
      ${fmt(op.a)}<br>${operationSymbol(op.type)}&nbsp;${fmt(op.b)}<br><span style="border-top:1px solid #333;display:inline-block;min-width:65px">&nbsp;</span>
    </div>`,'min-width:105px;height:58px');
  });
  let rows='';
  for(let i=0;i<cells.length;i+=4)rows+=`<tr>${cells.slice(i,i+4).join('')}</tr>`;
  return `<p style="margin:10pt 0 5pt 0"><b>Operaciones</b></p>
    <table style="border-collapse:separate;border-spacing:6px;margin:0">${rows}</table>`;
}
function richHtmlForWord(){
  const title=escapeHtml($('tituloHoja').value.trim()||'Resolvé los problemas.');
  const probs=seleccionActual.map((p,i)=>`<p style="margin:0 0 4pt 0;line-height:1.15"><b>${i+1}.</b> ${escapeHtml(p.enunciado)}</p>`).join('');
  return `<div style="font-family:Arial,sans-serif;font-size:11pt"><p style="margin:0 0 8pt 0">Nombre: ______________________________ &nbsp;&nbsp;&nbsp; Fecha: ______________</p><p style="margin:0 0 7pt 0"><b>${title}</b></p>${probs}</div>`;
}

async function copyForWord(){
  const plain=compactPlainText(),rich=richHtmlForWord();
  try{
    if(window.ClipboardItem&&navigator.clipboard&&navigator.clipboard.write)
      await navigator.clipboard.write([new ClipboardItem({'text/plain':new Blob([plain],{type:'text/plain'}),'text/html':new Blob([rich],{type:'text/html'})})]);
    else if(navigator.clipboard&&navigator.clipboard.writeText)await navigator.clipboard.writeText(plain);
    else throw new Error();
    alert('Problemas copiados para pegar en el procesador de textos.');
  }catch(e){
    const ta=document.createElement('textarea');ta.value=plain;document.body.appendChild(ta);ta.select();document.execCommand('copy');ta.remove();alert('Problemas copiados.');
  }
}
function syncModulePanel(checkId,panelId,labelId){
  const on=$(checkId).checked;
  $(panelId).classList.toggle('on',on);
  $(labelId).classList.toggle('active',on);
}
function bindUI(){
  $('generar').onclick=generate;
  $('otra').onclick=generate;
  $('imprimir').onclick=()=>window.print();
  $('copiar').onclick=copyForWord;
  $('volver').onclick=()=>{$('designPanel').style.display='none';$('previewWrap').style.display='none';$('configPanel').style.display='block';showWarning('')};
  $('editar').onclick=()=>{editando=!editando;document.body.classList.toggle('edit-mode',editando);$('editar').textContent=editando?'Cerrar edición':'Editar ficha'};
  $('cambiarDiseno').onclick=()=>{syncDesignPanel();$('designPanel').style.display='block';$('designPanel').scrollIntoView({behavior:'smooth',block:'start'})};
  $('aplicarDiseno').onclick=applyDesignFromPreview;
  $('cerrarDiseno').onclick=()=>{$('designPanel').style.display='none'};
  $('resetHist').onclick=()=>{if(confirm('¿Reiniciar el historial de problemas usados? Podrán volver a aparecer desde cero.')){localStorage.removeItem(USED_KEY);if(criteriosActuales)renderTeacherSummary(filterPool(criteriosActuales).length)}};
  $('toggleAdvanced').onclick=()=>{$('advanced').style.display=$('advanced').style.display==='block'?'none':'block'};
  campo.onchange=setRangeOptions;
  if($('addOps')) $('addOps').onchange=()=>syncModulePanel('addOps','opsPanel','opsToggleLabel');
  if($('addNum')) $('addNum').onchange=()=>syncModulePanel('addNum','numPanel','numToggleLabel');
  document.querySelectorAll('input[name="estilo"]').forEach(x=>x.onchange=()=>{if(criteriosActuales)paginate()});
  document.querySelectorAll('input[name="colorFicha"]').forEach(x=>x.onchange=()=>{if(criteriosActuales)paginate()});
  $('tituloHoja').oninput=()=>{if(criteriosActuales)paginate()};
  window.addEventListener('resize',()=>{if(criteriosActuales&&$('previewWrap').style.display==='block')paginate()});
}
(async function init(){
  try{await loadProblems();setRangeOptions();bindUI()}
  catch(e){document.body.innerHTML=`<div style="padding:30px;font-family:Arial"><h2>No se pudo cargar la base de problemas</h2><p>${escapeHtml(e.message)}</p><p>Si abriste la versión para servidor directamente desde el disco, usá la versión autónoma de prueba.</p></div>`}
})();
