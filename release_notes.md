### 📦 **Release Notes – v1.0.0 (Initial Release)**

**Date:** 25 February 2026  
**Version:** 1.0.0 – inaugural public release of **DevUtilityBox**

---

#### 🚀 Overview
This first release introduces a polished, utility‑focused web app built with **Vite**, **React + TypeScript** and a custom UI component library. DevUtilityBox is designed to provide developers with a suite of handy tools wrapped in a consistent, accessible interface.

---

#### ✅ Core Features

- **🧰 Utility Pages**
  - **Base64 Encoder/Decoder** (`Base64Tool.tsx`)
  - **JSON Editor** with syntax awareness (`JsonEditor.tsx`)
  - **JSON Formatter** for quick prettifying (`JsonFormatter.tsx`)
  - **JWT Decoder** to inspect tokens (`JwtDecoder.tsx`)
  - **List Comparator** for diffing arrays (`ListComparator.tsx`)
  - **Timezone Converter** to view times across zones (`TimezoneConverter.tsx`)
  - **404/Not‑Found** page for invalid routes (`NotFound.tsx`)

- **🧩 Component Library**
  - Reusable UI primitives under `src/components/ui/` covering buttons, forms, dialogs, tables, navigation, toasts, tooltips, and more.
  - Shared layout and navigation components (`Layout.tsx`, `NavLink.tsx`, `ToolCard.tsx`, `CookieConsent.tsx`) support rapid page composition.

- **🌗 Theming & State**
  - `ThemeContext.tsx` enables light/dark mode toggling throughout the app.
  - Hooks such as `useLocalStorage`, `use-toast`, and `use-mobile` for common behaviour.

- **⚙️ Utility Code**
  - Miscellaneous helpers in `src/lib/utils.ts`.

- **🛠 Testing**
  - Basic test setup (`test/setup.ts`) with an example spec (`example.test.ts`) using Vitest.

- **📄 Policies & Documentation**
  - Included documents like `README.md`, privacy/cookie/PWA policy files and other planning notes.

- **📦 Build & Config**
  - Configured with Vite, Tailwind CSS, ESLint, Vitest, TypeScript, and a simple SPA routing structure.

---

#### 📁 Project Structure Highlights

```
src/
├─ components/      ← UI and layout building blocks
├─ context/         ← global state (theme)
├─ hooks/           ← custom React hooks
├─ pages/           ← each utility tool/page
└─ lib/             ← general utilities
```

---

#### 📝 Notes

- This release establishes the foundation; more tools and enhancements are planned for future versions.
- All components are modular and can be extended or reused across new pages.

---

Thank you for exploring **DevUtilityBox**!  
Looking forward to your feedback as we build out v1.x 🚧✨
