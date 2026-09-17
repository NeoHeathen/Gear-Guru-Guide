import { mkdir, rm, writeFile } from "node:fs/promises";
const base="https://gearguruguide.com";
const files=["index.html","robots.txt","sitemap.xml","assets/index-D5F4_PYa.css","assets/ggg-products.json","assets/ggg-my-list-2026.js","assets/index-GGG-ROBOTICS-RELEVANCE.js"];
await rm("dist",{recursive:true,force:true}); await mkdir("dist/assets",{recursive:true});
for(const f of files){const r=await fetch(base+"/"+f);if(!r.ok)throw new Error(f+" "+r.status);await writeFile("dist/"+f,Buffer.from(await r.arrayBuffer()));}
const p=JSON.parse(await (await import("node:fs/promises")).readFile("dist/assets/ggg-products.json","utf8"));
const unitree={584:"https://shop.unitree.com/products/unitree-go2",585:"https://shop.unitree.com/products/unitree-go2",586:"https://shop.unitree.com/products/unitree-go2",587:"https://shop.unitree.com/products/unitree-go2",588:"https://shop.unitree.com/products/unitree-b2",589:"https://shop.unitree.com/products/unitree-g1",590:"https://shop.unitree.com/products/unitree-h1",591:"https://shop.unitree.com/products/unitree-r1"};
for(const x of p){if(unitree[x.id]){x.officialUrl=unitree[x.id];x.hasAmazon=false;x.amazonLinkType="official";x.commerceRoute="Unitree Official Store";}if(x.id===6){x.officialUrl="https://www.garmin.com/en-US/p/1191310/pn/010-02887-00/";x.hasAmazon=false;x.amazonLinkType="official";x.commerceRoute="Garmin Official Product";}}
await writeFile("dist/assets/ggg-products.json",JSON.stringify(p,null,2));
console.log("Built production baseline:",p.length,"products");