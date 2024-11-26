from .settings import *  # Import everything from settings.py
import os
# Enable debugging during tests to see detailed error outputs
DEBUG = True

# Test database configuration
conn_str = os.environ['AZURE_POSTGRESQL_CONNECTIONSTRING_1']
conn_str_params = {pair.split('=')[0]: pair.split('=')[1] for pair in conn_str.split(' ')}
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': conn_str_params['dbname'],
        'HOST': conn_str_params['host'],
        'USER': conn_str_params['user'],
        'PASSWORD': conn_str_params['password'],
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
