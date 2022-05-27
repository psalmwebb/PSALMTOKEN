
const PsalmToken = artifacts.require("PsalmToken.sol");

contract('Psalm Token',(accounts)=>{

    let psalmToken;
    let adminAccount = accounts[0];

    it('Deploys the contract', async ()=>{
        psalmToken = await PsalmToken.deployed();
    })

    it('It calls the name of the token and symbol', async ()=>{

        let name = await psalmToken.name();
        let symbol = await psalmToken.symbol();

        assert.equal(name,"Psalm Token","It checks the name of the token");
        assert.equal(symbol,"PST","it checks the name of the symbol");
    })

    it('It reads the total supply of "Psalm Token"', async ()=>{

        let totalSupply = await psalmToken.totalSupply();

        assert.equal(totalSupply,1_000_000)
    })

    it("it checks tha balance of the contract creator to equal the initial supply", async ()=>{

        let creatorBalance = await psalmToken.balanceOf(adminAccount);

        assert.equal(creatorBalance,1_000_000);
    })

    // it('it transfers token ownership', async ()=>{
    //     let account0 = accounts[0];
    //     let account1 = accounts[1]

    //     let returnValue = await psalmToken.transfer.call(account1,4_00_000);

    //     assert.equal(returnValue,true,'Return value of "Transfer" should output TRUE');

    //     let receipt = await psalmToken.transfer(account1,2_00_000,{from:account0});
        
    //     let balanceOfAccount0 = await psalmToken.balanceOf(account0);
    //     let balanceOfAccount1 = await psalmToken.balanceOf(account1);

    //     assert.equal(balanceOfAccount0.toNumber(),8_00_000,"checking the balance of Account 0");
    //     assert.equal(balanceOfAccount1.toNumber(),2_00_000,"checking the balance of Account 1");
    // })

    it('approves an account to send tokens from owner account', async ()=>{

        let owner = adminAccount;
        let spender = accounts[1];

        // let returnType = await psalmToken.approve.call(spender,1000);

        // assert.equal(returnType,true, "Checks the return type of the approval function");

        await psalmToken.approve(spender,1000)

        let allowance = await psalmToken.allowance(owner,spender);

        assert.equal(allowance.toNumber(),1000,"Checking allowance");

    })

    it("makes delegated transfers", async ()=>{
        let owner = accounts[0];
        let spender = accounts[1];
        let recipient = accounts[2];

        await psalmToken.transferFrom(owner,recipient,500,{from:spender});

        let balanceResp = await psalmToken.balanceOf(recipient);

        assert.equal(balanceResp.toNumber(),500, "Checks tha balance of recipient after making delegated transfer");

        let allowance = await psalmToken.allowance(owner,spender);

        assert.equal(allowance.toNumber(),500," checks the allowance of the spender");
    })
})