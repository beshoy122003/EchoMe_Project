#!/usr/bin/env bash
set -e

PORT="${PORT:-8000}"
echo "Starting EchoMe backend on port $PORT"

# If echome env exists, run server using it
if conda env list | grep -q "echome"; then
  conda run -n echome uvicorn api.main:app --host 0.0.0.0 --port $PORT --workers 1
else
  # fallback: use system python
  uvicorn api.main:app --host 0.0.0.0 --port $PORT --workers 1
fi
