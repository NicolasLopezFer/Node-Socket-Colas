const TicketControl = require("../models/ticket-control");

const ticketControl = new TicketControl;

const socketController = (socket) => {

    socket.emit( 'ultimo-ticket', ticketControl.ultimo );
    socket.emit('estado-actual', ticketControl.ultimos4);

    socket.on('siguiente-ticket', ( payload, callback ) => {
        
        const siguiente = ticketControl.siguiente();
        callback( siguiente );

        //TODO: Notificar que hay un nuevo ticket pendiente de asignar

    });

    socket.on('atender-ticket', ({escritorio}, callback) => {

        if(!escritorio) {
            return callback({
                ok: false,
                msg: 'Escritorio obligatorio'
            });
        }

        const ticket = ticketControl.atenderTicket( escritorio );

        socket.broadcast.emit('estado-actual', ticketControl.ultimos4);

        if(!ticket){
            return callback({
                ok: false,
                msg: 'No hay tickets pendientes'
            });
        } else {
            callback({
                ok: true,
                ticket
            });
        }
    })
  }


module.exports = {
    socketController,
}