#!/usr/bin/env node

var amqp = require('amqplib/callback_api');
amqp.connect('amqp://localhost', function(error0, connection) {
    if (error0) {
      console.log('error', error0);
    }
    console.log('connection success');

    connection.createChannel(function(error1, channel) {
        if (error1) {
            console.log('error', error1);
        }

        var queue = 'pedidos';
        channel.assertQueue(queue, {
          durable: false
        });

        //configura quantas mensagens simultâneas vão ser executadas
        channel.prefetch(1);

        channel.consume(queue, function(msg) {

        channel.ack(msg);

        setTimeout(() => {
            var body = JSON.parse(msg.content.toString());

            if (body.id > 5) {
                var queue_accepted = 'pedidos_aceitos';
                channel.assertQueue(queue_accepted, {
                    durable: false
                });
                
                channel.sendToQueue(queue_accepted, Buffer.from(JSON.stringify(body)));
                console.log(" [x] incluído na fila de pedidos aceitos: %s", body);
            } else {
                var queue_rejected = 'pedidos_rejeitados';
                channel.assertQueue(queue_rejected, {
                    durable: false
                });
                
                channel.sendToQueue(queue_rejected, Buffer.from(JSON.stringify(body)));
                console.log(" [x] incluído na fila de pedidos rejeitados: %s", body);
            }

        }, 2000);

        }, {
            noAck: false //remove da fila
            // noAck: true //mantém na fila
        });
    });
});