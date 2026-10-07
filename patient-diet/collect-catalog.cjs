const fs=require('node:fs');const path=require('node:path');
const rows=[
['rc-mini','rc','dog','dry',['maintenance'],'미니 어덜트','retail-products/mini-adult-3001',10,96,10],
['rc-mini-wet','rc','dog','wet',['maintenance'],'미니 어덜트 파우치','retail-products/mini-adult-1096',10,96,10,85],
['rc-medium','rc','dog','dry',['maintenance'],'미디엄 어덜트','retail-products/medium-adult-3004',12,84,25],
['rc-indoor','rc','cat','dry',['maintenance'],'인도어','retail-products/indoor-27-2529',12,84],
['rc-indoor7','rc','cat','dry',['maintenance'],'인도어 7+','retail-products/indoor-7%2B-2548',84,360],
['rc-satiety-cat','rc','cat','dry',['weight'],'캣 세타이어티 웨이트 매니지먼트','vet-products/satiety-weight-management-3943',12,360],
['rc-satiety-cat-wet','rc','cat','wet',['weight'],'캣 세타이어티 웨이트 매니지먼트 파우치','vet-products/satiety-weight-management-1070',12,360,null,85],
['rc-satiety','rc','dog','dry',['weight'],'독 세타이어티 웨이트 매니지먼트 스몰독','vet-products/satiety-renovation-small-dog',12,360,10],
['rc-satiety-wet','rc','dog','wet',['weight'],'독 세타이어티 웨이트 매니지먼트 캔','vet-products/satiety-weight-management-4250',12,360,null,410],
['rc-renal','rc','dog','dry',['renal'],'독 레날','vet-products/renal-3916',12,360],
['rc-renal-wet','rc','dog','wet',['renal'],'독 레날 캔','vet-products/renal-4020',12,360,null,410],
['rc-earlyrenal','rc','cat','dry',['renal'],'캣 얼리 레날','vet-products/early-renal-1242',12,360],
['rc-renal-cat','rc','cat','dry',['renal'],'캣 레날 스페셜','vet-products/renal-special-3949',12,360],
['rc-renal-cat-wet','rc','cat','wet',['renal'],'캣 레날 파우치','vet-products/renal-1246',12,360,null,85],
['rc-urinary-dog','rc','dog','dry',['urinary'],'독 유리너리 S/O','vet-products/urinary-so-3913',12,360],
['rc-urinary-cat','rc','cat','dry',['urinary'],'캣 유리너리 S/O','vet-products/urinary-so-3901',12,360],
['rc-urinary-cat-wet','rc','cat','wet',['urinary'],'캣 유리너리 S/O 머셀 인 그레이비 파우치','vet-products/urinary-so-1254',12,360,null,85],
['rc-urinary-weight','rc','cat','dry',['urinary','weight'],'캣 유리너리 S/O + 블래더 컴포트 + 세타이어티','vet-products/urinary-so-%2B-bladder-comfort-%2B-satiety-1263',12,360],
['rc-gi-lowfat','rc','dog','dry',['gi','lowfat'],'독 가스트로인테스티널 로우팻','vet-products/gastrointestinal-low-fat-3932',12,360],
['rc-hypo-dog','rc','dog','dry',['allergy'],'독 하이포알러제닉','vet-products/hypoallergenic-3910',12,360],
['rc-hypo-cat','rc','cat','dry',['allergy'],'캣 하이포알러제닉','vet-products/hypoallergenic-3902',12,360],
['h-adult-dog','hills','dog','dry',['maintenance'],'사이언스 다이어트 어덜트 스몰 바이트 치킨 & 보리','science-diet-adult-small-bites-dry',12,84],
['h-adult-cat','hills','cat','dry',['maintenance'],'사이언스 다이어트 어덜트 치킨 레시피','science-diet-adult-original-dry',12,84],
['h-senior-dog','hills','dog','dry',['maintenance'],'사이언스 다이어트 어덜트 7+ 스몰 바이트','science-diet-mature-adult-small-bites-dry',84,360],
['h-senior-cat','hills','cat','dry',['maintenance'],'사이언스 다이어트 어덜트 7+ 치킨','science-diet-mature-adult-senior-dry',84,360],
['h-met-dog','hills','dog','dry',['weight'],'메타볼릭 스몰 바이트 치킨','prescription-diet-metabolic-mini-chicken-weight-management-dry',12,360],
['h-met-cat','hills','cat','dry',['weight'],'메타볼릭 치킨','prescription-diet-metabolic-weight-management-dry',12,360],
['h-kd-dog','hills','dog','dry',['renal'],'k/d 반려견용','prescription-diet-kd-kidney-care-dry',12,360],
['h-kd-cat','hills','cat','dry',['renal'],'k/d 반려묘용 치킨','prescription-diet-kd-kidney-care-dry',12,360],
['h-kd-cat-wet','hills','cat','wet',['renal'],'k/d 치킨 & 야채 스튜','prescription-diet-kd-chicken-vegetable-stew-kidney-care-canned',12,360,null,82],
['h-cd-dog','hills','dog','dry',['urinary'],'c/d 멀티케어 반려견용 치킨','prescription-diet-cd-multicare-urinary-care-dry',12,360],
['h-cd-cat','hills','cat','dry',['urinary'],'c/d 멀티케어 반려묘용 치킨','prescription-diet-cd-multicare-chicken-urinary-care-dry',12,360],
['h-cd-met-cat','hills','cat','dry',['urinary','weight'],'c/d 멀티케어 + 메타볼릭','prescription-diet-cd-multicare-metabolic-urinary-care-dry',12,360],
['h-id-dog','hills','dog','dry',['gi'],'i/d 반려견용 치킨','prescription-diet-id-digestive-care-dry',12,360],
['h-id-cat','hills','cat','dry',['gi'],'i/d 반려묘용 치킨','prescription-diet-id-digestive-care-dry',12,360],
['h-id-lowfat','hills','dog','dry',['gi','lowfat'],'i/d 로우팻','prescription-diet-id-low-fat-digestive-care-dry',12,360],
['h-zd-dog','hills','dog','dry',['allergy'],'z/d 하이드롤라이즈드 치킨 반려견용','prescription-diet-zd-food-sensitivities-dry',12,360],
['h-zd-cat','hills','cat','dry',['allergy'],'z/d 반려묘용','prescription-diet-zd-food-sensitivities-dry',12,360]
];
const date='2026-10-07';
async function get(row){const[id,brand,species,type,purposes,name,slug,minAge,maxAge,maxWeight,packGrams]=row;const url=brand==='rc'?`https://www.royalcanin.com/kr/${species==='dog'?'dogs':'cats'}/products/${slug}`:`https://www.hillspet.co.kr/${species}-food/${slug}`;const r=await fetch(url);if(!r.ok)throw Error(`${id}: HTTP ${r.status}`);const html=await r.text();let energy=null,energyUnit='kg',notes='',contra=[];
if(brand==='rc'){const m=html.match(/<script id="__NEXT_DATA__" type="application\/json">([\s\S]*?)<\/script>/);if(!m)throw Error(id+': missing product data');const d=JSON.parse(m[1]).props.pageProps.productData.response.original_product;if(!d)throw Error(id+': missing original product');energy=d.reference_energy_value_per_weight?.amount||null;if(d.reference_energy_value_per_weight?.unit!=='kcal/kg')energy=null;const codes={growth:'성장기',growth_gestation_lactation:'성장기·임신·수유',chronic_kidney_disease:'만성 신장질환',concurrent_use_of_urinary_acidifiers:'소변 산성화 약물 병용',heart_disease_failure:'심장질환·심부전',pancreatitis:'췌장염',gestating_and_lactating_bitches_puppies:'임신·수유견 및 자견',gestating_and_nursing_queens_kittens:'임신·수유묘 및 자묘',kittens_and_gestating_per_nursing_queens:'자묘 및 임신·수유묘',condition_were_high_fibre_content_is_not_recommended:'고섬유 식이가 부적합한 상태'};contra=(d.not_recommended_for_recommendation||[]).map(x=>({code:x.code,label:codes[x.code]||x.code}));notes='공식 한국 페이지에 포함된 글로벌 기본 제품 데이터. 국내 포장과 배합·열량 일치 확인 필요. 제한사항의 원문 코드를 함께 확인하세요.';if(id==='rc-earlyrenal')notes+=' 초기 신장질환용 제품으로 CKD 단계와 영양 목표를 별도로 검토.';if(id==='rc-urinary-weight'){energy=null;notes+=' 열량 자료 충돌: 페이지 본문 312.6 kcal/100g, 제품 데이터 3039 kcal/kg. 실제 포장값을 입력해야 계산 가능.';}if(contra.length)notes+=' 비권장 상황(원문 코드 해석): '+contra.map(x=>x.label).join(', ')+'.';
}else{const plain=html.replace(/<script[\s\S]*?<\/script>/gi,' ').replace(/<[^>]+>/g,' ').replace(/\s+/g,' ');const start=plain.lastIndexOf('평균 영양소 및 칼로리 함량');const section=plain.slice(Math.max(0,start),Math.max(0,start)+1100);const m=section.match(/([\d,.]+)\s*kcal\s*\/\s*kg/i);if(m)energy=Number(m[1].replace(/,/g,''));notes='한국 공식 페이지 평균 영양소: 건물 기준(DM). ';const pairs=[...section.matchAll(/(단백질|지방|조섬유|인|나트륨)\s+([\d.]+)\s*%/g)].slice(0,5);notes+=pairs.map(x=>`${x[1]} ${x[2]}%`).join(', ')+'. 보증성분 최소·최대값과 구분하여 검토.';}
return{id,brand,species,type,purposes,name,url,minAge,maxAge,minWeight:id==='rc-medium'?11:null,maxWeight:maxWeight||null,packGrams:packGrams||null,energy,energyUnit,energySource:energy?'한국 공식 제품 페이지':'포장 열량 확인 필요',labelConfirmed:false,checkedAt:date,notes:notes.replace('公式','공식'),contra};}
Promise.all(rows.map(get)).then(products=>{fs.writeFileSync(path.join(__dirname,'dist','catalog.js'),'// 공식 제품 자료 확인일: '+date+'\n(function(root){const data='+JSON.stringify(products,null,2)+';if(typeof module!=="undefined")module.exports=data;else root.VetCatalog=data;})(typeof window!=="undefined"?window:globalThis);\n');console.log(JSON.stringify(products.map(p=>({id:p.id,name:p.name,energy:p.energy,unit:p.energyUnit,contra:p.contra})),null,2));}).catch(e=>{console.error(e);process.exitCode=1;});
