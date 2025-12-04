import os
import subprocess
from api.utils import save_upload, make_job
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

    job_id, up, out = make_job()

    img_path = os.path.abspath(save_upload(image, os.path.join(up, image.filename)))
    audio_path = os.path.abspath(save_upload(audio, os.path.join(up, audio.filename)))

    # ---------- Whisper ----------
    whisper_out = os.path.join(out, "transcript.txt")

    if lang == "auto":
        cmd = f'whisper "{audio_path}" --model large-v3 --task transcribe --output_format txt --output_dir "{out}" --fp16 False'
    else:
        cmd = f'whisper "{audio_path}" --model large-v3 --language {lang} --task transcribe --output_format txt --output_dir "{out}" --fp16 False'

    subprocess.run(cmd, shell=True)

    txt_files = [f for f in os.listdir(out) if f.endswith(".txt")]
    if not txt_files:
        raise FileNotFoundError("Whisper transcript missing!")

    os.rename(os.path.join(out, txt_files[0]), whisper_out)

    with open(whisper_out, "r", encoding="utf-8") as f:
        transcript = f.read().strip()

    # ---------- Aya LLM (Ollama local) ----------
    prompt = (
        "Answer clearly in 4-5 lines maximum:\n\n"
        f"{transcript}"
    )

    reply = subprocess.check_output(["ollama", "run", "aya:8b", prompt]).decode().strip()

    with open(os.path.join(out, "reply.txt"), "w", encoding="utf-8") as f:
        f.write(reply)

    # ---------- TTS ----------
    tts = TTS("tts_models/multilingual/multi-dataset/xtts_v2")
    tts_out = os.path.abspath(os.path.join(out, "tts.wav"))

    if voice_clone:
        clone_path = os.path.abspath(save_upload(voice_clone, os.path.join(up, voice_clone.filename)))
        tts.tts_to_file(
            text=reply,
            file_path=tts_out,
            speaker_wav=clone_path,
            language="en",
        )
    else:
        tts.tts_to_file(
            text=reply,
            file_path=tts_out,
            language="en",
        )

    # ---------- Wav2Lip ----------
    clear_temp()

    wav2lip_out = os.path.abspath(os.path.join(out, "result.mp4"))

    conda_path = r"C:\Users\el_magic\anaconda3\condabin\conda.bat"

    cmd3 = [
        conda_path, "run", "-n", "w2l",
        "python", "inference.py",
        "--checkpoint_path", "checkpoints/wav2lip_gan.pth",
        "--face", img_path,
        "--audio", tts_out,
        "--outfile", wav2lip_out,
        "--static", "True",
    ]

    result = subprocess.run(
        cmd3,
        shell=True,
        cwd=os.path.join(BASE_DIR, "models", "Wav2Lip"),
        capture_output=True,
        text=True,
    )

    print(result.stdout)
    print(result.stderr)

    return wav2lip_out, transcript, reply
