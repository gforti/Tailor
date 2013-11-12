Tailor
======

A JavaScript CSS Animator

This is a small framework that can be used to animate DOM objects with CSS properties.

e.g. :
 Tailor.animate("id",{'opacity' : "100"});
 
public funtion Tailor.animate(@id, @json [,@callback])
--
 params 
  - @id - ID of DOM object in HTML
  - @json - JSON object with CSS properties and values to animate
  - [@callback] - Callback function to excute when animation is complete.
        
public function Tailor.css(@id, @json)
--
 params 
  - @id - ID of DOM object in HTML
  - @json - JSON object with CSS properties and values to apply
