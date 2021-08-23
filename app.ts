import express from "express";
import multer from "multer";
import { IncomingMessage } from "http";
import { Writable } from "stream";

// Create a member to the request to store the raw body buffer.
// We can cast the IncomingMessage to MyIncomingMessage later when we want to access rawBody.
export class MyIncomingMessage extends IncomingMessage {
    rawBody?: Buffer;
}

const app = express();

// Store the raw body buffer when the request is being read.
app.use(function(req: MyIncomingMessage, res, next) {
    req.pipe(new Writable({
        write: (chunk, encoding, callback) => {
            req.rawBody = req.rawBody? Buffer.concat([req.rawBody, chunk]) : chunk;
        }
    }));
    next();
});

// Add body parsers when needed.
app.use(express.json());
app.use(express.urlencoded());
app.use(multer().any());
