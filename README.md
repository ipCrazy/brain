# About the App

The goal of this app is to serve as a personal assistant, designed to be simple, intuitive, and easy to use. While it may require some setup and hardware, the app aims to function like a diary—though not exactly. Think of it as a diary enhanced with algorithms that help track your data. It's like a sophisticated reminder system, but with a touch of elegance.

The concept behind this app is to create a "second brain"—an extended memory for your real-life experiences. Whenever you forget something, you can always turn to this app, ask your personal AI, or simply search your database for the relevant information. The AI is a bonus, not the main focus.

This app is straightforward in its use, with a simple design, but the algorithms behind it are well-thought-out and logical. However, don't worry—nothing too complex! I will document everything here, from installation to deployment.

Feel free to reach out if you'd like to collaborate or have ideas for new features to add to the app. I'm always open to suggestions!

This version smooths out the phrasing, corrects some grammar, and adds a bit of polish to make the description clearer and more engaging.


### Terminal

`npx create-next-app@latest`

With this we are starting a new *Next.js* app


### Answers to  promts

What is your project named? **Name of your app**  
Would you like to use TypeScript? **YES**  
Would you like to use ESLint? **YES**  
Would you like to use Tailwind CSS? **YES**  
Would you like your code inside a `src/` directory? **NO**  
Would you like to use App Router? (recommended) **YES**  
Would you like to use Turbopack for `next dev`?  **NO**  
Would you like to customize the import alias (`@/*` by default)? **NO**  

### Edit files for first use

App/page.tsx ---> clean or return h1 ( Hello world )
global.css ---> add some padding  or play with colors to visualise changes

### Add basic functinalities/logc and test

*api/country/route.ts
*country/page.tsx

implement ollama structured output

npm install next-auth
(check  https://next-auth.js.org/getting-started/example )
npm install bcrypt - for password hashing
