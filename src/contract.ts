// Find all our documentation at https://docs.near.org
import { NearBindgen, near, call, view } from 'near-sdk-js';

const DEPOSIT_AMOUNT = '100000000000000000000000'; // 0.1 NEAR in yoctoNEAR

@NearBindgen({})
export class SubAccountFactory {
  deposits: { [key: string]: string } = {};

  @view({})
  get_deposit({ account_id }: { account_id: string }): string {
    return this.deposits[account_id] || '0';
  }

  @call({ payableFunction: true })
  deposit(): void {
    const deposit = near.attachedDeposit().toString();
    const sender = near.predecessorAccountId();
    this.deposits[sender] = (BigInt(this.deposits[sender] || '0') + BigInt(deposit)).toString();
    near.log(`Deposit of ${deposit} received from ${sender}`);
  }

  @call({})
  create_subaccount({ subaccount_id }: { subaccount_id: string }): void {
    const sender = near.predecessorAccountId();
    const currentDeposit = BigInt(this.deposits[sender] || '0');
    const requiredDeposit = BigInt(DEPOSIT_AMOUNT);

    if (currentDeposit < requiredDeposit) {
      throw new Error(`Insufficient deposit. Required: 0.1 NEAR`);
    }

    const contractId = near.currentAccountId();
    const newAccountId = `${subaccount_id}.${contractId}`;

    // Create the new account
    const promise = near.promiseBatchCreate(newAccountId);
    near.promiseBatchActionCreateAccount(promise);
    near.promiseBatchActionTransfer(promise, BigInt('1820000000000000000000')); // Convert string to BigInt
    near.promiseBatchActionAddKeyWithFullAccess(promise, near.signerAccountPk(), 0); // Added nonce value

    // Deduct the deposit
    this.deposits[sender] = (currentDeposit - requiredDeposit).toString();
    near.log(`Created subaccount: ${newAccountId}`);
  }
}
