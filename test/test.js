const fs = require('fs');
const XML = require('../lib/xml_parser');

const feed = fs.readFileSync( __dirname + '/HDT-feed.xml', 'utf8' );

for( let i = 0; i < 5; ++i )
{
    
    let start = process.hrtime();

    const xml = new XML( feed );

    let end = process.hrtime(start);

    console.log( xml, ( end[0] * 1000 + end[1] / 1e6 ) + 'ms' );
}
