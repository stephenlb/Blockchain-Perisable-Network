export default (request, response) => {
    const db = require('kvstore');
    const crypto = require('crypto');

    // BlockChain
    let block = {
        data: "Genesis Block",
    };
    return crypto.sha256(block.data).then((result) => {
        block.hash = result;
        db.set("blockchain", [block])
        return response.send([block]);
    })
};