import React from 'react'
import AddAssetTab from './AddAssetTab/AddAssetTab'


/**
 * @TODO fetch HAVE/WANT TAB data here and pass it to CreateSwapContext
 * need to submit it with form data
 */
export default function WantNFTContent({ fetchedWantData }) {
  return (
    <>
    <div>WantNFTContent</div>
    <div> {fetchedWantData}... </div>
    </>
  )
}
