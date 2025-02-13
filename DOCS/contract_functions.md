# SLEET Sub-Account Contract Functions Documentation

This document provides a detailed description of all functions available in the SLEET Sub-Account Contract.

## Overview
The contract implements a sub-account factory system on NEAR Protocol, allowing users to create and manage sub-accounts under the master account.

## Contract Functions

### 1. init()
**Type**: Call Method
**Description**: Initializes the contract state.
**Parameters**: None
**Returns**: void
**Usage Example**:
```typescript
near call contract_name.testnet init --accountId your_account.testnet
```

### 2. get_deposit({ account_id })
**Type**: View Method
**Description**: Retrieves the current deposit amount for a specified account.
**Parameters**:
- `account_id` (string): The NEAR account ID to check the deposit for

**Returns**: string (The deposit amount in yoctoNEAR)
**Usage Example**:
```typescript
near view contract_name.testnet get_deposit '{"account_id": "user.testnet"}'
```

### 3. deposit()
**Type**: Call Method (Payable)
**Description**: Allows users to deposit NEAR tokens into the contract for creating sub-accounts.
**Parameters**: None (but requires attached deposit)
**Attached Deposit**: Any amount of NEAR
**Returns**: void
**Usage Example**:
```typescript
near call contract_name.testnet deposit --accountId your_account.testnet --deposit 0.1
```
**Important Notes**:
- Deposits are tracked per user
- Deposits cannot be withdrawn
- Each sub-account creation requires 0.1 NEAR from the deposit

### 4. create_subaccount({ subaccount_id, public_key })
**Type**: Call Method
**Description**: Creates a new sub-account under the contract's account if the caller has sufficient deposit.
**Parameters**:
- `subaccount_id` (string): The desired prefix for the sub-account
- `public_key` (string): The public key to be associated with the new sub-account

**Requirements**:
- Caller must have at least 0.1 NEAR deposited
- Valid sub-account ID format
- Valid public key format

**Returns**: void
**Usage Example**:
```typescript
near call contract_name.testnet create_subaccount '{"subaccount_id": "mysubaccount", "public_key": "ed25519:HeaBJ3xLgvZacQWmEctTeUqyfSU4SDEnEwckWxd92W2G"}' --accountId your_account.testnet --gas 300000000000000
```

**Important Notes**:
- Creates account in format: `subaccount_id.contract_name.testnet`
- Automatically sets up full access key for the new sub-account
- Transfers 0.00182 NEAR to the new sub-account for storage fees
- Deducts 0.1 NEAR from caller's deposit

## Technical Details

### Constants
- `DEPOSIT_AMOUNT`: 0.1 NEAR (100000000000000000000000 yoctoNEAR)
- Initial sub-account balance: 0.00182 NEAR (1820000000000000000000 yoctoNEAR)

### State Management
- Contract maintains a mapping of user deposits using the `deposits` object
- Deposits are stored as strings to handle large numbers accurately
- All amounts are handled in yoctoNEAR for precision

### Error Handling
- Throws error for insufficient deposits
- Validates public key format
- Ensures proper account ID formatting