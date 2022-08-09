const getAssetMetadata = require('../asset');

async function getAsset(req,res){
    try{
        let id = req.params.id;
        const tokenId = parseInt(id,10);
        const nft = await getAssetMetadata(tokenId);
        res.status(200);
        res.json(nft);
    } catch(e) {
        console.log(e.message);
        res.status(500);
        return res.json({ error: true, message: e.message })
    }
}

module.exports = { 
    getAsset
}