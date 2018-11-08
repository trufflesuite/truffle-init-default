let MetaCoin = artifacts.require("MetaCoin");

contract("MetaCoin", accounts => {
  before("new instance of MetaCoin", async () => {
    MetaCoin = await MetaCoin.new();
  });

  it("should put 10000 MetaCoin in the first account", () => {
    MetaCoin.getBalance.call(accounts[0]).then(balance => {
      expect(balance.toNumber()).to.be.deep.eq(10000);
    });
  });
  it("should call a function that depends on a linked library", () => {
    let metaCoinBalance;
    let metaCoinEthBalance;

    return MetaCoin.getBalance
      .call(accounts[0])
      .then(outCoinBalance => {
        metaCoinBalance = parseInt(outCoinBalance);
        return MetaCoin.getBalanceInEth.call(accounts[0]);
      })
      .then(outCoinBalanceEth => {
        metaCoinEthBalance = parseInt(outCoinBalanceEth);
      })
      .then(() => {
        expect(metaCoinEthBalance).to.be.deep.eq(2 * metaCoinBalance);
      });
  });
  it("should send coin correctly", () => {
    // Get initial balances of first and second account.
    const account_one = accounts[0];
    const account_two = accounts[1];

    let account_one_starting_balance;
    let account_two_starting_balance;
    let account_one_ending_balance;
    let account_two_ending_balance;

    const amount = 10;

    return MetaCoin.getBalance
      .call(account_one)
      .then(balance => {
        account_one_starting_balance = parseInt(balance);
        return MetaCoin.getBalance.call(account_two);
      })
      .then(balance => {
        account_two_starting_balance = parseInt(balance);
        return MetaCoin.sendCoin(account_two, amount, { from: account_one });
      })
      .then(() => MetaCoin.getBalance.call(account_one))
      .then(balance => {
        account_one_ending_balance = parseInt(balance);
        return MetaCoin.getBalance.call(account_two);
      })
      .then(balance => {
        account_two_ending_balance = parseInt(balance);

        expect(account_one_ending_balance).to.be.deep.eq(
          account_one_starting_balance - amount
        );
        expect(account_two_ending_balance).to.be.deep.eq(
          account_two_starting_balance + amount
        );
      });
  });
});
