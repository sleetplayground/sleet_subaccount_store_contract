# NEAR Subaccount Factory Contract

This smart contract enables users to create subaccounts of the master account where the contract is deployed. It requires a deposit of 0.1 NEAR to create subaccounts, which goes to the master account.

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

## 1. Build and Deploy the Contract

```bash
# Build the contract
npm run build

# Deploy the contract to your account
near deploy YOUR_ACCOUNT.testnet build/hello_near.wasm

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
First, generate a key pair on the client side:
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
near call YOUR_ACCOUNT.testnet deposit --accountId YOUR_ACCOUNT.testnet --deposit 0.1 && near call YOUR_ACCOUNT.testnet create_subaccount '{"subaccount_id": "mysubaccount", "public_key": "YOUR_GENERATED_PUBLIC_KEY"}' --accountId YOUR_ACCOUNT.testnet
```

This command combines the deposit and subaccount creation into a single line using the `&&` operator, which executes the second command only if the first one succeeds.

## Important Notes

- The deposit of 0.1 NEAR is required for each subaccount creation
- Deposits cannot be withdrawn
- You can create multiple subaccounts as long as you have sufficient deposit
- The contract automatically sets up full access keys for new subaccounts
- Each subaccount receives a small amount of NEAR for storage fees

