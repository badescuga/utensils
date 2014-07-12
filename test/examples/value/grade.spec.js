var Grade = require('../../../examples/value/grade');
var grade1;
var grade2;

describe('Grade', function() {

  describe('#isPassing', function() {

    it('returns true if grade is passing', function() {
      grade1 = new Grade(0.8);
      expect(grade1.isPassing()).to.be.true;
    });

    it('returns false if grade is not passing', function() {
      grade1 = new Grade(0.58);
      expect(grade1.isPassing()).to.be.false;
    })

  });

  describe('#letterGrade', function() {

    it('returns correct letter for percentage', function() {
      grade1 = new Grade(0.8);
      expect(grade1.letterGrade()).to.equal('B');
    });

    it('returns A for 100 percent', function() {
      grade1 = new Grade(1);
      expect(grade1.letterGrade()).to.equal('A');
    });

    it('returns F for 0 percent', function() {
      grade1 = new Grade(0);
      expect(grade1.letterGrade()).to.equal('F');
    });

    it('returns F for anything lower than 0.6', function() {
      grade1 = new Grade(0.4);
      expect(grade1.letterGrade()).to.equal('F');
    });

  });

  describe('#passingGradeLetters', function() {

    it('returns all passing letters', function() {
      grade1 = new Grade(0.8);
      expect(grade1.passingGradeLetters()).to.have.members(['A', 'B', 'C', 'D']);
    });

  });

  describe('#isImprovementFrom', function() {

    it('returns true if grade is better than comparison grade', function() {
      grade1 = new Grade(0.8);
      grade2 = new Grade(0.7);
      expect(grade1.isImprovementFrom( grade2 )).to.be.true;
    });

    it('returns false if grades are equal', function() {
      grade1 = new Grade(0.7);
      grade2 = new Grade(0.7);
      expect(grade1.isImprovementFrom( grade2 )).to.be.false;
    });

  });

  describe('#isBetterThan', function(){

    it('returns true if grade is better than comparison grade', function() {
      grade1 = new Grade(0.8);
      grade2 = new Grade(0.7);
      expect(grade1.isImprovementFrom( grade2 )).to.be.true;
    });

    it('returns false if grades are equal', function() {
      grade1 = new Grade(0.7);
      grade2 = new Grade(0.7);
      expect(grade1.isImprovementFrom( grade2 )).to.be.false;
    });

  });

});