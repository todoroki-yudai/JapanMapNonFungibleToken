import * as BigNumber from "bignumber.js";
import * as chai from "chai";
import * as Web3 from "web3";
import * as ABIDecoder from "abi-decoder";

import {PrefectureTokenContract} from "../../types/generated/prefecture_token";
import {BigNumberSetup} from "./utils/bignumber_setup.js";
import {chaiSetup} from "./utils/chai_setup.js";
import {INVALID_OPCODE, REVERT_ERROR} from "./utils/constants";
import {LogApproval, LogTransfer, LogMint, LogSnatch} from "./utils/logs";

// Set up Chai
chaiSetup.configure();
const expect = chai.expect;

// Configure BigNumber exponentiation
BigNumberSetup.configure();

// Import truffle contract instance
const mintablePrefectureContract = artifacts.require("PrefectureToken");

// Initialize ABI Decoder for deciphering log receipts
ABIDecoder.addABI(mintablePrefectureContract.abi);

contract("Prefecture Contract", (ACCOUNTS) => {
    let mintablePrefecture: PrefectureTokenContract;

    const TOKEN_NAME = "Prefecture";
    const TOKEN_SYMBOL = "PFT";

    const CONTRACT_OWNER = ACCOUNTS[0];
    const TOKEN_OWNER_1 = ACCOUNTS[1];
    const TOKEN_OWNER_2 = ACCOUNTS[2];
    const TOKEN_OWNER_3 = ACCOUNTS[3];

    const TOKEN_NAME_1 = "prefecture1";
    const TOKEN_NAME_2 = "prefecture2";
    const TOKEN_NAME_3 = "prefecture3";
    const TOKEN_NAME_4 = "prefecture4";

    const TOKEN_ID_1 = new BigNumber.BigNumber(1);
    const TOKEN_ID_2 = new BigNumber.BigNumber(2);
    const TOKEN_ID_3 = new BigNumber.BigNumber(3);
    const TOKEN_ID_4 = new BigNumber.BigNumber(4);
    const NONEXISTENT_TOKEN_ID = new BigNumber.BigNumber(100);
    const NULL_ADDRESS = "0x0000000000000000000000000000000000000000";

    const TX_DEFAULTS = { from: CONTRACT_OWNER, gas: 4000000 };

    const deployPrefecture = async () => {
        const instance =
            await mintablePrefectureContract.new(TX_DEFAULTS);

        // The generated contract typings we use ingest raw Web3 contract instances,
        // so we create a Web3 contract instance from the Truffle contract instance

        const web3ContractInstance =
            web3.eth.contract(instance.abi).at(instance.address);

        mintablePrefecture = new PrefectureTokenContract(
            web3ContractInstance, TX_DEFAULTS);
    };

    const deployAndInitNft = async () => {
        await deployPrefecture();

        await mintablePrefecture.mint
            .sendTransactionAsync(TOKEN_ID_1, TOKEN_NAME_1, new BigNumber.BigNumber(1));
        await mintablePrefecture.mint
            .sendTransactionAsync(TOKEN_ID_2, TOKEN_NAME_2, new BigNumber.BigNumber(1));
        await mintablePrefecture.mint
            .sendTransactionAsync(TOKEN_ID_3, TOKEN_NAME_3, new BigNumber.BigNumber(1));
    };

    before(deployPrefecture);

    describe("General Prefecture Metadata", () => {
        it("should expose name variable", async () => {
            const test =  await mintablePrefecture.name.callAsync();
            await expect(mintablePrefecture.name.callAsync()).to.eventually.equal(TOKEN_NAME);
        });

        it("should expose symbol variable", async () => {
            await expect(mintablePrefecture.symbol.callAsync()).to.eventually.equal(TOKEN_SYMBOL);
        });
    });

    describe("#totalSupply()", async () => {
        it("should return 0 for initial supply", async () => {
            await expect(mintablePrefecture.totalSupply.callAsync()).to.eventually.bignumber.equal(0);
        });

        it("should return correct current supply after each mint", async () => {
            await mintablePrefecture.mint
                .sendTransactionAsync(TOKEN_ID_1, TOKEN_NAME_1, new BigNumber.BigNumber(1));
            await expect(mintablePrefecture.totalSupply.callAsync()).to.eventually.bignumber.equal(1);

            await mintablePrefecture.mint
                .sendTransactionAsync(TOKEN_ID_2, TOKEN_NAME_2, new BigNumber.BigNumber(1));
            await expect(mintablePrefecture.totalSupply.callAsync()).to.eventually.bignumber.equal(2);

            await mintablePrefecture.mint
                .sendTransactionAsync(TOKEN_ID_3, TOKEN_NAME_3, new BigNumber.BigNumber(1));
            await expect(mintablePrefecture.totalSupply.callAsync()).to.eventually.bignumber.equal(3);
        });
    });

    describe("#getToken()", () => {
        before(deployAndInitNft);

        describe("user approves transfer for token he doesn't own", () => {
            let res: any;
            before(async () => {
                res = await mintablePrefecture.getToken.callAsync(
                                          new BigNumber.BigNumber(1));
                    // new BigNumber.BigNumber(1), { from: TOKEN_OWNER_1 });
            });
            it("token id", async () => {
                expect(res[0]).to.bignumber.equal(1);
            });
            it("token name", async () => {
                expect(res[1]).to.equal(TOKEN_NAME_1);
            });
            it("weiValue", async () => {
                expect(res[2]).to.bignumber.equal(1);
            });
            it("owner address", async () => {
                const ownerAddr = await mintablePrefecture.ownerOf.callAsync(
                                                                  TOKEN_ID_1);
                expect(res[3]).to.equal(ownerAddr);
            });
        });

    });

    describe("#mint()", () => {
      before(deployAndInitNft);

      describe("mint can't same token id", () => {

          it("should throw", async () => {
              await expect(mintablePrefecture.mint
                .sendTransactionAsync(TOKEN_ID_1, TOKEN_NAME_1,
                    new BigNumber.BigNumber(1)))
                        .to.eventually.be.rejectedWith(REVERT_ERROR);
          });

      });

      describe("should emit mint log", () => {
          let res: Web3.TransactionReceipt;
          let mintLog: ABIDecoder.DecodedLog;
          let _: ABIDecoder.DecodedLog;

          before(async () => {
              const txHash = await mintablePrefecture.mint.sendTransactionAsync(
                      TOKEN_ID_4,
                      TOKEN_NAME_4,
                      new BigNumber.BigNumber(1));
              res = await web3.eth.getTransactionReceipt(txHash);
              [_, mintLog] = ABIDecoder.decodeLogs(res.logs);
          });

          it("should emit mint log", () => {
              const logExpected =
                  LogMint(mintablePrefecture.address,
                      TOKEN_ID_4,
                      new BigNumber.BigNumber(1));

              expect(mintLog).to.deep.equal(logExpected);
          })

      });

    });

    describe("#snatch()", () => {
      before(deployAndInitNft);

      describe("snatch tokenid[1] value is 1", () => {
          let res: Web3.TransactionReceipt;
          let _: ABIDecoder.DecodedLog;
          let snatchLog: ABIDecoder.DecodedLog;

          before(async () => {
              const txHash = await mintablePrefecture.snatch.sendTransactionAsync(
                      TOKEN_ID_1,
                      { from: TOKEN_OWNER_1, value: new BigNumber.BigNumber(3) });
              res = await web3.eth.getTransactionReceipt(txHash);
              [_, _, snatchLog] = ABIDecoder.decodeLogs(res.logs);
              console.log(snatchLog);
          });

          it("sufficient wei", () => {
              const logExpected =
                  LogSnatch(
                      mintablePrefecture.address,
                      TOKEN_ID_1,
                      new BigNumber.BigNumber(3),
                      CONTRACT_OWNER,
                      TOKEN_OWNER_1
                  );
              expect(snatchLog).to.deep.equal(logExpected);
          });

          it("change token weiValue", () => {
              let res: any;
              before(async () => {
                  res = await mintablePrefecture.getToken.callAsync(
                                            new BigNumber.BigNumber(1));
              });
              it("token weiValues is 2", async () => {
                  expect(res[2]).to.bignumber.equal(2);
              });
          });

          it("insufficient wei", async () => {
              await expect(mintablePrefecture.snatch.sendTransactionAsync(
                    TOKEN_ID_1,
                    { from: TOKEN_OWNER_2,
                      value: new BigNumber.BigNumber(2)
                    })).to.eventually.be.rejectedWith(REVERT_ERROR);
          });

          it("same owner", async () => {
              await expect(mintablePrefecture.snatch.sendTransactionAsync(
                    TOKEN_ID_1,
                    { from: TOKEN_OWNER_1,
                      value: new BigNumber.BigNumber(100)
                    })).to.eventually.be.rejectedWith(REVERT_ERROR);
          });

      });

    });

});
