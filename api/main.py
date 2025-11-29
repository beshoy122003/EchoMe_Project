from fastapi import FastAPI, UploadFile, File, Form
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from api.pipeline import process_request

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/process")
async def process(image: UploadFile = File(...),
                  audio: UploadFile = File(...),
                  voice_clone: UploadFile = File(None),
                  lang: str = Form("auto")):

    video, transcript, reply = process_request(image, audio, voice_clone, lang)
    return {
        "video_path": video,
        "transcript": transcript,
        "reply": reply
    }

@app.get("/video")
def get_video(path: str):
    return FileResponse(path)
