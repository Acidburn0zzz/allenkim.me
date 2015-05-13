---
title: Find common or unique elements from ruby arrays
---
To find common elements from multiple ruby arrays, use bitwise operator and, \u2018&\u2019, not and operator,\u201d&&\u201d
<!--more-->

    >> [1,2,3] & [4,1,5] & [6,7,1] & [8,8,8,1]
    => [1]


On the contrary,  to find unique elements from multiple arrays, you can use bitwise operator or, \u2018|\u2019

    >> [1,2,3] | [4,1,5] | [6,7,1] | [8,8,8,1]
    => [1, 2, 3, 4, 5, 6, 7, 8]

**In common sense, this bitwise operator should not work**, but ruby Array defines its own method :& and :| for convenience. 

http://www.ruby-doc.org/core-1.9.3/Array.html#method-i-26
http://www.ruby-doc.org/core-1.9.3/Array.html#method-i-7C

Therefore, **there is no bitwise calculation going on with array** when use \u201c&\u201d or \u201c|\u201d, but you simply call method &(unique), |(intersect). it is confusing as a Java/C/Erlang backgrounded programmer, but it is also very convenient.
