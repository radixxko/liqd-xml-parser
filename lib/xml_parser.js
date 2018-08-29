'use strict';

const Parser = require('liqd-parser');
const XMLParser = new Parser( require('fs').readFileSync( __dirname + '/syntax/xml.syntax', 'utf8' ));

const convertAttributesToObject = ( nodes ) =>
{
	for( let node of nodes )
	{
		if( node.hasOwnProperty( 'attributes' ))
		{
			let attributes = {};

			for( let attr of node.attributes )
			{
				attributes[attr.attribute] = attr.value;
			}

			node.attributes = attributes;
		}

		if( node.hasOwnProperty( 'nodes' ) && node.nodes.length )
		{
			convertAttributesToObject( node.nodes );
		}
	}
}

module.exports = class XML
{
	constructor( xml, options = {} )
	{
		xml = XMLParser.parse( xml );

		if( options.associative === true && xml.hasOwnProperty( 'nodes' ) && xml.nodes.length )
		{
			convertAttributesToObject( xml.nodes );
		}

		return xml;
	}
}
