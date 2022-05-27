import { useContext } from "react"
import { web3Context } from "../contexts/web3ContextProvider"



export default function BuyTokenTab()
{
    const {user,tokenInfo,
           tokenToBuyPrice,setTokenToBuyPrice,
            tokenToBuy,setTokenToBuy,
            PSTSaleContractRef,web3,updateInterface,setError} = useContext(web3Context);

    function handleChange(e){
        setTokenToBuy(e.target.value);
        setTokenToBuyPrice(Number(e.target.value) * Number(tokenInfo.price))
        setError('');
    }

    async function buyToken(){

        if(!tokenToBuy) return setError('Enter the amount of PST you want to buy..');

        setError('');
        let data = await PSTSaleContractRef.current.methods.buyToken(tokenToBuy).encodeABI();
    
        // Construct transaction object...
        let txObject = {
          nonce: web3.utils.toHex(await web3.eth.getTransactionCount(user.account)), // ignored by MetaMask
          gasPrice: web3.utils.toHex(await web3.eth.getGasPrice()), // customizable by user during MetaMask confirmation.
          gas: web3.utils.toHex(100000), // customizable by user during MetaMask confirmation.
          to: PSTSaleContractRef.current._address, // Required except during contract publications.
          from: user.account, // must match user's active address.
          value: web3.utils.toHex(Number(tokenToBuy) * web3.utils.toWei(tokenInfo.price,'ether')), // Only required to send ether to the recipient from the initiating external account.
          data, // Optional, but used for defining smart contract creation and interaction.
          chainId: web3.utils.toHex(await web3.eth.getChainId())
        }
    
        console.log(txObject);
    
        // Prompt Metamask to sign and send transaction
        try{
            const txReceipt = await window.ethereum.request({
                method:"eth_sendTransaction",
                params:[txObject]
            })
            console.log(txReceipt);
            updateInterface([user.account]);
        }
        catch(e){
            console.log(e);
        }
      }

    return (
        <>
            <div className="d-flex">
                <input type="number" placeholder ="Enter amount of PST..." className="form-control rounded-0" onChange={handleChange} value={tokenToBuy} style={{'width':'90%'}}/>
                <button style={{'width':'10%'}} onClick={buyToken} className="btn btn-success btn-sm rounded-0">BUY TOKEN</button>
            </div>
            <div className='p-3 bg-light rounded mt-1'>
                <h5>TOTAL : {tokenToBuyPrice} ETH</h5>
            </div>
        </>
    )
}