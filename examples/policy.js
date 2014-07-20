var Utensils = require('utensils');

var ActiveStudentPolicy = Utensils.Policy.extend({

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