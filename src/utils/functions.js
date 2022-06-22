export const parseStatus = (status) => {
    switch (status){
      case 0:
      return 'pending'
      case 1:
      return 'revoked'
      case 2:
      return 'completed'
      default:
        return ''
    }
  }
  
  export const parseExpire = (secs) => {
     const time_left = secs - Math.floor(Date.now() / 1000) 
     return Math.ceil( time_left/60/60/24 ) < 7 ? Math.ceil( time_left/60/60/24 ) : 7
    //  @TODO fix this fake expire date.
  }
  
  const throttlePromise = async (throttle, promiseArr) => {
    var promiseArrGroup = [];
    var idx = 0;
    while (idx < promiseArr.length) {
      promiseArrGroup.push(promiseArr.slice(idx, idx += throttle));
    }
    
    const res = []
    for (const pArr of promiseArrGroup){
      const pRes= await Promise.all(pArr.map((p) => p.apply()));
      res.push(...pRes);
    }
    
    return res
  }
  
  export const getTokensMetadata = (allSwaps, setAllSwapsImg) => {
      if(!allSwaps?.length) return
      // format allSwaps
      let formattedAllSwaps = allSwaps.reduce((formattedParam, param, i) => {
        formattedParam.push({ nft_addr: param[3], token_id: param[5].toNumber() })
        formattedParam.push({ nft_addr: param[4], token_id: param[6].toNumber() })
        return formattedParam
      }, [])
  
      // promise all this and throttle it if necessary.
      // const allFetch = formattedAllSwaps.map((token) => 
      //   fetch(
      //     `https://testnets-api.opensea.io/api/v1/assets?asset_contract_addresses=${formattedAllSwaps[0].nft_addr}&token_ids=${formattedAllSwaps[0].token_id}`,
      //     { method: "GET", headers: { Accept: "application/json" } }
      //   )
      // )
      
      const genReqStr = formattedAllSwaps?.reduce((newStr, param, i) => {
        return newStr += `token_ids=${param.token_id}&asset_contract_addresses=${param.nft_addr}&`
      }, '' ).slice(0, -1)
  
      fetch(
        `https://testnets-api.opensea.io/api/v1/assets?${genReqStr}`,
        { method: "GET", headers: { Accept: "application/json" } }
      ).then(response => response.json()).then(({ assets }) => {
  
        let formattedData = assets.reduce((formattedAsset, attr, i) => { 
            let key = attr.asset_contract.address + `#${attr.token_id}`
            formattedAsset[ key ] = ({
              description: attr.description || '',
              name: attr.name || '',
              token_id: attr.token_id || '',
              nft_address: attr.asset_contract.address || '',
              image_url: attr.image_url || '',
            })
          return formattedAsset
        }, {})
        // console.log('formattedData: ', formattedData)
  
        let allSwapsWithImg = allSwaps.map((swap) => {
          let haveImgKey =  `${swap.myNFT}#${swap.myToken}` 
          let wantImgKey = `${swap.wantNFT}#${swap.wantToken}` 
          return  [formattedData[haveImgKey.toLocaleLowerCase()]?.image_url, formattedData[wantImgKey.toLocaleLowerCase()]?.image_url]
        })
  
        setAllSwapsImg( allSwaps.map(( (swap, i) => ({...swap, ...allSwapsWithImg[i] }) )) )
  
        // allSwapsRef.current = allSwaps.map(( (swap, i) => ({...swap, ...allSwapsWithImg[i] }) ))
        // console.log("allSwapsRef.current: ", allSwapsRef.current)
      }).catch(err => console.error(err));
  }
  

 export const renderNFTData = ( addr, token_id, handletHaveNFT ) => {
    fetch(
      `https://testnets-api.opensea.io/api/v1/asset/${addr}/${token_id}`,
      { method: "GET", headers: { Accept: "application/json" } }
    ).then(response => response.json())
    .then(( assets ) => {

      let formattedData = {
          description: assets.description || '',
          name: assets.name || '',
          token_id: assets.token_id || '',
          nft_address: assets.asset_contract.address || '',
          schema_name: assets.asset_contract.schema_name || '',
          image_url: assets.image_url || '',
          id: assets.id || '',
          owner: assets.owner.address || ''
        }

        handletHaveNFT( formattedData )
    }).catch( err => console.error(err) )


  }
