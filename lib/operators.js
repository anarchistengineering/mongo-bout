const {
  compare,
  comparable,
  search,
  validate,
  and,
  or,
  isString,
} = require('./utils');

const OPERATORS = {
  $eq: or((a, b)=>a(b)),

  $ne: and((a, b)=>!a(b)),

  $or(a, b){
    return a.find((elem)=>{
      return validate(elem, b);
    })!==undefined;
  },

  $gt: or((a, b)=>compare(comparable(b), a)>0),

  $gte: or((a, b)=>compare(comparable(b), a)>=0),

  $lt: or((a, b)=>compare(comparable(b), a)<0),

  $lte: or((a, b)=>compare(comparable(b), a)<=0),

  $mod: or((a, b)=>b%a[0] == a[1]),

  $in(a, b){
    if(Array.isArray(b)){
      return b.find((elem)=>~a.indexOf(comparable(elem)))!==undefined;
    }
    return !!~a.indexOf(comparable(b));
  },

  $nin(a, b){
    return !OPERATORS.$in(a, b);
  },

  $not(a, b){
    return !validate(a, b);
  },

  $type(a, b){
    return b!=void(0)?b instanceof a || b.constructor == a : false;
  },

  $all(a, b){
    if(!b){
      b = [];
    }
    return a.every((elem)=>comparable(b).indexOf(elem)>-1);
  },

  $size(a, b){
    return b ? a === b.length : false;
  },

  $nor(a, b){
    //return !OPERATORS.$in(a, b);
    for(let i = 0, n = a.length; i<n; i++){
      if(validate(a[i], b)){
        return false;
      }
    }
    return true;
  },

  $and(a, b){
    return a.every((elem)=>validate(elem, b));
  },

  $regex: or((a, b)=>{
      return isString(b) && a.test(b);
    }),

  $where(a, b){
    return a.call(b, b);
  },

  $elemMatch(a, b){
    if(Array.isArray(b)){
      return search(b, a)!==-1;
    }
    return validate(a, b);
  },

  $exists(a, b){
    return (b != void 0) === a;
  },
};

module.exports = {
  and,
  or,
  OPERATORS,
};
