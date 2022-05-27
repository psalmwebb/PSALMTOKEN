const PsalmToken = artifacts.require("PsalmToken.sol");
const PsalmTokenSale = artifacts.require("PsalmTokenSale.sol");

module.exports = async function(deployer){

    // price of 1 PsalmToken => 0.0001 Ether;

    let psalmTokenPrice = 100000000000000;

    await deployer.deploy(PsalmToken,100000000);

    await deployer.deploy(PsalmTokenSale,PsalmToken.address,psalmTokenPrice);
}