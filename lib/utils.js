const curry = require('./curry');

const isType = (type, val)=>typeof(val)===type;

const isFunction = curry(isType, 'function');
const isString = curry(isType, 'string');

const compare = (a, b)=>{
  if(a === b){
    return 0;
  }
  if(typeof(a) === typeof(b)){
    return (a > b)?1:-1;
  }
};

const comparable = (value)=>{
  if(value instanceof Date){
    return value.getTime();
  }
  if(Array.isArray(value)){
    return value.map(comparable);
  }
  return value;
};

const search = (arr, validator)=>{
  return arr.findIndex((item)=>validate(validator, item));
};

const validate = (validator, b)=>{
  return validator.validate(validator.a, b);
};

const get = (obj, key)=>{
  if(isFunction(obj.get)){
    return obj.get(key);
  }
  return obj[key];
};

const or = (predicate)=>(a, b)=>{
  if(!Array.isArray(b)){
    return predicate(a, b);
  }
  for(let i = 0, n = b.length; i<n; i++){
    if(predicate(a, get(b, i))){
      return true;
    }
  }
  return false;
};

const and = (predicate)=>(a, b)=>{
  if(!Array.isArray(b) || !b.length){
    return predicate(a, b);
  }
  for(let i = 0, n = b.length; i<n; i++){
    if(!predicate(a, get(b, i))){
      return false;
    }
  }
  return true;
};

const findValues = (current, path, index, values = [])=>{
  if(index === path.length || current == void 0){
    return [...values, current];
  }
  const key = path[index];

  if(Array.isArray(current) && isNaN(Number(key))){
    return [...values, ...current.map((item)=>findValues(item, path, index, values)).filter((v)=>v !== void 0)];
  }
  return findValues(get(current, key), path, index+1, values);
};

module.exports = {
  get,
  curry,
  isType,
  isFunction,
  isString,
  compare,
  comparable,
  search,
  validate,
  and,
  or,
  findValues,
};
