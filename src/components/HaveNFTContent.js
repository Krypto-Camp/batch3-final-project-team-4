import React from 'react'
// import AddAssetTab from './AddAssetTab/AddAssetTab'

/**
 * @TODO fetch HAVE/WANT TAB data here and pass it to CreateSwapContext
 * need to submit it with form data
 */
export default function HaveNFTContent({ fetchedHaveData }) {
  return (
      <>
    <div>HaveNFTContent</div>
      <div> {fetchedHaveData} </div>
      </>
  )
}
