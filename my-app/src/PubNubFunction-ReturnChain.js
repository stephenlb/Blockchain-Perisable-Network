export default (request, response) => {
    const pubnub = require('pubnub');
    const db = require('kvstore');
    return db.get("blockchain").then((result) => {
        console.log("result", result);
        return response.send(result);
    })
};