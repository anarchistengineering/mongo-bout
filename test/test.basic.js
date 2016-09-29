const Code = require('code');
const Lab = require('lab');
const lab = exports.lab = Lab.script();

const describe = lab.describe;
const it = lab.it;
const expect = Code.expect;

const {
  matches,
} = require('../');

describe('Basic', ()=>{
  it('throws an error if the operation is invalid', (done)=>{
    try{
      matches({$aaa: true});
    }catch(e){
      expect(e.message).to.equal('Unkonwn operation $aaa');
      done();
    }
  });

  it('returns a valid matcher if not passed something to compare against', (done)=>{
    const f = matches({a : 1});
    expect(f).to.be.a.function();
    done();
  });

  it('returns true for a basic match', (done)=>{
    const out = matches({a : 1}, {a: 1});
    expect(out).to.be.a.boolean().and.to.equal(true);
    done();
  });

  it('returns false for no basic match', (done)=>{
    const out = matches({a : 1}, {b: 1});
    expect(out).to.be.a.boolean().and.to.equal(false);
    done();
  });

  it('returns true for a basic curried match', (done)=>{
    const matcher = matches({a : 1});
    const out = matcher({a: 1});
    expect(out).to.be.a.boolean().and.to.equal(true);
    done();
  });

  it('returns false for no basic curried match', (done)=>{
    const matcher = matches({a : 1});
    const out = matcher({b: 1});
    expect(out).to.be.a.boolean().and.to.equal(false);
    done();
  });

  it('can match empty objects', (done)=>{
    const out = matches({}, {foo: 'bar'});
    expect(out).to.be.a.boolean().and.to.equal(true);
    done();
  });

  it('$ne: null returns true when field is different', (done)=>{
    const out = matches({field: {$ne: null}}, {field: 'value'});
    expect(out).to.be.a.boolean().and.to.equal(true);
    done();
  });

  it('$ne: null returns false when field is not present', (done)=>{
    const out = matches({field: {$ne: null}}, {foo: 'value'});
    expect(out).to.be.a.boolean().and.to.equal(false);
    done();
  });

  it('$ne: null returns false when field is null', (done)=>{
    const out = matches({field: {$ne: null}}, {field: null});
    expect(out).to.be.a.boolean().and.to.equal(false);
    done();
  });

  it('can be used with Array.filter to create something that looks like sift', (done)=>{
    const matcher = matches({$gt: 1});
    const arr = [0, 1, 2, 3, 4, 5];
    const out = arr.filter(matcher);
    expect(out).to.be.an.array().length(4);
    done();
  });

  it('accepts a regular expression as a filter', (done)=>{
    const out = matches(/^j/, 'john');
    expect(out).to.be.a.boolean().and.to.equal(true);
    const out2 = matches(/^j/, 'bob');
    expect(out2).to.be.a.boolean().and.to.equal(false);
    done();
  });

  it('suports get', (done)=>{
    const o = {
      get(v){
        return this[`_${v}`];
      },
      _a: 5
    };
    const pat = {a: 5};
    const out = matches(pat, o);
    expect(out).to.be.a.boolean().and.to.equal(true);
    done();
  });

  it('$eq takes function', (done)=>{
    const o = {a: 5};
    const pat = {$eq(v){
        return v.a==5;
      }};
    const out = matches(pat, o);
    expect(out).to.be.a.boolean().and.to.equal(true);
    done();
  });

  it('$eq works for empty arrays', (done)=>{
    const o = [[]];
    const pat = {$eq: []};
    const out = matches(pat, o);
    expect(out).to.be.a.boolean().and.to.equal(true);
    done();
  });

  it('$eq works for empty arrays against false', (done)=>{
    const o = [false];
    const pat = {$eq: []};
    const out = matches(pat, o);
    expect(out).to.be.a.boolean().and.to.equal(false);
    done();
  });

  it('works with multiple nested values', (done)=>{
    const o = {a: {b: [1, 1, 2]}};
    const pat = {'a.b': 1};
    const out = matches(pat, o);
    expect(out).to.be.a.boolean().and.to.equal(true);
    done();
  });

  it('works with multiple nested objects with values', (done)=>{
    const o = {a: [{b: [1, 1, 2]}, {b: 1}]};
    const pat = {'a.b': 1};
    const out = matches(pat, o);
    expect(out).to.be.a.boolean().and.to.equal(true);
    done();
  });
});
