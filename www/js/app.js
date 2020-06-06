fetch('/api/mongo/post')
.then( rawData => {

    if( rawData.ok ){
        return rawData.json()
    }
})
.then( jsonData => {
    for( let item of jsonData.data ){
        console.log(item)
    }
})
.catch( fetchError => {
    console.log(fetchError)
})