from .settings import *  # Import all default settings

# Test-specific configurations
DEBUG = True

# Use Azure PostgreSQL DB for testing
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'postgres',  # Replace with your test database name
        'USER': 'ranjan',  # Replace with your Azure PostgreSQL username
        'PASSWORD': 'Bigenergy613#',  # Replace with your Azure PostgreSQL password
        'HOST': 'hobbyhivedev.postgres.database.azure.com',  # Replace with your Azure PostgreSQL host
        'PORT': '5432',
    }
}

