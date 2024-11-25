import os 
from .settings import *
from .settings import BASE_DIR
from storages.backends.azure_storage import AzureStorage
from azure.storage.blob import BlobServiceClient, generate_blob_sas, BlobSasPermissions
from datetime import datetime, timedelta

SECRET_KEY = os.environ['SECRET']
ALLOWED_HOSTS = [os.environ['WEBSITE_HOSTNAME']]
CSRF_TRUSTED_ORIGINS = ['https://' + os.environ['WEBSITE_HOSTNAME']]
DEBUG = False

AZURE_ACCOUNT_NAME = 'hobbyhivemedia'
AZURE_ACCOUNT_KEY = os.environ['AZURE_STORAGE_ACCOUNT_KEY']
AZURE_CONTAINER = 'media' 

def generate_sas_url(blob_name):
    sas_token = generate_blob_sas(
        account_name=AZURE_ACCOUNT_NAME,
        account_key=AZURE_ACCOUNT_KEY,
        container_name=AZURE_CONTAINER,
        blob_name=blob_name,
        permission=BlobSasPermissions(read=True),
        expiry=datetime.utcnow() + timedelta(hours=1)  # Set expiry
    )
    return f"https://{AZURE_ACCOUNT_NAME}.blob.core.windows.net/{AZURE_CONTAINER}/{blob_name}?{sas_token}"

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

CORS_ALLOW_ALL_ORIGINS = True
CORS_ALLOW_CREDENTIALS = True

CORS_ALLOWED_ORIGINS = [
    "https://hobbyhive-dbhtapemgpdeayc7.northcentralus-01.azurewebsites.net",
]



STORAGES = {
    "default": {
        "BACKEND": "storages.backends.azure_storage.AzureStorage",
    },
    "staticfiles": {
        "BACKEND": "whitenoise.storage.CompressedStaticFilesStorage",
    },
}


conn_str = os.environ['AZURE_POSTGRESQL_CONNECTIONSTRING']
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

STATIC_ROOT = BASE_DIR/'staticfiles'