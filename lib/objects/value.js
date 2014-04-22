var Value = function( value ) {
  this.value = value;
}

Value.create = function( value ) {
  if ( this.parse )
    value = this.parse( value );

  return new this( value );
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