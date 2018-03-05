export default (request, response) => {
    const crypto = require('crypto');
    const db = require('kvstore');
    let block = JSON.parse(request.body);
    let blockchain = [],
        hashOfBlock;
    return db.get("blockchain").then((result) => {
        blockchain = result;
        console.log("-----blockchain----", blockchain);
        block.previousHash = result[result.length - 1].hash;
        crypto.sha256(JSON.stringify(block)).then((result) => {
            block.hash = result;
            blockchain.push(block);
            db.set("blockchain", blockchain);
        });
        response.status = 200;
        response.headers['X-Custom-Header'] = 'CustomHeaderValue';
        return response.send(blockchain);
    });

    // switch (block.type) {
    //     case "request":
    //         db.set("shipment", {
    //             productName: block.productName,
    //             quantity: block.quantity,
    //             from: block.from,
    //             to: block.to,
    //         });
    //         db.setItem("shipmentStatus", "requested");
    //         break;
    //     case "ship":
    //         db.setItem("shipmentStatus", "shipped");
    //         break;
    //     case "tempReading":
    //         db.set("shipmentStatus", "shipped & perished");
    //         break;
    //     case "PickUp":
    //         db.set("shipmentStatus", "delivered");
    //         break;
    //     default:
    //         break;
    // }


};