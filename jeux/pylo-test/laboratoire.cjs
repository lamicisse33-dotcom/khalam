
/* PYLO 1.5 — moteur pur partagé par le jeu, le worker et les tests. */
(function(root){
'use strict';
const DIRS=[[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]];
const REALMS=[{name:'Spiritualité',short:'Esprit',color:'#9673b0',symbol:'✧'},{name:'Amour',short:'Amour',color:'#b86876',symbol:'♡'},{name:'Santé',short:'Santé',color:'#76976b',symbol:'♧'},{name:'Argent',short:'Argent',color:'#c6a050',symbol:'◈'}];
const TYPES=[{name:'Roi',mark:'R',rule:'Un pas vers l’avant, droit ou en diagonale. Chez l’adversaire, le recul droit ou diagonal est permis dans le même royaume.'},{name:'Garde',mark:'↕',rule:'Un pas vers l’avant ou l’arrière, sur sa colonne.'},{name:'Sentinelle',mark:'↔',rule:'Un pas à gauche ou à droite, sur sa ligne.'},{name:'Sauteur',mark:'2',rule:'Exactement deux cases en diagonale. La case survolée peut être vide, amie ou ennemie.'}];
const owner=v=>v?Math.ceil(v/4):0,type=v=>(v-1)%4,token=(p,t)=>(p-1)*4+t+1,coord=i=>'ABCDEFGH'[i%8]+(8-(i>>3));
const square=(col,row)=>(8-row)*8+col.charCodeAt(0)-65;
const zone=i=>((i>>3)>=4?2:0)+(i%8>=4?1:0),inEnemy=(i,p)=>p===1?(i>>3)<4:(i>>3)>=4;
function palace(i){const r=i>>3,c=i%8;if((r===1||r===2)&&(c===1||c===2))return 0;if((r===1||r===2)&&(c===5||c===6))return 1;if((r===5||r===6)&&(c===1||c===2))return 2;if((r===5||r===6)&&(c===5||c===6))return 3;return -1;}
const enemyPalaces=p=>p===1?[0,1]:[2,3];
const sameEnemyRealm=(a,b,p)=>inEnemy(a,p)&&inEnemy(b,p)&&zone(a)===zone(b);
function kingStep(from,to,p){const dr=(to>>3)-(from>>3),dc=to%8-from%8;if(Math.max(Math.abs(dr),Math.abs(dc))!==1)return false;return dr===(p===1?-1:1)||(dr!==0&&sameEnemyRealm(from,to,p));}
function initial(first=1,rule,config={}){const b=Array(64).fill(0),royals=Array(64).fill(-1);for(let p=1;p<=2;p++){const r=p===1?6:1,f=p===1?-1:1;for(const c of [2,5]){b[r*8+c]=token(p,0);royals[r*8+c]=(p===1?2:0)+(c===5?1:0);}for(const c of [2,5])b[(r-f)*8+c]=token(p,1);for(const c of [1,6])b[(r+f)*8+c]=token(p,2);for(const c of [0,7])b[(r+f)*8+c]=token(p,3);}const s={b,royals,turn:first,ply:0};if(rule)s.rule=rule;if(rule==='conquetes'){for(let p=1;p<=2;p++){const row=p===1?5:2;for(const c of [1,6])b[row*8+c]=token(p,1);for(const c of [3,4])b[row*8+c]=token(p,3);}for(let p=1;p<=2;p++){const row=p===1?5:2;if(config.pieces===16)for(const c of [1,3,4,6])b[row*8+c]=0;if(config.pieces===28)for(const c of [0,7])b[row*8+c]=token(p,2);if(config.pieces===32)for(const c of [0,2,5,7])b[row*8+c]=token(p,c===0||c===7?2:1);}s.origins=b.map((v,i)=>v?zone(i):-1);s.prisoners=[];s.claims=[0,1,2,3];s.refuges=[false,false,false,false];s.rallies=[0,0,0,0];s.variant=config.variant||'offensive';s.config={...config};}return s;}
function rawMoves(s,p=s.turn){if(s.variant==='offensive')return offensiveMoves(s,p);const out=[],f=p===1?-1:1;for(let i=0;i<64;i++){const piece=s.b[i];if(owner(piece)!==p)continue;const t=type(piece),r=i>>3,c=i%8;for(const [dr,dc] of DIRS){let n=1;if(t===0){const rr=r+dr,cc=c+dc;if(rr<0||rr>7||cc<0||cc>7||!(s.rule==='conquetes'?dr!==0:kingStep(i,rr*8+cc,p)))continue;}if(t===1&&(dc||!dr))continue;if(t===2&&(dr||!dc))continue;if(t===3){if(!dr||!dc)continue;n=2;}
 if(t<3){const rr=r+2*dr,cc=c+2*dc,mr=r+dr,mc=c+dc;if(rr>=0&&rr<8&&cc>=0&&cc<8&&mr>=0&&mr<8&&mc>=0&&mc<8){const mid=mr*8+mc,to=rr*8+cc;if(owner(s.b[mid])===3-p&&!s.b[to]&&(t!==0||s.rule==='conquetes'||dr===f||sameEnemyRealm(i,to,p)))out.push({from:i,to,capture:mid,taken:s.b[mid],piece});}}
 const rr=r+n*dr,cc=c+n*dc;if(rr<0||rr>7||cc<0||cc>7)continue;const to=rr*8+cc;if(s.b[to])continue;const mid=(r+dr)*8+c+dc,taken=t===3&&owner(s.b[mid])===3-p?s.b[mid]:0;out.push({from:i,to,capture:taken?mid:null,taken,piece});
 }}return out;}
function offensiveMoves(s,p){const out=[];for(let i=0;i<64;i++){const v=s.b[i];if(owner(v)!==p)continue;const t=type(v),r=i>>3,c=i%8;for(const [dr,dc] of DIRS){if(t===1&&dc&&!(s.config?.guardCross&&dr===0)||t===2&&dr&&!(s.config?.sentinelCross&&dc===0)||t===3&&(!dr||!dc))continue;const max=t===0?1:t===3?(s.config?.diagonal||3):(s.config?.straight||3);for(let k=1;k<=max;k++){const rr=r+k*dr,cc=c+k*dc;if(rr<0||rr>7||cc<0||cc>7)break;const j=rr*8+cc,w=s.b[j];if(!w){out.push({from:i,to:j,capture:null,taken:0,piece:v});continue;}if(owner(w)===3-p){const lr=rr+dr,lc=cc+dc;if(lr>=0&&lr<8&&lc>=0&&lc<8&&!s.b[lr*8+lc])out.push({from:i,to:lr*8+lc,capture:j,taken:w,piece:v});}break;}}}return out;}
function apply(s,m,identity=true){if(s.rule==='conquetes')return conquestApply(s,m);const b=s.b.slice();b[m.to]=b[m.from];b[m.from]=0;if(m.capture!==null)b[m.capture]=0;let royals=s.royals;if(identity&&royals){royals=royals.slice();royals[m.to]=royals[m.from];royals[m.from]=-1;if(m.capture!==null)royals[m.capture]=-1;}const n={b,royals,turn:3-s.turn,ply:s.ply+1};if(s.rule)n.rule=s.rule;return n;}
/* ── HONNEUR (PYLO 1.5, par défaut ; l'autre règle s'appelle « classique ») ──
   1. On ne joue jamais un coup qui laisse un de ses rois capturable. Menacé
      sans aucun coup légal : PRIS AU PIÈGE, l'adversaire gagne ('piege').
      Aucun roi menacé et aucun coup légal : PAT, partie nulle.
   2. CONQUÊTE TENUE : pour gagner par conquête, ses deux rois doivent encore
      occuper les deux palais quand son tour revient ; l'adversaire a un
      coup pour réagir. S'il n'en a aucun, la conquête tient.
   Une conquête qui finit la partie n'est jamais interdite. Le « dernier
   souffle » de la 1.4 est retiré : il ne pouvait pas se produire en partie.
   Un état sans « rule » est classique (leçons, exemple commenté). */
function conquestApply(s,m){
 const b=s.b.slice(),royals=s.royals.slice(),origins=s.origins.slice(),prisoners=s.prisoners.map(x=>({...x})),claims=s.claims.slice(),refuges=s.refuges.slice(),rallies=(s.rallies||[0,0,0,0]).slice(),events=[];
 const z=origins[m.from],p=owner(b[m.from]),royal=type(b[m.from])===0;
 if(m.capture!==null){const v=b[m.capture],o=origins[m.capture];if(type(v)!==0)prisoners.push({v,z:o});else events.push({kind:'fallen',z:o});b[m.capture]=0;royals[m.capture]=-1;origins[m.capture]=-1;}
 b[m.to]=b[m.from];b[m.from]=0;royals[m.to]=royals[m.from];royals[m.from]=-1;origins[m.to]=z;origins[m.from]=-1;
 if(royal&&!m.taken&&s.config?.escort){
 const dist=(a,c)=>Math.max(Math.abs((a>>3)-(c>>3)),Math.abs(a%8-c%8)),dr=(m.to>>3)-(m.from>>3),dc=m.to%8-m.from%8;
 const old=Array.from({length:64},(_,i)=>i).filter(i=>owner(b[i])===p&&origins[i]===z&&type(b[i])!==0&&dist(i,m.from)<=2);
 const moved=new Set();let count=0;
 for(let k=0;k<s.config.escort;k++){
 const q={...s,b,royals,origins};let opts=rawMoves(q,p).filter(a=>!a.taken&&old.includes(a.from)&&!moved.has(a.from)&&dist(a.to,m.to)<=1&&(a.to>>3)-(a.from>>3)===dr&&a.to%8-a.from%8===dc);
 opts.sort((a,c)=>dist(a.to,m.to)-dist(c.to,m.to)||(p===1?c.from-a.from:a.from-c.from));if(!opts.length)break;const a=opts[0];b[a.to]=b[a.from];b[a.from]=0;origins[a.to]=origins[a.from];origins[a.from]=-1;moved.add(a.to);moved.add(a.from);count++;
 }if(count)events.push({kind:'escort',z,count});
 }
 const target=palace(m.to),previous=palace(m.from);
 if(royal&&target>=0&&target!==previous){
  const enemy=enemyPalaces(p).includes(target),reclaim=target===z&&claims[target]!==z,refuge=!enemy&&target!==z&&claims[target]===target&&claims[z]!==z&&!refuges[z]&&royals.includes(target);
  if((enemy&&claims[target]!==z)||reclaim||refuge){
   if(!refuge){claims[target]=z;refuges[target]=false;}else refuges[z]=true;
   const distance=i=>Math.max(Math.abs((i>>3)-(m.to>>3)),Math.abs(i%8-m.to%8));
   const free=Array.from({length:64},(_,i)=>i).filter(i=>!b[i]).sort((a,c)=>distance(a)-distance(c)||(zone(a)===target?0:1)-(zone(c)===target?0:1)||(p===1?c-a:a-c));
   let count=0;for(let k=0;k<prisoners.length;){const x=prisoners[k];if(x.z!==z||!free.length){k++;continue;}if(rallies[z]>=(s.config?.rally??(s.variant==='offensive'?1:2)))break;const i=free.shift();b[i]=x.v;origins[i]=z;prisoners.splice(k,1);count++;}
   if(count)rallies[z]++;events.push({kind:refuge?'alliance':reclaim?'reconquest':'conquest',z,target,count});
  }
 }
 return {b,royals,origins,prisoners,claims,refuges,rallies,events,turn:3-s.turn,ply:s.ply+1,rule:s.rule,variant:s.variant,config:s.config};
}
const honour=s=>s.rule==='honneur';
function kingCapturable(s,p){return rawMoves(s,3-p).some(m=>m.taken&&type(m.taken)===0&&owner(m.taken)===p);}
function legalMoves(s,p=s.turn){const raw=rawMoves(s,p);if(s.config?.forced){const caps=raw.filter(m=>m.taken);if(caps.length)return caps;}if(!honour(s))return raw;
 return raw.filter(m=>{const n=apply(s,m,false);if(!kingCapturable(n,p))return true;const end=outcome(n);return !!end&&end.winner===p&&end.reason==='conquest';});}
/* La fin propre à l'honneur quand le joueur au trait n'a aucun coup : conquête tenue, pris au piège ou pat. */
function stalemate(s){if(!honour(s)||legalMoves(s).length)return null;
 if(control(s,3-s.turn).every(Boolean))return {winner:3-s.turn,reason:'conquest'};
 return kingCapturable(s,s.turn)?{winner:3-s.turn,reason:'piege'}:{winner:0,reason:'pat'};}
function control(s,p){const target=enemyPalaces(p);return target.map(z=>s.b.some((v,i)=>owner(v)===p&&type(v)===0&&palace(i)===z));}
function outcome(s){if(s.rule==='conquetes'){for(let p=1;p<=2;p++)if(!s.b.some(v=>owner(v)===p&&type(v)===0))return {winner:3-p,reason:'royal'};return null;}for(let p=1;p<=2;p++){if(s.b.filter(v=>owner(v)===p&&type(v)===0).length<2)return {winner:3-p,reason:'royal'};if(control(s,p).every(Boolean)&&(!honour(s)||s.turn===p))return {winner:p,reason:'conquest'};}return null;}
const key=s=>s.b.join(',')+':'+s.turn+(s.rule==='conquetes'?':'+s.origins.join(',')+':'+s.claims.join(',')+':'+s.refuges.join(',')+':'+(s.rallies||[]).join(',')+':'+s.prisoners.map(x=>x.z+'-'+x.v).sort().join(','):'');
function attackedKings(s,p){const hit=new Set(rawMoves(s,3-p).filter(m=>m.taken&&type(m.taken)===0).map(m=>m.capture));return [...hit].filter(i=>owner(s.b[i])===p);}
function threats(s,p){return new Set(rawMoves(s,3-p).filter(m=>m.taken).map(m=>m.capture));}
const distanceMemo={};
function distances(p){if(distanceMemo[p])return distanceMemo[p];const rev=Array.from({length:64},()=>[]);for(let a=0;a<64;a++)for(const [dr,dc]of DIRS){const r=(a>>3)+dr,c=a%8+dc;if(r>=0&&r<8&&c>=0&&c<8&&kingStep(a,r*8+c,p))rev[r*8+c].push(a);}return distanceMemo[p]=enemyPalaces(p).map(z=>{const d=Array(64).fill(50),q=[];for(let i=0;i<64;i++)if(palace(i)===z){d[i]=0;q.push(i);}for(let n=0;n<q.length;n++)for(const a of rev[q[n]])if(d[a]>d[q[n]]+1){d[a]=d[q[n]]+1;q.push(a);}return d;});}
function solo(s,p,own,enemy){const kings=[];let score=0;for(let i=0;i<64;i++)if(owner(s.b[i])===p){if(type(s.b[i])===0)kings.push(i);else score+=26;}if(s.rule==='conquetes'){score+=kings.length*600;for(const i of kings){const z=s.origins[i];score+=s.claims.filter(x=>x===z).length*85;const foes=[];for(let j=0;j<64;j++)if(owner(s.b[j])===3-p&&type(s.b[j])===0)foes.push(j);if(foes.length)score-=8*Math.min(...foes.map(j=>Math.max(Math.abs((i>>3)-(j>>3)),Math.abs(i%8-j%8))));score+=s.prisoners.filter(x=>x.z===z).length*4;for(const m of enemy)if(m.capture===i)score-=350;}if(s.variant==='offensive'){const threatened=new Set(own.filter(m=>m.taken).map(m=>m.capture));score+=threatened.size*8;for(let i=0;i<64;i++)if(owner(s.b[i])===p&&type(s.b[i])!==0){const row=i>>3,col=i%8;score+=3*(3.5-Math.abs(col-3.5))+2*(p===1?7-row:row);}}return score+Math.min(own.length,50)*.6;}if(kings.length!==2)return -99999;const ds=distances(p);score-=16*Math.min(ds[0][kings[0]]+ds[1][kings[1]],ds[1][kings[0]]+ds[0][kings[1]]);for(const i of kings){if(enemyPalaces(p).includes(palace(i)))score+=210;for(const m of enemy)if(m.taken&&m.capture===i)score-=900;}score+=Math.min(own.length,50)*.6;for(const m of own)if(m.taken&&type(m.taken)!==0)score+=2;return score;}
function evaluate(s,p){const end=outcome(s);if(end)return end.winner===p?100000-s.ply:-100000+s.ply;const a=legalMoves(s,p),b=legalMoves(s,3-p);if(honour(s)&&!(s.turn===p?a:b).length){const st=stalemate(s);if(!st.winner)return 0;return st.winner===p?100000-s.ply:-100000+s.ply;}return solo(s,p,a,b)-solo(s,3-p,b,a);}
function analyse(s,opts={}){const depth=opts.depth||2,beam=opts.beam||8,rng=opts.rng||Math.random,deadline=Date.now()+(opts.budgetMs||1600),seen=opts.seen||[],seenKeys=Array.isArray(seen)?seen:[];let nodes=0,timedOut=false;
 function ranked(q,p){return legalMoves(q).map(m=>({move:m,next:apply(q,m,false)})).map(x=>({...x,value:evaluate(x.next,p)})).sort((a,b)=>q.turn===p?b.value-a.value:a.value-b.value).slice(0,beam);}
 function search(q,d,p,alpha,beta){nodes++;if((nodes&31)===0&&Date.now()>deadline){timedOut=true;return evaluate(q,p);}if(!d||outcome(q))return evaluate(q,p);const rows=ranked(q,p);if(!rows.length)return evaluate(q,p);let best=q.turn===p?-Infinity:Infinity;for(const x of rows){const val=search(x.next,d-1,p,alpha,beta);if(q.turn===p){best=Math.max(best,val);alpha=Math.max(alpha,best);}else{best=Math.min(best,val);beta=Math.min(beta,best);}if(beta<=alpha||timedOut)break;}return best;}
 const roots=ranked(s,s.turn);if(!roots.length)return null;let completed=roots.map(x=>({move:x.move,value:x.value})),reached=1;
 for(let d=1;d<=depth;d++){const result=[];for(const x of roots){const rep=seenKeys.filter(k=>k===key(x.next)).length;result.push({move:x.move,value:(d===1?x.value:search(x.next,d-1,s.turn,-Infinity,Infinity))-rep*85});if(timedOut)break;}if(!timedOut){completed=result.sort((a,b)=>b.value-a.value);reached=d;}else break;}
 const best=completed[0].value,ties=completed.filter(x=>Math.abs(x.value-best)<2),pick=ties[Math.floor(rng()*ties.length)];return {move:pick.move,value:pick.value,alternatives:completed.filter(x=>x!==pick).slice(0,2),depth:reached,nodes};}
const api={VERSION:'2.2-experimental',DIRS,REALMS,TYPES,owner,type,token,coord,square,zone,palace,enemyPalaces,inEnemy,sameEnemyRealm,kingStep,initial,legalMoves,rawMoves,moves:legalMoves,kingCapturable,stalemate,apply,control,outcome,key,attackedKings,threats,distances,evaluate,analyse};
if(typeof module!=='undefined')module.exports=api;else root.Pilo=api;
})(typeof self!=='undefined'?self:globalThis);


const E=module.exports;
const configs=[{id:'reference',pieces:24},{id:'forced24',pieces:24,forced:true},{id:'escort24',pieces:24,forced:true,escort:2},{id:'escort24mix',pieces:24,forced:true,escort:2,straight:2,diagonal:4},{id:'escort16',pieces:16,forced:true,escort:2},{id:'escort28',pieces:28,forced:true,escort:2},{id:'escort32',pieces:32,forced:true,escort:2}];
function run(seedBase=8173,n=4,depth=2){const rows=[];for(const c of configs)for(let j=0;j<n;j++){let seed=seedBase+Math.floor(j/2)*1021;const rng=()=>((seed=(Math.imul(seed,1664525)+1013904223)>>>0)/4294967296);let q=E.initial(j%2+1,'conquetes',c),seen=[E.key(q)],captures=0,quiet=0,maxQuiet=0,escorts=0,threats=0,flips=0,lead=0,end=null,moves=[],depthTotal=0;for(let i=0;i<100;i++){const a=E.analyse(q,{depth,beam:5,budgetMs:50,seen,rng});if(!a){end={winner:0,reason:'blocked'};break;}const m=a.move,p=q.turn;q=E.apply(q,m);depthTotal+=a.depth;captures+=!!m.taken;escorts+=q.events.filter(e=>e.kind==='escort').reduce((v,e)=>v+e.count,0);const t=E.attackedKings(q,q.turn).length;threats+=!!t;quiet=m.taken||t||q.events.some(e=>e.kind!=='escort')?0:quiet+1;maxQuiet=Math.max(quiet,maxQuiet);let bal=q.b.reduce((v,x)=>v+(E.owner(x)===1?1:E.owner(x)===2?-1:0)*(E.type(x)===0?5:1),0),l=Math.abs(bal)>=2?Math.sign(bal):0;if(l&&lead&&l!==lead)flips++;if(l)lead=l;moves.push({camp:p,from:E.coord(m.from),to:E.coord(m.to),taken:m.taken,events:q.events,threats:t,depth:a.depth});seen.push(E.key(q));end=E.outcome(q);if(!end&&seen.filter(k=>k===E.key(q)).length>=3)end={winner:0,reason:'repetition'};if(end)break;}rows.push({id:c.id,first:j%2+1,result:end||{winner:0,reason:'limit'},turns:q.ply,captures,threats,maxQuiet,escorts,flips,depth:depthTotal/Math.max(1,q.ply),moves});}const ranking=configs.map(c=>{const a=rows.filter(x=>x.id===c.id),avg=k=>a.reduce((v,x)=>v+x[k],0)/a.length,w=a.filter(x=>x.result.winner).length,first=a.filter(x=>x.result.winner===x.first).length,iv=a.filter(x=>x.result.winner===1).length;return {config:c,games:a.length,wins:w,firstWins:first,ivoryWins:iv,ebonyWins:w-iv,turns:avg('turns'),captures:avg('captures'),threats:avg('threats'),quiet:avg('maxQuiet'),escorts:avg('escorts'),flips:avg('flips'),depth:avg('depth'),score:100*w/n-40*Math.abs(2*first-w)/n-20*Math.abs(2*iv-w)/n+Math.min(20,avg('captures'))+Math.min(15,avg('flips')*5)-avg('maxQuiet')*.7-Math.max(0,avg('turns')-65)*.3-Math.max(0,20-avg('turns'))};}).sort((a,b)=>b.score-a.score);return {version:E.VERSION,seedBase,requestedDepth:depth,ranking,rows};}
module.exports.run=run;
if(typeof require!=='undefined'&&require.main===module){const fs=require('node:fs');const report=run(Number(process.argv[2])||8173,Number(process.argv[3])||4,Number(process.argv[4])||2);fs.writeFileSync(process.argv[5]||'pylo-report.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report.ranking,null,2));}
