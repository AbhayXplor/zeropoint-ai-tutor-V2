# ZeroPoint AI: Math Prerequisite Detector

ZeroPoint AI is an advanced educational tool designed to help students preparing for the JEE (Joint Entrance Examination) in Mathematics. It analyzes a math problem, concept, or solution to identify the hidden prerequisite knowledge required for understanding. By generating a detailed analysis, micro-lessons, and interactive tests, it bridges knowledge gaps and provides a clear learning path to mastery.

This project leverages the power of the Google Gemini API to deconstruct complex topics into their foundational components, creating a personalized and efficient learning experience.

 <!-- It's highly recommended to replace this with an actual screenshot of your app! -->

---

## ✨ Key Features

-   **🤖 AI-Powered Assumption Detection:** Identifies critical, helpful, and advanced concepts a student is assumed to know.
-   **🗺️ Interactive Knowledge Graph:** Visually maps the dependencies between the target concept and its prerequisites, color-coded by severity.
-   **📚 Dynamic Micro-Lessons:** Generates concise, focused lessons for each prerequisite, complete with practice questions and answers.
-   **📝 Interactive Gap Tests:** Creates multiple-choice questions to help students self-assess their understanding of key concepts.
-   **📊 At-a-Glance Metrics:** Provides a dashboard summarizing the analysis, including the number of assumptions found and an estimated time to mastery.
-   **🚀 Clear Learning Path:** Suggests a step-by-step sequence for mastering the required concepts.

## 🛠️ Tech Stack

-   **Frontend:** React, TypeScript, Tailwind CSS
-   **AI Engine:** Google Gemini API (`gemini-2.5-flash`)
-   **Hosting:** Deploys easily on platforms like Vercel or Netlify

---

## 🚀 Getting Started

Follow these instructions to set up and run the project locally.

### Prerequisites

-   Node.js (v18 or later recommended)
-   A package manager like `npm`, `yarn`, or `pnpm`
-   A Google Gemini API Key. You can get one from [Google AI Studio](https://aistudio.google.com/app/apikey).

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/zeropoint-ai.git
cd zeropoint-ai
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

The application requires a Gemini API key to function.

1.  Create a new file named `.env` in the root of the project.
2.  Open the `.env` file and add your API key as shown below:

```
API_KEY=YOUR_GEMINI_API_KEY_HERE
```

The `.gitignore` file is already configured to prevent this file from being committed to the repository.

### 4. Run the Development Server

```bash
npm run dev
```

The application should now be running on `http://localhost:5173` (or another port if 5173 is busy).

## 🌐 Deployment

This project is built as a static site and can be deployed to any modern hosting provider. Vercel is highly recommended for its seamless integration with GitHub.

### Deploying with Vercel

1.  **Push your code to a public GitHub repository.**
2.  **Sign up for Vercel** with your GitHub account.
3.  **Import your project:** On your Vercel dashboard, click "Add New..." -> "Project" and select your repository.
4.  **Configure Environment Variables:**
    -   In the project settings, go to the "Environment Variables" section.
    -   Add a new variable with the name `API_KEY` and paste your Gemini API key as the value.
5.  **Deploy:** Click the "Deploy" button. Vercel will automatically build and host your application, providing you with a public URL.
