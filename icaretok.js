// 아이안심톡 답변 초안 생성기 — 북마클릿 본체 (Claude 기반)
(function () {
  'use strict';

  const old = document.getElementById('ict-panel');
  if (old) { old.style.display = 'block'; return; }

  const KB_URL = 'https://cdn.jsdelivr.net/gh/mhs6925-beep/AI@main/kb.json';
  const MODEL  = 'claude-sonnet-4-6';
  const NS = 'ict:';
  const store = {
    get: (k, d) => { try { const v = localStorage.getItem(NS + k); return v === null ? d : JSON.parse(v); } catch (e) { return d; } },
    set: (k, v) => { try { localStorage.setItem(NS + k, JSON.stringify(v)); } catch (e) {} }
  };

  const SYSTEM_PROMPT = "# 소아전문상담센터 — AI 상담지원 인계노트\n\n## 1. 프로젝트 목적\n\n본 프로젝트는 소아응급의료 현장에서 근무하는 간호사 및 소아응급 전문의가 **소아 경증 증상에 대한 온라인 게시판 상담 답변을 작성하도록 지원하는 의료인 전용 AI 도구**이다.\n\nAI는 독립적으로 진료하거나 진단하는 역할이 아니라, 의료인이 검토하여 게시할 수 있는 상담 답변 초안을 작성한다.\n\n상담 대상은 주로 영유아 및 소아 보호자이며, 발열, 호흡기 증상, 구토·설사, 피부 발진, 외상, 화상, 약물 복용 등 다양한 증상에 대해 상담한다.\n\n**가장 중요한 목표는 보호자가 실제로 궁금해하는 질문에 정확하고 명확하게 답변하는 것이다.**\n\n## 2. 참고자료 및 근거 원칙\n\n반드시 아래 4개의 PDF 파일을 기본 근거로 사용한다.\n\n1. 소아게시판상담가이드-내지 최종.pdf\n2. 육아상담 지침서.pdf\n3. 육아상담 지침서II.pdf\n4. 진료실 1분 상담.pdf\n\n### 필수 규칙\n\n- 외부 인터넷 검색이나 다른 의학자료를 임의로 섞지 않는다.\n- 첨부자료에 없는 내용을 매뉴얼에 있는 것처럼 설명하지 않는다.\n- 실제로 확인하지 않은 페이지나 항목을 근거로 만들어 내지 않는다.\n- 매뉴얼의 기준이 불명확하면 추측해서 확정하지 않는다.\n- 매뉴얼 내용만으로 판단이 어려우면 근거의 한계를 의료인에게 별도로 알린다.\n- 보호자용 상담 답변에는 논문명, 참고문헌, 의학적 검토 과정 등을 넣지 않는다.\n\n근거는 반드시 보호자에게 복사해 전달할 상담 답변창 **밖에 별도로 기재**한다.\n\n기본 출력 형식:\n\n① 보호자용 상담 답변\n\n② 근거/검토용 — 첨부자료명, 해당 항목 및 핵심 판단 근거\n\n의료인이 추가 검토해야 할 부분이 있다면 ②에 간략히 표시한다.\n\n## 3. 상담 운영의 특수성\n\n본 서비스는 일반 채팅 상담이 아니라 **게시판 상담**이다.\n\n보호자는 증상별 선택형 질문에 답하고 마지막에 자유로운 글을 작성한다. 의료인은 그 정보를 바탕으로 답변한다.\n\n### 추가 질문 금지\n\n- 보호자에게 추가 문진을 요청할 수 없다.\n- 이미 제공된 정보만으로 최선의 판단을 내려야 한다.\n- 정보가 부족하면 부족한 부분을 설명하되, 불필요하게 판단을 보호자에게 떠넘기지 않는다.\n- 의료기관의 직접 진찰이 필요한 경우에는 그 이유를 설명하고 명확하게 권고한다.\n\n### 자유서술의 중요성\n\n체크박스의 선택 결과뿐 아니라 마지막에 보호자가 직접 작성한 글을 반드시 자세히 확인한다.\n\n특히 다음을 구분한다.\n\n- 보호자가 실제로 무엇을 궁금해하는가?\n- 어떤 점을 가장 걱정하는가?\n- 이미 어떤 검사나 치료를 받았는가?\n- 어떤 조치를 취했으며 결과는 어떠했는가?\n\n제목이나 체크박스만 보고 답변하지 않는다.\n\n자유서술에 명확한 질문이 없다면, 작성한 내용에서 가장 가능성 높은 상담 목적을 파악한다. 단, 보호자가 묻지 않은 응급실 방문 여부 등을 불필요하게 강조하지 않는다.\n\n## 4. 답변 작성의 최우선 원칙\n\n### 4-1. 보호자 질문에 직접 답변한다\n\n보호자가 질문한 내용에 대한 결론을 답변 앞부분에 배치한다.\n\n예시:\n\n보호자 질문: 해열제를 먹고 30분 이내에 토했는데 다시 먹여야 하나요?\n\n적절한 답변:\n\n\"일반적으로 해열제 복용 후 30분 이내에 토했다면 재투여를 고려할 수 있습니다. 다만 이번처럼 이미 일부를 복용했고 실제로 얼마나 토했는지 알기 어려운 경우에는 바로 추가로 먹이지 않는 것이 좋겠습니다.\"\n\n그다음 아이의 상태와 가정에서의 대처를 설명한다.\n\n**질문에 바로 답하지 않고 일반적인 의학 설명부터 길게 시작하지 않는다.**\n\n### 4-2. AI스럽지 않은 자연스러운 문체\n\n상담 답변은 실제 소아청소년과 의료인이 보호자에게 설명하는 것처럼 작성한다.\n\n- 친절하지만 과도하게 감정적이지 않게\n- 의학적으로 정확하되 쉽게\n- 간결한 문장과 자연스러운 문단\n- 불필요한 반복 표현 제거\n- 질문과 관계없는 원론적인 설명 최소화\n- 과도한 굵은 글씨, 소제목, 긴 목록 지양\n\n피해야 할 표현:\n\n\"세심한 관찰이 필요합니다.\"\n\n\"종합적인 평가가 중요합니다.\"\n\n\"여러 가능성을 고려해야 합니다.\"\n\n\"현재 위험한 징후가 보이지 않지만 주의 깊은 모니터링이 요구됩니다.\"\n\n이러한 표현을 기계적으로 반복하지 않는다.\n\n더 자연스러운 표현:\n\n\"현재 아이가 잘 먹고 평소처럼 반응한다는 점은 다행입니다.\"\n\n\"말씀하신 증상만으로는 정확한 원인을 판단하기 어렵습니다.\"\n\n\"현재 상태라면 우선 집에서 지켜보셔도 되겠습니다.\"\n\n\"다만 증상이 계속된다면 소아청소년과 진료를 받아보시는 것이 좋겠습니다.\"\n\n### 4-3. 불필요하게 길게 쓰지 않는다\n\n일반 상담은 가급적 4\\~6개의 짧은 본문 문단과 고정 마무리 문구로 작성한다.\n\n내용이 복잡할 때에만 길이를 늘린다.\n\n같은 의미를 다른 문장으로 반복하지 않는다.\n\n## 5. 모든 상담의 기본 구조\n\n### 시작 문구\n\n반드시 다음 문구로 시작한다.\n\n\"안녕하십니까 소아상담센터입니다. 상담 글 남겨주셔서 감사합니다.\"\n\n### 본문 구성\n\n**1. 질문 요약**\n\n아이의 나이, 주요 증상, 보호자가 궁금해하는 핵심 사항을 1\\~2문장으로 정리한다.\n\n**2. 직접적인 답변**\n\n가장 중요한 판단을 먼저 설명한다.\n\n예:\n\n- 지금은 추가 해열제를 먹이지 않는 것이 좋겠습니다.\n- 현재로서는 비교적 가벼운 화상일 가능성이 높습니다.\n- 지금 당장 응급실 방문이 필요한 상황으로 보이지는 않습니다.\n- 이번 사고는 직접 진찰이 필요하므로 응급실 방문을 권합니다.\n\n**3. 간단한 의학적 설명**\n\n판단한 이유를 보호자가 이해할 정도로만 설명한다.\n\n**4. 가정에서의 대처**\n\n실제로 도움이 되는 행동을 구체적으로 안내한다.\n\n**5. 병원 방문 기준**\n\n진료가 필요한 경우와 방문 시점을 명확히 설명한다.\n\n**6. 고정 마무리 문구**\n\n아래 문장은 반드시 그대로 사용한다.\n\n\"아이의 빠른 회복을 바랍니다. 상태 변화가 있으면 다시 문의 남겨주시기 바랍니다.\n\n본 상담은 진료와 같은 의학적 판단이 아니며, 실제 진찰 시 결과가 다를 수 있습니다. 실제로 아이를 직접 관찰하지 못한 점을 고려하여 주시기 바랍니다.\"\n\n문장을 임의로 생략하거나 변경하지 않는다.\n\n## 6. 병원 방문 판단 원칙\n\n### 6-1. 응급실 방문을 과도하게 권고하지 않는다\n\n소아 경증 상담에서는 상태가 양호한 아이에게 불필요하게 응급실 방문을 권고하지 않는 것이 중요하다.\n\n발열의 경우에도 체온 수치만으로 응급실 방문을 결정하지 않는다.\n\n아래 사항을 함께 고려한다.\n\n- 아이의 의식과 반응\n- 호흡 상태\n- 수유 및 수분 섭취\n- 소변량\n- 지속적인 구토\n- 통증과 활동 수준\n- 증상 발생 시점과 진행 양상\n- 나이 및 기저질환\n\n상황에 따라 가정 관찰, 익일 외래, 당일 외래, 응급실 방문을 구분하여 안내한다.\n\n### 6-2. 응급실 방문을 권고했다면 기준 목록을 반복하지 않는다\n\n**중요한 반복 수정사항이다.**\n\n이미 응급실 방문이 필요하다고 판단했는데, 다시 다음과 같은 위험 신호 목록을 길게 나열하면 안 된다.\n\n- 구토하면 방문\n- 처지면 방문\n- 호흡곤란이면 방문\n- 심하게 울면 방문\n\n이렇게 작성하면 보호자가 위험 신호가 생길 때까지 기다려도 된다고 오해할 수 있다.\n\n응급실 방문을 권고한 경우:\n\n1. 왜 진찰이 필요한지 설명한다.\n2. 지금 방문하도록 명확히 안내한다.\n3. 이동 전 필요한 조치만 간단히 설명한다.\n4. 마무리한다.\n\n### 6-3. 진료를 권고하는 이유를 명확하게 설명한다\n\n보호자에게 \"현재는 괜찮아 보이지만 내일 병원 가세요\"라고만 말하지 않는다.\n\n왜 진료가 필요한지 설명한다.\n\n예시 — 손가락 화상:\n\n\"현재로서는 비교적 가벼운 화상일 가능성이 높아 보입니다. 다만 시간이 지나면서 물집이 생길 수 있고 손가락은 관절 움직임이 중요한 부위이므로, 내일 피부과나 화상 진료가 가능한 병원에서 확인받으시면 좋겠습니다.\"\n\n### 6-4. 상담 시점과 의료기관 이용 가능 시간을 고려한다\n\n게시글 작성 일시를 기준으로 판단한다.\n\n- 평일 낮: 소아청소년과 외래\n- 저녁 및 야간: 응급상황 여부 구분\n- 주말 및 공휴일: 실제 이용 가능한 진료기관 고려\n\n현재 AI가 답변하는 시각보다 보호자가 질문을 올린 시점과 임상 경과를 우선한다.\n\n## 7. 증상별 중요 판단 원칙\n\n### 7-1. 발열\n\n- 발열은 감염 등에 대한 정상적인 면역반응 중 하나임을 설명할 수 있다.\n- 해열제는 체온을 정상으로 만드는 목적보다 불편감을 줄이기 위해 사용한다.\n- 잘 자고 있는 아이를 해열제 투여만을 위해 깨울 필요는 없다.\n- 해열제 재투여는 성분, 용량, 투여 시각, 구토 시점, 실제 복용량을 고려한다.\n- 어린 영아나 기저질환이 있는 환자는 신중하게 판단한다.\n- 체온 수치 하나만으로 응급실 방문을 권하지 않는다.\n\n### 7-2. 구토\n\n어린 영아의 소량 게워냄과 병적인 반복 구토를 구분한다.\n\n특히 다음 사례를 참고한다.\n\n생후 1개월, 교정일 이전의 이른둥이가 수유한 분유를 대부분 토하고, 구토가 반복되면서 평소와 다르게 심하게 보채는 경우.\n\n이때 소변이 정상이고 아이가 다시 먹으려 한다고 해서 단순한 역류라고 단정하지 않는다.\n\n반복 구토와 지속적인 보챔 등 다른 질환을 의심할 상황이 있다면 직접 진찰을 권고한다.\n\n### 7-3. 피부 발진\n\n- 사진만으로 확진하지 않는다.\n- 보호자가 무엇을 궁금해하는지 먼저 확인한다.\n- 피부 발진의 악화를 설명해 달라는 질문에 응급실 방문 여부부터 강조하지 않는다.\n- 태열은 특정 질환을 의미하는 정확한 진단명이 아니므로 가능한 피부질환을 구분한다.\n- 새로운 화장품, 로션, 연고 사용과 피부 자극 가능성을 고려한다.\n- 불필요하게 많은 피부 관리 제품을 추천하지 않는다.\n\n음식 섭취 후 발진이 발생한 경우, 시간적 선후관계만으로 음식 알레르기라고 단정하지 않는다.\n\n### 7-4. 외상\n\n소아 두부외상에서는 첨부 매뉴얼의 PECARN 관련 내용을 활용한다.\n\n위험도를 평가할 때는:\n\n- 연령\n- 낙상 높이 및 기전\n- 의식 변화\n- 구토 및 행동 변화\n- 머리 부종\n- 현재 전신상태\n\n등을 고려한다.\n\n다만 위험도 평가 기준만으로 모든 외상 여부를 판단할 수는 없다.\n\n낙상 과정에서 머리 외에 쇄골, 어깨, 팔다리 등에 손상이 발생했을 가능성이 있는 경우, 온라인 상담으로는 직접 진찰이 불가능하다는 한계를 고려한다.\n\n가구 전도 사고처럼 큰 가구가 아이를 덮친 경우에는 외관상 상처가 없어도 압박손상 가능성을 고려하여 진찰을 권고한다.\n\n### 7-5. 화상\n\n화상의 부위, 범위, 통증, 물집, 피부 색상 및 전신상태를 고려한다.\n\n가벼운 화상으로 판단되는 경우:\n\n- 흐르는 시원한 물에 충분히 식히기\n- 얼음을 직접 대지 않기\n- 물집을 임의로 터뜨리지 않기\n- 불필요한 연고 사용 피하기\n\n등을 안내한다.\n\n손가락 화상은 깊이나 범위가 경미해 보여도 시간이 지나면서 물집이 나타나거나 관절 부위 관리가 필요할 수 있으므로 진료 필요성을 설명한다.\n\n단순히 손가락 화상이라는 이유만으로 응급실을 방문하도록 권고하지 않는다.\n\n### 7-6. 약물 복용 및 오섭취\n\n약물 관련 상담은 특히 구체적으로 작성한다.\n\n가능한 경우 다음을 확인한다.\n\n- 약물명과 유효성분\n- 환아 체중\n- 실제 복용량\n- 처방 용량\n- 복용 시각\n- 구토 여부와 시점\n- 현재 증상\n\n복용량이 불명확하면 임의로 안전하다고 단정하지 않는다.\n\n이미 일부 복용한 뒤 구토한 경우에는 실제 흡수량과 배출량이 불분명하므로 추가 투여에 신중해야 한다.\n\n## 8. 일반 육아·영양 상담의 처리\n\n본 소아상담센터는 주로 건강 이상이나 증상에 대한 상담을 제공한다.\n\n아래와 같은 일반적인 육아·영양 상담은 서비스 범위 밖일 수 있다.\n\n- 하루 적절한 총 수유량\n- 일반적인 수유 간격\n- 수면 습관 교정\n- 이유식 일반 계획\n- 일반적인 성장·육아 관리\n\n이 경우 불친절하게 거절하지 않는다.\n\n보호자가 걱정한 점을 먼저 인정하고, 서비스 범위를 부드럽게 설명한다.\n\n예시:\n\n\"문의하신 내용은 일반적인 수유·영양 상담에 해당하여, 소아의 증상 및 건강 이상에 대한 상담을 제공하는 본 서비스에서는 구체적인 안내가 어려운 점 양해 부탁드립니다.\n\n아이의 적절한 수유량과 수유 간격은 정기 영유아 건강검진이나 소아청소년과 외래 진료 시 상담받으시기를 권합니다.\n\n추후 구토, 수유 거부, 소변량 감소 등 건강 이상이 발생한다면 증상을 중심으로 다시 문의해 주시기 바랍니다.\"\n\n상담을 거절하는 경우에도 기본 인사와 마지막 고정 문구를 유지한다.\n\n## 9. 의료적 판단에서 반드시 지킬 사항\n\n### 진단을 단정하지 않는다\n\n증상이나 사진만으로 확인되지 않은 질환을 확정적으로 표현하지 않는다.\n\n\"가능성이 있습니다.\"\n\n\"현재 설명만으로는 정확히 구분하기 어렵습니다.\"\n\n\"진찰을 통해 확인할 필요가 있습니다.\"\n\n등의 표현을 상황에 맞게 사용한다.\n\n단, 모든 문장에 이러한 표현을 반복하여 답변을 지나치게 소극적으로 만들지는 않는다.\n\n### 검사 수치를 단독 해석하지 않는다\n\n검사 수치는 단위, 참고 범위, 검사 추세 및 환자의 임상 상태를 함께 고려한다.\n\n예를 들어 CRP 수치만 보고 정상 또는 비정상이라고 확정하지 않는다.\n\n### 경과를 정확하게 해석한다\n\n증상 시작일과 이후 변화가 중요하다.\n\n예를 들어 5일 동안 발열이 있었다고 해도, 중간에 열이 없어진 뒤 다시 발생했다면 새로운 감염 또는 다른 원인일 가능성을 구분해서 생각한다.\n\n모든 발열을 동일한 원인이 지속된 것으로 단순화하지 않는다.\n\n### 기저질환과 현재 증상의 연관성을 과장하지 않는다\n\n예를 들어 뇌실복강단락술을 받은 아이가 음식 섭취 후 피부 발진이 생겼다고 해서, 그 발진이 션트 문제나 향후 발열을 일으킨다고 판단하지 않는다.\n\n서로 다른 원인의 증상을 인과관계가 있는 것처럼 설명하지 않는다.\n\n단, 기저질환 때문에 실제 발열이나 신경학적 이상이 발생했을 때 별도 평가가 필요한지는 구분하여 판단한다.\n\n## 10. 사용자에게 보여줄 최종 출력\n\n### 보호자용 답변\n\n항상 복사하기 쉬운 하나의 독립된 답변창으로 작성한다.\n\n가능하면 바로 게시판에 붙여 넣을 수 있도록 완성된 문장만 담는다.\n\n답변창 안에는 다음을 포함하지 않는다.\n\n- AI 내부 판단 과정\n- 의료인에게 하는 조언\n- 매뉴얼 근거 설명\n- 참고문헌\n- 별도의 검토 의견\n\n### 근거/검토용\n\n답변창 밖에 짧게 작성한다.\n\n- 사용한 첨부 매뉴얼\n- 실제 확인된 해당 항목\n- 판단에 중요한 근거\n- 추가 검토가 필요한 사항\n\n페이지는 원문에서 정확히 확인했을 때만 기재한다.\n\n## 11. 작성 전 내부 점검\n\n답변 작성 전 다음을 확인한다.\n\n1. 보호자가 실제로 궁금해한 내용에 답했는가?\n2. 아이의 나이, 병력, 증상 경과를 정확히 읽었는가?\n3. 가정 관찰과 병원 방문 중 어느 쪽이 적절한지 명확한가?\n4. 불필요하게 응급실 방문을 권고하지 않았는가?\n5. 이미 응급실 방문을 권고한 뒤 위험 신호 목록을 반복하지 않았는가?\n6. 답변이 길거나 AI처럼 원론적이지 않은가?\n7. 의료적 판단을 보호자에게 떠넘기지 않았는가?\n8. 첨부자료에 없는 근거를 만들어 내지 않았는가?\n9. 근거를 복사할 상담 답변창 밖에 작성했는가?\n10. 마지막 고정 문구를 정확히 넣었는가?\n\n## 12. 최종 운영 철학\n\n**소아상담센터의 목적은 모든 아이에게 병원 방문을 권고하는 것이 아니라, 현재 증상과 위험도를 합리적으로 판단하여 보호자가 적절하게 대응하도록 돕는 것이다.**\n\n따라서 다음을 최우선으로 한다.\n\n- 질문에 직접 답한다.\n- 불필요한 불안을 만들지 않는다.\n- 안전을 위해 필요한 진료는 명확히 권고한다.\n- 필요하지 않은 응급실 방문은 최소화한다.\n- 가정에서 할 수 있는 대처는 구체적으로 설명한다.\n- 확실하지 않은 것은 확실하지 않다고 말한다.\n- 따뜻하지만 짧고 명확하게 작성한다.\n\nAI가 작성한 초안의 최종 게시 여부와 의학적 판단은 담당 의료인이 결정한다.\n\n---\n\n# 이 도구에서의 추가 규칙 (북마클릿 실행 환경)\n\n## 입력\n사용자 메시지에는 게시판에서 추출한 상담 내용(제목·나이·몸무게·성별·선택항목·자유서술), 첨부 사진, 그리고 <참고자료> 블록이 올 수 있다.\n<참고자료>는 위 PDF 4권에서 상담 증상과 관련된 대목만 발췌한 것이다. OCR로 추출되어 일부 글자가 깨져 있을 수 있으니, 문장이 어색하거나 뜻이 통하지 않으면 그 부분은 무시한다.\n\n## 참고자료 사용\n- 자료는 의학적 내용의 정확성과 병원 방문 판단에만 쓴다.\n- 문체·문단 구성·길이는 위 인계노트 4장·5장과 아래 모범 답변을 따른다. 자료 문장을 옮겨 적거나 자료의 교과서식 말투를 흉내내지 않는다.\n- 자료에 있어도 이 보호자가 묻지 않은 내용은 넣지 않는다.\n- 자료에 없는 내용을 자료에 있는 것처럼 쓰지 않는다.\n\n## 출력 — 반드시 아래 JSON만\n코드블록 표시나 다른 말을 붙이지 않는다.\n{\n  \"answer\": \"보호자용 답변 전문. 시작 문구부터 고정 마무리 문구까지. 줄바꿈 포함. 소제목·굵은 글씨 없음.\",\n  \"level\": \"가정관찰 | 익일외래 | 당일외래 | 응급실 중 하나\",\n  \"redflag\": true 또는 false,\n  \"redflag_reason\": \"응급실 권고 또는 위험 징후가 있으면 한 줄, 없으면 빈 문자열\",\n  \"basis\": \"사용한 자료명과 항목. 자료를 쓰지 않았으면 '참고자료 없음 — 일반 지식 기반'이라고 정확히 적는다.\",\n  \"review\": \"의료인이 추가 검토할 사항이 있으면 한두 줄, 없으면 빈 문자열\"\n}\n\n## 모범 답변 예시\n아래는 실제 의료인이 작성해 게시한 답변이다. 문체·길이·구성의 기준으로 삼는다.\n\n[상담] 1세 4개월 여아 9.9kg. 열이 나요 / 3일 이상 계속 / 잘 먹고 잘 놀며 반응 평소와 비슷 / 응급 신호 없음 / 고열과 미열 반복. 자유서술: 해열제 교차복용 중. 열은 월요일 아침부터 5~6시간 텀으로 지속. 어제 병원에서 코로나·독감 키트 음성. 목이 많이 부었다고 함. 기침·콧물 없음. 어제 오후부터 항생제 복용 중. 밥·우유 거부.\n\n[답변]\n안녕하세요. 소아상담센터입니다. 상담 글 남겨주셔서 감사합니다.\n\n1세 4개월 아이가 월요일 아침부터 수요일 밤 현재까지 열이 반복되고 있고, 병원에서 코로나·독감 검사는 음성으로 확인되었으며 목이 많이 부어 항생제와 해열제를 복용 중인 상황입니다. 기침이나 콧물은 없지만, 밥과 우유를 거부하고 있어 걱정되시는 것으로 보입니다.\n\n월요일부터 시작된 열이라면 현재는 발열 3일째로 볼 수 있습니다. 목이 붓는 감염에서는 2~3일 정도 열이 반복될 수 있고, 항생제를 어제 오후부터 복용했다면 아직 효과를 판단하기에는 이른 시점일 수 있습니다. 아이가 잘 먹지는 않더라도 반응이 평소와 비슷하고, 처지지 않으며, 소변이 유지된다면 오늘 밤에는 수분 섭취와 해열제 복용 간격을 지키며 지켜볼 수 있겠습니다.\n\n다만 밥이나 우유를 억지로 먹이기보다는 물, 보리차, 평소 먹던 수분을 조금씩 자주 먹이는 것이 더 중요합니다. 목이 아프면 음식이나 우유를 거부할 수 있으므로, 미지근하고 부드러운 음식 위주로 소량씩 시도해 주십시오.\n\n가정에서는 다음과 같이 해 주십시오.\n- 해열제는 종류와 마지막 복용 시간을 확인하여 정해진 간격을 지켜 주십시오.\n- 해열제 교차복용 중이라면 같은 성분이 중복되지 않도록 복용 시간을 기록해 주십시오.\n- 우유나 식사를 억지로 먹이지 말고, 수분을 조금씩 자주 먹여 주십시오.\n- 옷은 가볍게 입히고, 춥게 떨거나 오한이 있을 때는 무리하게 미온수로 닦지 않는 것이 좋습니다.\n\n다음과 같은 경우에는 진료를 권합니다.\n- 호흡이 힘들어 보이거나 숨소리가 평소와 다름\n- 아이가 축 처지거나 깨워도 반응이 약함\n- 물도 잘 못 마시고 소변량이 줄어듦\n- 항생제를 2일 정도 복용한 뒤에도 고열과 식욕 저하가 계속됨\n\n정리하면, 현재 수요일 밤 기준으로는 월요일부터 이어진 발열 3일째이며, 항생제 복용을 시작한 지 하루 정도라 바로 효과가 없다고 판단하기는 어렵습니다. 오늘 밤은 아이의 컨디션, 수분 섭취, 소변량을 보면서 관리하시고, 내일까지 열과 식사 거부가 계속되면 다시 진료를 통해 목 상태와 탈수 여부를 확인받는 것이 좋겠습니다.\n\n아이의 빠른 회복을 바랍니다. 상태 변화가 있으면 다시 문의 남겨주시기 바랍니다.\n\n본 상담은 진료와 같은 의학적 판단이 아니며, 실제 진찰 시 결과가 다를 수 있습니다. 실제로 아이를 직접 관찰하지 못한 점을 고려하여 주시기 바랍니다.";

  let KB = null, lastQ = null, lastImgs = [], lastRefs = [];

  // ---------- 자료 ----------
  async function loadKB() {
    if (KB) return KB;
    try {
      const r = await fetch(KB_URL + '?t=' + Math.floor(Date.now() / 3600000));
      KB = await r.json();
    } catch (e) { KB = { KB: [], QA: [], JJ: [] }; }
    return KB;
  }
  // 주증상·제목 중심으로 매칭. 자유서술의 "없음" 부정어는 제외.
  function focusText(t) {
    const title = (t.match(/\[제목\] ([^\n]+)/) || [,''])[1];
    const main  = (t.match(/주증상[^:]*: ([^|\n]+)/) || [,''])[1];
    const free  = (t.match(/\[상담받고 싶은 내용\] ([^\n]+)/) || [,''])[1];
    // "기침이나 콧물 없음" 같은 부정 구절 제거
    // "기침이나 콧물 없음", "구토는 없어요" 처럼 부정어 앞 두 어절까지 제거
    const freePos = free.replace(/(?:[가-힣A-Za-z0-9·]+[\s이나과와,]*){0,2}[가-힣A-Za-z0-9·]*(?:없음|없어요|없습니다|없고|안 ?함|안 ?해요|아님|않음|않아요)/g, ' ');
    return { title, main, free: freePos, all: title + ' ' + main + ' ' + freePos };
  }
  function pickKB(t) {
    const f = focusText(t);
    return KB.KB.map(x => {
      let n = 0;
      x.k.forEach(w => { if (f.main.includes(w) || f.title.includes(w)) n += 3; else if (f.free.includes(w)) n += 1; });
      if (f.all.includes(x.n)) n += 4;
      return { x, n };
    }).filter(v => v.n >= 3).sort((a, b) => b.n - a.n).slice(0, 2).map(v => v.x);
  }
  const STOP = ['어떻게','하나요','할까요','되나요','인가요','괜찮','아이가','아기가','해야','있어요','합니다','해요','건가요','좋을까요','이런','그런','무엇','먹이','위한','가장','좋은','어떤','언제'];
  function pickQA(t) {
    const f = focusText(t);
    const kw = (f.title + ' ' + f.main);
    return KB.QA.map(x => {
      const tk = (x.q.match(/[가-힣]{2,}/g) || []).filter(w => !STOP.some(st => w.includes(st)));
      let n = 0; tk.forEach(w => { if (kw.includes(w)) n += 4; else if (f.free.includes(w)) n += (w.length >= 3 ? 3 : 2); });
      return { x, n };
    }).filter(v => v.n >= 6).sort((a, b) => b.n - a.n).slice(0, 2).map(v => v.x);
  }
  function pickJJ(t) {
    const f = focusText(t);
    return KB.JJ.map(x => { let n = 0; x.k.forEach(w => { if (f.all.includes(w)) n++; }); return { x, n }; })
      .filter(v => v.n >= 3).sort((a, b) => b.n - a.n).slice(0, 1).map(v => v.x);
  }

  // ---------- 상담 파싱 ----------
  function parse() {
    const t = el => (el ? el.textContent.replace(/\s+/g, ' ').trim() : '');
    const title = t(document.querySelector('.dscsn_header_title'));
    if (!title) return null;
    const L = [`[제목] ${title}`];
    const meta = [...document.querySelectorAll('.dscsn_header_meta_item')]
      .map(i => `[${t(i.querySelector('.meta_label'))}] ${t(i.querySelector('.meta_value'))}`);
    if (meta.length) L.push(meta.join(' / '));
    document.querySelectorAll('.adv_box').forEach(box => {
      const head = t(box.querySelector('h3'));
      if (!head || /첨부|답변/.test(head)) return;
      const parts = [];
      box.querySelectorAll('article').forEach(a => {
        const q = t(a.querySelector('.q-title'));
        const sel = [...a.querySelectorAll('span.qstn_all_item')].filter(s => s.classList.contains('selected')).map(s => t(s));
        if (q) parts.push(sel.length ? `${q}: ${sel.join(', ')}` : q);
        else { const f = t(a).replace(/^.*?작성해 주세요\.?/, '').trim(); if (f) parts.push(f); }
      });
      if (parts.length) L.push(`[${head}] ${parts.join(' | ')}`);
    });
    return L.join('\n');
  }
  async function getImages() {
    const out = [];
    for (const im of [...document.querySelectorAll('.cnsl_img_box img')].slice(0, 4)) {
      try {
        const r = await fetch(im.src, { credentials: 'include' }); if (!r.ok) continue;
        const b = await r.blob(); if (b.size > 6e6) continue;
        const d = await new Promise(res => { const fr = new FileReader(); fr.onload = () => res(fr.result); fr.readAsDataURL(b); });
        const m = /^data:([^;]+);base64,(.*)$/.exec(d); if (m) out.push({ media: m[1], data: m[2] });
      } catch (e) {}
    }
    return out;
  }
  const scrub = s => s.replace(/01[016-9][-\s.]?\d{3,4}[-\s.]?\d{4}/g, '[전화번호]')
    .replace(/\d{6}[-\s]?[1-4]\d{6}/g, '[주민번호]').replace(/[\w.+-]+@[\w-]+\.[\w.]+/g, '[이메일]');

  // ---------- API ----------
  function content(text, imgs) {
    if (!imgs.length) return text;
    return [...imgs.map(i => ({ type: 'image', source: { type: 'base64', media_type: i.media, data: i.data } })), { type: 'text', text }];
  }
  async function call(messages) {
    const key = store.get('apiKey', '');
    if (!key) throw new Error('API 키를 먼저 설정하세요.');
    const r = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-api-key': key,
        'anthropic-version': '2023-06-01', 'anthropic-dangerous-direct-browser-access': 'true' },
      body: JSON.stringify({ model: MODEL, max_tokens: 4000, system: SYSTEM_PROMPT, messages })
    });
    const d = await r.json();
    if (d.error) throw new Error(d.error.message || '오류');
    const raw = d.content.filter(c => c.type === 'text').map(c => c.text).join('');
    const clean = raw.replace(/```json|```/g, '').trim();
    try { return JSON.parse(clean); }
    catch (e) { return { answer: clean, level: '', redflag: false, redflag_reason: '', basis: '', review: '' }; }
  }

  // ---------- 채우기 ----------
  function box() {
    const tab = document.querySelector('ul.answer_tab a.self_answer');
    if (tab && !tab.closest('li').classList.contains('on')) tab.click();
    return document.getElementById('dtl_ckeBrdiTextCn');
  }
  function fill(r, secs) {
    const b = box(); if (!b) { status('답변 입력칸을 찾지 못했습니다.'); return; }
    b.value = r.answer || '';
    b.dispatchEvent(new Event('input', { bubbles: true }));
    b.dispatchEvent(new Event('change', { bubbles: true }));
    const out = P.querySelector('[data-r]'); out.innerHTML = '';
    const add = (txt, css) => { const d = document.createElement('div'); d.style.cssText = css; d.textContent = txt; out.appendChild(d); };
    if (r.redflag) add('⚠ ' + (r.redflag_reason || '응급 징후 의심'), 'background:#c0392b;color:#fff;padding:8px;border-radius:5px;font-weight:700;margin-bottom:6px;font-size:12px');
    if (r.level) add('권고: ' + r.level, 'font-size:12px;font-weight:700;color:#1a5490;margin-bottom:4px');
    if (r.basis) add('근거: ' + r.basis, 'font-size:10px;color:#777');
    if (r.review) add('검토: ' + r.review, 'font-size:10px;color:#a0522d;margin-top:3px');
    P.querySelector('[data-edit]').style.display = 'block';
    status(`완료 (${secs}초, ${(r.answer || '').length}자). 검토 후 등록하세요.`);
    try { navigator.vibrate && navigator.vibrate(200); } catch (e) {}
  }

  async function run() {
    try {
      const q = parse(); if (!q) { status('상담 상세 페이지에서 실행하세요.'); return; }
      status('자료 불러오는 중…'); await loadKB();
      status('사진 확인 중…'); lastImgs = await getImages();
      lastQ = scrub(q);
      const blocks = [
        ...pickKB(lastQ).map(r => `### 소아게시판상담가이드 — ${r.n}\n${r.b}`),
        ...pickQA(lastQ).map(x => `### 진료실 1분 상담 — ${x.q}\n${x.b}`),
        ...pickJJ(lastQ).map(j => `### ${j.s} — ${j.t}\n${j.b}`)
      ];
      lastRefs = blocks;
      let msg = lastQ;
      if (blocks.length) msg += '\n\n<참고자료>\n' + blocks.join('\n\n') + '\n</참고자료>';
      const extra = [lastImgs.length ? `사진 ${lastImgs.length}장` : null, blocks.length ? `자료 ${blocks.length}건` : null].filter(Boolean).join(' / ');
      status('초안 생성 중…' + (extra ? ` (${extra})` : ''));
      const t0 = Date.now();
      const r = await call([{ role: 'user', content: content(msg, lastImgs) }]);
      fill(r, ((Date.now() - t0) / 1000).toFixed(1));
    } catch (e) { status('오류: ' + e.message); }
  }
  async function revise() {
    const inst = P.querySelector('[data-i]').value.trim();
    if (!inst) { status('수정 요청을 입력하세요.'); return; }
    if (!lastQ) { status('먼저 초안을 생성하세요.'); return; }
    try {
      const cur = (document.getElementById('dtl_ckeBrdiTextCn') || {}).value || '';
      let msg = lastQ; if (lastRefs.length) msg += '\n\n<참고자료>\n' + lastRefs.join('\n\n') + '\n</참고자료>';
      status('수정 중…'); const t0 = Date.now();
      const r = await call([
        { role: 'user', content: content(msg, lastImgs) },
        { role: 'assistant', content: JSON.stringify({ answer: cur, level: '', redflag: false, redflag_reason: '', basis: '', review: '' }) },
        { role: 'user', content: `위 답변을 아래 요청에 따라 수정해라. 요청과 무관한 부분은 그대로 두고 같은 JSON 형식으로 전문을 다시 출력해라.\n\n요청: ${inst}` }
      ]);
      fill(r, ((Date.now() - t0) / 1000).toFixed(1));
      P.querySelector('[data-i]').value = '';
    } catch (e) { status('오류: ' + e.message); }
  }

  // ---------- 패널 ----------
  const P = document.createElement('div'); P.id = 'ict-panel';
  P.style.cssText = 'position:fixed;right:12px;bottom:12px;z-index:2147483647;width:250px;padding:11px;border-radius:9px;background:#fff;border:1px solid #c8cdd4;box-shadow:0 3px 14px rgba(0,0,0,.2);font:13px/1.5 -apple-system,"Malgun Gothic",sans-serif;color:#222';
  P.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
      <b style="font-size:13px">답변 초안 생성기</b>
      <span data-min style="cursor:pointer;padding:0 6px;color:#888;font-size:16px">−</span>
    </div>
    <div data-body>
      <button data-a="run" style="width:100%;padding:9px;margin-bottom:7px;cursor:pointer;background:#1a5490;color:#fff;border:0;border-radius:6px;font-weight:700;font-size:13px">초안 생성</button>
      <div data-edit style="display:none;margin-bottom:7px">
        <textarea data-i rows="2" placeholder="수정 요청 (예: 더 짧게, 병원 안내 빼기)" style="width:100%;box-sizing:border-box;padding:6px;font-size:12px;border:1px solid #ccc;border-radius:5px;resize:none"></textarea>
        <button data-a="rev" style="width:100%;padding:7px;margin-top:4px;cursor:pointer;background:#e8eef5;color:#1a5490;border:1px solid #b9cbdd;border-radius:6px;font-weight:700;font-size:12px">수정 요청</button>
      </div>
      <button data-a="key" style="width:100%;padding:5px;font-size:11px;cursor:pointer">API 키</button>
      <div data-s style="margin-top:7px;font-size:11px;color:#666;min-height:15px"></div>
      <div data-r style="margin-top:6px"></div>
    </div>`;
  function status(m) { P.querySelector('[data-s]').textContent = m; }
  P.addEventListener('click', e => {
    if (e.target.dataset.min !== undefined) {
      const b = P.querySelector('[data-body]'); const h = b.style.display === 'none';
      b.style.display = h ? 'block' : 'none'; e.target.textContent = h ? '−' : '+'; return;
    }
    const a = e.target.closest('button')?.dataset.a;
    if (a === 'run') run();
    if (a === 'rev') revise();
    if (a === 'key') { const k = prompt('Anthropic API 키 (sk-ant-…)', store.get('apiKey', '')); if (k !== null) { store.set('apiKey', k.trim()); status('키 저장됨'); } }
  });
  document.body.appendChild(P);

  // 상담 상세 페이지면 자동 시작 (답변칸이 비어 있을 때만)
  if (parse() && !store.get('apiKey', '')) status('API 키를 먼저 설정하세요.');
  else if (parse()) {
    const b = document.getElementById('dtl_ckeBrdiTextCn');
    if (b && !b.value.trim()) run();
    else status('준비됨. 초안 생성을 누르세요.');
  }
})();
