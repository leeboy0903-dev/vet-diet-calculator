(function(root){
  'use strict';
  const E=typeof module!=='undefined'?require('./engine.js'):root.VetEngine;
  const C=typeof module!=='undefined'?require('./clinical.js'):root.VetClinical;
  const sources={
    ...C.sources,
    postopDog:['VCA · 개 수술 후 첫 식사','https://vcahospitals.com/carriage-hills/know-your-pet/post-operative-instructions-in-dogs'],
    postopCat:['VCA · 고양이 수술 후 첫 식사','https://vcahospitals.com/arbor/know-your-pet/post-operative-instructions-in-cats'],
    giSurgery:['ACVS · 위장관 이물 수술 후 조기 급여','https://www.acvs.org/small-animal/gastrointestinal-foreign-bodies/'],
    giTiming:['Merck · 폐색 수술 후 급여 시점','https://www.merckvetmanual.com/digestive-system/surgical-problems-of-the-gastrointestinal-tract-in-small-animals/gastrointestinal-obstruction-in-small-animals'],
    enteral:['AAHA 2024 · 입원 환자 초기 장관 영양','https://www.aaha.org/resources/2024-aaha-fluid-therapy-guidelines-for-dogs-and-cats/section-5-fluid-therapy-in-ill-patients/'],
    extraction:['Clinician’s Brief · 발치 후 부드러운 식이','https://www.cliniciansbrief.com/article/canine-teeth-extraction-periodontal-disease'],
    jaw:['ACVS · 구강 종양·턱 수술 후 급여','https://www.acvs.org/small-animal/oral-tumors/'],
    bladder:['ACVS · 요석 수술과 재발 관리','https://www.acvs.org/small-animal/urinary-stones/']
  };
  const profiles={healthy:'기저질환 없음 · 정상 섭취',renal:'안정된 만성 신장질환',lowfat:'저지방 식이가 필요한 질환',allergy:'제거식 / 식이 이상반응',diabetic:'당뇨',aspiration:'역류·흡인 위험',poor:'3일 이상 섭취 부족 / 심한 영양 저하',unsafe:'지속 구토·연하 불가·불안정',other:'복합 질환 / 기타'};
  const procedures=[
    {id:'neuter',name:'중성화',group:'routine',diet:'익숙한 완전균형식으로 시작합니다. 중성화만을 이유로 고열량 회복식을 필수 처방하지 않습니다.',specific:'장기 유지 열량은 회복 후 체중·활동량에 맞춰 재평가합니다.',sources:[]},
    {id:'mass',name:'피부·연부조직 종괴 절제',group:'routine',diet:'평소 먹던 완전균형식을 소량으로 시작합니다. 섭취가 감소하면 기호성·식감과 오심을 평가합니다.',specific:'단순 절제 기준입니다. 큰 재건 수술·중증 질환에는 개별 영양 지원을 검토합니다.',sources:[]},
    {id:'orthopedic',name:'정형 수술 (TPLO·골절 등)',group:'routine',diet:'익숙한 완전균형식을 소량으로 시작합니다. 활동 제한 기간에는 과급여와 체중 증가를 피합니다.',specific:'마취·진통제 관련 오심과 실제 섭취량을 확인합니다. 정형 수술만을 이유로 수술 후 금식을 연장하지 않습니다.',sources:[]},
    {id:'bladder',name:'방광절개 / 결석 제거',group:'routine',diet:'처음에는 기존에 적합했던 식이를 소량 급여합니다. 장기 처방은 결석 성분·감염 여부·신장 상태에 따라 결정합니다.',specific:'결석 종류를 모르면 유리너리 제품을 자동 확정하지 않습니다. 분석 결과 후 질환별 식이법을 적용합니다.',sources:['bladder']},
    {id:'extraction',name:'발치',group:'routine',diet:'부드러운 습식 또는 충분히 불린 기존 사료를 권장합니다. 딱딱한 사료·껌·간식으로 발치 부위를 자극하지 않습니다.',specific:'발치 후 약 2주 부드러운 식이를 사용하는 임상 참고가 있습니다. 범위·봉합 상태와 재검 결과에 따라 기간을 조정합니다.',sources:['extraction']},
    {id:'gastrotomy',name:'위절개 / 위 이물 제거',group:'gi',diet:'고소화성 소화기 식이를 소량씩 나눠 급여합니다. 저지방 요구가 없다면 로얄캐닌 리커버리 등 회복식도 후보가 될 수 있습니다.',specific:'구토·위 배출 문제·누출/복막염 여부를 확인합니다. 폐색이 응급이면 금식 시간을 채우기 위해 수술을 지연하지 않습니다.',sources:['giSurgery','giTiming','enteral']},
    {id:'intestinal',name:'장절개 / 장절제·문합',group:'gi',diet:'고소화성 식이를 소량씩 분할합니다. 장기 금식 대신 내약성을 평가하며 조기 장관 영양을 검토합니다.',specific:'문합 상태, 장운동·장폐색·복막염·저알부민혈증·절제 범위를 확인합니다. 누출 의심 시 재평가가 우선입니다.',sources:['giSurgery','giTiming','enteral']},
    {id:'jaw',name:'턱·구강 종양 수술',group:'complex',diet:'부드러운 식감과 자발 섭취 가능성을 평가합니다. 광범위 구강·혀 절제나 고양이의 섭취 저하에는 급여관 경로를 고려합니다.',specific:'수술 부위에 따른 연하·섭취 기능 평가가 먼저입니다. 시간과 경구 급여량을 자동 확정하지 않습니다.',sources:['jaw']},
    {id:'other',name:'기타 / 흉부·기도·복잡한 수술',group:'complex',diet:'기존 치료 식이와 수술 부위에 맞는 식감·급여 경로를 검토합니다.',specific:'등록된 수술별 근거가 없거나 기도·연하에 영향을 주는 수술입니다. 획일적인 경구 급여 시각·양을 제시하지 않습니다.',sources:[]}
  ];
  const recoveryFoods=[
    {id:'s-rc-recovery',name:'리커버리 캔',brand:'rc',species:'both',type:'wet',purposes:['recovery'],energy:1266,energyUnit:'kg',packGrams:195,minAge:12,maxAge:361,contra:[{code:'pancreatitis'},{code:'hepatic_encephalopathy'}],url:'https://www.royalcanin.com/kr/dogs/products/vet-products/recovery-4055',notes:'한국 공식 페이지의 글로벌 제품 데이터 1,266 kcal/kg. 국내 포장과 대조 필요. 췌장염·간성뇌증 비권장.',checkedAt:'2026-10-08'},
    {id:'s-h-ad',name:'a/d 반려견·반려묘용 습식',brand:'hills',species:'both',type:'wet',purposes:['recovery'],energy:null,energyUnit:'kg',packGrams:156,minAge:12,maxAge:361,contra:[],url:'https://www.hillspet.co.kr/cat-food/prescription-diet-ad-urgent-care-canned',notes:'한국 공식 페이지에서 열량 미확인. kcal 목표만 표시하며 g은 포장 열량 확인 후 환산해야 합니다. 단기 회복식 후보로 검토.',checkedAt:'2026-10-08'}
  ];
  function candidateFoods(p,products){const proc=procedures.find(x=>x.id===p.procedureType);if(!proc||!['dog','cat'].includes(p.species))return[];if(['diabetic','aspiration','poor','unsafe','other'].includes(p.profile)||proc.group==='complex')return[];
    const age=Number(p.ageWeeks)*7/(365.25/12),conditions=p.profile==='renal'?['renal']:p.profile==='lowfat'?['gi','lowfat']:p.profile==='allergy'?['allergy']:proc.group==='gi'?['gi']:[];
    const list=E.candidates(products,{species:p.species,age,weight:p.weight,conditions,goal:'maintain',life:'adult'}).sort((a,b)=>Number(b.type==='wet')-Number(a.type==='wet'));
    if(proc.group==='gi'&&p.profile==='healthy'&&age>=12)list.push(...recoveryFoods);
    return list;
  }
  function recommend(p,food){const errors=[],warnings=[];const proc=procedures.find(x=>x.id===p.procedureType),age=E.n(p.ageWeeks),kg=E.n(p.weight);if(!proc)errors.push('수술 종류를 선택하세요.');if(!['dog','cat'].includes(p.species))errors.push('동물 종류를 선택하세요.');if(!Number.isFinite(kg)||kg<.1||kg>150)errors.push('체중을 0.1–150 kg 범위로 입력하세요.');if(!Number.isFinite(age)||age<1||age>1560)errors.push('나이를 1–1,560주 범위로 입력하세요.');if(!Object.hasOwn(profiles,p.profile))errors.push('환자 상태를 선택하세요.');
    if(p.induction&&!Number.isFinite(C.parseDate(p.induction)))errors.push('마취 유도 예정 일시를 확인하세요.');if(p.recoveredAt&&!Number.isFinite(C.parseDate(p.recoveredAt)))errors.push('마취 회복 확인 일시를 확인하세요.');if(p.induction&&p.recoveredAt&&C.parseDate(p.recoveredAt)<C.parseDate(p.induction))errors.push('회복 확인 일시는 마취 유도 예정 일시보다 빠를 수 없습니다.');
    if(p.dailyKcal!==''&&p.dailyKcal!=null&&(!Number.isFinite(E.n(p.dailyKcal))||E.n(p.dailyKcal)<=0||E.n(p.dailyKcal)>30000))errors.push('평소 하루 섭취 열량을 확인하세요.');const meals=E.n(p.usualMeals||2);if(!Number.isInteger(meals)||meals<1||meals>12)errors.push('평소 하루 식사 횟수를 확인하세요.');
    if(errors.length)return{ok:false,errors,warnings};
    const special=age<8||kg<2,adult=age>=365.25/7;let preHours=[4,6],preText='마취 유도 4–6시간 전부터 음식·간식 금식',preDetail='물은 자유 접근이 일반 지침입니다. 수술명만으로 마취 전 음식 금식을 더 길게 정하지 않습니다.';
    if(special){preHours=[1,2];preText='어린/소형 환자: 음식 금식 1–2시간을 넘기지 않는 짧은 계획';preDetail='8주 미만 또는 2 kg 미만 기준입니다. 혈당 관찰과 첫 수술 순서를 검토합니다.';}
    if(p.profile==='diabetic'){preHours=special?null:[2,4];preText=special?'어린/소형 + 당뇨: 마취팀이 짧은 금식 계획을 조정':'당뇨: 유도 2–4시간 전 평소 식사의 절반을 고려';preDetail='AAHA 금식표의 참고입니다. 혈당·식사·인슐린 지시는 함께 조정하며 약물 용량은 추천하지 않습니다.';}
    if(p.profile==='aspiration'){preHours=special?null:[4,6];preText='역류 위험: 유도 4–6시간 전 소량 습식 식사 전략을 검토';preDetail='AAHA는 평소 양의 10–25%인 소량 습식 식사를 고려하도록 안내합니다. 단순 금식 연장으로 해결하지 않습니다. 어린/소형 조건이 겹치면 개별 조정합니다.';}
    if(['unsafe','other'].includes(p.profile)){preHours=null;preText='상태·흡인 위험에 맞춘 마취팀 금식 판단';preDetail='건강한 환자의 시간표를 자동 적용하지 않습니다.';}
    if(p.emergency){preHours=null;preText='응급: 정규 금식 시간을 채우려고 수술을 지연하지 않음';preDetail='마지막 섭취와 흡인 위험을 확인하고 안정화·기도 관리 계획을 결정합니다.';}
    const refs=['fasting','recovery',p.species==='dog'?'postopDog':'postopCat',...(proc.sources||[])];
    const gi=proc.group==='gi';let postTitle='충분히 마취에서 회복한 뒤, 당일 소량 급여',postDetail='고정된 수술 종료 후 대기 시간은 근거로 확정하지 않습니다. VCA 퇴원 안내는 귀가 몇 시간 후 평소 저녁 한 끼의 절반, 내약성이 좋으면 약 1시간 후 나머지를 제시합니다.',postWindow=null;
    if(gi){postTitle='회복 후 조기 급여 평가 · 12–24시간 내 음식 시작 참고';postDetail='ACVS는 회복 시 음식 제공과 조기 경구 영양을 권장합니다. Merck는 구토가 없으면 마취 회복 후 물 12시간, 음식 12–24시간을 제시합니다. 12시간까지 반드시 굶기라는 단일 기준이 아니며 수술·내약성에 맞춰 시작합니다.';postWindow=[12,24];}
    if(proc.group==='complex'){postTitle='수술 부위·연하 기능에 맞춰 급여 시점과 경로 결정';postDetail=proc.specific;}
    const blocked=['diabetic','aspiration','poor','unsafe','other'].includes(p.profile)||proc.group==='complex';
    if(p.profile==='poor')warnings.push('3일 이상 섭취 부족 또는 심한 영양 저하: 재급식 위험을 평가하여 전해질·열량 증가 속도를 개별화합니다. 일률적인 첫 급여량을 계산하지 않습니다.');
    if(p.profile==='unsafe'){postTitle='현재 경구 급여 보류 · 안정화/구토·연하 평가 우선';postWindow=null;postDetail='일반 추천량을 지금 급여하지 않습니다. 가능한 영양 지원 경로를 평가합니다.';}
    if(p.profile==='renal')warnings.push('기존 신장 식이와 인·수분·근육 상태를 우선합니다. 고단백 회복식을 자동 대체하지 않습니다.');
    if(p.profile==='lowfat')warnings.push('저지방 요구를 우선합니다. 리커버리·a/d를 자동 추천하지 않습니다.');
    if(p.profile==='allergy')warnings.push('제거식의 원료 제한을 유지합니다. 회복식을 섞어 시험식을 깨지 않도록 합니다.');
    let firstKcal=null,dayKcal=null,amountText='',basis='',model=null;
    if(blocked){amountText='일률적인 g 추천 제외 · 기존 치료 계획과 급여 경로에 맞춰 결정';basis='이 상태에는 일반 회복 식사량을 적용하지 않습니다.';}
    else if(gi&&adult){dayKcal=E.rer(kg)/3;firstKcal=dayKcal/4;model='rer-third';amountText='첫 급여는 초기 하루 계획의 1/4씩 분할';basis='AAHA의 입원 장관 영양 시작값 1/3 RER/일을 참고한 예시입니다. 하루 4회 분할은 이 도구의 초기 예시이며, 한 끼에 1/3 RER 전량을 주지 않습니다. 내약성에 따라 증량합니다.';}
    else {model='half-meal';amountText='첫 식사: 평소 한 끼의 1/2';if(E.n(p.dailyKcal)>0){firstKcal=E.n(p.dailyKcal)/meals/2;basis=`입력한 평소 ${p.dailyKcal} kcal/일 ÷ ${meals}회 × 1/2. 실제 평소 식사량을 기준으로 합니다.`;}else if(adult&&p.profile==='healthy'){const factor=p.species==='dog'?1.6:1.2;firstKcal=E.rer(kg)*factor/meals/2;basis=`평소 섭취량 미입력: 중성화 성체 유지 열량 추정(RER × ${factor})을 ${meals}회로 나눈 한 끼의 1/2 예시입니다. 실제 평소 한 끼의 절반을 우선하며 수술별 검증량은 아닙니다.`;}else basis='성장기 또는 치료 식이 환자는 평소 한 끼의 절반을 기준으로 합니다. 평소 하루 kcal를 알고 있으면 추가 설정에 입력하여 환산할 수 있습니다.';}
    if(gi&&!adult){firstKcal=null;dayKcal=null;model=null;amountText='성장기 위·장 수술: 성장 요구량과 입원 계획을 개별화';basis='성체 초기 RER 비율을 성장기 환자의 하루 영양 목표로 자동 적용하지 않습니다.';}
    if(food){const validSpecies=food.species==='both'||food.species===p.species;const density=E.kcalPerGram(food);if(!validSpecies)errors.push('선택한 사료의 동물 종류가 다릅니다.');const choices=candidateFoods(p,[food]);if(!choices.some(x=>x.id===food.id))errors.push('선택한 사료가 현재 추천 조건에 맞지 않습니다.');if(!density)warnings.push('이 제품은 공식 열량 미확인으로 kcal 목표만 표시합니다. g은 실제 포장 열량으로 환산하세요.');}
    let diet=proc.diet;
    if(p.profile==='renal')diet='기존 신장 처방식을 우선하여 소량 분할합니다. 수술 후 내약성과 인·수분·근육 상태를 평가하며 회복식으로 자동 대체하지 않습니다.';
    if(p.profile==='lowfat')diet='저지방 요구를 충족하는 소화기 처방식을 소량 분할합니다. 고지방 회복식으로 자동 대체하지 않습니다.';
    if(p.profile==='allergy')diet='기존 제거식 또는 적합한 가수분해·제한 원료 식이를 유지합니다. 다른 회복식·간식이 섞이지 않도록 합니다.';
    if(proc.id==='extraction'&&p.profile!=='healthy')diet+=' 발치 부위에는 부드러운 습식 또는 충분히 불린 식감을 사용합니다.';
    const density=food?E.kcalPerGram(food):null,firstGrams=firstKcal!==null&&density?firstKcal/density:null,dayGrams=dayKcal!==null&&density?dayKcal/density:null;
    const foodStopWindow=p.induction&&preHours?[C.stamp(C.parseDate(p.induction)-preHours[1]*3600000),C.stamp(C.parseDate(p.induction)-preHours[0]*3600000)]:null;
    const postClockWindow=p.recoveredAt&&postWindow?[C.stamp(C.parseDate(p.recoveredAt)+postWindow[0]*3600000),C.stamp(C.parseDate(p.recoveredAt)+postWindow[1]*3600000)]:null;
    return{ok:errors.length===0,errors,warnings,procedure:proc,preHours,preText,preDetail,foodStopWindow,postTitle,postDetail,postWindow,postClockWindow,condition:'의식·기도 보호/연하·순환이 회복되고 구토/역류가 조절되며 집도의가 해당 경로의 급여를 허용한 경우',diet,specific:proc.specific,blocked,model,firstKcal,dayKcal,firstGrams,dayGrams,amountText,basis,food:food||null,refs:[...new Set(refs)]};
  }
  const api={sources,profiles,procedures,recoveryFoods,candidateFoods,recommend,checkedAt:'2026-10-08'};if(typeof module!=='undefined')module.exports=api;else root.VetSurgery=api;
})(typeof window!=='undefined'?window:globalThis);
