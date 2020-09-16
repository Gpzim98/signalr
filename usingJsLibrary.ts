const signalR = require("signalr");

console.log("adf");

 
let connection = new signalR.HubConnectionBuilder()
    .withUrl("http://dailytest.lime-energy.com/signalr/chat")
    .build();
 
connection.on("send", data => {
    console.log(data);
});
 
connection.start()
    .then(() => connection.invoke("send", "Hello"));