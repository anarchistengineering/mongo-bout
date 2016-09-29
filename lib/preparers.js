const {
  compare,
  comparable,
  isString,
} = require('./utils');

const PREPARERS = {
  $eq(a){
    if(a instanceof RegExp){
      return (b)=>typeof(b)==='string' && a.test(b);
    }
    if(a instanceof Function){
      return a;
    }
    if(Array.isArray(a) && !a.length){
      return (b)=>Array.isArray(b) && !b.length;
    }
    if(a === null){
      return (b)=>b == null;
    }
    return (b)=>compare(comparable(b), a)===0;
  },

  $ne(a){
    return PREPARERS.$eq(a);
  },

  $and(a, {parse}){
    return a.map(parse);
  },

  $or(a, {parse}){
    return a.map(parse);
  },

  $nor(a, {parse}){
    return a.map(parse);
  },

  $not(a, {parse}){
    return parse(a);
  },

  $regex(a, {query}){
    return new RegExp(a, query.$options);
  },

  $where(a){
    return isString(a)?new Function('obj', `return ${a}`):a;
  },

  $elemMatch(a, {parse}){
    return parse(a);
  },

  $exists(a){
    return !!a;
  },
};

module.exports = {
  PREPARERS,
};
