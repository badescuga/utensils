var Value = require('../lib/utensils').Value;
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
    return _.chain( grades ).where({ passing: true }).pluck('letter').value();
  },

  details: function() {
    return _.find( function() { this.value >= min; });
  },

  letterGrade: function() {
    return this.details().letter;
  },

  isPassing: function() {
    return this.passingGradeLetters().indexOf( this.letterGrade() ) !== -1;
  },

  isImprovementFrom: function( grade ) {
    return this.details().min > grade.details().min;
  }

});
