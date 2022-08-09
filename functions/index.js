
const functions = require('firebase-functions');
const express = require('express');
const NodeCache = require('node-cache');
const cors = require('cors');
const http = require('http');
const { getAsset } = require('./src/routes');

global.cache = new NodeCache({ stdTTL: 60 * 60 });

const app = express();
app.use(cors({ origin: true }));

app.get('/asset/:id', getAsset);
app.get('/api/asset/:id', getAsset);

exports.api = functions.https.onRequest(app);

