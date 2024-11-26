from .settings import *  # Import everything from settings.py
import os
from dotenv import load_dotenv
# Enable debugging during tests to see detailed error outputs

env_path = os.path.join(BASE_DIR, '.env.production')
load_dotenv(dotenv_path=env_path)

DEBUG = True

# Test database configuration

load_dotenv()

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': os.getenv('DB_NAME'),
        'HOST': os.getenv('DB_HOST'),
        'USER': os.getenv('DB_USER'),
        'PASSWORD': os.getenv('DB_PASSWORD'),
    }
}


# Use a different secret key for testing
SECRET_KEY = 'testing-secret-key'

# Restrict allowed hosts for testing
ALLOWED_HOSTS = ['localhost', '127.0.0.1']



# Disable authentication classes to simplify testing (optional)
REST_FRAMEWORK['DEFAULT_AUTHENTICATION_CLASSES'] = []

# Adjust media settings for testing (use temporary storage)
MEDIA_ROOT = BASE_DIR / 'test_media'
os.makedirs(MEDIA_ROOT, exist_ok=True)

