const app = require("./../index");
import express from "express";
import { createServer } from "http";
import * as path from "path";

/**
 * Normalize a port into a number, string, or false.
 */

let normalizePort = (val) => {
    let port = parseInt(val, 10);

    if (isNaN(port)) {
        // named pipe
        return val;
    }

    if (port >= 0) {
        // port number
        return port;
    }

    return false;
};

/**
 * Event listener for HTTP server 'error' event.
 */

let onError = (error) => {
    if (error.syscall !== "listen") {
        throw error;
    }

    let bind = typeof port === "string" ? "Pipe " + port : "Port " + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case "EACCES":
            console.log(bind + " requires elevated privileges");
            process.exit(1);
            break;
        case "EADDRINUSE":
            console.log(bind + " is already in use");
            process.exit(1);
            break;
        default:
            throw error;
    }
};

/**
 * Event listener for HTTP server 'listening' event.
 */

let onListening = () => {
    let addr = server.address();
    let bind = typeof addr === "string" ? "pipe " + addr : "port " + addr?.port;
    console.log("Listening on " + bind);
};

/**
 * Get port from environment and store in Express.
 */
let port = normalizePort(process.env.PORT);

app.set("port", port);

let server = createServer(app);

app.use(express.static(path.join(__dirname + './../../uploads')))

server.listen(port, process.env.HOST, function () {
    console.log(
        "Express server listening on %d, in %s mode",
        process.env.PORT,
        app.get("env")
    );
});



server.on("error", onError);
server.on("listening", onListening);
