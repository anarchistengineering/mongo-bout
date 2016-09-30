const Code = require('code');
const Lab = require('lab');
const lab = exports.lab = Lab.script();

const describe = lab.describe;
const it = lab.it;
const expect = Code.expect;

const {filter} = require('../');

const getFilter = ()=>filter({a: 1});
const testFilter = (pat, list)=>filter(pat, list);

describe('Filter', ()=>{
  it('curry basic should return object against object', (done)=>{
    const out = getFilter()({a:1});
    expect(out).to.be.an.array().and.to.equal([ { a: 1 } ]);
    done();
  });

  it('curry basic should return empty array for no match', (done)=>{
    const out = getFilter()({a:2});
    expect(out).to.be.an.array().and.to.equal([]);
    done();
  });

  it('curry basic should return only matches', (done)=>{
    const out = getFilter()([{a: 1}, {b: 2}]);
    expect(out).to.be.an.array().and.to.equal([ { a: 1 } ]);
    done();
  });

  it('curry basic should return empty array when no matches', (done)=>{
    const out = getFilter()([{a: 2}, {b: 2}]);
    expect(out).to.be.an.array().and.to.equal([]);
    done();
  });

  it('basic should return object against object', (done)=>{
    const out = testFilter({a: 1}, {a:1});
    expect(out).to.be.an.array().and.to.equal([ { a: 1 } ]);
    done();
  });

  it('basic should return empty array for no match', (done)=>{
    const out = testFilter({a: 1}, {a:2});
    expect(out).to.be.an.array().and.to.equal([]);
    done();
  });

  it('basic should return only matches', (done)=>{
    const out = testFilter({a: 1}, [{a: 1}, {b: 2}]);
    expect(out).to.be.an.array().and.to.equal([ { a: 1 } ]);
    done();
  });

  it('basic should return empty array when no matches', (done)=>{
    const out = testFilter({a: 1}, [{a: 2}, {b: 2}]);
    expect(out).to.be.an.array().and.to.equal([]);
    done();
  });
});
