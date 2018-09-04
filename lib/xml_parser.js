'use strict';

require('liqd-string')('liqd_');
const Parser = require('liqd-parser');
const XMLParser = new Parser( require('fs').readFileSync( __dirname + '/syntax/xml.syntax', 'utf8' ));

const decodeNodes = ( nodes ) =>
{
	for( let node of nodes )
	{
		if( node.hasOwnProperty( 'attributes' ))
		{
			for( let attr of node.attributes )
			{
				attr.attribute = attr.attribute.liqd_decodeHTMLEntities();
				attr.value = attr.value.liqd_decodeHTMLEntities();
			}
		}

		if( node.hasOwnProperty( 'text' ))
		{
			node.text = node.text.value !== undefined ? node.text.value.liqd_decodeHTMLEntities() : node.text.cdata;
		}

		if( node.hasOwnProperty( 'nodes' ) && node.nodes.length )
		{
			decodeNodes( node.nodes );
		}
	}
}

const mapAndDecodeNodes = ( obj, nodes ) =>
{
	for( let node of nodes )
	{
		if( node.prolog ){ continue; }

		let map = { '$': {} };

		if( !obj.hasOwnProperty( node.tag )){ obj[node.tag] = []; }

		obj[node.tag].push( map );

		if( node.hasOwnProperty( 'attributes' ))
		{
			for( let attr of node.attributes )
			{
				map.$[attr.attribute.liqd_decodeHTMLEntities()] = attr.value.liqd_decodeHTMLEntities();
			}
		}

		if( node.hasOwnProperty( 'text' ))
		{
			map._ = node.text.value !== undefined ? node.text.value.liqd_decodeHTMLEntities() : node.text.cdata;
		}

		if( node.hasOwnProperty( 'nodes' ) && node.nodes.length )
		{
			mapAndDecodeNodes( map, node.nodes );
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
				mapAndDecodeNodes( map, xml.nodes );
			}

			xml = map;
		}
		else if( xml.hasOwnProperty( 'nodes' ) && xml.nodes.length )
		{
			decodeNodes( xml.nodes );
		}

		return xml;
	}
}
