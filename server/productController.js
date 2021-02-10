const productServices = require("./productServices");

const productController = {
  receiveProductActions(socket, actions) {
    actions.map((action) => {
      this.processReceivedAction(socket, action);
    });
  },

  async processReceivedAction(socket, action) {
    let actionResult = [];
    let trxResult = false; 
    switch (action.type) {
      case "CREATE":
        actionResult = await productServices.createProduct(action.data);
        socket.emit("productActionResult", actionResult[0]);
        trxResult = await this.handleFinishTransaction( // This will be true (trx commit) or false (trx rollback)
          socket,
          actionResult[0],
          actionResult[1]
        );
        if (trxResult)
          console.log(
            `Product ${actionResult[0].data.name} inserted successfully with id ${actionResult[0].data.id}`
          );
        break;
      case "READ":
        actionResult = await productServices.readProduct(action.data);
        socket.emit("productActionResult", actionResult);
        break;
      case "UPDATE":
        actionResult = await productServices.updateProduct(action.data);
        socket.emit("productActionResult", actionResult[0]);
        trxResult = await this.handleFinishTransaction(
          socket,
          actionResult[0],
          actionResult[1]
        );
        if (trxResult)
          console.log(
            `Product ${actionResult[0].data.name} with id ${actionResult[0].data.id} updated successfully`
          );
        break;
      case "DELETE":
        actionResult = await productServices.deleteProduct(action.data);
        socket.emit("productActionResult", actionResult[0]);
        trxResult = await this.handleFinishTransaction(
          socket,
          actionResult[0],
          actionResult[1]
        );
        if (trxResult)
          console.log(
            `Product ${actionResult[0].data.name} with id ${actionResult[0].data.id} deleted successfully`
          );
        break;
      default:
        break;
    }
  },

  handleFinishTransaction(socket, actionResult, trx) {
    return (promise = new Promise((resolve, reject) => {
      if (actionResult.status === "NACK") {
        trx.rollback();
        resolve(false);
      } // If a NACK was sent, don't wait for FIN
      else {
        let timer = setTimeout(trx.rollback, 120000); // Start 2 min timer, if TIMEOUT, rollback transaction
        socket.on("clientFin", () => {
          // If FIN received commit transaction and stop timer
          trx.commit();
          clearTimeout(timer);
          socket.removeAllListeners("clientFin");
          resolve(true);
        });
      }
    }));
  },
};

module.exports = productController;
