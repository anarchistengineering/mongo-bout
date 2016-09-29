const {
  parse,
} = require('./parser');
const {
  validate,
} = require('./utils');
const curry = require('./curry');

const matches = (pattern, ...args)=>{
  const tree = parse(pattern);
  if(args.length > 0){
    return validate(tree, args[0]);
  }
  return curry(validate, tree);
};

module.exports = matches;
