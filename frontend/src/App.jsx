import { useContext, useEffect } from 'react'
import BuyTokenTab from './components/BuyTokenTab';
import TransactionTab from './components/TransactionTab';
import UserInfoTab from './components/UserInfoTab';
import { web3Context } from './contexts/web3ContextProvider';


function App() {

  const {user,web3,updateInterface,error} = useContext(web3Context)


  useEffect(()=>{
    window.ethereum.on('accountsChanged',(accounts)=>{
      updateInterface(accounts);
    })
  },[])


  async function connectWallet(){
    try{
      let accounts = await window.ethereum.request({
        method:"eth_requestAccounts"
      })
  
      switchNetwork();
      updateInterface(accounts);
    }
    catch(e){
      console.log(e);
    }

  }


  async function switchNetwork(){
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId:web3.utils.toHex(await web3.eth.getChainId())}],
      });
      console.log("You have switched to the right network")
      
    }catch (switchError) {
      // The network has not been added to MetaMask
      if (switchError.code === 4902) {
          console.log("Please add the Ganache network to MetaMask")
        }
      console.log("Cannot switch to the network") 
    }
  }


  return (
    <div className="App">
         <div className="col-8 offset-2 p-3 mt-2">
               <div>
                <h4 className="text-center">Welcome to PSALM TOKEN ICO WEBSITE</h4>
              </div>
              {error && 
                <div className='alert alert-danger text-center'>
                   {error}
                </div>
              }

              {user.account && <UserInfoTab/>}

             {!user.account &&  <div className="mt-5 d-flex justify-content-center border p-5 rounded bg-light">
                <div>
                    <button className="btn btn-success btn-lg" onClick={connectWallet}>CONNECT WALLET</button>
                    <div>
                      <small className='text-muted'>Connect your wallet to buy PST</small>
                    </div>
                </div>
              </div>
             }

              {user.account && <BuyTokenTab/>}

              {user.account && <TransactionTab/>}
        </div>
        
    </div>
  )
}

export default App
