import nltk
import ssl

# Bypass SSL errors (common on some Windows setups)
try:
    _create_unverified_https_context = ssl._create_unverified_context
except AttributeError:
    pass
else:
    ssl._create_default_https_context = _create_unverified_https_context

print("⬇️  Downloading NLTK data...")

# Download BOTH required packages
nltk.download('punkt')
nltk.download('punkt_tab')  # <--- This is the one you were missing!

print("✅ SUCCESS! You can now restart app.py")