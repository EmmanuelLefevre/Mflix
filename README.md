
# 🎞️ MFLIX

## 📋 SOMMAIRE
- [INTRODUCTION](#-introduction)
- [TECHNOS](#-technos)
- [REQUIREMENTS](#-requirements)
- [ARCHITECTURE](#-architecture)
- [DOCUMENTATIONS](#-documentations)
- [GETTING STARTED](#-getting-started)
- [TESTS UNITAIRES](#-tests-unitaires)
- [PRODUCTION](#-production)

## 👋 INTRODUCTION
Ce projet a pour objectif la refonte de l'architecture serveur et base de données de l'application MFLIX, une plateforme fournissant des informations cinématographiques en ligne. Actuellement, toutes les données sont stockées sur des serveurs physiques internes, mais pour des raisons de coût et de sécurité, une migration vers une infrastructure Cloud est nécessaire.  

L'objectif de cette migration est de :  
- Déployer MongoDB dans le Cloud, en assurant une migration fluide des données existantes.
- Concevoir et mettre en place une API REST permettant la communication entre la base de données et le front-end existant.
- Garantir une architecture scalable, sécurisée et performante pour répondre aux besoins de l'application.
- Fournir une documentation claire et interactive de l’API grâce à Swagger, facilitant son utilisation et son intégration.  

Ce dépôt contient toutes les ressources et instructions nécessaires à la mise en place de cette nouvelle architecture.

## 💻 TECHNOS
- **Next.js**: 15.2.4
- **MongoDB**
- **MongoDB Atlas**
- **Vercel**
- **Swagger**
- **Typescript**: 5.0
- **Tailwind**: 3.4.17
- **Jest**: 29.7.0

## 📚 REQUIREMENTS
- NodeJS <= 20.18.0  
[Download NodeJS](https://nodejs.org/fr/download)  

- Optional  
Switch to minimum version with NVM tool =>  
```bash
nvm use 20.18.0
```

## 📃 DOCUMENTATIONS
**1. Next.js**
- [Next.js Documentation](https://nextjs.org/docs/app/getting-started)
- [Next.js Deployment Documentation](https://nextjs.org/docs/deployment)

**2. MongoDB**
- [MongoDB Documentation](https://docs.mongodb.com/)  

**3. MongoDB Atlas**
- [MongoDB Atlas Documentation](https://mongodb.com/atlas)
- [MongoDB Atlas for free](https://www.mongodb.com/fr-fr/cloud/atlas/register)  

**4. Vercel**
- [Vercel Documentation](https://vercel.com/docs)
- [Vercel Import Git Repository](https://vercel.com/new)
- [Vercel Deploy Documentation](https://vercel.com/docs/deployments)  

**5. Swagger**
- [Swagger Documentation](https://swagger.io/docs/)  

**5. NodeJS**
- [NodeJS Documentation](https://nodejs.org/docs/latest/api/)  

**6. Tailwind**
- [Tailwind 3.4.17 Documentation](https://v3.tailwindcss.com/docs/installation)  

**7. Jest**
- [Jest Documentation](https://jestjs.io/docs/getting-started)  

**8. Typescript**
- [Typescript Documentation](https://www.typescriptlang.org/docs/)
- [Typescript 5.0 Release Notes](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-0.html)  

**9. NVM**
- [NVM Documentation](https://github.com/nvm-sh/nvm)  

## 🏗 ARCHITECTURE
```bash
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── login/
│   │   │   │   ├── route.ts
│   │   │   ├── logout/
│   │   │   │   ├── route.ts
│   │   │   ├── refresh-token/
│   │   │   │   ├── route.ts
│   │   │   ├── register/
│   │   │   │   ├── route.ts
│   │   ├── movies/
│   │   │   ├── [idMovie]/
│   │   │   │   ├── route.ts
│   │   │   ├── comments/
│   │   │   │   ├── [idComments]/
│   │   │   │   │   ├── route.ts
│   │   │   │   ├── route.ts
│   │   │   ├── route.ts
│   │   ├── theaters/
│   │   │   ├── [idTheater]/
│   │   │   │   ├── route.ts
│   │   │   ├── route.ts
│   ├── api-doc/
│   │   │   ├── page.tsx
│   │   │   ├── react-swagger.tsx
│   ├── app-demo/
│   │   │   ├── page.tsx
│   ├── actions.ts
│   ├── favicon.ico
│   ├── layout.tsx
├── lib/
│   ├── mongodb.ts
│   ├── swagger.ts
├── pages/
│   ├── _app.tsx
│   ├── _document.tsx
│   ├── index.tsx
├── public/
│   ├── svg files
├── styles/
│   ├── globals.css
├── .env.local
├── .gitignore
├── next-env.d.ts
├── next.config.js
├── package.lock.json
├── package.json
├── postcss.config.js
├── readme.md
├── tailwind.config.ts
├── tsconfig.json
```

## 🚀 GETTING STARTED
**1. Installer les librairies (⚠️ se placer dans le répertoire Mflix !!!)**
```bash
npm install
```
```bash
yarn install
```
**2. MongoDB Atlas**

**3. Lancer le projet en local**
```bash
npm run dev
```
```bash
yarn dev
```
[Open Project on Localhost](http://localhost:3000)  

**4. Ouvrir la doc Swagger**
[Online Swagger Documentation](http://localhost:3000/api-doc)  

## 🧪 TESTS UNITAIRES
```bash
npm run test
```
```bash
yarn test
```

## 🛒 PRODUCTION


***

⭐⭐⭐ I hope you enjoy it, if so don't hesitate to leave a like on this repository and on the [Dotfiles](https://github.com/EmmanuelLefevre/Dotfiles) one (click on the "Star" button at the top right of the repository page). Thanks 🤗
