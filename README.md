# 🎞️ MFLIX

## 📋 SOMMAIRE
- [INTRODUCTION](#-introduction)
- [TECHNOS](#-technos)
- [REQUIREMENTS](#-requirements)
- [ARCHITECTURE](#-architecture)
- [DOCUMENTATIONS](#-documentations)
- [GETTING STARTED](#-getting-started)
- [MONGODB ATLAS SETUP](#-mongodb-atlas-setup)
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
├── dataset/
│   ├── collections files
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

Generate two robust tokens (64 characters, uppercase, lowercase, numbers but without special characters) with this online tool =>  
[Token Generator](https://it-tools.tech/token-generator)  

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

## 🧳 MONGODB ATLAS SETUP
As part of the Mflix ​​project, the use of MongoDB Atlas and Vercel was chosen to provide a scalable, secure, and high-performance solution tailored to the application's needs.  
MongoDB Atlas, as a managed database service in the cloud, allows for simplified management and automatic data scalability, while ensuring high availability and advanced security mechanisms.  
It also provides us with real-time monitoring and performance management tools, essential for a high-demand project like Mflix.  

**1. Create an account**  

[Link to create an account on MongoDB Atlas](https://www.mongodb.com/fr-fr/cloud/atlas/register)  

**2. Create a cluster**  

![Create Cluster](https://github.com/EmmanuelLefevre/MarkdownImg/blob/main/mongo_atlas_create_cluster.png)  

**3. Deploy the cluster**  

![Deploy Cluster](https://github.com/EmmanuelLefevre/MarkdownImg/blob/main/mongo_atlas_deploy_cluster.png)  

**4. Link cluster to your tool choice**  

![Link Cluster Tool Choice](https://github.com/EmmanuelLefevre/MarkdownImg/blob/main/mongo_atlas_connect.png)  

**5. Choose your favorite tool**  

![Choose Favorite Tool](https://github.com/EmmanuelLefevre/MarkdownImg/blob/main/mongo_atlas_connection_method.png)  

**6. Copy your string connection**  

![Copy String Connection](https://github.com/EmmanuelLefevre/MarkdownImg/blob/main/mongo_atlas_string_connection.png)  

**7. Add a user ("Database Access" tab)**  

![Add User](https://github.com/EmmanuelLefevre/MarkdownImg/blob/main/mongo_atlas_add_user.png)  

**8. Setup user password**  

![Set User Password](https://github.com/EmmanuelLefevre/MarkdownImg/blob/main/mongo_atlas_set_password.png)  

**9. Load the dataset “sample_mflix”**  

![Load Dataset](https://github.com/EmmanuelLefevre/MarkdownImg/blob/main/mongo_atlas_load_dataset.png)  

**10. Optional**  
Allow all IP addresses for connection from the application layer (Network Access).  
⚠️⚠️⚠️ Be careful, this practice is dangerous and reprehensible in business. ⚠️⚠️⚠️  

## ⚡ MISCELLANEOUS
**Queries in Compass, examples =>**  

![Find a Film](https://github.com/EmmanuelLefevre/MarkdownImg/blob/main/compass_find_film.png)  

![Find a Theater](https://github.com/EmmanuelLefevre/MarkdownImg/blob/main/compass_find_theater.png)  

![Find a Comment by Id](https://github.com/EmmanuelLefevre/MarkdownImg/blob/main/compass_find_comment_by_id.png)  

**Dataset**  
All collections are available in the dataset folder in case it needs to be integrated into another DBMS.  
```bash
Copy-Item -Path ".\dataset" -Destination "$env:USERPROFILE\Downloads" -Recurse
```

## 🧪 UNIT TESTS
```bash
npm run test
```
```bash
yarn test
```
## 🏭 PRE PRODUCTION
**Test if API is build correctly on local environment**
```bash
yarn build
```

## 🛒 PRODUCTION
Vercel is a deployment platform optimized for modern applications such as those built with Next.js. It enables rapid deployment, automated environment management, and automatic optimizations to ensure optimal application performance.  
By combining MongoDB Atlas for data management and Vercel for deployment, we ensure a modern, reliable, and scalable cloud infrastructure that meets Mflix's security, performance, and cost requirements.  
Note also Vercel is the official developer and maintainer of Next.js, ensuring seamless integration and native optimizations for a seamless development experience.  

**1. Create an account**  
Connect yourself with your versioning tool !  

[Link to create an account on Vercel](https://vercel.com/signup)  

**2. Link your project with Vercel**  

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?project-name=with-mongodb&repository-name=with-mongodb&repository-url=https%3A%2F%2Fgithub.com%2Fvercel%2Fnext.js%2Ftree%2Fcanary%2Fexamples%2Fwith-mongodb&integration-ids=oac_jnzmjqM10gllKmSrG0SGrHOH)  

![Vercel Deploy](https://github.com/EmmanuelLefevre/MarkdownImg/blob/main/vercel_deploy.png)  

Next, check if you have nicely link your main/master branch with Vercel.  

![Vercel Branch](https://github.com/EmmanuelLefevre/MarkdownImg/blob/main/vercel_branch.png)  

**3. Configure JWT_SECRET and REFRESH_SECRET environment variables**  

![Setup Environment Variables](https://github.com/EmmanuelLefevre/MarkdownImg/blob/main/vercel_secrets.png)  

**4. Link to production =>**  
[Mflix](https://movies-pi-ruby.vercel.app/)  

**5. After being authenticated, you will be automatically redirected to the Swagger API documentation =>**  
[Mflix Swagger Documentation](https://movies-pi-ruby.vercel.app/api-doc)  

***

⭐⭐⭐ I hope you enjoy it, if so don't hesitate to leave a like on this repository and on the [Dotfiles](https://github.com/EmmanuelLefevre/Dotfiles) one (click on the "Star" button at the top right of the repository page). Thanks 🤗
