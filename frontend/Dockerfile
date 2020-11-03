FROM node:10.16.0-alpine

WORKDIR /home/payment-init-demo-app/deploy
#things needed for install
COPY package*.json /home/payment-init-demo-app/

# Install packages
RUN npm install && npm install -g @angular/cli@6.0.8


COPY . /home/payment-init-demo-app
RUN cd /home/payment-init-demo-app && ng build --prod --output-hashing none

# Make everything available for start
RUN cp -r /home/payment-init-demo-app/dist /home/payment-init-demo-app/deploy
RUN cd /home/payment-init-demo-app/deploy && npm install

#clean up
RUN rm -rf /home/payment-init-demo-app/node_modules

EXPOSE 4201
CMD ["node", "serve.js"]
