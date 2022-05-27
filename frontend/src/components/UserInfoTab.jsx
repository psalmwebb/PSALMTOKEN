import { useContext } from "react"
import { web3Context } from "../contexts/web3ContextProvider"



export default function UserInfoTab(){

    const {user,tokenInfo} = useContext(web3Context);

    return (
      <>
        <div className="border p-3 rounded bg-light mt-4">
            <h6>Acc : {user.account ? user.account : 'Not connected'}</h6>
            <h6>ETH Balance : {user.ETHbalance ? user.ETHbalance + ' ETH' : '0 ETH'}</h6>
            <h6>PST Balance : {user.PSTBalance}</h6>
        </div>
        <div className='d-flex justify-content-between p-2'>
            <h5 className='border p-2 rounded'>{tokenInfo.price ? `${tokenInfo.price} ETH/PST` : ''}</h5>
            <h5 className='border p-2 rounded'>{tokenInfo.tokenLeft}</h5>
        </div>
      </>
    )
}