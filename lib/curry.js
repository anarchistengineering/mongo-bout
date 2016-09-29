const curry = (fn, ...args1)=>(...args2)=>fn(...args1, ...args2);

module.exports = curry;
