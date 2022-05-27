import { createContext,useEffect,useState,useRef} from "react";
import Web3 from "web3";
import PsalmTokenABI from "../contractsAbi/PsalmTokenABI.json";
import PsalmTokenSaleABI from "../contractsAbi/PsalmTokenSaleABI.json";

export const web3Context = createContext();

export default function Web3ContextProvider({children})
{
    const [web3,setWeb3] = useState({});

    const [user,setUser] = useState({});
    const [tokenInfo,setTokenInfo] = useState({});
    const [tokenToBuy,setTokenToBuy] = useState(1);
    const [tokenToBuyPrice,setTokenToBuyPrice] = useState(0);
    const [transactions,setTransactions] = useState([]);
    const [error,setError] = useState('');
    const PSTContractRef = useRef();
    const PSTSaleContractRef = useRef();  

    useEffect(()=>{

        setWeb3(new Web3('HTTP://127.0.0.1:7545'));

      },[])
    
      useEffect(()=>{
    
        if(Object.keys(web3).length){
           PSTContractRef.current = new web3.eth.Contract(PsalmTokenABI,'0x07F9A5cB947495BA11703222F1716cFc3c986297');
           PSTSaleContractRef.current = new web3.eth.Contract(PsalmTokenSaleABI,'0x16c01Bbd2c265A5B46078EB8e7E4C54E1b35f5BA');
        }
    
      },[Object.keys(web3).length])

      async function updateInterface(accounts){
        setUser({account:accounts[0]})
    
        let ETHbalance = await web3.eth.getBalance(accounts[0]); // return in Wei
        setUser((prevUser)=>{
           return {...prevUser,
                   ETHbalance:web3.utils.fromWei(ETHbalance,'ether'),
                  }
        })
    
        let PSTBalance = await PSTContractRef.current.methods.balanceOf(accounts[0]).call();
    
        setUser((prevUser)=>{
           return {...prevUser,PSTBalance}
        })
    
        // console.log(PSTSaleContractRef.current)
    
        let tokensSold = await PSTSaleContractRef.current.methods.tokensSold().call();
        let tokenBalance = await PSTContractRef.current.methods.balanceOf(PSTSaleContractRef.current._address).call();
        let tokenPrice = await PSTSaleContractRef.current.methods.tokenPrice().call();
    
        setTokenInfo({tokenLeft:`${tokensSold} / ${Number(tokenBalance) + Number(tokensSold)} PST sold`})
    
        setTokenInfo((prevTokenInfo)=>{
            
          return {...prevTokenInfo,price:`${web3.utils.fromWei(tokenPrice,'ether')}`}
        })
    
      }

    return (
       <web3Context.Provider value={{
           web3,setWeb3,
           user,setUser,
           tokenInfo,setTokenInfo,
           tokenToBuy,setTokenToBuy,
           tokenToBuyPrice,setTokenToBuyPrice,
           PSTContractRef,PSTSaleContractRef,
           error,setError,updateInterface,
           transactions,setTransactions
           }}>

           {Object.keys(web3).length ? children : <div>Loading...</div>}

       </web3Context.Provider>    
    )
}