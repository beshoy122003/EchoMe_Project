# EchoMe — Multimodal Conversational Avatar System

EchoMe is a local multimodal AI pipeline that generates a lip-synced talking-avatar video from three user inputs:

* A static face image
* A short voice sample for cloning
* A recorded question

The system produces a natural spoken response using Whisper for transcription, an LLM for reasoning, XTTS for voice synthesis, and Wav2Lip for lip-sync generation.
The frontend is built with React (Vite + TailwindCSS), while the backend runs on FastAPI.

---

## 1. Features

* Speech-to-text transcription (Whisper Large-v3)
* LLM-based response generation (Aya 8B via Ollama)
* Voice cloning and text-to-speech (XTTS v2)
* Lip-synchronized video generation (Wav2Lip)
* Fully local pipeline (no external computation required)
* FastAPI backend and modern React frontend
* Privacy-focused architecture: all processing runs locally

---

## 2. System Architecture

Processing pipeline:

```
Audio Recording → Whisper → LLM → XTTS → Wav2Lip → MP4 Output
```

**Frontend**: React, Vite, TailwindCSS
**Backend**: FastAPI, Python 3.10, PyTorch
**Optional Runtime Tools**: Ollama, CUDA GPU acceleration

---

## 3. Project Structure

```
EchoMe_Project/
│
├── api/
│   ├── main.py               # FastAPI application
│   ├── pipeline.py           # Full processing pipeline
│   ├── utils.py              # File-handling helpers
│   ├── requirements_echome.txt
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── components/
│   ├── index.html
│   ├── package.json
│   └── tailwind.config.js
│
├── demo/                     # Demo videos
├── models/                   # Not included in the repo
├── uploads/                  # Temporary user uploads
├── outputs/                  # Generated MP4 files
├── environment.yaml          # Conda environment file
└── README.md
```

---

## 4. Installation

### Backend Setup

```bash
conda env create -f environment.yaml
conda activate echome
pip install -r api/requirements_echome.txt
uvicorn api.main:app --host 0.0.0.0 --port 8000
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

---

## 5. Processing Workflow

1. User records an audio question from the frontend
2. Whisper transcribes the audio to text
3. An LLM generates a short response
4. XTTS synthesizes the reply using the cloned voice
5. Wav2Lip produces a synchronized talking-head video
6. The React frontend receives and displays the final MP4 file

---

## 6. Use Cases

* Interactive AI assistants
* Virtual tutoring systems
* Character-based conversational agents
* Customer support avatars
* Accessibility and educational applications
* Creative multimedia production

---

## 7. Demo Videos

### Arabic Demo
[▶️ Watch EchoMe Arabic Demo](demo/EchoMe_Ar_demo.mp4)

### English Demo
[▶️ Watch EchoMe English Demo](demo/EchoMe_En_demo.mp4)

---

## 8. Contributing

Feedback and contributions are welcome.
Please submit issues or pull requests through GitHub.

---

## 9. License

MIT License.
