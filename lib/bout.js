const {
  parse,
} = require('./parser');
const {
  validate,
} = require('./utils');
const {
  OPERATORS,
} = require('./operators');
const {
  PREPARERS,
} = require('./preparers');
const curry = require('./curry');

class Bout{
  constructor({pattern = {}, operators = {}, preparers = {}} = {}){
    this.operators = Object.assign({}, OPERATORS, operators);
    this.preparers = Object.assign({}, PREPARERS, preparers);
  }

  matches(pattern, ...args){
    const {
      operators,
      preparers,
    } = this;
    const tree = parse(pattern, {operators, preparers});
    if(args.length > 0){
      return validate(tree, args[0]);
    }
    return curry(validate, tree);
  }

  filter(pattern, ...args){
    const matcher = this.matches(pattern);
    if(args.length > 0){
      const arr = Array.isArray(args[0])?args[0]:[args[0]];
      return arr.filter(matcher);
    }
    return (arr)=>Array.isArray(arr)?arr.filter(matcher):[arr].filter(matcher);
  }
}

const bout = new Bout();
const matches = (pattern, ...args)=>bout.matches(pattern, ...args);
const filter = (pattern, ...args)=>bout.filter(pattern, ...args);

module.exports = {
  Bout,
  matches,
  filter,
};
