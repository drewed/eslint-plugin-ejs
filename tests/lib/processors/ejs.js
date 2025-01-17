var processor = require('../../../lib/processors/ejs.js');
var expect = require('chai').expect;

describe('preprocess', function() {
  it('doesn\'t change input with no markers', function() {
    var input = 'var a = 4;\na++;\a = \'stuff\'';
    expect(processor.preprocess(input)).to.deep.equal([input]);
  });

  it('removes <%= markers', function() {
    var input = 'var <%= identifier = 4;';
    expect(processor.preprocess(input)).to.deep.equal(['var identifier = 4;']);
  });

  it('removes <%# comments %>', function() {
    var input = "Some lines of text\n# Not a comment block\n<%# I'm a comment %>\n<%= <%# I'm an embedded comment %>I'm not a comment%>\n<%# I'm another comment %>\nComments<%# like this%> should be removed";
    var output = "Some lines of text\n# Not a comment block\n\nI'm not a comment\n\nComments should be removed";

    expect(processor.preprocess(input)).to.deep.equal([output]);
  });

  it('removes <% markers', function() {
    var input = 'var <% identifier = 4;';
    expect(processor.preprocess(input)).to.deep.equal(['var identifier = 4;']);
  });

  it('removes %> markers', function() {
    var input = 'var %> identifier = 4;';
    expect(processor.preprocess(input)).to.deep.equal(['var identifier = 4;']);
  });

  it('removes all ERB markers', function() {
    var input = 'var <%= identifier %> = 4;\n <% doSomething(); %>';
    expect(processor.preprocess(input)).to.deep.equal(['var identifier = 4;\n doSomething();']);
  });

  it('We do no more require spacing inside markers', function() {
    var input = 'var <%= identifier%> = 4;\n <%doSomething();%>';
    expect(processor.preprocess(input)).to.deep.equal(['var identifier = 4;\n doSomething();']);
  });

  it('handles unusual input', function() {
    var input = 'var <$= identifier &> = 4;\n <@ doSomething(); *>';
    expect(processor.preprocess(input)).to.deep.equal(['var <$= identifier &> = 4;\n <@ doSomething(); *>']);
  });
});

// describe('postprocess', function() {
//   it('doesn\'t change location of a message before any marker', function() {
//     var input = 'var <%= identifier = 4;';
//     processor.preprocess(input);
//     expect(processor.postprocess([[{
//       line: 0,
//       column: 3
//     }]])).to.deep.equal([{
//       line: 0,
//       column: 3
//     }]);
//   });

//   it('does change location of a message at any marker', function() {
//     var input = 'var <%= identifier = 4;';
//     processor.preprocess(input);
//     expect(processor.postprocess([[{
//       line: 0,
//       column: 4
//     }]])).to.deep.equal([{
//       line: 0,
//       column: 8
//     }]);
//   });

//   it('can handle a message after multiple markers', function() {
//     var input = 'var <%= identifier %> <% sleep(100); %> = 4;';
//     processor.preprocess(input);
//     expect(processor.postprocess([[{
//       line: 0,
//       column: 27
//     }]])).to.deep.equal([{
//       line: 0,
//       column: 40
//     }]);
//   });

//   it('can handle multiple messages after multiple markers', function() {
//     var input = 'var <%= identifier %> <% sleep(100); %> = 4;';
//     processor.preprocess(input);
//     expect(processor.postprocess([[
//     {
//       line: 0,
//       column: 14
//     },
//     {
//       line: 0,
//       column: 27
//     }
//     ]])).to.deep.equal([
//     {
//       line: 0,
//       column: 21
//     },
//     {
//       line: 0,
//       column: 40
//     }
//     ]);
//   });

//   it('can handle multiple lines', function() {
//     var input = 'var <%= identifier %> = 4;\n <% doSomething(); %>';
//     processor.preprocess(input);
//     expect(processor.postprocess([[
//     {
//       line: 0,
//       column: 14
//     },
//     {
//       line: 1,
//       column: 11
//     }
//     ]])).to.deep.equal([
//     {
//       line: 0,
//       column: 21
//     },
//     {
//       line: 1,
//       column: 14
//     }
//     ]);
//   });
// });
