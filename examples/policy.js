var Policy = require('../lib/utensils').Policy;

var ActiveStudentPolicy = Policy.extend({

  argumentName: 'student',

  isNotExpelled: function() {
    return !this.student.isExpelled;
  },

  isNotSuspended: function() {
    return !this.student.isSuspended;
  },

  isSomethingAsync: function( resolve, reject ) {
    reject('foo');
  }

});

module.exports = ActiveStudentPolicy;