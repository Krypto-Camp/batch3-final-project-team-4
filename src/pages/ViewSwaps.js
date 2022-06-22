import React, { useState, useEffect } from 'react'
import styled from 'styled-components';
import { parseStatus, parseExpire, getTokensMetadata } from '../utils/functions';

import { BigNumber, ethers } from 'ethers';
import { contractABI, contractAddress, erc721ContractABI  } from '../configs/contract';
import { useSigner, useContract, useAccount, useContractWrite, useWaitForTransaction } from 'wagmi'

import { motion } from 'framer-motion'


/**
 * @TODO  button depends on status
 * @TODO  after approve(only if want nft exists), 
 *        when confirm clicked, use Take() to request pay first,  (do it in one function. need to handle async)
 *        after pay succeed, send confirm()
 * @TODO useWaitForTransaction and add loader

 * @TODO convert all bigNumber before setAllSwaps
 * @TODO useError (optional)
 * @TODO error429 and throttle (pls ask)
 * @TODO fix fake expire date.
 * @TODO fix allSwapsImg, use str index for imgUrl.
 */

export default function ViewSwaps() {
  const [ filter, setFilter ] = useState('expiredDate') // or status
  const [ walletFilter, setWalletFilter ] = useState('') 

  const [ swapsCount, setSwapsCount ] = useState(null) 
  const [ allSwaps, setAllSwaps ] = useState([]) // do not mutate this 
  const [ allSwapsImg, setAllSwapsImg ] = useState([]) // do not mutate this 

  const [ filteredAllSwaps, setFilteredAllSwaps ] = useState([]) // for view. the order changes here.
  const [ confirmedRes, setConfirmRes ] = useState()
  const [ approveNFTres, setApproveNFTres ] = useState()

  const { data: wallet } = useAccount() 
  const { data: signer } = useSigner()
  const contract = useContract({
    addressOrName: contractAddress,
    contractInterface: contractABI,
    signerOrProvider: signer
  })

  //** BUG: CONNECTORS NOT FOUND */
  // const [ confirmedContract, setConfirmedContract ] = useState()
  // const { write:confirmWrite } = useContractWrite(
  //   {
  //     addressOrName: contractAddress,
  //     contractInterface: contractABI,
  //   },
  //   'confirmTransaction',
  //   {
  //     overrides: {
  //       args: [confirmedContract?.id, confirmedContract?.wantNFT, confirmedContract?.wantNFTtokenID ],
  //       from: wallet.address,
  //       value: ethers.utils.parseEther('0.01'),
  //     },
  //   },
  // )

/****************************************
 * FETCHING DATA
 */    
  const getSwapsCount = async() => {
    const res = await contract?.getAllTransactionsCount()
    setSwapsCount(res)
  }
  const getAllSwaps = async() => {
    let all_promise = []
    for (let i=16; i<swapsCount; i++) { 
      all_promise.push( contract?.getTransactionsData(i) )
    }
    Promise.all(all_promise)
      // .then(swaps => swaps.map( (swap, i) => swap.reduce((newSwap, attr) => { if (attr._isBigNumber ) }) )
      .then( swap => setAllSwaps(swap))
  }

    useEffect(() => {
      if (!contract) return
      getSwapsCount().catch( e => console.log(e) )
    }, [contract])

    useEffect(() => {
      getAllSwaps().catch( e => console.log(e) )
    }, [swapsCount])
    
    useEffect(() => {
      console.log("allSwaps useEffect: ", allSwaps)
      getTokensMetadata(allSwaps, setAllSwapsImg)
    }, [allSwaps])

    useEffect(() => {
      // console.log(allSwapsImg)
      setFilteredAllSwaps(allSwapsImg)
    }, [allSwapsImg])


/****************************************
 * USER INPUTS
 */  
  const handleWalletFilter = e => {
    setWalletFilter(e.target.value.toLowerCase())
  }

  useEffect(() => { 
    if (walletFilter === '') setFilteredAllSwaps( allSwapsImg )

    let newSort = allSwapsImg.filter(swap => {
        return swap.requestor.toLowerCase().includes(walletFilter) || swap.receiver.toLowerCase().includes(walletFilter)
    } ) 
    setFilteredAllSwaps( newSort );
  } , [walletFilter])

  const handleFilter = e => {
    setFilter(e.target.value)
  }

  useEffect(() => {
    let newSort = []
    switch (filter) {
      case 'expiredDate':
        newSort = allSwapsImg.sort(function(a,b) { return parseFloat(a.dueDate.toNumber()) - parseFloat(b.dueDate.toNumber()) } ) ;
        setFilteredAllSwaps([...newSort]) 
        return
      case 'status':
        newSort =  allSwapsImg.sort(function(a,b) { return parseFloat(a.state.toNumber()) - parseFloat(b.state.toNumber()) } ) ;
        setFilteredAllSwaps([...newSort]) 
        return 

      default: 
        return null 
    }    
  }, [filter])


  /****************************************************
   * SUBMIT DATA
   * @TODO CHECK APPROVED BEFORE CONFIRM
   */

  const handleApprove = async(e) => {
    e.preventDefault()
    const transacId = e.target.id
    // approve nft in wallet first 
    const nft_contract = new ethers.Contract(allSwaps[transacId].wantNFT, erc721ContractABI, signer);
    const approve_res = nft_contract.approve(contractAddress, allSwaps[transacId].wantToken.toNumber()  )
    setApproveNFTres(approve_res)
  }
  const { data: approvedData, isLoading: isApprovedLoading } = useWaitForTransaction({
    hash: approveNFTres?.hash,
  })

  const handleConfirm = e => {
    e.preventDefault()
    const transacId = e.target.id
    confirmSwap(allSwaps[transacId].transactionId, allSwaps[transacId].wantNFT, allSwaps[transacId].wantToken.toNumber()  ).catch( e => console.log(e) )
  }

  const confirmSwap = async( id, wantNFT, wantNFTtokenID ) => {
    // setConfirmedContract({id:id, wantNFT:wantNFT, wantNFTtokenID:wantNFTtokenID})
    // sign contract
    const confirm_res = await contract?.confirmTransaction(id, wantNFT, wantNFTtokenID )
    setConfirmRes(confirm_res)

  }
  const { data: ConfirmedData, isLoading: isConfirmedLoading } = useWaitForTransaction({
    hash: confirmedRes?.hash,
  })

  // useEffect(() => {
  //   (async() => {
  //     const confirm_res = await confirmWrite()
  //     setConfirmRes(confirm_res)
  //   })()
    
  // }, [confirmedContract?.id, confirmedContract?.wantNFT, confirmedContract?.wantNFTtokenID])
  
  return (
    // <>
      // {/* <motion.div 
      //   style={{ height:"100%", width:"100%", background:"#F00", position:"absolute", zIndex:-1 }}
      //   initial={{y: "0%" }}
      //   animate={{ height: "100%" }}
      //   exit={{ y: "100%" }}
      //   // transition={{ }}
      // ></motion.div> */}
    
      <StyledAllswapsContainer
        as={motion.div}
        initial={{ width: 0 }}
        animate={{ width: "100%" }}
        exit={{ x: window.innerWidth }}
        transition={{
          type:"spring",
          stiffness: 260,
          damping: 20
        }}
      > 

        <StyledSearch className='header'>
          <h3> All swaps records </h3>
          <input type="text" id="search-bar" placeholder="Search for NFT address here.." onChange={handleWalletFilter}/>
          <p> found {filteredAllSwaps?.length} results... </p>
          <div> or </div>
          <label > by filter:</label>
          <select name="filter" onChange={handleFilter}>
            <option value="expiredDate"> expired date </option>
            <option value="status"> status </option>
          </select>
        </StyledSearch>
        
        <StyledContent>
            { filteredAllSwaps?.length ? 
            filteredAllSwaps.map( (swap, i) => 
              <StyledCardWrap key={i}>
                <StyledUpperContent>
                <div> transcId: {swap.transactionId.toNumber()} </div>
                  <StyledCol>
                      <StyledCards key={i} image_url={swap[0]}> 
                          <StyledCardTop>
                              <StyledCardItems> {swap.myNFT}</StyledCardItems>
                              <StyledCardItems># {swap.myToken.toNumber()}</StyledCardItems>
                              <StyledCardItems> make-up price:   {ethers.utils.formatEther(BigNumber.from( swap.myETH)) } eth </StyledCardItems>
                          </StyledCardTop>
                          
                          <StyledCardItems>Initiator: {swap.requestor} </StyledCardItems>
                      </StyledCards>
                  </StyledCol>

                  <StyledCol>
                    <StyledCol>
                      <StyledCards key={i} image_url={swap[1]}> 
                          <StyledCardTop>
                              <StyledCardItems> {swap.wantNFT}</StyledCardItems>
                              <StyledCardItems># {swap.wantToken.toNumber()}</StyledCardItems>
                              <StyledCardItems> make-up price: {ethers.utils.formatEther(BigNumber.from( swap.wantETH )) } eth </StyledCardItems>
                          </StyledCardTop>
                          
                          <StyledCardItems>Receiver: {swap.receiver} </StyledCardItems>
                      </StyledCards>
                  </StyledCol>

                  </StyledCol>
                </StyledUpperContent>

                <StyledCorner> 
                  <div>expire in { parseExpire(swap.dueDate.toNumber()) } days</div>
                  status: {parseStatus(swap.state.toNumber()) } 
                  { swap.state.toNumber() === 0 && 
                    <StyledButton onClick={ handleApprove } id={i}> 
                      { isApprovedLoading ? 'processing...': approvedData ? 'succeeded!' : 'approve'} 
                    </StyledButton> }
                  { swap.state.toNumber() === 0 && 
                    <StyledButton onClick={ handleConfirm } id={i}> 
                      { isConfirmedLoading ? 'processing...': ConfirmedData ? 'succeeded!' : 'confirm'}
                    </StyledButton> }
                
                </StyledCorner>
                {/* <StyledCorner> expiredDate: {swap[9].toNumber()} </StyledCorner> */}
              </StyledCardWrap> 
            ) : 'loading' }
        </StyledContent>
      </StyledAllswapsContainer>
    // </>
  )
}



  

const StyledAllswapsContainer = styled(motion.div)`
  width: auto;
  min-height: 100vh;
  padding-top: 100px;
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: center;
  
  background: rgb(223,173,155);
  background: linear-gradient(153deg, rgba(223,173,155,0.9612219887955182) 9%, rgba(166,196,213,1) 34%, rgba(81,78,158,1) 84%, rgba(7,5,43,1) 100%);
`
const StyledSearch = styled.div`
  position: relative;
  width: 400px;
`
const StyledContent = styled.div`
  position: relative;
  // height: 400vh
  padding-top: 120px;
  padding-bottom: 200px;
`
// =================
const StyledCardWrap = styled.div`
  width: auto;
  height: auto;
  padding: 20px;
  margin: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  background: #dedbc850;
  border-radius: 20px;

  font-family: VT323;
  font-size:1.2rem;

`
const StyledUpperContent = styled.div`
  display: flex; 
  justify-content: space-between;
`

const StyledCol = styled.div`
  width:500px;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: start;
`
const StyledCards = styled.div`
// min-width: 500px;
// min-height: 500px;
  width: 400px;
  height: 400px;
  padding: 30px;
  margin: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: start;

  background: #ebff12;
  border-radius: 20px;

  font-family: VT323;
  font-size: 1.2rem;
  background-image: ${({image_url}) => `url( ${image_url} )`} ;
  background-size: 400px 400px;

`
const StyledCardTop = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: start;

`
const StyledCardItems = styled.div`
  max-width: 80%;
  overflow: hidden;
  white-space:nowrap;
  text-overflow: ellipsis;
  padding: 10px;
  margin: 5px;

  border: 1px solid #000;
  border-radius: 30px;
  background: #FFFFFF80;
`
const StyledCorner = styled.div`
  width:100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: end;
`

const StyledButton = styled.button`
  display: inline-flex;
  justify-content: center; 
  align-items: center; 
  padding: 15px;
  margin: 10px;

  height: auto;
  max-height: 35px;
  background-color: #ebff12;
  border-radius: 5px;
  border-color: orange;
  box-shadow: 0px 2px 2px 1px #0F0F0F;
  cursor: pointer;

  font-family: "VT323";
  font-size: 1.2rem;

  &:hover {
    background-color: #12f7ff;
  }
`