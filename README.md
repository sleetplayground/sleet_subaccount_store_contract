# SLEET Sub-Account Store Contract

Turn your near account into a subaccount store

> This contract was generated by ai. I am not entirly sure how all this works. I had ai generate a security doc [DOCS/security.md](DOCS/security.md)
<br/>
> This contract introduces a huge potential for a malicious activity with your near account. Becuase lets say you deploy this contract to alice.near anyone can create subaccounts of that account, and use those accouts for malicious activity like launching tokens or creating token launch pads with that address.
<br/>
> I would love to see this contract deployed to thousands of near accounts, and a front end interface that allows people to shop for near subaccounts form all of these accounts.
<br/>
> See this contract in action on the .web3stick.near store https://web3stick.on-fleek.app/


This smart contract enables users to create subaccounts of the master account where the contract is deployed. It requires a deposit of 0.1 NEAR to create subaccounts, which goes to the master account.

![image](DOCS/sleet_banner_100px_8e9dcc.svg)

## Contract Features

- Users must deposit NEAR before creating subaccounts
- Required deposit: 0.1 NEAR per subaccount
- Deposits are tracked per user and cannot be withdrawn
- Multiple subaccounts can be created if sufficient deposit exists
- Full access keys are automatically set up for new subaccounts

```ts
@NearBindgen({})
class SubAccountFactory {
  deposits: { [key: string]: string } = {};

  @call({})
  init(): void {
    // Initialization logic if needed
  }

  @view({})
  get_deposit({ account_id }: { account_id: string }): string {
    return this.deposits[account_id] || '0';
  }

  @call({ payable: true })
  deposit(): void {
    // Users can deposit NEAR to enable subaccount creation
  }

  @call({})
  create_subaccount({ subaccount_id, public_key }: { subaccount_id: string, public_key: string }): void {
    // Creates a new subaccount if sufficient deposit exists
  }
}
```

# Quickstart

1. Make sure you have installed [node.js](https://nodejs.org/en/download/package-manager/) >= 16
2. Install the [`NEAR CLI`](https://github.com/near/near-cli#setup)
3. Install [PNPM](https://pnpm.io/installation) (recommended)

## 1. Build and Deploy the Contract

```bash
# Install dependencies
pnpm install

# Build the contract
pnpm run build

# to see errors, this command is helpful to run so you can get something to send to ai when experiencing build errors, when this thing outputs no errors, you sohould be able to build
npx tsc --noEmit --skipLibCheck --experimentalDecorators --target es2020 --moduleResolution node src/contract.ts


# Deploy the contract to your account
near deploy YOUR_ACCOUNT.testnet build/build/sleet_subaccount.wasm

# Initialize the contract
near call YOUR_ACCOUNT.testnet init '{}' --accountId YOUR_ACCOUNT.testnet
```

## 2. Interact with the Contract

### Check Your Deposit Balance
```bash
near view YOUR_ACCOUNT.testnet get_deposit '{"account_id": "YOUR_ACCOUNT.testnet"}'
```

### Make a Deposit
```bash
near call YOUR_ACCOUNT.testnet deposit --accountId YOUR_ACCOUNT.testnet --deposit 0.1
```

### Create a Subaccount
First, generate a key pair. You have two options:

1. Using NEAR CLI:
> Human note: AI is outdated, this command does not work as far as I know! ❄️😀
```bash
near generate-key
```
This will create a key pair and save it in your local credentials directory. The public key will be displayed in the terminal.


2. Using JavaScript on the client side:
```javascript
const { KeyPair } = require('near-api-js');
const keyPair = KeyPair.fromRandom('ed25519');
const publicKey = keyPair.getPublicKey().toString();
const privateKey = keyPair.secretKey;
console.log(`Public Key: ${publicKey}`);
console.log(`Private Key: ${privateKey}`);
```

Then, use the public key to create the subaccount:
```bash
near call YOUR_ACCOUNT.testnet create_subaccount '{"subaccount_id": "mysubaccount", "public_key": "YOUR_GENERATED_PUBLIC_KEY"}' --accountId YOUR_ACCOUNT.testnet
```

After successful execution, you'll have a new account `mysubaccount.YOUR_ACCOUNT.testnet` with full access keys set up.

### Deposit and Create Subaccount in One Command
```bash
near call YOUR_ACCOUNT.testnet deposit --accountId YOUR_ACCOUNT.testnet --deposit 0.1 && near call YOUR_ACCOUNT.testnet create_subaccount '{"subaccount_id": "mysubaccount", "public_key": "YOUR_GENERATED_PUBLIC_KEY"}' --accountId YOUR_ACCOUNT.testnet --gas 300000000000000
```

This command combines the deposit and subaccount creation into a single line using the `&&` operator, which executes the second command only if the first one succeeds.

## Important Notes

- The deposit of 0.1 NEAR is required for each subaccount creation
- Deposits cannot be withdrawn
- You can create multiple subaccounts as long as you have sufficient deposit
- The contract automatically sets up full access keys for new subaccounts
- Each subaccount receives a small amount of NEAR for storage fees

## Storage Costs

> Not sure how this math adds up, ai generated.

For some reason, User must have over four near in their
account to deploy the contract.
(5 to be safe, you can recover this NEAR by either:
- Deploying a minimal contract to replace the existing one
- Deleting the contract completely with 'near delete')


The contract stores the following data:
- A mapping of account IDs to their deposit amounts
- Each user entry costs approximately 0.00082 NEAR in storage
- The contract has a base storage cost of 0.00367 NEAR

Storage fees are automatically managed by the contract, and a small portion of the 0.1 NEAR deposit covers these costs.

For 100 users:
- Base storage: 0.00367 NEAR
- Deposits mapping (100 entries): 100 * 0.00082 = 0.082 NEAR
Total: ~0.08567 NEAR


---
![image](DOCS/sleet_banner_100px_8e9dcc.svg)


This repo and contract are a part of the sleet playground project by Nathan Renfroe and The SunShining.

Copyright 2025 by SLEET