var Value = require('../../lib/utensils').Value;
var _ = require('underscore');

var Grade = Value.extend({

  grades: [
    { letter: 'A', min: 0.9, passing: true },
    { letter: 'B', min: 0.8, passing: true },
    { letter: 'C', min: 0.7, passing: true },
    { letter: 'D', min: 0.6, passing: true },
    { letter: 'F', min: 0,   passing: false }
  ],

  passingGradeLetters: function() {
    return _.chain( this.grades ).where({ passing: true }).pluck('letter').value();
  },

  details: function() {
    var self = this;
    return _.find( this.grades, function( item ) { return self.value >= item.min; });
  },

  letterGrade: function() {
    return this.details().letter;
  },

  isPassing: function() {
    return this.passingGradeLetters().indexOf( this.letterGrade() ) !== -1;
  },

  isImprovementFrom: function( grade ) {
    if ( grade instanceof Grade === false ) {
      throw new Error('comparison grade is not an instance of Grade');
      return false;
    }
    return this.details().min > grade.details().min;
  }

});

module.exports = Grade;