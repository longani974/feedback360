# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

-   [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
-   [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

-   Configure the top-level `parserOptions` property like this:

```js
export default {
    // other rules...
    parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        project: ['./tsconfig.json', './tsconfig.node.json'],
        tsconfigRootDir: __dirname,
    },
};
```

-   Replace `plugin:@typescript-eslint/recommended` to `plugin:@typescript-eslint/recommended-type-checked` or `plugin:@typescript-eslint/strict-type-checked`
-   Optionally add `plugin:@typescript-eslint/stylistic-type-checked`
-   Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and add `plugin:react/recommended` & `plugin:react/jsx-runtime` to the `extends` list
    #   f e e d b a c k 3 6 0 
     
     #   f e e d b a c k 3 6 0 
     
     

```
feedback360
├─ .eslintrc.cjs
├─ .firebaserc
├─ .git
├─ .gitignore
├─ components.json
├─ firebase.json
├─ functions
│  ├─ .eslintrc.js
│  ├─ .gitignore
│  ├─ lib
│  │  ├─ index.js
│  │  └─ index.js.map
│  ├─ package-lock.json
│  ├─ package.json
│  ├─ src
│  │  └─ index.ts
│  ├─ tsconfig.dev.json
│  └─ tsconfig.json
├─ index.html
├─ package-lock.json
├─ package.json
├─ postcss.config.js
├─ public
│  └─ vite.svg
├─ README.md
├─ src
│  ├─ App.css
│  ├─ App.tsx
│  ├─ assets
│  │  └─ react.svg
│  ├─ components
│  │  ├─ AuthForm.tsx
│  │  ├─ SideBar.tsx
│  │  ├─ SideBarMobile.tsx
│  │  └─ ui
│  │     ├─ avatar.tsx
│  │     ├─ button.tsx
│  │     ├─ card.tsx
│  │     ├─ drawer.tsx
│  │     ├─ dropdown-menu.tsx
│  │     ├─ input.tsx
│  │     ├─ navigation-menu.tsx
│  │     ├─ shared
│  │     │  ├─ Footer.tsx
│  │     │  └─ Header.tsx
│  │     └─ sheet.tsx
│  ├─ context
│  │  └─ AuthContext.tsx
│  ├─ firebase.ts
│  ├─ hooks
│  │  └─ useAuth.ts
│  ├─ index.css
│  ├─ layouts.tsx
│  │  ├─ DashboardLayout.tsx
│  │  ├─ ProtectedRoutes.tsx
│  │  └─ PublicLayout.tsx
│  ├─ lib
│  │  ├─ authUtils.ts
│  │  ├─ schemas.ts
│  │  └─ utils.ts
│  ├─ main.tsx
│  ├─ routes
│  │  ├─ AnswerFeedback.tsx
│  │  ├─ CreateFeedback.tsx
│  │  ├─ Dashboard.tsx
│  │  ├─ FeedbackList.tsx
│  │  ├─ Home.tsx
│  │  ├─ NewOrganisation.tsx
│  │  ├─ Report.tsx
│  │  ├─ Signin.tsx
│  │  ├─ Signup.tsx
│  │  ├─ UserProfile.tsx
│  │  └─ ViewFeedback.tsx
│  ├─ schemas
│  │  └─ firestoreSchela.ts
│  ├─ utils.ts
│  └─ vite-env.d.ts
├─ tailwind.config.js
├─ tsconfig.app.json
├─ tsconfig.json
├─ tsconfig.node.json
└─ vite.config.ts

```
