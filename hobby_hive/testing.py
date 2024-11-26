from .settings import *  # Import everything from settings.py

# Enable debugging during tests to see detailed error outputs
DEBUG = True

# Test database configuration
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',  # PostgreSQL for GitHub Actions
        'NAME': 'postgres',                         # Database name in GitHub Actions
        'USER': 'ranjan',                        # Default username
        'PASSWORD': 'Bigenergy613#',                    # Default password
        'HOST': 'hobbyhivedev.postgres.database.azure.com',                       # Database host in GitHub Actions
        'PORT': '5432',                            # Default PostgreSQL port
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

# Use SQLite (alternative for local testing)
# Uncomment the following to use SQLite for testing:
# DATABASES = {
#     'default': {
#         'ENGINE': 'django.db.backends.sqlite3',
#         'NAME': BASE_DIR / 'test_db.sqlite3',
#     }
# }
