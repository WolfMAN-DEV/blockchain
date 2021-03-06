const Transaction = require("../../wallet/transaction");
const Wallet = require("../../wallet");
const verifySignature = require("../../utils/verifySignature");

describe("Transaction", () => {
  let transaction, senderWallet, recipient, amount;

  beforeEach(() => {
    senderWallet = new Wallet();
    recipient = "recipient-public-key";
    amount = 50;
    transaction = new Transaction({ senderWallet, recipient, amount });
  });

  it("Has an `id`.", () => {
    expect(transaction).toHaveProperty("id");
  });

  describe("outputMap", () => {
    it("Has an `outputMap.", () => {
      expect(transaction).toHaveProperty("outputMap");
    });

    it("Outputs the amount to the recipient.", () => {
      expect(transaction.outputMap[recipient]).toEqual(amount);
    });

    it("outputs the remaining balance for the `senderWallet`.", () => {
      expect(transaction.outputMap[senderWallet.publicKey]).toEqual(
        senderWallet.balance - amount
      );
    });
  });

  describe("input", () => {
    it("Has an `input`.", () => {
      expect(transaction).toHaveProperty("input");
    });

    it("Has a `timestamp` in the `input`.", () => {
      expect(transaction.input).toHaveProperty("timestamp");
    });

    it("Sets the `amount` to the `senderWallet` `balance`", () => {
      expect(transaction.input.amount).toEqual(senderWallet.balance);
    });

    it("Sets the `address` to the `senderWallet` `publicKey`", () => {
      expect(transaction.input.address).toEqual(senderWallet.publicKey);
    });

    it("Signs the input", () => {
      expect(
        verifySignature({
          publicKey: senderWallet.publicKey,
          data: transaction.outputMap,
          signature: transaction.input.signature,
        })
      ).toBe(true);
    });
  });
});
