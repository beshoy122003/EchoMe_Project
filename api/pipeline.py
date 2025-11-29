import os
import subprocess
from api.utils import make_job, save_upload
from TTS.api import TTS


def clear_temp():
    temp_path = "models/Wav2Lip/temp"
    os.makedirs(temp_path, exist_ok=True)
    for f in os.listdir(temp_path):
        try:
            os.remove(os.path.join(temp_path, f))
        except:
            pass


def process_request(image, audio, voice_clone=None, lang="auto"):

    BASE_DIR = os.getcwd()

    # --------- 0) Create folders ---------
    job_id, up, out = make_job()

    img_path = os.path.abspath(save_upload(image, os.path.join(up, image.filename)))
    audio_path = os.path.abspath(save_upload(audio, os.path.join(up, audio.filename)))

    # --------- 1) Whisper ---------
    whisper_out = os.path.join(out, "transcript.txt")

    if lang == "auto":
        cmd = f'whisper "{audio_path}" --model large-v3 --task transcribe --output_format txt --output_dir "{out}" --fp16 False'
    else:
        cmd = f'whisper "{audio_path}" --model large-v3 --language {lang} --task transcribe --output_format txt --output_dir "{out}" --fp16 False'

    subprocess.run(cmd, shell=True)

    txt_files = [f for f in os.listdir(out) if f.endswith(".txt")]
    if not txt_files:
        raise FileNotFoundError("Whisper did not generate transcript.")

    os.rename(os.path.join(out, txt_files[0]), whisper_out)

    with open(whisper_out, "r", encoding="utf-8") as f:
        transcript = f.read().strip()

    # --------- 2) Aya LLM ---------
    prompt = (
        "Answer the following clearly in 5 to 6 lines:\n\n"
        f"{transcript}"
    )
    
    reply = subprocess.check_output(["ollama", "run", "aya:8b", prompt]).decode().strip()

    with open(os.path.join(out, "reply.txt"), "w", encoding="utf-8") as f:
        f.write(reply)

    # --------- 3) TTS ---------
    tts = TTS("tts_models/multilingual/multi-dataset/xtts_v2")
    tts_out = os.path.abspath(os.path.join(out, "tts.wav"))

    if voice_clone:
        clone_path = os.path.abspath(save_upload(voice_clone, os.path.join(up, voice_clone.filename)))
        tts.tts_to_file(
            text=reply, 
            file_path=tts_out, 
            speaker_wav=clone_path,
            language="ar" if lang.startswith("ar") else "en"
        )
    else:
        tts.tts_to_file(
            text=reply, 
            file_path=tts_out,
            language="ar" if lang.startswith("ar") else "en"
        )

    # --------- 4) Wav2Lip (Linux / Docker version) ---------
    clear_temp()

    wav2lip_out = os.path.abspath(os.path.join(out, "result.mp4"))

    # NO WINDOWS PATHS ANYMORE
    # This works on Linux + Docker + Render
    cmd3 = [
        "conda", "run", "-n", "w2l",
        "python", "inference.py",
        "--checkpoint_path", "checkpoints/wav2lip_gan.pth",
        "--face", img_path,
        "--audio", tts_out,
        "--outfile", wav2lip_out,
        "--static", "True"
    ]

    result = subprocess.run(
        cmd3,
        cwd=os.path.join(BASE_DIR, "models", "Wav2Lip"),
        capture_output=True,
        text=True
    )

    print("Wav2Lip stdout:", result.stdout)
    print("Wav2Lip stderr:", result.stderr)

    if not os.path.exists(wav2lip_out):
        raise FileNotFoundError("Wav2Lip failed! Check checkpoints and Linux env.")

    return wav2lip_out, transcript, reply
