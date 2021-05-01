using RabbitMQ.Client;
using RabbitMQ.Client.Events;
using System;
using System.Text;
using System.Net.Mail;
using System.Net;

namespace consumer_2
{
    class Program
    {
        public static void Main()
        {
            var factory = new ConnectionFactory() { HostName = "localhost" };
            using (var connection = factory.CreateConnection())
            {
                using (var channel = connection.CreateModel())
                {
                    var client = new SmtpClient("smtp.mailtrap.io", 2525) {
                        Credentials = new NetworkCredential("710c597a2e18be", "8708bdc43f92e4"),
                        EnableSsl = true
                    };

                    channel.QueueDeclare(queue: "pedidos_aceitos",
                                         durable: false,
                                         exclusive: false,
                                         autoDelete: false,
                                         arguments: null);

                    var consumer = new EventingBasicConsumer(channel);
                    consumer.Received += (model, x) => { 
                        var body = x.Body.ToArray();
                        var message = Encoding.UTF8.GetString(body);

                        sendMail(client, message, "pedidos_aceitos");
                    };

                    channel.BasicConsume(queue: "pedidos_aceitos",
                                         autoAck: true,
                                         consumer: consumer);


                    channel.QueueDeclare(queue: "pedidos_rejeitados",
                                         durable: false,
                                         exclusive: false,
                                         autoDelete: false,
                                         arguments: null);

                    var consumer2 = new EventingBasicConsumer(channel);
                    consumer2.Received += (model, x) => {
                        var body = x.Body.ToArray();
                        var message = Encoding.UTF8.GetString(body);

                        sendMail(client, message, "pedidos_rejeitados");
                    };

                    channel.BasicConsume(queue: "pedidos_rejeitados",
                                         autoAck: true,
                                         consumer: consumer2);


                    Console.WriteLine(" Press [enter] to exit.");
                    Console.ReadLine();
                }
            }
        }

        private static void sendMail(SmtpClient client, string message, string queue) {
            
            var title = "";
            if (queue == "pedidos_aceitos"){
                title = "Fila RabbitMQ (pedidos aceitos)";
            } else {
                title = "Fila RabbitMQ (pedidos rejeitados)";
            }

            client.Send("from@example.com", "to@example.com", title, message);
            Console.WriteLine(" [x] Email enviado - {0}", message);
        }
    }
}
