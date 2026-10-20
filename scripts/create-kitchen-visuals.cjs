// Original, explicitly illustrative SVG assets. No manufacturer/technical claims.
const fs = require('node:fs');
const path = require('node:path');
const source = fs.readFileSync(path.resolve(__dirname, '../src/data/content.ts'), 'utf8');
const seeds = [...source.matchAll(/model\('([^']+)', '([^']+)', '(straight|corner|u)', (true|false), \[([^\]]+)\]/g)];
const output = path.resolve(__dirname, '../public/images/kitchens');
fs.mkdirSync(output, { recursive: true });
const palettes = [
 ['#8b977f','#c8b28c'],['#dad2be','#b49977'],['#5e7566','#bc9e69'],['#b38b5d','#d4c5aa'],
 ['#454e46','#af8d65'],['#c6bba0','#9f7b54'],['#65715f','#c3aa89'],['#e0d9c7','#bda98d'],
 ['#a48052','#c5b495'],['#525c54','#a99a81'],['#687960','#c3a66b'],['#b5bba4','#b68e62'],
];
function door(x,y,w,h,fill,framed,deco) {
 return `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${fill}" stroke="#676f5f" stroke-opacity=".25"/>${framed ? `<rect x="${x+10}" y="${y+12}" width="${w-20}" height="${h-24}" fill="none" stroke="#7c7d68" stroke-opacity=".4"/>` : ''}${deco ? `<path d="M${x+12} ${y+h-12}V${y+42}Q${x+w/2} ${y-4} ${x+w-12} ${y+42}V${y+h-12}" fill="none" stroke="#c4ab70" stroke-width="3"/>` : ''}<path d="M${x+w-12} ${y+h*.42}v26" stroke="${deco?'#c4ab70':'#626c5b'}" stroke-width="3"/>`;
}
seeds.forEach((match,i)=>{
 const [,id,title,layout,islandFlag,groups] = match;
 const island=islandFlag==='true', framed=/classic/.test(groups), deco=/art-deco/.test(groups);
 const [paint,wood]=palettes[i];
 const start=layout==='straight'?345:315, count=layout==='u'?5:4, unit=layout==='u'?120:143;
 let lower='',upper='';
 for(let n=0;n<count;n++) lower+=door(start+n*unit,430,unit-2,205,n%3===1&&/wood/.test(groups)?'url(#wood)':paint,framed,false);
 for(let n=0;n<3;n++) upper+=door(start+n*146,157,144,170,n===2&&i%2?'url(#wood)':paint,framed,deco);
 const sideRight=layout!=='straight'?`<path d="M905 430L1170 520V733L905 635Z" fill="${paint}"/><path d="M900 415L1190 505V526L900 438Z" fill="#e4dfd0"/><path d="M1000 468V665M1090 500V698" stroke="#66705d" stroke-opacity=".4"/>`:'';
 const sideLeft=layout==='u'?`<path d="M315 430L155 545V725L315 635Z" fill="${wood}"/><path d="M315 415L140 531V552L315 438Z" fill="#e4dfd0"/><path d="M215 512V690" stroke="#796d56"/>`:'';
 const islandView=island?`<ellipse cx="720" cy="769" rx="260" ry="24" fill="#928773" opacity=".2"/><path d="M490 590L810 577L965 656L637 681Z" fill="#e5dfd0"/><path d="M637 681L965 656V777L637 808Z" fill="${wood}"/><path d="M490 590L637 681V808L490 713Z" fill="#9a8568"/><path d="M490 590L810 577L965 656" fill="none" stroke="#f2eee2" stroke-width="7"/><path d="M680 741L667 838M779 735L797 827" stroke="#535c4c" stroke-width="7"/><ellipse cx="731" cy="735" rx="61" ry="18" fill="#7a8068"/><path d="M800 618v-42h31v42" fill="#a99a7e"/>`:'';
 const classicCrown=framed?`<path d="M${start-8} 145h460v13H${start-8}Z" fill="#c3b99f"/><path d="M${start+180} 145q49-38 98 0" fill="#d8d0bc"/>`:'';
 const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="850" viewBox="0 0 1200 850"><title>Демонстрационная интерьерная композиция «${title}»</title><defs><linearGradient id="wall" x2="1" y2="1"><stop stop-color="#f2eee3"/><stop offset="1" stop-color="#d5d1c3"/></linearGradient><linearGradient id="floor" x2="0" y2="1"><stop stop-color="#c5b79c"/><stop offset="1" stop-color="#e5d9c1"/></linearGradient><pattern id="wood" width="12" height="100" patternUnits="userSpaceOnUse"><rect width="12" height="100" fill="${wood}"/><path d="M2 0v100M8 0v100" stroke="#796849" stroke-opacity=".22"/></pattern></defs><rect width="1200" height="850" fill="url(#wall)"/><path d="M0 640H1200V850H0Z" fill="url(#floor)"/><path d="M0 720H1200M0 810H1200M160 640L60 850M390 640L350 850M640 640L690 850M890 640L1030 850" stroke="#ac9f87" stroke-opacity=".3"/><rect x="35" y="85" width="230" height="420" fill="#fcf8eb"/><rect x="47" y="97" width="206" height="396" fill="#d9dfcc"/><path d="M47 397q100-83 206 0v96H47Z" fill="#b9c3aa"/><path d="M150 97v396M47 300h206" stroke="#fff9eb" stroke-width="8"/><rect x="300" y="130" width="640" height="508" fill="#d3cdbc"/>${classicCrown}${upper}<rect x="${start}" y="327" width="436" height="6" fill="#ecd6ad"/>${lower}<rect x="${start-12}" y="413" width="${count*unit+20}" height="18" fill="#e6e0d0"/>${sideLeft}${sideRight}<rect x="${start+466}" y="151" width="118" height="251" fill="url(#wood)"/><path d="M${start+475} 220h100M${start+475} 305h100" stroke="#7a6c53" stroke-width="6"/><rect x="${start+488}" y="272" width="33" height="30" fill="#9aa78b"/><rect x="${start+529}" y="278" width="29" height="23" fill="#c4b395"/><ellipse cx="${start+250}" cy="416" rx="40" ry="5" fill="#79816e"/><path d="M${start+249} 413v-44q0-26 22-26t22 26v13" stroke="#596451" stroke-width="5" fill="none"/><rect x="${start+40}" y="385" width="40" height="27" fill="#b5a281"/><path d="M${start+60} 388l-14-59m14 40 24-38" stroke="#738261" stroke-width="3"/><ellipse cx="${start+144}" cy="411" rx="34" ry="5" fill="#ac9c7d"/>${islandView}<path d="M${610+i*8} 0v121" stroke="#716f5d" stroke-width="2"/><path d="M${555+i*8} 145q55-83 110 0Z" fill="${deco?'#b8a06b':'#c6b596'}"/><ellipse cx="${610+i*8}" cy="145" rx="55" ry="8" fill="#eee2c9"/>${i%2?'<rect x="980" y="115" width="150" height="205" fill="#e6e0d0" stroke="#a5a990" stroke-width="5"/><path d="M1010 290V170q45-65 90 0v120Z" fill="#c3ccba"/>':'<path d="M1050 350v-160m0 90 50-65m-50 25-43-57" stroke="#7f8d6b" stroke-width="5"/><ellipse cx="1100" cy="213" rx="32" ry="11" fill="#91a17b" transform="rotate(-35 1100 213)"/><path d="M1018 349h64l-10 67h-44Z" fill="#b3a182"/>'}</svg>`;
 fs.writeFileSync(path.join(output,id+'.svg'),svg);
});
if(seeds.length!==12)throw Error('Expected twelve distinct demo models');
console.log('Created 12 original demo SVG compositions.');
