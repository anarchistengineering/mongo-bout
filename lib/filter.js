const matches = require('./matches');
const curry = require('./curry');

const filter = (pattern, ...args)=>{
  const matcher = matches(pattern);
  if(args.length > 0){
    const arr = Array.isArray(args[0])?args[0]:[args[0]];
    return arr.filter(matcher);
  }
  return (arr)=>Array.isArray(arr)?arr.filter(matcher):[arr].filter(matcher);
};

module.exports = filter;
