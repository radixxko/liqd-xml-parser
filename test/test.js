const fs = require('fs');
const XML = require('../lib/xml_parser');

const xml = new XML( fs.readFileSync( __dirname + '/HDT-feed.xml', 'utf8' ));
