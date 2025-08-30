# Installation Guide

This guide will walk you through the steps required to set up and run this Next.js application locally.

## Prerequisites

- Node.js (v18 or later recommended)
- npm or yarn

## 1. Clone the Repository

First, get the project code onto your local machine.

```bash
git clone <repository_url>
cd <repository_directory>
```

## 2. Install Dependencies

Install all the necessary npm packages.

```bash
npm install
```

## 3. Set Up Environment Variables

The application requires an API key for its AI features, which are powered by Google Gemini.

1.  **Copy the example environment file:**
    ```bash
    cp .env .env.local
    ```
2.  **Get a Gemini API Key:**
    - Go to [Google AI Studio](https://aistudio.google.com/app/apikey).
    - Sign in with your Google account.
    - Click **"Create API key in new project"**.
    - Copy the generated API key.
3.  **Add the key to your `.env.local` file:**
    Open the `.env.local` file and add your API key like this:
    ```
    GEMINI_API_KEY=YOUR_API_KEY_HERE
    ```

This key will be used by the backend Genkit flows for all AI-related tasks.

## 4. Run the Development Server

You need to run two separate processes for the application to work fully: the Next.js frontend and the Genkit AI flows.

1.  **Run the Next.js App (Terminal 1):**
    ```bash
    npm run dev
    ```
    This will start the main application, usually on [http://localhost:9002](http://localhost:9002).

2.  **Run the Genkit Flows (Terminal 2):**
    ```bash
    npm run genkit:dev
    ```
    This starts the Genkit development server, which makes the AI flows available for the Next.js app to call.

## 5. Access the Application

Open your browser and navigate to [http://localhost:9002](http://localhost:9002).

You can log in with the following mock credentials:
- **Username:** `admin`
- **Password:** `chapri`

Once logged in, it's a good practice to go to **Settings -> AI Provider Configuration** to verify that your API key is working correctly.
