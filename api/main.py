from fastapi import FastAPI, UploadFile, File, Form
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from api.pipeline import process_request

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
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

from fastapi.responses import FileResponse, Response

@app.get("/video")
def get_video(path: str):
    try:
        headers = {
            "Accept-Ranges": "bytes",
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "video/mp4"
        }
        return FileResponse(path, headers=headers)
    except Exception as e:
        return Response(content=str(e), status_code=500)

