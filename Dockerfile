# Use official miniconda image
FROM continuumio/miniconda3:23.1.0

WORKDIR /app
ENV DEBIAN_FRONTEND=noninteractive
ENV PATH=/opt/conda/bin:$PATH

# Install apt deps
RUN apt-get update && apt-get install -y --no-install-recommends \
    git wget ffmpeg build-essential libsndfile1 curl \
    && rm -rf /var/lib/apt/lists/*

# Copy project files
COPY . /app

# Create echome conda env from environment.yaml (modern env)
RUN conda env create -f environment.yaml || \
    (echo "conda env create failed; creating minimal echome env" && \
     conda create -y -n echome python=3.10 && \
     /opt/conda/envs/echome/bin/python -m pip install -r /app/api/requirements_echome.txt)

# Create old env for Wav2Lip (w2l) with legacy deps
RUN conda create -y -n w2l python=3.7 && \
    /opt/conda/envs/w2l/bin/python -m pip install --no-cache-dir \
        "librosa==0.7.0" \
        "numpy==1.17.1" \
        "opencv-python==4.1.0.25" \
        "torch==1.1.0" \
        "torchvision==0.3.0" \
        "tqdm==4.45.0" \
        "numba==0.48" \
        "soundfile" \
        "scipy" \
        "moviepy"

# Optional fallback pip install for echome env
RUN if [ -f /app/api/requirements_echome.txt ]; then \
      /opt/conda/envs/echome/bin/python -m pip install -r /app/api/requirements_echome.txt; \
    fi

SHELL ["bash", "-lc"]
RUN conda init bash

ENV PORT=8000
EXPOSE 8000

COPY start.sh /app/start.sh
RUN chmod +x /app/start.sh

CMD ["/app/start.sh"]
