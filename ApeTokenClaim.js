"use strict";
require("dotenv").config();

var Web3 = require("web3");

var ApeTokenClaimABI = require("./abi/ApeTokenClaim.json");

(async () => {
  const web3 = new Web3(process.env.WEB3_API);
  var tokenIndexCheck = 1000;

  let ApeClaimContractAddress = "0x025C6da5BD0e6A5dd1350fda9e3B6a614B205a1F";

  const ApeClainContract = await new web3.eth.Contract(
    ApeTokenClaimABI,
    ApeClaimContractAddress
  );

  var tokensClaimableByBAYCHolder = toEthUnit(
    await ApeClainContract.methods.ALPHA_DISTRIBUTION_AMOUNT().call()
  );
  var tokensClaimableByMAYCHolder = toEthUnit(
    await ApeClainContract.methods.BETA_DISTRIBUTION_AMOUNT().call()
  );

  var tokensClaimableByBAKCHolder = toEthUnit(
    await ApeClainContract.methods.GAMMA_DISTRIBUTION_AMOUNT().call()
  );

  console.log(
    "Tokens claimable by BAYC holder is " + tokensClaimableByBAYCHolder
  );
  console.log(
    "Tokens claimable by MAYC holder is " + tokensClaimableByMAYCHolder
  );
  console.log(
    "Extra Tokens claimable by BAKC holder (should have BAYC/MAYC) is " +
      tokensClaimableByBAKCHolder
  );

  try {
    for (let i = 1; i < tokenIndexCheck; i++) {
      var isBAYCClaimable = await ApeClainContract.methods
        .alphaClaimed(i)
        .call();
      var isMAYCClaimable = await ApeClainContract.methods
        .betaClaimed(i)
        .call();
      var isBAKCClaimable = await ApeClainContract.methods
        .gammaClaimed(i)
        .call();

      if (!isBAYCClaimable) {
        console.log(
          "BAYC #" + i + " is claimable for " + tokensClaimableByBAYCHolder
        );
      }
      if (!isMAYCClaimable) {
        console.log(
          "MAYC #" + i + " is claimable for " + tokensClaimableByMAYCHolder
        );
      }

      if (!isBAKCClaimable) {
        console.log(
          "BAKC #" + i + " is claimable for " + tokensClaimableByBAKCHolder
        );
      }
    }
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();

function toEthUnit(wei) {
  var num = Web3.utils.fromWei(wei);
  var value = parseFloat(num).toFixed(6);
  return value;
}
