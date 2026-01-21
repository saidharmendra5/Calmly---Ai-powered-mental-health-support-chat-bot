#!/usr/bin/env bash
# Exit on error
set -o errexit

# 1. Install dependencies
pip install -r requirements.txt

# 2. Download NLTK data explicitly
python -m nltk.downloader punkt
python -m nltk.downloader punkt_tab