const knex = require("../db/knex");

const productServices = {
  async createProduct(receivedActionData) {
    const trxProvider = knex.transactionProvider();
    const trx = await trxProvider();
    let createAttrs = {
      name: receivedActionData.name,
      description: receivedActionData.description,
      price: receivedActionData.price,
      category: receivedActionData.category,
    };
    let createActionResult = {
      status: "",
      data: {},
    };

    try {
      const insertProductResult = await trx("product")
        .insert(createAttrs)
        .returning(["id", "name"]);
      createActionResult.status = "ACK";
      createActionResult.data = insertProductResult[0];
    } catch (error) {
      console.error(error);
      createActionResult.status = "NACK";
      createActionResult.data = error.toString();
    }

    return [createActionResult, trx];
  },

  async readProduct(receivedActionData) {
    let readActionResult = {
      status: "",
      data: {},
    };
    const selectedProduct = await knex("product")
      .select()
      .where("id", "=", receivedActionData.id);
    if (selectedProduct[0].length == 0) {
      readActionResult.status = "NACK";
      readActionResult.data = receivedActionData.id;
    } else {
      readActionResult.status = "ACK";
      readActionResult.data = selectedProduct[0];
    }
    return selectedProduct;
  },

  async updateProduct(receivedActionData) {
    let updateActionResult = {
      status: "",
      data: {},
    };
    try {
      const selectedProduct = this.readProduct(receivedActionData);
      if (selectedProduct.status == "NACK") {
        updateActionResult.status = "NACK";
      } else {
        const trxProvider = knex.transactionProvider();
        trx = await trxProvider();
        const updateAttrs = {
          name: receivedActionData.name,
          description: receivedActionData.description,
          price: receivedActionData.price,
          category: receivedActionData.category,
          lastUpdate: "NOW()",
        };
        await trx("product")
          .update(updateAttrs)
          .where("id", "=", receivedActionData.id)
          .returning(["id", "name"])
          .then((justUpdatedProduct) => {
            updateActionResult.status = "ACK";
            updateActionResult.data = justUpdatedProduct[0];
          })
          .catch((error) => {
            console.error(error);
            throw `Failed when updating the product ${receivedActionData.id} with client modifications ${error}`;
          });
      }
    } catch (error) {
      console.error(error);
      updateActionResult.status = "NACK";
      updateActionResult.data = error.toString();
    }

    return [updateActionResult, trx];
  },

  async deleteProduct(receivedActionData) {
    const trxProvider = knex.transactionProvider();
    const trx = await trxProvider();
    let deleteActionResult = {
      status: "",
      data: {},
    };
    try {
      const selectedProduct = this.readProduct(receivedActionData);
      if (selectedProduct.status == "NACK") {
        deleteActionResult.status = "NACK";
      } else {
        const deleteProductResult = await trx("product")
          .delete()
          .where("id", "=", receivedActionData.id)
          .returning(["id", "name"]);
        deleteActionResult.status = "ACK";
        deleteActionResult.data = deleteProductResult[0];
      }
    } catch (error) {
      console.error(error);
      deleteActionResult.status = "NACK";
      deleteActionResult.type = "ERROR";
      deleteActionResult.data = error.toString();
    }
    return [deleteActionResult, trx];
  },
};

module.exports = productServices;
