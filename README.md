# 🎞️ MFLIX

## 📋 SOMMAIRE
- [INTRODUCTION](#-introduction)
- [TECHNOS](#-technos)
- [REQUIREMENTS](#-requirements)
- [ARCHITECTURE](#-architecture)
- [DOCUMENTATIONS](#-documentations)
- [GETTING STARTED](#-getting-started)
- [MISCELLANEOUS](#-miscellaneous)
- [UNIT TESTS](#-unit-tests)
- [PRE PRODUCTION](#-pre-production)
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
- **Sass**
- **Tailwind**: 3.4.17
- **Jest**: 29.7.0
- **JWT**: 9.0.2
- **Bcrypt**: 3.0.2
- **Dotenv**: 16.4.7

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

**Sass**
- [Sass 3.4.17 Documentation](https://sass-lang.com/documentation/)  

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

**Dotenv**
- [Dotenv Documentation](https://www.npmjs.com/package/dotenv)  

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
│   │   │   │   │   ├── [idComment]/
│   │   │   │   │   │   ├── route.ts
│   │   │   │   │   ├── route.ts
│   │   │   │   ├── route.ts
│   │   │   ├── route.ts
│   │   ├── theaters/
│   │   │   ├── [idTheater]/
│   │   │   │   ├── route.ts
│   │   │   ├── route.ts
│   │   ├── users/
│   │   │   ├── [idUser]/
│   │   │   │   ├── route.ts
│   ├── api-doc/
│   │   ├── page.tsx
│   │   ├── react-swagger.tsx
│   ├── favicon.ico
│   ├── layout.tsx
├── lib/
│   ├── interfaces/
│   │   ├── api-interfaces.ts
│   ├── check-collection-exists.ts
│   ├── jwt-secrets-config.ts
│   ├── mongodb.ts
│   ├── swagger.ts
├── pages/
│   ├── index.tsx
│   ├── login.tsx
├── public/
│   ├── fonts/
│   │   ├── roboto files
│   ├── styles/
│   │   ├── global.scss
│   │   ├── globals.css
├── .env.local
├── .env.local.example
├── .gitignore
├── middleware.ts
├── next-env.d.ts
├── next.config.js
├── package.json
├── postcss.config.js
├── README.md
├── tailwind.config.ts
├── tsconfig.json
├── yarn.lock
```

## 🚀 GETTING STARTED
**1. Install libraries (⚠️ place yourself in Mflix directory !!!)**
```bash
npm install
```
```bash
yarn install
```
**2. Set up .env.local file**
Use the .env.local.example to setup your configuration.

**3. MongoDB Atlas**

**4. Launch the project locally**
```bash
npm run dev
```
```bash
yarn dev
```
[Open Project on Localhost](http://localhost:3000)  

**5.Open online Swagger documentation**  

[Online Swagger Documentation](http://localhost:3000/api-doc)  

**6. Vercel setup**


## ⚡ MISCELLANEOUS
**Query in Compass examples =>**

![Find a Film](https://github.com/EmmanuelLefevre/MarkdownImg/blob/main/compass_find_film.png)  

![Find a Theater](https://github.com/EmmanuelLefevre/MarkdownImg/blob/main/compass_find_theater.png)  

## 🧪 UNIT TESTS
```bash
npm run test
```
```bash
yarn test
```
## 🛒 PRE PRODUCTION
**Test if API is build correctly**
```bash
yarn build
```

## 🛒🛒 PRODUCTION
**1. Configure JWT_SECRET and REFRESH_SECRET environment variables on Vercel**  

![Setup Environment Variables](https://github.com/EmmanuelLefevre/MarkdownImg/blob/main/vercel_secrets.png)  

**2. Link to production =>**  
[Mflix](https://mflix.vercel.app/)  

**3. After being authenticated, you will be automatically redirected to the Swagger API documentation =>**  
[Mflix](https://mflix.vercel.app/api-doc)  

***

⭐⭐⭐ I hope you enjoy it, if so don't hesitate to leave a like on this repository and on the [Dotfiles](https://github.com/EmmanuelLefevre/Dotfiles) one (click on the "Star" button at the top right of the repository page). Thanks 🤗
