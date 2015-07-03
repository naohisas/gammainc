'use strict';

// MODULES //

var isArrayLike = require( 'validate.io-array-like' ),
	isTypedArrayLike = require( 'validate.io-typed-array-like' ),
	isObject = require( 'validate.io-object' );


// FUNCTIONS

var GAMMAINC = require( './number.js' );


// INCOMPlETE GAMMA FUNCTION //

/**
* FUNCTION: gammainc( out, arr, a, clbk )
*	Computes the incomplete gamma function for an array using an accessor.
*
* @param {Number[]|Int8Array|Uint8Array|Uint8ClampedArray|Int16Array|Uint16Array|Int32Array|Uint32Array|Float32Array|Float64Array} out - output array
* @param {Number[]|Int8Array|Uint8Array|Uint8ClampedArray|Int16Array|Uint16Array|Int32Array|Uint32Array|Float32Array|Float64Array} arr - input array
* @param {Number[]|Int8Array|Uint8Array|Uint8ClampedArray|Int16Array|Uint16Array|Int32Array|Uint32Array|Float32Array|Float64Array|Number} a - either an array of equal length or a scalar
* @param {Function} accessor - accessor function for accessing array values
* @returns {Number[]|Int8Array|Uint8Array|Uint8ClampedArray|Int16Array|Uint16Array|Int32Array|Uint32Array|Float32Array|Float64Array} output array
*/
function gammainc( out, arr, a, clbk ) {
	var len = arr.length,
		i,
		arrVal, aVal;

	if ( isTypedArrayLike( a ) ) {
		if ( len !== a.length ) {
			throw new Error( 'gammainc()::invalid input argument. Exponent array must have a length equal to that of the base array.' );
		}
		for ( i = 0; i < len; i++ ) {
			arrVal = clbk( arr[ i ], i, 0 );
			if ( typeof arrVal === 'number' ) {
				out[ i ] = GAMMAINC( a[ i ], arrVal );
			} else {
				out[ i ] = NaN;
			}
		}
	} else if ( isArrayLike( a ) ) {
		if ( len !== a.length ) {
			throw new Error( 'gammainc()::invalid input argument. Exponent array must have a length equal to that of the base array.' );
		}
		if ( !isObject( a[ 0 ] ) ) {
			// Guess that `a` is a primitive array -> callback does not have to be applied
			for ( i = 0; i < len; i++ ) {
				arrVal = clbk( arr[ i ], i, 0 );
				if ( typeof a[ i ] === 'number' && typeof arrVal === 'number' ) {
					out[ i ] = GAMMAINC( a[ i ], arrVal );
				} else {
					out[ i ] = NaN;
				}
			}
		} else {
			// `a` is an object array, too -> callback is applied
			for ( i = 0; i < len; i++ ) {
				arrVal = clbk( arr[ i ], i, 0 );
				aVal = clbk( a[ i ], i, 1 );
				if ( typeof arrVal === 'number' && typeof aVal  === 'number' ) {
					out[ i ] = GAMMAINC( aVal, arrVal );
				} else {
					out[ i ] = NaN;
				}
			}
		}
	} else {
		if ( typeof a === 'number' ) {
			for ( i = 0; i < len; i++ ) {
				arrVal = clbk( arr[ i ], i );
				if ( typeof arrVal === 'number' ) {
					out[ i ] = GAMMAINC( a, arrVal );
				} else {
					out[ i ] = NaN;
				}
			}
		} else {
			for ( i = 0; i < len; i++ ) {
				out[ i ] = NaN;
			}
		}
	}
	return out;
} // end FUNCTION gammainc()


// EXPORTS //

module.exports = gammainc;