'use strict';

// MODULES //

var gamma = require( 'gamma' );


// VARIABLES //

var EPSILON = 1e-12;


// UPPER INCOMPLETE GAMMA FUNCTION
// via modified Lentz's method for computing continued fraction, see README.md

/**
* FUNCTION: gammainc_u( x, s, regularized )
*	Computes the regularized upper incomplete gamma function
* @param {Number} x - function parameter
* @param {Number} s - function parameter
* @param {Boolean} [regularized=true] - boolean indicating if the function should evaluate the regularized or non-regularized incomplete gamma functions
* @returns {Number} function value
*/
function gammainc_u( x, s, regularized ) {


	if ( x <= 1.1 || x <= s ) {
		if ( regularized !== false ) {
			return 1 - gammainc_l( x, s, regularized );
		} else {
			return gamma( s ) - gammainc_l( x, s, regularized );
		}
	}

	var f = 1 + x - s,
		C = f,
		D = 0,
		i = 1,
		a, b, chg;
	for ( i = 1; i < 10000; i++ ) {
		a = i * (s - i);
		b = (i<<1) + 1 + x - s;
		D = b + a * D;
		C = b + a / C;
		D = 1 / D;
		chg = C * D;
		f *= chg;
		if ( Math.abs( chg - 1 ) < EPSILON ) {
			break;
		}
	}
	if ( regularized !== false ) {
		return Math.exp(s * Math.log( x ) - x - gamma.log( s ) - Math.log(f) );
	} else {
		return Math.exp(s * Math.log( x ) - x - Math.log(f) );
	}
}

// LOWER INCOMPlETE GAMMA FUNCTION //
// via power series expansion, see README.md

/**
* FUNCTION: gammainc_l( x, s[, regularized] )
*	Computes the regularized lower incomplete gamma function
* @param {Number} x - function parameter
* @param {Number} s - function parameter
* @param {Boolean} [regularized=true] - boolean indicating if the function should evaluate the regularized or non-regularized incomplete gamma functions
* @returns {Number} function value
*/
function gammainc_l( x, s, regularized ) {
	if ( x === 0) {
		return 0;
	}
	if ( x < 0 || s <= 0 ) {
		return NaN;
	}

	if( x > 1.1 && x > s ) {
		if ( regularized !== false ) {
			return 1 - gammainc_u( x, s, regularized );
		} else {
			return gamma( s ) - gammainc_u( x, s, regularized );
		}
	}

	var ft,
		r = s,
		c = 1,
		pws = 1;

	if ( regularized !== false ) {
		ft = s * Math.log( x ) - x - gamma.log( s );
	} else {
		ft = s * Math.log( x ) - x;
	}
	ft = Math.exp( ft );
	do {
		r += 1;
		c *= x/r;
		pws += c;
	} while ( c / pws > EPSILON );
	return pws*ft/s;
}

// EXPORTS


module.exports = {
	'lower': gammainc_l,
	'upper': gammainc_u
};
