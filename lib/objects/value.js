var Value = function( value ) {
  if ( this.parse ) value = this.parse( value );
  this.value = value;
}

Value.prototype.isEqualTo = function( otherValue ) {
  return this.value === otherValue.value;
}

Value.prototype.isNotEqualTo = function( otherValue ) {
  return this.value !== otherValue.value;
}

Value.prototype.isGreaterThan = function( otherValue ) {
  return this.value > otherValue.value;
}

Value.prototype.isLessThan = function( otherValue ) {
  return this.value < otherValue.value;
}

module.exports = Value;