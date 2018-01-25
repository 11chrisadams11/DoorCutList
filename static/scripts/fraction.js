/*
 Fraction.js v4.0.3 09/09/2015
 http://www.xarg.org/2014/03/rational-numbers-in-javascript/

 Copyright (c) 2015, Robert Eisele (robert@xarg.org)
 Dual licensed under the MIT or GPL Version 2 licenses.
 */
(function(w){function n(a,b){if(!a)return b;if(!b)return a;for(;;){a%=b;if(!a)return b;b%=a;if(!b)return a}}function x(a){for(;0===a%2;a/=2);for(;0===a%5;a/=5);if(1===a)return 0;for(var b=10%a,d=1;1!==b;d++)if(b=10*b%a,2E3<d)return 0;return d}function k(a,b){var d=0,l=1,h=1,e=0,k=0,n=0,t=1,q=1,f=0,g=1,r=1,p=1;if(void 0!==a&&null!==a)if(void 0!==b)d=a,l=b,h=d*l;else switch(typeof a){case "object":"d"in a&&"n"in a?(d=a.n,l=a.d,"s"in a&&(d*=a.s)):0 in a?(d=a[0],1 in a&&(l=a[1])):u();h=d*l;break;case "number":0>
a&&(h=a,a=-a);if(0===a%1)d=a;else if(0<a){1<=a&&(q=Math.pow(10,Math.floor(1+Math.log(a)/Math.LN10)),a/=q);for(;1E7>=g&&1E7>=p;)if(d=(f+r)/(g+p),a===d){1E7>=g+p?(d=f+r,l=g+p):p>g?(d=r,l=p):(d=f,l=g);break}else a>d?(f+=r,g+=p):(r+=f,p+=g),1E7<g?(d=r,l=p):(d=f,l=g);d*=q}else if(isNaN(a)||isNaN(b))l=d=NaN;break;case "string":g=a.match(/\d+|./g);null===g&&u();"-"===g[f]?(h=-1,f++):"+"===g[f]&&f++;if(g.length===f+1)k=m(g[f++],h);else if("."===g[f+1]||"."===g[f]){"."!==g[f]&&(e=m(g[f++],h));f++;if(f+1===
    g.length||"("===g[f+1]&&")"===g[f+3]||"'"===g[f+1]&&"'"===g[f+3])k=m(g[f],h),t=Math.pow(10,g[f].length),f++;if("("===g[f]&&")"===g[f+2]||"'"===g[f]&&"'"===g[f+2])n=m(g[f+1],h),q=Math.pow(10,g[f+1].length)-1,f+=3}else"/"===g[f+1]||":"===g[f+1]?(k=m(g[f],h),t=m(g[f+2],1),f+=3):"/"===g[f+3]&&" "===g[f+1]&&(e=m(g[f],h),k=m(g[f+2],h),t=m(g[f+4],1),f+=5);if(g.length<=f){l=t*q;h=d=n+l*e+q*k;break}default:u()}if(0===l)throw new y;c.s=0>h?-1:1;c.n=Math.abs(d);c.d=Math.abs(l)}function v(a){function b(){}function d(){var b=
    Error.apply(this,arguments);b.name=this.name=a;this.stack=b.stack;this.message=b.message}b.prototype=Error.prototype;d.prototype=new b;return d}function m(a,b){isNaN(a=parseInt(a,10))&&u();return a*b}function u(){throw new z;}function e(a,b){if(!(this instanceof e))return new e(a,b);k(a,b);a=e.REDUCE?n(c.d,c.n):1;this.s=c.s;this.n=c.n/a;this.d=c.d/a}var c={s:1,n:0,d:1},y=e.DivisionByZero=v("DivisionByZero"),z=e.InvalidParameter=v("InvalidParameter");e.REDUCE=1;e.prototype={s:1,n:0,d:1,abs:function(){return new e(this.n,
    this.d)},neg:function(){return new e(-this.s*this.n,this.d)},add:function(a,b){k(a,b);return new e(this.s*this.n*c.d+c.s*this.d*c.n,this.d*c.d)},sub:function(a,b){k(a,b);return new e(this.s*this.n*c.d-c.s*this.d*c.n,this.d*c.d)},mul:function(a,b){k(a,b);return new e(this.s*c.s*this.n*c.n,this.d*c.d)},div:function(a,b){k(a,b);return new e(this.s*c.s*this.n*c.d,this.d*c.n)},clone:function(){return new e(this)},mod:function(a,b){if(isNaN(this.n)||isNaN(this.d))return new e(NaN);if(void 0===a)return new e(this.s*
    this.n%this.d,1);k(a,b);0===c.n&&0===this.d&&e(0,0);return new e(this.s*c.d*this.n%(c.n*this.d),c.d*this.d)},gcd:function(a,b){k(a,b);return new e(n(c.n,this.n),c.d*this.d/n(c.d,this.d))},lcm:function(a,b){k(a,b);return 0===c.n&&0===this.n?new e:new e(c.n*this.n/n(c.n,this.n),n(c.d,this.d))},ceil:function(a){a=Math.pow(10,a||0);return isNaN(this.n)||isNaN(this.d)?new e(NaN):new e(Math.ceil(a*this.s*this.n/this.d),a)},floor:function(a){a=Math.pow(10,a||0);return isNaN(this.n)||isNaN(this.d)?new e(NaN):
    new e(Math.floor(a*this.s*this.n/this.d),a)},round:function(a){a=Math.pow(10,a||0);return isNaN(this.n)||isNaN(this.d)?new e(NaN):new e(Math.round(a*this.s*this.n/this.d),a)},inverse:function(){return new e(this.s*this.d,this.n)},pow:function(a){return 0>a?new e(Math.pow(this.s*this.d,-a),Math.pow(this.n,-a)):new e(Math.pow(this.s*this.n,a),Math.pow(this.d,a))},equals:function(a,b){k(a,b);return this.s*this.n*c.d===c.s*c.n*this.d},compare:function(a,b){k(a,b);var d=this.s*this.n*c.d-c.s*c.n*this.d;
    return(0<d)-(0>d)},divisible:function(a,b){k(a,b);return!(!(c.n*this.d)||this.n*c.d%(c.n*this.d))},valueOf:function(){return this.s*this.n/this.d},toFraction:function(a){var b,d="",c=this.n,e=this.d;0>this.s&&(d+="-");1===e?d+=c:(a&&0<(b=Math.floor(c/e))&&(d=d+b+" ",c%=e),d=d+c+"/",d+=e);return d},toLatex:function(a){var b,d="",c=this.n,e=this.d;0>this.s&&(d+="-");1===e?d+=c:(a&&0<(b=Math.floor(c/e))&&(d+=b,c%=e),d=d+"\\frac{"+c+"}{"+e,d+="}");return d},toContinued:function(){var a=this.n,b=this.d,
    d=[];do{d.push(Math.floor(a/b));var c=a%b;a=b;b=c}while(1!==a);return d},toString:function(){var a=this.n,b=this.d;if(isNaN(a)||isNaN(b))return"NaN";if(!e.REDUCE){var d=n(a,b);a/=d;b/=d}d=x(b);a:{var c=1;var h=d;for(var k=10,m=1;0<h;k=k*k%b,h>>=1)h&1&&(m=m*k%b);h=m;for(k=0;300>k;k++){if(c===h){h=k;break a}c=10*c%b;h=10*h%b}h=0}c=-1===this.s?"-":"";c+=a/b|0;(a=a%b*10)&&(c+=".");if(d){for(;h--;)c+=a/b|0,a%=b,a*=10;c+="(";for(h=d;h--;)c+=a/b|0,a%=b,a*=10;c+=")"}else for(h=15;a&&h--;)c+=a/b|0,a%=b,a*=
    10;return c}};"function"===typeof define&&define.amd?define([],function(){return e}):"object"===typeof exports?module.exports=e:w.Fraction=e})(this);