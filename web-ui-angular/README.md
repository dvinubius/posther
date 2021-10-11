# Technicals
To be used within a specifically configured hardhat project that keeps track of smart contract deployments.

The hardhat project is unaware of the angular, so the angular app does some more work in order to be usable both dev-wise and deployment-wise.

For development purposes, the angular app expects that a local ganache instance is runnning. A daemon script updates the environment.ts file whenever new contract deployments do occur. See package.json , npm start.

For deployment purposes, the angular app should be build with npm build (see package.json), such that the correct contract address appears in the angular production environment.ts.

# UX
For demo purposes we show all posts ever posted since contract deployment. In a production version we'd have pagination.


# WebUiAngular

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 11.1.4.
