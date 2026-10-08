(function(root){
  'use strict';
  const sources={
    fasting:['AAHA 2020 · 마취 전 금식표','https://www.aaha.org/wp-content/uploads/globalassets/02-guidelines/2020-anesthesia/aahaanesthesiaguidelines_fastingandtreatmentrecommendations.pdf'],
    recovery:['AAHA 2024 · 마취와 수액','https://www.aaha.org/resources/2024-aaha-fluid-therapy-guidelines-for-dogs-and-cats/section-4-fluid-therapy-and%20anesthesia/'],
    renal:['IRIS · CKD 지침','https://www.iris-kidney.com/iris-guidelines-1'],
    renalCat:['IRIS · 고양이 CKD 식이','https://www.iris-kidney.com/diets-for-cats-with-chronic-kidney-disease-ckd'],
    urinary:['ACVIM · 요석 치료와 예방 합의문','https://onlinelibrary.wiley.com/doi/10.1111/jvim.14559'],
    pancreas:['Merck Veterinary Manual · 췌장염 (2025)','https://www.merckvetmanual.com/digestive-system/the-exocrine-pancreas/pancreatitis-in-dogs-and-cats'],
    allergy:['AAHA 2023 · 알레르기 피부질환','https://www.aaha.org/wp-content/uploads/2023/10/2023-aaha-management-of-allergic-skin-diseases-guidelines-new.pdf'],
    weight:['AAHA 2021 · 체중 관리','https://www.aaha.org/resources/2021-aaha-nutrition-and-weight-management-guidelines/weight-reduction-in-the-obese-pet/0/'],
    diabetesDog:['AAHA 2026 · 개 당뇨 식이','https://www.aaha.org/resources/2026-aaha-diabetes-management-guidelines-for-dogs/section-6-dietary-management-in-diabetic-dogs/'],
    diabetesCat:['AAHA 2026 · 고양이 당뇨 식이','https://www.aaha.org/resources/2026-aaha-diabetes-management-guidelines-for-cats/section-8-dietary-management/'],
    nutrition:['AAHA 2021 · 질환별 영양 관리','https://www.aaha.org/wp-content/uploads/globalassets/02-guidelines/2021-nutrition-and-weight-management/resourcepdfs/nutritiongl_table8.pdf']
  };
  const profiles={healthy:'건강한 성체 · 예정 마취',young:'어린 환자 / 소형·저혈당 위험',diabetic:'당뇨',aspiration:'역류·흡인 위험',emergency:'응급수술',other:'동반 질환 / 개별 계획'};
  const topics=[
    {id:'renal',title:'만성 신장질환 (CKD)',purpose:'renal',goal:'인 제한과 충분한 열량 섭취, 근육 유지가 목표입니다. 안정화 후 IRIS 단계와 혈청 인·칼슘·단백뇨에 따라 신장식을 선택합니다.',feeding:'식욕이 있는 시기에 점진적으로 전환하고 소량씩 나눕니다. 식욕 저하 시 치료식 강요로 섭취량이 감소하지 않도록 오심과 영양 지원을 함께 평가합니다.',dog:'개는 단계별 IRIS 치료 권고와 인 수치에 맞춰 신장식의 필요성을 결정합니다.',cat:'고양이 IRIS 2–4단계는 신장식과 섭취량 모니터링을 권장합니다. 초기 단계용과 일반 신장식을 구분합니다.',monitor:'체중·BCS·MCS·실제 kcal, 혈청 인/칼슘·칼륨, 신장 지표, 단백뇨, 식욕을 추적합니다.',caution:'급성 신손상과 CKD를 구분합니다. 과도한 단백질 제한, 고칼슘혈증, 동반 질환이 있으면 조정합니다.',sources:['renal','renalCat']},
    {id:'urinary',title:'요석 / 하부요로질환',purpose:'urinary',goal:'결석 종류와 용해 또는 재발 예방 목적을 먼저 구분합니다. 수분 섭취를 늘려 소변을 희석하는 전략을 검토합니다.',feeding:'적합한 습식 또는 사료에 물을 더하는 방법을 환자 반응에 따라 적용합니다. 용해식 처방 중에는 간식과 다른 사료 혼합이 치료 설계를 바꿀 수 있습니다.',dog:'개 스트루바이트는 감염 여부와 배양 결과를 확인하고 감염 관리를 병행합니다.',cat:'고양이 스트루바이트 용해와 칼슘옥살레이트 재발 예방을 구분합니다. 특발성 방광염에는 환경·스트레스 관리도 필요합니다.',monitor:'결석 분석/영상, 소변 비중·pH, 배양과 임상 증상으로 반응을 확인합니다.',caution:'칼슘옥살레이트는 식이로 용해되지 않습니다. 요도 폐색은 응급 평가 대상입니다. 모든 요로질환에 동일한 산성화식을 적용하지 않습니다.',sources:['urinary']},
    {id:'gi',title:'소화기질환 / 만성 장질환',purpose:'gi',goal:'진단과 소화·흡수 상태에 맞춰 고소화성, 가수분해/새 단백질, 지방·섬유 조절 중 필요한 전략을 선택합니다.',feeding:'섭취가 가능하면 소량씩 나누어 급여하고 반응을 기록합니다. 식이 반응성 장질환은 정한 시험식만 급여하는 계획을 세웁니다.',dog:'장 림프관확장증이나 지방 불내성은 저지방 요구를 별도로 검토합니다.',cat:'식욕 저하와 체중·근육 감소를 함께 평가하며 단순 장기 금식으로 관리하지 않습니다.',monitor:'실제 섭취량, 구토·변 상태, 체중·MCS, 알부민 및 진단별 검사 지표를 확인합니다.',caution:'장폐색·지속 구토·연하 이상은 경구 급여 적합성을 먼저 평가합니다. 소화기용이라는 명칭만으로 저지방을 판단하지 않습니다.',sources:['nutrition','pancreas']},
    {id:'pancreatitis',title:'췌장염',purpose:'lowfat',goal:'수분·오심·통증 관리와 함께 가능한 조기 장관 영양을 검토합니다. 췌장을 쉬게 한다는 이유의 일률적인 장기 금식은 적용하지 않습니다.',feeding:'임상적으로 급여가 가능하면 소량씩 나누고, 자발 섭취가 부족하면 영양 지원 경로를 결정합니다.',dog:'개는 저지방 식이를 검토합니다. Merck 기준은 지방 <20 g/1,000 kcal이며 제품의 실제 지방·열량 자료로 확인합니다.',cat:'고양이는 개의 저지방 기준을 그대로 적용하지 않습니다. 지방 함량과 동반 장·간질환을 함께 평가하여 개별 선택합니다.',monitor:'오심·구토·통증, 실제 섭취량, 체중, 탈수와 임상 경과를 추적합니다.',caution:'적절한 항구토 치료에도 조절되지 않는 구토는 급여 가능성을 재평가합니다. 보증 지방 %만으로 g/1,000 kcal를 확정하지 않습니다.',sources:['pancreas']},
    {id:'allergy',title:'식이 이상반응 / 제거식 시험',purpose:'allergy',goal:'식이 이력에 맞는 처방 가수분해 또는 새 단백질 식이로 엄격한 제거식 시험을 합니다.',feeding:'시험식과 물만을 기본으로 하며 간식·영양제·향미 약·투약용 음식까지 점검합니다. 반응이 좋으면 계획한 재도전으로 진단을 확인합니다.',dog:'피부 증상의 시험은 보통 8주를 기준으로 검토하되 임상 경과에 따라 4–12주 범위와 동반 치료를 조정합니다.',cat:'고양이도 노출 원료와 순응도를 점검하고 피부·소화기 반응에 따라 시험 기간을 정합니다.',monitor:'가려움·피부/귀 상태, 구토·변, 섭취 순응도와 다른 음식 노출을 기록합니다.',caution:'반응 호전만으로 알레르기를 확진하지 않습니다. 일반 제한원료식과 처방 제거식의 목적·오염 관리가 같다고 가정하지 않습니다.',sources:['allergy']},
    {id:'diabetes',title:'당뇨',purpose:null,goal:'안정된 섭취량과 적정 체중·근육 유지, 식후 혈당 관리가 목표입니다. 인슐린 등 치료 계획과 식이를 함께 조정합니다.',feeding:'매일 정한 양과 시간으로 급여하고 간식까지 기록합니다. 먹지 않거나 식이를 변경하면 혈당 및 투약 계획을 재평가합니다.',dog:'개는 균형 잡힌 기호성 좋은 식이를 일정하게 급여합니다. 비만에서는 섬유 조절을 검토하고, 저체중에서는 감량식보다 체중 회복을 우선합니다.',cat:'고양이는 고단백·저탄수화물 식이를 검토합니다. 습식 또는 혼합식의 실제 영양 분석으로 판단하며 CKD 등 동반 질환을 우선 조정할 수 있습니다.',monitor:'혈당/CGM, 식욕, 체중·BCS·MCS, 저혈당 증상과 치료 반응을 확인합니다.',caution:'금식 중 인슐린 용량을 자동 계산하지 않습니다. 식이 변화로 필요량이 달라질 수 있습니다. 등록 제품의 탄수화물 자료가 없어 제품을 자동 매칭하지 않습니다.',sources:['diabetesDog','diabetesCat']},
    {id:'weight',title:'비만 / 감량',purpose:'weight',goal:'수의사가 정한 목표 체중과 섭취 이력을 바탕으로 초기 열량을 설정하고 근육을 유지하며 조정합니다.',feeding:'계량한 하루 사료량을 나누고 간식 열량을 포함합니다. 충분한 영양소 공급을 위해 감량용 완전균형식의 적합성을 검토합니다.',dog:'개는 초기 계획에 대한 실제 체중 변화와 활동량을 확인합니다.',cat:'고양이는 급격한 섭취 감소나 굶기기를 피하고 먹지 않는 경우 즉시 계획을 재평가합니다.',monitor:'같은 체중계로 체중·BCS·MCS, 섭취량과 순응도를 반복 평가하여 열량을 조정합니다.',caution:'동반 질환이나 근육 감소가 있으면 감량보다 우선순위를 다시 정합니다. 일반 유지식을 크게 줄일 때 영양소 충족을 확인합니다.',sources:['weight']}
  ];
  const num=v=>v===''||v==null?NaN:Number(v);
  function parseDate(v){if(typeof v!=='string'||!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(v))return NaN;const t=Date.parse(v+':00+09:00');if(!Number.isFinite(t))return NaN;const iso=new Date(t+9*3600000).toISOString().slice(0,16);return iso===v?t:NaN;}
  function stamp(t){return new Date(t+9*3600000).toISOString().slice(0,16).replace('T',' ')+' (한국시간)';}
  function surgicalPlan(p){const errors=[],warnings=[];const age=num(p.ageWeeks),weight=num(p.weight),induction=parseDate(p.induction);if(!['dog','cat'].includes(p.species))errors.push('동물 종류를 확인하세요.');if(!Number.isFinite(age)||age<1||age>1560)errors.push('나이를 1–1,560주 범위로 입력하세요.');if(!Number.isFinite(weight)||weight<.1||weight>150)errors.push('체중을 0.1–150 kg 범위로 입력하세요.');if(!Number.isFinite(induction))errors.push('마취 유도 예정 일시를 정확하게 입력하세요.');if(!Object.hasOwn(profiles,p.profile))errors.push('환자 유형을 선택하세요.');if(!['standard','individual'].includes(p.mode))errors.push('금식 계획 방식을 확인하세요.');
    const eligible=p.profile==='healthy'&&age>=52&&weight>=2;
    if(p.mode==='standard'&&!eligible)errors.push('일반 계획은 건강한 성체(52주 이상, 2 kg 이상)만 지원합니다. 개별 계획을 작성하세요.');
    let hours=num(p.hours);if(p.mode==='standard'&&(!Number.isFinite(hours)||hours<4||hours>6))errors.push('일반 계획의 음식 금식 시간은 4–6시간 중 선택하세요.');
    if(p.mode==='individual'){if(!Number.isFinite(hours)||hours<0||hours>24)errors.push('담당 수의사가 정한 음식 금식 시간을 0–24시간 범위로 입력하세요.');if(!p.reason?.trim())errors.push('개별 계획의 판단 근거와 식사 지시를 입력하세요.');}
    if(p.profile==='young'||age<8||weight<2)warnings.push('8주 미만 또는 2 kg 미만: AAHA는 음식 금식 1–2시간을 넘기지 않는 짧은 계획과 혈당 관찰을 안내합니다. 개별 지시를 확인하세요.');
    if(p.profile==='diabetic')warnings.push('당뇨: 식사·혈당 모니터링·인슐린 지시를 마취팀이 함께 결정합니다. 평소 인슐린 용량을 금식 환자에게 그대로 적용하지 마세요.');
    if(p.profile==='aspiration')warnings.push('역류·흡인 위험: 음식 종류/양, 마지막 섭취와 위장관 상태를 평가합니다. 단순히 더 오래 굶기는 방식을 자동 적용하지 않습니다.');
    if(p.profile==='emergency')warnings.push('응급수술: 정규 금식 시간을 채우기 위해 필요한 처치를 지연하지 않습니다. 안정화와 기도·흡인 위험 관리는 마취팀이 판단합니다.');
    if(p.profile==='other')warnings.push('동반 질환과 현재 섭취·수분 상태, 수술 목적에 맞춰 마취팀의 개별 계획을 확인하세요.');
    if(p.mode==='individual'&&hours>6)warnings.push('6시간을 넘는 음식 금식입니다. 연장 필요성과 수분·영양·저혈당 위험을 재검토하세요.');
    let waterStop=null;if(!['free','individual'].includes(p.waterMode))errors.push('물 섭취 계획을 확인하세요.');if(p.waterMode==='individual'){const wh=num(p.waterHours);if(!Number.isFinite(wh)||wh<0||wh>24)errors.push('물 제한 시간을 0–24시간 범위로 입력하세요.');else if(Number.isFinite(induction))waterStop=stamp(induction-wh*3600000);if(!p.waterReason?.trim())errors.push('물 제한의 판단 근거를 입력하세요.');warnings.push('물 제한은 일반 건강한 환자의 기본 지침과 다릅니다. 별도 적응증과 수분 상태를 검토하세요.');}
    const lastFood=parseDate(p.lastFood);let actualHours=null;if(p.lastFood){if(!Number.isFinite(lastFood))errors.push('마지막 음식 섭취 일시를 확인하세요.');else if(Number.isFinite(induction)){actualHours=(induction-lastFood)/3600000;if(actualHours<0)errors.push('마지막 음식 섭취가 마취 유도 예정 시각보다 늦습니다.');else if(actualHours<hours)warnings.push('예정 시각까지의 음식 금식이 계획보다 짧습니다. 마취팀에 마지막 음식 섭취를 알리고 재평가하세요.');else if(actualHours>6)warnings.push('실제 예상 음식 금식이 6시간을 넘습니다. 불필요한 연장 여부를 확인하세요.');}}
    const postReady=['awake','swallow','stable','noVomiting','surgeon'].every(k=>p[k]===true);
    return{ok:errors.length===0,errors,warnings,eligible,foodStop:Number.isFinite(induction)&&Number.isFinite(hours)?stamp(induction-hours*3600000):null,induction:Number.isFinite(induction)?stamp(induction):null,waterStop,actualHours,postReady,postText:postReady?'기록한 회복 조건이 충족되었습니다. 담당 수의사가 승인한 소량의 물·식사를 시도하고 내약성에 따라 나눠 급여합니다.':'급여 재개 조건 확인이 필요합니다. 고정된 수술 후 금식 시간을 자동 지정하지 않습니다.'};
  }
  const api={sources,profiles,topics,surgicalPlan,parseDate,stamp,checkedAt:'2026-10-08'};
  if(typeof module!=='undefined')module.exports=api;else root.VetClinical=api;
})(typeof window!=='undefined'?window:globalThis);
