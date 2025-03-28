
# 🎞️ MFLIX

## 📋 SOMMAIRE
- [INTRODUCTION](#-introduction)
- [TECHNOS](#-technos)
- [REQUIREMENTS](#-requirements)
- [ARCHITECTURE](#-architecture)
- [DOCUMENTATIONS](#-documentations)
- [GETTING STARTED](#-getting-started)
- [UNIT TESTS](#-unit-tests)
- [PRODUCTION](#-production)

## 👋 INTRODUCTION
This project aims to redesign the server and database architecture of the MFLIX application, an online platform providing cinematic information. Currently, all data is stored on internal physical servers. However, for cost and security reasons, migrating to a Cloud infrastructure is necessary.​  

The goals of this migration are to : 
- Deploy MongoDB in the Cloud, ensuring a smooth transition of existing data.​
- Design and implement a REST API to facilitate communication between the database and the existing front-end.​
- Ensure a scalable, secure, and high-performance architecture to meet the application's needs.​
- Provide clear and interactive API documentation using Swagger, simplifying its usage and integration.
- Implementation of a JWT middleware to secure certain API routes (/movies and /theaters): A middleware is implemented to verify JWT (JSON Web Tokens) on specific API routes, ensuring that only authenticated and authorized requests can access sensitive resources, thereby enhancing the security of the application.​  

This repository contains all the resources and instructions necessary to establish this new architecture.

## 💻 TECHNOS
- **Next.js**: 15.2.4
- **MongoDB**
- **MongoDB Atlas**
- **Vercel**
- **Swagger**: 3.0
- **Typescript**: 5.0
- **Tailwind**: 3.4.17
- **Jest**: 29.7.0
- **JWT**: 9.0.2
- **Bcrypt**: 3.0.2

## 📚 REQUIREMENTS
- NodeJS <= 20.18.0  

[Download NodeJS](https://nodejs.org/fr/download)  

- Optional  

Switch to minimum version with NVM tool =>  
```bash
nvm install 20.18.0
```
Then :  
```bash
nvm use 20.18.0
```
[NVM Personnal Documentation](https://github.com/EmmanuelLefevre/Documentations/blob/master/Personnal%20Cheatsheets/nvm_cheatsheets.md)

## 📃 DOCUMENTATIONS
**Next.js**
- [Next.js Documentation](https://nextjs.org/docs/app/getting-started)
- [Next.js Deployment Documentation](https://nextjs.org/docs/deployment)  

**MongoDB**
- [MongoDB Documentation](https://docs.mongodb.com/)  

**MongoDB Atlas**
- [MongoDB Atlas Documentation](https://mongodb.com/atlas)
- [MongoDB Atlas for free](https://www.mongodb.com/fr-fr/cloud/atlas/register)  

**Vercel**
- [Vercel Documentation](https://vercel.com/docs)
- [Vercel Import Git Repository](https://vercel.com/new)
- [Vercel Deploy Documentation](https://vercel.com/docs/deployments)  

**Swagger**
- [Swagger Documentation](https://swagger.io/docs/)  

**NodeJS**
- [NodeJS Documentation](https://nodejs.org/docs/latest/api/)
- [NodeJS 20.18.0 Release Notes](https://nodejs.org/fr/blog/release/v20.18.0)  

**Tailwind**
- [Tailwind 3.4.17 Documentation](https://v3.tailwindcss.com/docs/installation)  

**Jest**
- [Jest Documentation](https://jestjs.io/docs/getting-started)  

**Typescript**
- [Typescript Documentation](https://www.typescriptlang.org/docs/)
- [Typescript 5.0 Release Notes](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-0.html)  

**JWT**
- [JWT Documentation](https://www.npmjs.com/package/jsonwebtoken)  

**Bcrypt**
- [Bcrypt Documentation](https://www.npmjs.com/package/bcrypt)  

**NVM**
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
│   │   │   │   ├── comments/
│   │   │   │   │   ├── [idComments]/
│   │   │   │   │   │   ├── route.ts
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
├── middleware.ts
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
**1. Install libraries (⚠️ place oneself in Mflix directory !!!)**
```bash
npm install
```
```bash
yarn install
```
**2. MongoDB Atlas**

**3. Launch the project locally**
```bash
npm run dev
```
```bash
yarn dev
```
[Open Project on Localhost](http://localhost:3000)  

**4.Open online Swagger documentation**  

[Online Swagger Documentation](http://localhost:3000/api-doc)  

## 🧪 UNIT TESTS
```bash
npm run test
```
```bash
yarn test
```

## 🛒 PRODUCTION

***

⭐⭐⭐ I hope you enjoy it, if so don't hesitate to leave a like on this repository and on the [Dotfiles](https://github.com/EmmanuelLefevre/Dotfiles) one (click on the "Star" button at the top right of the repository page). Thanks 🤗
