'use strict';

const Parser = require('liqd-parser');
const XMLParser = new Parser( require('fs').readFileSync( __dirname + '/syntax/xml.syntax', 'utf8' ));

const mapNodes = ( obj, nodes ) =>
{
	for( let node of nodes )
	{
		let map = { '$': {} };

		if( !obj.hasOwnProperty( node.tag )){ obj[node.tag] = []; }

		obj[node.tag].push( map );

		if( node.hasOwnProperty( 'attributes' ))
		{
			for( let attr of node.attributes )
			{
				map.$[attr.attribute] = attr.value;
			}
		}

		if( node.hasOwnProperty( 'text' ))
		{
			map._ = node.text;
		}

		if( node.hasOwnProperty( 'nodes' ) && node.nodes.length )
		{
			mapNodes( map, node.nodes );
		}
	}
}

module.exports = class XML
{
	constructor( xml, options = {} )
	{
		xml = XMLParser.parse( xml );

		if( options.associative === true )
		{
			let map = {};

			if( xml.hasOwnProperty( 'nodes' ) && xml.nodes.length )
			{
				mapNodes( map, xml.nodes );
			}

			xml = map;
		}

		return xml;
	}
}
