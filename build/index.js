"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var mongoose = require("mongoose");
var config_1 = __importDefault(require("./src/config"));
var keys = config_1.default();
var app = express();
console.log('keys', keys);
console.log(keys.mongoURI);
mongoose.connect(keys.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
var db = mongoose.connection;
db.on('open', function () {
    console.log('connected');
});
db.on('error', function () {
    console.log('error');
});
app.get('/', function (req, res) {
    res.send(' BIENVENIDO ');
});
app.listen(4000, function () {
    console.log('esuchando puerto 4000');
});
