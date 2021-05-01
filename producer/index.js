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

        setInterval(() => {
            var msg = {
                id: Math.floor(Math.random() * 10 + 1),
                data: new Date().toISOString(),
                nome: "serviço teste",
                servicos: [
                    {
                        nome: "1.0"
                    },
                    {
                        nome: "2.0"
                    }
                ]
            };
        
            channel.sendToQueue(queue, Buffer.from(JSON.stringify(msg)));
            console.log(" [x] Sent %s", msg);
        }, 1000);
    });
});