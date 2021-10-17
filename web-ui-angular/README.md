# Posther V1 Frontend

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 11.1.4.

# Technicals
To be used within a specifically configured hardhat project that keeps track of smart contract deployments.

The hardhat project is unaware of the angular, so the angular app does some more work in order to be usable both dev-wise and deployment-wise.

For development purposes the angular app expects a local ganache instance to be runnning. A daemon script updates the environment.ts file whenever new contract deployments do occur. See package.json , npm start.

For deployment purposes, the angular app should be build with npm build (see package.json), such that the correct contract address appears in the angular production environment.ts.

# UX
For demo purposes we show only the most recent posts. In a production version we'd specify a date range and present with pagination.

