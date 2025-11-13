# 🚀 Data Explorer — Frontend

A modern, dark-themed React frontend built for login-based data services.  
This project provides a clean authentication flow, beautiful UI animations,  
and robust error handling using a global ErrorBoundary with a custom 404 robot illustration.

---

## 🌙 Preview
![메인 페이지](./public/images/total_image.png)


### **Global ErrorBoundary Screen**
When an unexpected error occurs, the system displays a custom robot illustration:

<p align="center">
  <img src="./public/images/error-occured.png" width="280px" alt="Error Robot"/>
</p>

---

## 🔧 Tech Stack

| Category | Technology |
|---------|------------|
| Framework | **React 18** |
| Routing | **React Router v6 (HashRouter)** |
| Styling | **Tailwind CSS** |
| State | React Hooks |
| HTTP | Custom Fetch/Axios APIs |
| Error Handling | Custom **ErrorBoundary** |
| Notification | Optional: react-toastify |

---

## 🎨 UI Features

### 🌑 **Dark Themed UI**
- Full dark-mode design using Tailwind utility classes
- Smooth fade-in animations on all pages
- Clean and distraction-free layout

### 🔐 **Authentication Pages**
- Login page
- Sign up page
- Forgot password page (API integrated)
- All pages centered and responsive

### ⚠️ **Global ErrorBoundary**
- Displays a custom “broken robot” 404/500 illustration
- Hover → “Go Home” text appears smoothly
- Clicking the robot sends the user back to `/main`

---

## 🛠 Environment Versions

이 프로젝트는 아래 환경에서 개발 및 테스트되었습니다.

| Component | Version |
|----------|---------|
| **Node.js** | 22.16.0 |

### ⚙️ Recommended Development Stack
- **VSCode + Tailwind IntelliSense 플러그인**
- Browers: Chrome 최신 버전 (권장)

---

## 📂 Node / npm 버전 확인 방법

```bash
node -v
npm -v
```

## libray version & install
```bash
npm install react-router-dom react-toastify
"react-router-dom": "^7.9.5",
"react-toastify": "^11.0.5",

npm install -D tailwindcss@3 postcss autoprefixer
```