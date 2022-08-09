const { nft } = require('../contract');

async function getAssetMetadata(tokenId){

    const unavailableMetadata = {
        image: '',
    }
    try{
        const { monster, level } = await (await nft()).methods.attributes(tokenId).call();
        if(monster == 0)
            return unavailableMetadata;
        return {
            image: `https://labmonster-2b44e.web.app/static/monster-${monster}.png`,
            attributes: [
                {
                    trait_type: 'monster',
                    value: monster
                },
                { 
                    trait_type: 'level',
                    value: level
                }
            ]
        }
    } catch (e){
        console.log(e);
        return unavailableMetadata;
    }

}

module.exports = getAssetMetadata;