import React from 'react'
import AddAssetTab from './AddAssetTab/AddAssetTab'


/**
 * @TODO fetch HAVE/WANT TAB data here and pass it to CreateSwapContext
 * need to submit it with form data
 */
export default function WantNFTContent({ fetchedWantData }) {
  const { title, wantTokenId, wantNFTAddress, amount } = fetchedWantData;


  return (
    <>
    <div>WantNFTContent</div>
    <div> {title} </div>
    </>
  )
}
