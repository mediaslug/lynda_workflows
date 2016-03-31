$ = require 'jquery'
do fill = (item='the most creative minds in Art') -> 
$('.tagline').append "#{item}"
fill