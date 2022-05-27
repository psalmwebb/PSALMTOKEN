let PsalmTokenSale = artifacts.require("PsalmTokenSale.sol");
let PsalmToken = artifacts.require("PsalmToken.sol");

contract('Psalm token sale',(accounts)=>{
    let psalmTokenSale;
    let psalmToken;
    let adminAccount = accounts[0];
    let buyer = accounts[1];

    // price of 1 PsalmToken => 0.0001 Ether;
    let psalmTokenPrice = 100000000000000;

    it('initializes psalmToken sale contract', async ()=>{

        psalmTokenSale = await PsalmTokenSale.deployed();
        psalmToken = await PsalmToken.deployed()

        assert.notEqual(psalmTokenSale.address,"0x0",'Checks if the psalm token sale contract has been deployed');

        let tokenPrice = await psalmTokenSale.tokenPrice();

        assert.equal(tokenPrice,psalmTokenPrice,"Checks the price of the token");
    })

    it('transfer 70% of the total tokens to the sale contract', async ()=>{

        await psalmToken.transfer(psalmTokenSale.address,7_00_000,{from:adminAccount});

        assert.equal(await psalmToken.balanceOf(psalmTokenSale.address),7_00_000,'Checks the tokens in the "token sale" contract');

        assert.equal(await psalmToken.balanceOf(adminAccount),3_00_000,"checks the token in the admin account")
    })

    it("sell tokens from 'token sale contract' to buyer", async ()=>{

        let tokenToBuy = 100000;

        await psalmTokenSale.buyToken(tokenToBuy,{from:buyer,value:tokenToBuy * psalmTokenPrice});

       assert.equal(await psalmToken.balanceOf(psalmTokenSale.address),6_00_000,"Checks the balance of token sale contract after sale");

       assert.equal(await psalmToken.balanceOf(buyer),1_00_000,'Checks the balance of the account that just bought some token from the "token sale contract"')

    })

    it("ends the token sale", async ()=>{
       
        try{
            await psalmTokenSale.endSale({from:buyer});
        }
        catch(e){
            console.log("Only admin can end the sale")
        }

        // before ending the sale

        let adminAccountBal = (await psalmToken.balanceOf(adminAccount)).toNumber();

        await psalmTokenSale.endSale({from:adminAccount});

        assert.equal(await psalmToken.balanceOf(adminAccount),adminAccountBal + 6_00_000, 'Checks the balance of the admin after ending token sale');

    })
})