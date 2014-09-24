(function(){

  var slides = document.getElementsByClassName('slide'),
      currSlideIdx = 0,

      checkNextStep = function(slideIdx){
        var currSlide = slides[slideIdx],
            steps = currSlide.getElementsByClassName('step');

        for(var i = 0, stepsCount = steps.length; i < stepsCount; i++){

          var curr = B(steps[i]);
          if(!curr.hasClass('done')){
            //step found thats not done
            curr.addClass('done');
            return false;
          }

        }

        return true;
      },

      checkPrevStep = function(slideIdx){
        var currSlide = slides[slideIdx],
            steps = currSlide.getElementsByClassName('step');

        for(var i = steps.length-1; i >= 0; i--){

          var curr = B(steps[i]);
          if(curr.hasClass('done')){
            //step found thats done
            curr.removeClass('done');
            return false;
          }

        }

        return true;
      },

      switchSlide = function(currSlideIdx, newSlideIdx){
        console.log(newSlideIdx);
         B(slides[ currSlideIdx ]).removeClass('visible');
         B(slides[ newSlideIdx ]).addClass('visible');
      },

      nextSlide = function(currSlideIdx){
        var nextSlideIdx = slides[currSlideIdx+1] !== undefined ? currSlideIdx+1 : 0;

        switchSlide(currSlideIdx, nextSlideIdx);

        return nextSlideIdx;
      },

      prevSlide = function(currSlideIdx){
        var prevSlideIdx = slides[currSlideIdx-1] !== undefined ? currSlideIdx-1 : slides.length-1;

        switchSlide(currSlideIdx, prevSlideIdx);

        return prevSlideIdx;
      };

  //make first slide visible
  B(slides[currSlideIdx]).addClass('visible');

  document.addEventListener('keyup', function(e){

    if(e.keyCode === 39 || e.keyCode === 32){
      //next (arrow or space)
      if(checkNextStep(currSlideIdx)){
        currSlideIdx = nextSlide(currSlideIdx);
      }
    } else if(e.keyCode === 37){
      //prev
      if(checkPrevStep(currSlideIdx)){
        currSlideIdx = prevSlide(currSlideIdx);
      }
    }

  }, false);

}());