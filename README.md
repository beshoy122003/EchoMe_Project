# EchoMe — Multimodal Conversational Avatar System

EchoMe is a fully local (offline) AI-driven avatar system that generates a lip-synced talking video using a static face image, a cloned voice sample, and a recorded user question.
The backend integrates Whisper for transcription, Aya 8B for response generation, XTTS for voice synthesis, and Wav2Lip for realistic lip-sync.
The frontend is built using React, Vite, and TailwindCSS.

## 1. Key Features

* Speech-to-text transcription using Whisper Large-v3
* LLM-based response generation using Aya 8B (via Ollama)
* Voice cloning and text-to-speech using XTTS v2
* Lip-sync video generation using Wav2Lip
* Fully offline execution
* Modern UI using React + Vite + TailwindCSS
* High privacy — all processing stays local

## 2. System Architecture

Processing pipeline:

```
Audio Input → Whisper → Aya LLM → XTTS → Wav2Lip → MP4 Output
```

**Frontend:** React, Vite, TailwindCSS
**Backend:** FastAPI, Python 3.10, Torch
**Runtime Tools:** Ollama (Aya 8B), CUDA (optional)

## 3. Project Structure

```
EchoMe_Project/
│
├── api/
│   ├── main.py
│   ├── pipeline.py
│   └── utils.py
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   └── components/
│   ├── index.html
│   ├── package.json
│   └── tailwind.config.js
│
├── models/              # (Not included in repo)
├── uploads/             # Temporary upload files
├── outputs/             # Generated output files
├── demo/                # Demo videos (added later)
└── environment.yaml     # Conda environment
```

## 4. Installation

### Backend Setup

```bash
conda env create -f environment.yaml
conda activate echome
uvicorn api.main:app --host 0.0.0.0 --port 8000
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

## 5. How It Works

1. User records an audio question
2. Whisper transcribes the speech
3. Aya 8B LLM generates a concise reply
4. XTTS synthesizes the response using the cloned voice
5. Wav2Lip creates a lip-synced talking video
6. The frontend displays the final MP4 result

## 6. Use Cases

* AI assistants
* Virtual tutors
* Interactive character systems
* Customer service avatars
* Accessibility tools
* Creative applications

## 7. Demo

Demo videos will be stored in the `demo/` folder.
More demos will be added soon.

## 8. Contributing

Contributions and improvements are welcome.

## 9. License

MIT License
