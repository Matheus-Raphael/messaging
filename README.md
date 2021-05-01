# Instalar e executar o RabbitMQ

Passos para instalação manual: https://www.rabbitmq.com/download.html

### Executar com docker

`docker run -it --rm --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:3-management`

### /producer (JavaScript)

Publica eventos no tópico `pedidos`

### /consumer-1 (JavaScript)

Consome eventos do tópico `pedidos`

Faz ack manual de eventos. Ver `Message acknowledgment` em [
Work Queues](https://www.rabbitmq.com/tutorials/tutorial-two-javascript.html):

```javascript
channel.consume(queue, function(msg) {
        ...
    }, {
        noAck: false
    });
```

Consome somente 1 evento por vez. Ver `Fair dispatch` em [
Work Queues](https://www.rabbitmq.com/tutorials/tutorial-two-javascript.html):

channel.prefetch(1);

Após o consumo dos eventos, aplica regra de negócio e publica novos eventos nos tópicos `pedidos_aceitos` ou `pedidos_rejeitados`

### /consumer-2 (C#)

Consome eventos dos tópicos `pedidos_aceitos` e `pedidos_rejeitados`, em seguida realiza envio de email.

```C#
var consumer = new EventingBasicConsumer(channel);
consumer.Received += (model, x) => { 
        ...
        sendMail(client, message, "...");
};
```

