[![Travis CI](https://travis-ci.org/createbang/utensils.svg)](https://travis-ci.org/createbang/utensils)
[![Coverage Status](https://coveralls.io/repos/createbang/utensils/badge.png)](https://coveralls.io/r/createbang/utensils)

utensils.js
========

Base objects as tools for code cleanliness

# Introduction



# Patterns

## Value

Value Objects are objects whos equality is determined not by identity but by value.

```js
var Grade = Utensils.Value.extend();

var firstScore = new Grade(0.6);
var secondScore = new Grade(0.6);

firstScore === secondScore // false
firstScore.isEqualTo(secondScore) // true
Utensils.Value.isEqual(firstScore, secondScore) // true
```