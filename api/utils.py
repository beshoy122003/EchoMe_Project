import os
import uuid

def make_job():
    job_id = uuid.uuid4().hex[:8]
    up = os.path.join("uploads", job_id)
    out = os.path.join("outputs", job_id)
    os.makedirs(up, exist_ok=True)
    os.makedirs(out, exist_ok=True)
    return job_id, up, out


def save_upload(file, path):
    with open(path, "wb") as f:
        f.write(file.file.read())
    return path
