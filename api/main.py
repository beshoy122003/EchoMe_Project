from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, Response
from api.pipeline import process_request

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://echo-me-project.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/process")
async def process(
    image: UploadFile = File(...),
    audio: UploadFile = File(...),
    voice_clone: UploadFile = File(None),
    lang: str = Form("auto")
):
    video_path, transcript, reply = process_request(image, audio, voice_clone, lang)

    return {
        "video_path": video_path,
        "transcript": transcript,
        "reply": reply
    }


@app.get("/video")
def get_video(path: str):
    try:
        return FileResponse(
            path,
            media_type="video/mp4",
            filename="result.mp4",
            headers={
                "Access-Control-Allow-Origin": "*",
                "Cache-Control": "no-cache",
            }
        )
    except Exception as e:
        return Response(content=str(e), status_code=500)