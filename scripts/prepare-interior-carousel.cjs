// Originals remain untouched; only web copies are produced.
const fs = require('node:fs/promises');
const path = require('node:path');
const crypto = require('node:crypto');
const sharp = require('../admin/node_modules/sharp');
const files = ['a5cb188e-1d16-4793-bd65-a06361dcd3c1.png','3998de73-7549-4ced-a528-12ce949c95c1.png','7446d77e-40c5-4b68-8563-a608fd068ee1 (1).png','8b3a1bff-7e0e-4712-9062-3be53522ed20.png','bf5a3625-bfc7-4025-91e7-20610841efe3.png','11966bc6-74d3-4e8f-947e-698411129d6e.png','6b4c4e92-0cb4-419b-9831-2f35cf0f0d69.png','a387cf18-1bc3-4fc2-abe3-44e839fd2d49.png'];
(async()=>{
 const output=path.resolve(__dirname,'../public/images/interior-carousel');
 await fs.mkdir(output,{recursive:true});
 for(const [index,name]of files.entries()){
  const input=await fs.readFile(path.join('C:/Users/izoto/Desktop/света/ВАЛЕНЗА',name));
  const meta=await sharp(input).metadata(),id=String(index+1).padStart(2,'0'),sizes={};
  for(const [suffix,width]of [['mobile',768],['large',meta.width]]){
   const dest=path.join(output,`${id}-${suffix}.webp`);
   await sharp(input).resize({width,withoutEnlargement:true}).webp({quality:86,effort:6}).toFile(dest);
   sizes[suffix]=(await fs.stat(dest)).size;
  }
  console.log(JSON.stringify({id,source:name,width:meta.width,height:meta.height,sha256:crypto.createHash('sha256').update(input).digest('hex'),bytes:sizes}));
 }
})().catch(error=>{console.error(error);process.exitCode=1});
