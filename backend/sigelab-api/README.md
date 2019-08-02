<h3 align="center">SigeLAB: Universidad del Valle SABS connection API</h3>



---

<p align="center">
  This is the Univalle's inventory connection API system. This API is still under heavy development, constantly improvement and is not needed to deploy a new SigeLAB instance. This API just works for the Universidad del Valle implementation.
    <br>
</p>

## 📝 Table of Contents
- [Getting Started](#getting_started)
- [Testing](#tests)
- [Deployment](#deployment)


## 🏁 Getting Started <a name = "getting_started"></a>
This interface was built using [sails.js](https://sailsjs.com/) and these instructions will let you get the Universidad del Valle inventory API system up and running to comunicate your SigeLAB instance with our internal SABS system.

### Repository structure
    sigelab-api/
      api/
        controllers/
        models/
        policies/
        responses/
      assets/
        images/
        js/
        styles/
        templates/
      config/
        env/
        locales/
      docs/
        api/
      logs/
      tasks/
        config/
        register/
      test/
        integration/
          controllers/
          models/
      views/
      README.md

This project has a specified repository structure with separated folders for each part of the code. Here you will find a typical sails project structure plus some files and folders needed in order to configurate and deploy the application on our system.

### Installing
1. Go to the root folder (sigelab-api) and execute `npm install`.
2. Configure your [sabs](./config/sabs.js) config file with your `URL_SABS_SERVICE`.
3. Execute in the root folder the command `npm run dev` and the API will be up, running and listening to **1337** port (`npm run  start` to run in production mode).

### Usage

  This API has `/inventario/buscar` as a base endpoint, so if you deploy this interface in your local machine, the endpoint to consume should be `http://localhost:1337/inventario/buscar`. To make a call and consume this endpoint you must send a `POST` request and the body should be built as follows:

  |key:| value |
  |--|--|
  |codInventario:| "inventory code" |
  | codLab | "laboratory code" |
  |nomLab:| "laboratory name" |
  |sede:| "headquarter" |
  | edificio | "building" |
  |espacio:| "space" |


## 🔧 Running the tests <a name = "tests"></a>
No automated test has been provided for this project at the current state. We are looking to improve this. If you want to contribute to this project in this topic just let us know.

## 🚀 Deployment <a name = "deployment"></a>

To deploy this API in production, we recommend the [PM2](http://pm2.keymetrics.io/) usage and to follow this [guide](https://www.digitalocean.com/community/tutorials/how-to-use-pm2-to-setup-a-node-js-production-environment-on-an-ubuntu-vps) to set up the server.
