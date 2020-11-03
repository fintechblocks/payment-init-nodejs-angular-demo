# How to use payment-init demo app with exampleBank sandbox

## Set environment variables

* Open *.env*
* Set the following environment vairables properly based on exampleBank sandbox properties
  * OIDC_WELL_KNOWN_URL (e.g. https://api.sandbox.exampleBank.hu/auth/realms/ftb-sandbox/.well-known/openid-configuration)
  * PAYMENT_INIT_API_URL (e.g. https://api.sandbox.exampleBank.hu/payment-init-1.0)
* Custom properties
  * FRONTEND_HOST (e.g. payment-init-frontend.ftb-local, have to set in *hosts* file)
  * BACKEND_HOST (e.g. payment-init-back-end.ftb-local, have to set in *hosts* file)
  * REDIRECT_URL (is equal to FRONTEND_HOST)
  * CLIENT_ID must be a registered client identification (e.g. ftb-demo-app@payment-init-1.0)

## Build frontend

* Open a terminal
* Navigate to */frontend*
* Command: *ng build*

## Edit host file

Open *hosts* file and add FRONTEND_HOST and BACKEND_HOST.

### Example

```hosts file
127.0.0.1 payment-init-frontend.ftb-local
127.0.0.1 payment-init-backend.ftb-local
```

## Set backend url for frontend for LOCAL docker-compose.yml (without https)

* Open *frontend-env-local.json*
* base path of *apiUrl* is equal to BACKEND_HOST

### Example

```frontend environment
"apiUrl": "http://payment-init-backend.ftb-local"
```

## Add keys:
Add pulic and private key to backend/keys folder
For example: 
public_cert.pem and private.key 
or
public_key.txt and private_key.txt


## Run demo application

* Navigate to root folder
* Command: *docker-compose up -d*

## OIDC error: *Invalid parameter: redirect_uri*

* Open keycloak (e.g. https://api.sandbox.exampleBank.hu/auth)
* Log in admin console
* Click on *Clients*
* Edit actual client (e.g. ftb-demo-app)
* Add REDIRECT_URL to *Valid Redirect URIs*