export default async function handler(req, res) {
  // POST 요청만 허용
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'POST 요청만 허용됩니다.' });
  }

  const { studentAlias, gradeSummary, learningTraits, teacherConcern } = req.body;

  // 필수 값 검증
  if (!studentAlias || !gradeSummary || !learningTraits || !teacherConcern) {
    return res.status(400).json({ success: false, error: '필수 데이터가 누락되었습니다.' });
  }

  // API 키 하드코딩 (Vercel 설정이 어려우신 분을 위한 임시 조치)
  // API 키 확인
  if (!process.env.GEMINI_API_KEY) {
    return res.status(500).json({ success: false, error: 'GEMINI_API_KEY 환경 변수가 설정되지 않았습니다.' });
  }

  const prompt = `
당신은 "AI 학생 상담 전략 도우미"입니다. 
다음은 교사가 제공한 익명화된 학생 정보와 교사의 상담 고민입니다.

[학생 정보]
- 익명: ${studentAlias}
- 성적 요약: ${gradeSummary}
- 학습 특성: ${learningTraits}

[교사의 고민]
${teacherConcern}

[응답 작성 원칙]
1. 학생을 단정적으로 판단하거나 진단하지 마세요. ("의지가 부족하다", "주의력 문제가 있다" 등의 단정적 표현 금지)
2. 교사가 학생을 이해하고 대화할 수 있도록 돕는 방향으로 작성하세요.
3. 다음 형식을 반드시 지켜서 응답하세요:
   1. 현재 상황 요약
   2. 학생 데이터 기반 해석
   3. 상담 접근 전략
   4. 교사가 던질 수 있는 질문 3개
   5. 피해야 할 말 또는 주의점
   6. 다음 수업에서 해볼 수 있는 작은 지원
  `;

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite:generateContent?key=${process.env.GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }]
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Gemini API Error:', errorData);
      return res.status(500).json({ success: false, error: 'Gemini API 호출 중 오류가 발생했습니다.' });
    }

    const data = await response.json();
    const resultText = data.candidates?.[0]?.content?.parts?.[0]?.text || '응답을 생성할 수 없습니다.';

    return res.status(200).json({ success: true, result: resultText });
  } catch (error) {
    console.error('Serverless Function Error:', error);
    return res.status(500).json({ success: false, error: '서버 내부 오류가 발생했습니다.' });
  }
}
