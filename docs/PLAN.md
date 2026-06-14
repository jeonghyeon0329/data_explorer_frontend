# data_explorer_frontend — 기획 문서

## 1. 서비스 개요

CSV / Excel / JSON 파일을 업로드하고 데이터를 탐색·시각화·공유하는 웹 서비스의 프론트엔드 SPA.

| 항목 | 내용 |
|------|------|
| 프레임워크 | React 19 + React Router 7 (HashRouter) |
| 스타일링 | Tailwind CSS 3 (다크 테마) |
| 차트 라이브러리 | Recharts (신규 추가 예정) |
| 상태 관리 | React Context (전역 인증 상태) + 로컬 useState |
| API 통신 | fetch 래퍼 (`src/api/request.js`) |

---

## 2. 라우트 구조

```
/#/main                      → MainPage          (랜딩, 로그인 전 공개)
/#/login                     → LoginPage         (로그인)
/#/signup                    → SignupPage         (회원가입)
/#/forgot-password           → ForgotPasswordPage
/#/reset-password            → ResetPasswordPage (?uid=X&token=Y)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ 로그인 후 진입 가능 ━━━━━━━━━━━━━━━
/#/dashboard                 → DashboardPage     (내 데이터셋 목록)
/#/datasets/upload           → UploadPage        (파일 업로드)
/#/datasets/:id              → DatasetDetailPage (메타데이터 + 미리보기)
/#/datasets/:id/visualize    → VisualizePage     (차트 생성 및 조회)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ 관리자 전용 ━━━━━━━━━━━━━━━━━━━━━━━
/#/admin                     → AdminPage         (사용자 + 데이터셋 관리)
*                            → /#/main 리다이렉트
```

---

## 3. 화면 구성

### 3-1. MainPage (`/#/main`)
**목적**: 서비스 소개 + 로그인/회원가입 유도

**구성 요소**:
- 서비스 로고 및 한 줄 소개 문구
- "로그인" / "회원가입" 버튼
- 서비스 핵심 기능 소개 (아이콘 3개: 업로드 / 탐색 / 시각화)

---

### 3-2. LoginPage (`/#/login`)
**목적**: 사용자 인증 (기존 구현)

**구성 요소**:
- username / password 입력
- 로그인 버튼
- "회원가입" / "비밀번호 찾기" 링크

**로직**:
- 성공 → `localStorage.access_token` 저장 → `/#/dashboard` 이동
- 실패 → Toast 에러 메시지

---

### 3-3. DashboardPage (`/#/dashboard`)
**목적**: 내 데이터셋 목록 + 빠른 업로드 진입

**구성 요소**:
- 상단 네비게이션 바 (로고, 사용자명, 로그아웃, 관리자 메뉴)
- "새 데이터셋 업로드" 버튼 (→ `/#/datasets/upload`)
- 데이터셋 카드 그리드
  - 카드: 이름, 파일 타입 뱃지, 행/컬럼 수, 업로드일, 공개 여부
  - 카드 클릭 → `/#/datasets/:id`
  - 카드 삭제 버튼 (확인 모달)
- 검색 입력 (이름 필터)
- "내 것만 보기 / 공개 포함" 토글
- 페이지네이션

**상태**:
```
datasets: Dataset[]
loading: boolean
page: number
search: string
mineOnly: boolean
```

---

### 3-4. UploadPage (`/#/datasets/upload`)
**목적**: 파일 업로드 및 데이터셋 이름·설명 입력

**구성 요소**:
- 드래그 앤 드롭 업로드 존 (또는 클릭 선택)
  - 허용 확장자: `.csv`, `.xlsx`, `.json`
  - 최대 크기: 50MB
  - 선택된 파일명 / 크기 표시
- 데이터셋 이름 입력 (기본값: 파일명)
- 설명 입력 (textarea)
- 공개 여부 토글
- "업로드" 버튼
- 업로드 진행 표시 (프로그레스 바 또는 스피너)

**업로드 흐름**:
```
파일 선택 → 클라이언트 검증 (확장자, 크기)
    ↓
POST /datasets/ (multipart/form-data)
    ↓ 성공
Toast "업로드 완료" → /#/datasets/:id 이동
    ↓ 실패
Toast 에러 메시지
```

---

### 3-5. DatasetDetailPage (`/#/datasets/:id`)
**목적**: 데이터셋 메타정보 + 데이터 테이블 미리보기

**구성 요소**:

**상단 메타데이터 섹션**:
- 데이터셋 이름 (인라인 편집 가능)
- 설명 (인라인 편집)
- 뱃지: 파일 타입 / 행 수 / 컬럼 수 / 공개 여부
- "시각화 →" 버튼 (→ `/#/datasets/:id/visualize`)
- 삭제 버튼

**컬럼 정보 패널** (접기/펼치기):
- 컬럼명 / 타입 / NULL 수 / 고유값 수 / 샘플값 테이블

**데이터 미리보기 테이블**:
- 고정 헤더, 가로 스크롤
- 컬럼 클릭 → 정렬 (asc/desc 토글)
- 상단 필터 바: 컬럼 선택 → 조건 → 값 입력
- 페이지네이션 (50행씩)
- 행 수 선택 (50 / 100 / 200)

**상태**:
```
dataset: DatasetMeta
columns: ColumnInfo[]
rows: any[][]
page: number
sortBy: string | null
sortDir: 'asc' | 'desc'
filters: Filter[]
loading: boolean
```

---

### 3-6. VisualizePage (`/#/datasets/:id/visualize`)
**목적**: 차트 생성 + 저장된 차트 조회

**구성 요소**:

**차트 설정 패널 (왼쪽)**:
- 차트 유형 선택 (막대 / 선 / 파이 / 산점도 / 히스토그램)
- X축 컬럼 드롭다운
- Y축 컬럼 드롭다운 (파이 제외)
- 차트 제목 입력
- 색상 선택 (프리셋 6가지)
- "차트 생성" / "저장" 버튼

**차트 미리보기 (오른쪽)**:
- Recharts 컴포넌트로 렌더링
- 차트 유형에 따라 컴포넌트 전환

**저장된 차트 목록 (하단)**:
- 카드 형태로 나열
- 클릭 → 설정 패널에 불러오기
- 삭제 버튼

---

### 3-7. AdminPage (`/#/admin`)
**목적**: 관리자 전용 사용자·데이터셋 관리

**접근 제어**: `user.role !== 'admin'`이면 `/#/dashboard`로 리다이렉트

**탭 구성**:

**탭 1 - 사용자 관리**:
- 전체 사용자 테이블 (id / username / email / role / is_active / 가입일)
- 역할 변경 드롭다운 (user ↔ admin)
- 활성화/비활성화 토글
- 사용자 삭제 버튼

**탭 2 - 데이터셋 관리**:
- 전체 데이터셋 테이블 (id / 이름 / 소유자 / 파일타입 / 행수 / 공개여부 / 생성일)
- 삭제 버튼

---

## 4. 공통 컴포넌트

| 컴포넌트 | 위치 | 역할 |
|---------|------|------|
| `Navbar` | components/common/ | 상단 네비게이션 (로고, 사용자명, 로그아웃) |
| `ProtectedRoute` | components/common/ | 미인증 시 /login 리다이렉트 |
| `AdminRoute` | components/common/ | 비관리자 시 /dashboard 리다이렉트 |
| `DataTable` | components/common/ | 정렬·필터·페이지네이션이 있는 범용 테이블 |
| `Modal` | components/common/ | 확인/취소 모달 |
| `Badge` | components/common/ | 파일 타입, 역할 등 뱃지 |
| `Spinner` | components/common/ | 로딩 인디케이터 |
| `DropZone` | components/upload/ | 드래그 앤 드롭 파일 선택 |
| `ChartRenderer` | components/chart/ | chart_type에 따라 Recharts 컴포넌트 선택 |

---

## 5. API 레이어 구조

```
src/api/
├── request.js      # fetch 래퍼 (Authorization 헤더, 에러 처리) - 기존
├── address.js      # 엔드포인트 URL 상수 - 기존 + 확장
├── auth.js         # signup, login, forgot_password, reset_password - 기존
├── datasets.js     # uploadDataset, listDatasets, getDataset,
│                   # deleteDataset, previewDataset, getColumnStats  (신규)
├── charts.js       # createChart, listCharts, getChartData,
│                   # deleteChart  (신규)
└── admin.js        # listUsers, updateUser, deleteUser,
                    # listAllDatasets  (신규)
```

### address.js 확장 예시
```js
export const API = {
  // 기존
  SIGNUP:           '/accounts/signup/',
  LOGIN:            '/accounts/login/',
  FORGOT_PASSWORD:  '/accounts/forgot-password/',
  RESET_PASSWORD:   '/accounts/reset-password/',
  // 신규
  DATASETS:         '/datasets/',
  DATASET:          (id) => `/datasets/${id}/`,
  DATASET_PREVIEW:  (id) => `/datasets/${id}/preview/`,
  DATASET_COLUMNS:  (id, col) => `/datasets/${id}/columns/${col}/`,
  DATASET_CHARTS:   (id) => `/datasets/${id}/charts/`,
  CHART:            (id, cid) => `/datasets/${id}/charts/${cid}/`,
  ADMIN_USERS:      '/admin/users/',
  ADMIN_USER:       (id) => `/admin/users/${id}/`,
  ADMIN_DATASETS:   '/admin/datasets/',
};
```

---

## 6. 전역 상태 설계

`src/context/AuthContext.js` (신규):
```js
{
  user: { id, username, role } | null,
  accessToken: string | null,
  login(token, user) {},
  logout() {},
}
```

- 앱 시작 시 `localStorage.access_token` 읽어 JWT decode → user 세팅
- `ProtectedRoute`: `user === null`이면 `/login` 리다이렉트
- `AdminRoute`: `user.role !== 'admin'`이면 `/dashboard` 리다이렉트

---

## 7. 디렉토리 구조 (추가 예정)

```
src/
├── api/
│   ├── request.js          # 기존
│   ├── address.js          # 기존 + 확장
│   ├── auth.js             # 기존
│   ├── datasets.js         # 신규
│   ├── charts.js           # 신규
│   └── admin.js            # 신규
├── context/
│   └── AuthContext.js      # 신규
├── components/
│   ├── common/
│   │   ├── Navbar.js       # 신규
│   │   ├── ProtectedRoute.js  # 신규
│   │   ├── AdminRoute.js      # 신규
│   │   ├── DataTable.js       # 신규
│   │   ├── Modal.js           # 신규
│   │   ├── Badge.js           # 신규
│   │   └── Spinner.js         # 신규
│   ├── upload/
│   │   └── DropZone.js        # 신규
│   ├── chart/
│   │   └── ChartRenderer.js   # 신규
│   ├── MainPage.js         # 기존
│   ├── LoginPage.js        # 기존
│   ├── SignupPage.js       # 기존
│   ├── ForgotPasswordPage.js  # 기존
│   ├── ResetPasswordPage.js   # 기존
│   ├── DashboardPage.js    # 신규
│   ├── UploadPage.js       # 신규
│   ├── DatasetDetailPage.js   # 신규
│   ├── VisualizePage.js    # 신규
│   └── AdminPage.js        # 신규
├── constants/
│   └── constants.js        # 기존
├── App.js                  # 기존 + 라우트 추가
└── index.js                # 기존
```

---

## 8. 추가 패키지

| 패키지 | 용도 |
|-------|------|
| `recharts` | 차트 렌더링 (막대/선/파이/산점도/히스토그램) |
| `jwt-decode` | 클라이언트 측 JWT payload 파싱 (role 추출) |

```bash
npm install recharts jwt-decode
```

---

## 9. 구현 우선순위

| 단계 | 기능 | 비고 |
|------|------|------|
| 1 | AuthContext + ProtectedRoute | 이후 모든 페이지의 기반 |
| 2 | Navbar (공통 레이아웃) | 모든 인증 후 페이지에 삽입 |
| 3 | DashboardPage (목록) | API 연동 전 목 데이터로 먼저 구현 가능 |
| 4 | UploadPage (드래그앤드롭 + API) | 핵심 기능 |
| 5 | DatasetDetailPage (테이블 미리보기) | DataTable 컴포넌트 재사용 |
| 6 | VisualizePage (Recharts) | ChartRenderer 컴포넌트 분리 |
| 7 | AdminPage | 마지막 단계 |

---

## 10. 스타일 가이드 (기존 확장)

### 색상 팔레트
| 역할 | 값 |
|------|-----|
| 배경 (기본) | `#0f0f11` |
| 배경 (카드) | `#18181b` |
| 배경 (입력) | `#1b1b1d` |
| 강조 (Primary) | `#4f83cc` |
| 성공 | `#22c55e` |
| 경고 | `#f59e0b` |
| 에러 | `#ef4444` |
| 텍스트 (기본) | `#f4f4f5` |
| 텍스트 (서브) | `#a1a1aa` |

### 파일 타입 뱃지 색상
| 타입 | 색상 |
|------|------|
| CSV | `#22c55e` (green) |
| XLSX | `#3b82f6` (blue) |
| JSON | `#f59e0b` (amber) |
