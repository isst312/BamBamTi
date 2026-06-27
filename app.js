const USERS = [
  { id: "admin", password: "2026", role: "admin", name: "관리자" },
  { id: "10101", password: "1234", role: "student", studentId: "10101" },
  { id: "10102", password: "1234", role: "student", studentId: "10102" },
  { id: "10103", password: "1234", role: "student", studentId: "10103" },
];

const STUDENTS = [
  {
    id: "10101",
    name: "김코딩",
    photo: "assets/10101_김코딩.jpg",
    grades: {
      "정보 수행평가": "A",
      "웹앱 프로젝트": "92점",
      "디지털 윤리 퀴즈": "88점",
      "수업 참여도": "상",
    },
    traits: [
      "문제 해결 과정을 차분히 설명합니다.",
      "새 도구를 시도할 때 기록을 꼼꼼히 남깁니다.",
      "제출 전 확인 습관을 더 연습하면 좋습니다.",
    ],
    teacherMemo: "프론트엔드 구조 이해가 빠르며, 팀원 질문에 답하는 태도가 좋습니다.",
  },
  {
    id: "10102",
    name: "박개발",
    photo: "assets/10102_박개발.jpg",
    grades: {
      "정보 수행평가": "B+",
      "웹앱 프로젝트": "86점",
      "디지털 윤리 퀴즈": "91점",
      "수업 참여도": "중상",
    },
    traits: [
      "협업 중 역할 분담을 잘 지킵니다.",
      "UI 수정 아이디어를 자주 제안합니다.",
      "프로젝트 범위를 작게 나누는 연습이 필요합니다.",
    ],
    teacherMemo: "기능 구현 의욕이 높고, 오류가 날 때 원인을 함께 추적하려는 태도가 좋습니다.",
  },
  {
    id: "10103",
    name: "이교사",
    photo: "assets/10103_이교사.jpg",
    grades: {
      "정보 수행평가": "A-",
      "웹앱 프로젝트": "89점",
      "디지털 윤리 퀴즈": "95점",
      "수업 참여도": "상",
    },
    traits: [
      "학습 내용을 자기 언어로 정리합니다.",
      "개선할 지점을 발견하면 근거를 함께 제시합니다.",
      "코드 주석을 더 구체적으로 쓰면 좋습니다.",
    ],
    teacherMemo: "질문의 초점이 좋고, 개선 방향을 토의하는 데 적극적입니다.",
  },
];

const loginForm = document.querySelector("#loginForm");
const userIdInput = document.querySelector("#userId");
const passwordInput = document.querySelector("#password");
const loginMessage = document.querySelector("#loginMessage");
const logoutButton = document.querySelector("#logoutButton");
const loginView = document.querySelector("#loginView");
const studentView = document.querySelector("#studentView");
const adminView = document.querySelector("#adminView");

let currentUser = null;
let selectedStudentForCounseling = null;

loginForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const id = userIdInput.value.trim();
  const password = passwordInput.value;
  const user = USERS.find((item) => item.id === id && item.password === password);

  if (!user) {
    loginMessage.textContent = "아이디 또는 비밀번호가 올바르지 않습니다.";
    passwordInput.value = "";
    passwordInput.focus();
    return;
  }

  currentUser = user;
  loginMessage.textContent = "";
  loginForm.reset();

  if (user.role === "admin") {
    renderAdminDashboard();
  } else {
    const student = STUDENTS.find((item) => item.id === user.studentId);
    renderStudentPage(student);
  }
});

logoutButton.addEventListener("click", () => {
  currentUser = null;
  showOnly(loginView);
  logoutButton.classList.add("hidden");
  userIdInput.focus();
});

function showOnly(targetView) {
  [loginView, studentView, adminView].forEach((view) => view.classList.add("hidden"));
  targetView.classList.remove("hidden");
}

function renderStudentPage(student) {
  if (!student) {
    loginMessage.textContent = "학생 정보를 찾을 수 없습니다.";
    showOnly(loginView);
    return;
  }

  studentView.innerHTML = `
    <div class="view-header">
      <div class="view-title">
        <p class="eyebrow">Student</p>
        <h2>${student.name} 학생 페이지</h2>
        <p>로그인한 학생의 학습 현황을 확인합니다.</p>
      </div>
    </div>

    <div class="student-layout">
      <article class="student-profile">
        <img class="student-photo" src="${student.photo}" alt="${student.name} 학생 사진" />
        <div class="profile-body">
          <h3>${student.name}</h3>
          <p class="student-number">학번 ${student.id}</p>
          <div class="tag-row" aria-label="학습 키워드">
            <span class="tag">정보</span>
            <span class="tag">프로젝트</span>
          </div>
        </div>
      </article>

      <div class="content-stack">
        ${renderGrades(student.grades, false, `gradesTitle-${student.id}`)}
        ${renderTraits(student)}
      </div>
    </div>
  `;

  showOnly(studentView);
  logoutButton.classList.remove("hidden");
}

function renderAdminDashboard() {
  adminView.innerHTML = `
    <div class="view-header">
      <div class="view-title">
        <p class="eyebrow">Admin</p>
        <h2>관리자 대시보드</h2>
        <p>학생 3명의 학습 현황을 한 화면에서 비교합니다.</p>
      </div>
    </div>

    <section class="intro-panel" style="margin-top: 22px; margin-bottom: 22px;" aria-labelledby="counselingTitle">
      <p class="eyebrow">AI Assistant</p>
      <h2 id="counselingTitle" style="color: var(--primary);">AI 학생 상담 전략 도우미</h2>
      
      <div id="counselingContent" style="margin-top: 18px; padding: 18px; background: var(--surface); border: 3px solid var(--line); border-radius: 8px;">
        <p style="color: var(--muted); font-weight: bold;">아래 학생 카드에서 '상담 전략 요청' 버튼을 클릭해주세요.</p>
      </div>
      
      <p style="margin-top: 14px; font-size: 13px; color: var(--muted); line-height: 1.5; font-weight: bold;">
        ※ AI 상담 전략은 참고용입니다. 최종 판단과 실제 상담은 교사가 학생의 상황을 종합적으로 고려하여 진행해야 합니다.
      </p>
    </section>

    <section class="admin-grid" aria-label="전체 학생 정보">
      ${STUDENTS.map(renderStudentCard).join("")}
    </section>
  `;

  showOnly(adminView);
  logoutButton.classList.remove("hidden");
}

function renderStudentCard(student) {
  return `
    <article class="student-card">
      <img class="student-photo" src="${student.photo}" alt="${student.name} 학생 사진" />
      <div class="student-card-body">
        <h3>${student.name}</h3>
        <p class="student-number">학번 ${student.id}</p>
        ${renderGrades(student.grades, true, `gradesTitle-${student.id}`)}
        ${renderTraits(student)}
        <button class="ghost-button" style="width: 100%; margin-top: 14px;" data-action="request-counseling" data-studentid="${student.id}">상담 전략 요청</button>
      </div>
    </article>
  `;
}

function renderGrades(grades, compact = false, headingId = "gradesTitle") {
  const rows = Object.entries(grades)
    .map(([label, value]) => `<tr><th scope="row">${label}</th><td>${value}</td></tr>`)
    .join("");

  return `
    <section aria-labelledby="${headingId}">
      <div class="section-title">
        <h3 id="${headingId}">성적 정보</h3>
      </div>
      <table class="grade-table ${compact ? "compact-table" : ""}">
        <tbody>${rows}</tbody>
      </table>
    </section>
  `;
}

function renderTraits(student) {
  return `
    <section aria-labelledby="traitsTitle-${student.id}">
      <div class="section-title">
        <h3 id="traitsTitle-${student.id}">학습 특성 및 교사 메모</h3>
      </div>
      <ul class="memo-list">
        ${student.traits.map((trait) => `<li>${trait}</li>`).join("")}
        <li>${student.teacherMemo}</li>
      </ul>
    </section>
  `;
}

showOnly(loginView);

function renderCounselingPanel() {
  const panel = document.getElementById("counselingContent");
  if (!selectedStudentForCounseling) return;

  const student = selectedStudentForCounseling;
  const studentIndex = STUDENTS.findIndex(s => s.id === student.id);
  const alias = `학생 ${String.fromCharCode(65 + studentIndex)}`; // 학생 A, B, C...

  const gradesArr = Object.entries(student.grades).map(([k,v]) => `${k}: ${v}`);
  const gradeSummary = gradesArr.join(', ');
  const learningTraits = student.traits.join(' / ');

  const previewJson = JSON.stringify({
    studentAlias: alias,
    gradeSummary: gradeSummary,
    learningTraits: learningTraits,
    teacherConcern: "입력한 고민 내용..."
  }, null, 2);

  panel.innerHTML = `
    <div style="display: flex; gap: 14px; align-items: center; margin-bottom: 14px; flex-wrap: wrap;">
      <h3 style="margin:0; color: var(--ink);">선택된 학생: ${student.name} (${student.id})</h3>
      <span class="tag" style="background: var(--surface-strong); border: 2px solid var(--muted); color: var(--muted); box-shadow: none; min-height: 24px; padding: 0 8px; font-size: 12px; transform: none;">전송 시 '${alias}'로 익명화됨</span>
    </div>

    <label style="display: block; font-weight: bold; margin-bottom: 8px; color: var(--ink);">상담 고민 입력</label>
    <textarea id="teacherConcernInput" rows="3" placeholder="예: 수업 참여는 좋은데 평가 결과가 낮습니다. 어떻게 상담하면 좋을까요?" style="width: 100%; padding: 12px; border: 4px inset #808080; background: #eaffff; font-family: inherit; font-size: 15px; margin-bottom: 14px; resize: vertical;"></textarea>
    
    <div style="background: #f8fafc; padding: 14px; border-left: 5px solid var(--primary); margin-bottom: 18px; font-size: 13px; font-family: monospace; white-space: pre-wrap; overflow-x: auto; color: var(--ink);">
      <div style="font-weight: bold; margin-bottom: 6px; color: var(--muted);">전송 데이터 미리보기:</div>${previewJson}
    </div>

    <button class="primary-button" data-action="submit-counseling" style="margin-bottom: 18px;">AI 상담 전략 받기</button>
    
    <div id="counselingResultArea" style="min-height: 0; padding-top: 0;">
      <!-- 결과 표시 영역 -->
    </div>
  `;
}

adminView.addEventListener("click", async (e) => {
  if (e.target.dataset.action === "request-counseling") {
    const studentId = e.target.dataset.studentid;
    selectedStudentForCounseling = STUDENTS.find(s => s.id === studentId);
    renderCounselingPanel();
    document.getElementById("counselingTitle").scrollIntoView({ behavior: 'smooth' });
  }

  if (e.target.dataset.action === "submit-counseling") {
    const concernInput = document.getElementById("teacherConcernInput");
    const concern = concernInput.value.trim();
    const resultArea = document.getElementById("counselingResultArea");

    if (!concern) {
      resultArea.style.borderTop = "3px dashed var(--line)";
      resultArea.style.paddingTop = "18px";
      resultArea.innerHTML = `<p style="color: var(--danger); font-weight: bold; margin: 0;">상담 고민을 먼저 입력해주세요.</p>`;
      return;
    }

    resultArea.style.borderTop = "3px dashed var(--line)";
    resultArea.style.paddingTop = "18px";
    resultArea.innerHTML = `<p style="color: var(--primary); font-weight: bold; margin: 0;">AI가 상담 전략을 생성하는 중입니다...</p>`;
    
    // 익명화 데이터 생성
    const studentIndex = STUDENTS.findIndex(s => s.id === selectedStudentForCounseling.id);
    const alias = `학생 ${String.fromCharCode(65 + studentIndex)}`; 
    
    const gradesArr = Object.entries(selectedStudentForCounseling.grades).map(([k,v]) => `${k}: ${v}`);
    const gradeSummary = gradesArr.join(', ');
    const learningTraits = selectedStudentForCounseling.traits.join(' / ');

    try {
      /*
       [보안 점검용 주석]
       1. 프론트엔드에 API 키를 넣으면 개발자 도구에서 노출될 수 있습니다.
       2. Gemini API 호출은 Vercel Serverless Function에서 처리합니다.
       3. .env 파일은 GitHub에 올리지 않습니다.
       4. Vercel 배포 시에는 Project Settings의 Environment Variables에 GEMINI_API_KEY를 등록해야 합니다.
       5. Gemini로 전송하는 데이터는 이름, 학번, 사진 경로를 제외한 최소 정보로 제한합니다.
      */
      const response = await fetch('/api/gemini-counseling', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          studentAlias: alias,
          gradeSummary: gradeSummary,
          learningTraits: learningTraits,
          teacherConcern: concern
        })
      });

      const data = await response.json();
      if (data.success) {
        resultArea.innerHTML = `<div style="white-space: pre-wrap; font-size: 15px; color: var(--ink); line-height: 1.6;">${data.result}</div>`;
      } else {
        resultArea.innerHTML = `<p style="color: var(--danger); font-weight: bold; margin: 0;">AI 상담 전략을 불러오지 못했습니다. API 키 또는 Vercel 환경 변수를 확인해주세요. (${data.error || ''})</p>`;
      }
    } catch (err) {
      resultArea.innerHTML = `<p style="color: var(--danger); font-weight: bold; margin: 0;">AI 상담 전략을 불러오지 못했습니다. API 키 또는 Vercel 환경 변수를 확인해주세요.</p>`;
    }
  }
});
