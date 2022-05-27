import { useContext, useEffect, useState } from "react"
import { web3Context } from "../contexts/web3ContextProvider"

export default function TransactionTab(){

    const {transactions,setTransactions,PSTSaleContractRef,tokenInfo,user} = useContext(web3Context);

    useEffect(()=>{
       ( async ()=>{
        try{
            PSTSaleContractRef.current.events.Sell({fromBlock:0}).on('connected',(id)=>{
                console.log(id);

            }).on('data',(event)=>{
                console.log(event);
            })
        }
        catch(e){
            console.log(e);
        }
       })();

    },[])


    useEffect(()=>{
       if(!user.account) return 

       PSTSaleContractRef.current.getPastEvents('Sell',{fromBlock:0,toBlock:"latest"})
       .then((sellEvents)=>{
          sellEvents = sellEvents.filter((event)=> event.returnValues.buyer.toLowerCase() === user.account.toLowerCase() );
          setTransactions([...sellEvents.reverse()]);
       })
    },[user.account,user.ETHbalance])

    return (
        <div className="transaction-tab border p-3 mt-3" style={{maxHeight:"350px",overflow:"auto"}}>
            <h5 className="border bg-light p-2" style={{'position':'sticky','top':'0'}}>Your transaction history</h5>
           {
               transactions.map(({returnValues:{buyer,numOfToken}},i)=>(
                   <div className="d-flex justify-content-between border mt-2 p-2" key={i}>
                       <div>
                           <h6>Address</h6>
                           <span>
                               {buyer.toLowerCase() === user.account.toLowerCase() ? 'You' : buyer}
                            </span>
                       </div>
                       <div>
                           <h6>PST Bought</h6>
                           <span>{numOfToken}</span>
                       </div>
                       <div>
                           <h6>Total Price</h6>
                           <span>
                               {tokenInfo.price ?
                                  `${Number(numOfToken) * Number(tokenInfo.price)} ETH`
                                : <small className="text-muted">loading...</small>}
                           </span>
                       </div>
                   </div>
               ))
           }
        </div>
    )
}