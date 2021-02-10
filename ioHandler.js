const productController = require("./server/productController");

module.exports = (io) => {
    io.of('/sendActions')
        .on('connection', (socket) => {
            console.log("New client connected")
            socket.emit('connected', 'Connected to server');
            socket.on('sendProductActions', (actions) => {
                productController.receiveProductActions(socket, actions);
            });
            
            socket.on('disconnect', () => {
                socket.disconnect();
                console.log("Client disconnected")
            });
        });

};