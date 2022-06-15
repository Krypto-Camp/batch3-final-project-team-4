import React from 'react'
// import AddAssetTab from './AddAssetTab/AddAssetTab'

/**
 * @TODO fetch HAVE/WANT TAB data here and pass it to CreateSwapContext
 * need to submit it with form data
 */
export default function HaveNFTContent({ fetchedHaveData }) {
  const { title, haveTokenId, haveNFTAddress } = fetchedHaveData;
  return (
      <>
       <div>HaveNFTContent</div>
        <div> {title} </div>
      </>
  )
}
