# Frontend for AI Video Generator

This is a React + Vite + TailwindCSS frontend for the AI Video Generator backend.

## Features
- Upload face image
- Record audio using the microphone
- Select language for processing
- Submit data to the backend
- Display and download the generated video

## Setup Instructions

1. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and go to:
   ```
   http://localhost:5173
   ```

## Environment Variables

Ensure the `.env` file is set up with the following:
```
VITE_API_URL=http://localhost:8000
```

## Build for Production

To build the app for production, run:
```bash
npm run build
```

To preview the production build locally, run:
```bash
npm run serve
```