# Posther

This project is a proof of concept for a dApp to persist text data on Ethereum while keeping gas fees very low. Instead of explicitly storing the text in the EVM storage, we merely keep it as part of the calldata.

The contract has an owner and can be configured to take user fees, such that it does cost ETH to post. But the fee can be also set to 0.

The project has been [deployed](https://kovan.etherscan.io/0xcD9bAd0cb9FeF8C73B4C4163cd51e857d8D54047) to the Kovan Test Network.

Try it out [here](https://posther.vercel.app).

In order to post you'll need some testnet ETH. Use this [faucet](https://kovan.chain.link/) which is kindly maintained by Chainlink.

# Advanced Sample Hardhat Project

This project demonstrates an advanced Hardhat use case, integrating other tools commonly used alongside Hardhat in the ecosystem.

The project includes a web frontend which is optimized to be developed within a hardhat project, making use of the deployment information.

## Smart Contract Development

The hardhat.config.js is optimized for development with a local ganache running in a deterministic fashion and "real-world" deployment on the kovan testnet.
Start ganache with `ganache-cli --deterministic`

Some useful custom tasks are included in tasks/general.js

Deployment history is handled in a simple fashion. We keep track of deployments in order to use the most recently deployed contract address in specific hardhat tasks and the frontend configuration. The hardhat deploy plugin can be useful if there are more complex demands.

# General Hardhat Information

Try running some of the following tasks:

```shell
npx hardhat accounts
npx hardhat compile
npx hardhat clean
npx hardhat test
npx hardhat node
npx hardhat help
REPORT_GAS=true npx hardhat test
npx hardhat coverage
npx hardhat run scripts/deploy.js
node scripts/deploy.js
npx eslint '**/*.js'
npx eslint '**/*.js' --fix
npx prettier '**/*.{json,sol,md}' --check
npx prettier '**/*.{json,sol,md}' --write
npx solhint 'contracts/**/*.sol'
npx solhint 'contracts/**/*.sol' --fix
```

# Etherscan verification

To try out Etherscan verification, you first need to deploy a contract to an Ethereum network that's supported by Etherscan, such as Ropsten.

In this project, copy the .env.template file to a file named .env, and then edit it to fill in the details. Enter your Etherscan API key, your Ropsten node URL (eg from Alchemy), and the private key of the account which will send the deployment transaction. With a valid .env file in place, first deploy your contract. Then, copy the deployment address and paste it in to replace `DEPLOYED_CONTRACT_ADDRESS` in this command:

```shell
npx hardhat verify --network ropsten DEPLOYED_CONTRACT_ADDRESS "Hello, Hardhat!"
```
