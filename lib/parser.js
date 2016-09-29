const {
  isFunction,
  comparable,
  search,
  validate,
  findValues,
} = require('./utils');
const {
  OPERATORS,
} = require('./operators');
const {
  PREPARERS,
} = require('./preparers');

const getQuery = (query)=>{
  const cQuery = comparable(query);
  if (!cQuery || (cQuery.constructor.toString().replace(/\n/g,'').replace(/ /g, '') !== 'functionObject(){[nativecode]}')) { // cross browser support
    return { $eq: cQuery };
  }
  return cQuery;
};

const createValidator = (a, validate)=>{
  return {
    a,
    validate
  };
};

const nestedValidator = (a, b)=>{
  const values = findValues(b, a.k, 0);
  if(values.length === 1){
    return validate(a.nv, values[0]);
  }
  return !!~search(values, a.nv);
};

const createNestedValidator = (path, a)=>{
  return {
    a: {
      k: path,
      nv: a
    },
    validate: nestedValidator
  }
};

const getValidator = ({key, value, query, parse})=>{
  if(key === '$options'){
    return false;
  }
  if(OPERATORS[key]){
    if(PREPARERS[key]){
      const prepared = PREPARERS[key](value, {query, parse});
      return createValidator(comparable(prepared), OPERATORS[key]);
    }
    return createValidator(comparable(value), OPERATORS[key]);
  }
  if(key.charCodeAt(0)===36){
    throw new Error(`Unkonwn operation ${key}`);
  }
  return createNestedValidator(key.split('.'), parse(value));
};

const parse = (query)=>{
  const cQuery = getQuery(query);

  const validators = Object.keys(cQuery)
      .map((key)=>getValidator({key, value: cQuery[key], query: cQuery, parse}))
      .filter((v)=>v!==false);

  return validators.length === 1?validators[0] : createValidator(validators, OPERATORS.$and);
};

module.exports = {
  parse,
};
