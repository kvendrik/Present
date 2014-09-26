(function(){

  var slides = document.getElementsByClassName('slide'),
      currSlideIdx = 0,

      makeStepsVisible = function(slideIdx, stepsAmount){
        var currSlide = slides[slideIdx],
            steps = currSlide.getElementsByClassName('step');

        for(var i = 0, stepsCount = steps.length; i < stepsCount; i++){

          var curr = B(steps[i]);
          if( i <= stepsAmount ){
            curr.addClass('done');
          } else {
            curr.removeClass('done');
          }

        }
      },

      checkNextStep = function(slideIdx){
        var currSlide = slides[slideIdx],
            steps = currSlide.getElementsByClassName('step');

        for(var i = 0, stepsCount = steps.length; i < stepsCount; i++){

          var curr = B(steps[i]);
          if(!curr.hasClass('done')){
            //step found thats not done
            curr.addClass('done');
            history.pushState([(slideIdx+1), (i+1)], 'Slide: '+(slideIdx+1), '#slide-'+(slideIdx+1)+'&step-'+(i+1));
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
            history.pushState([(slideIdx+1), i], 'Slide: '+(slideIdx+1), '#slide-'+(slideIdx+1)+(i !== 0 ? '&step-'+i : ''));
            return false;
          }

        }

        return true;
      },

      switchSlide = function(currSlideIdx, newSlideIdx){
         B(slides[ currSlideIdx ]).removeClass('visible');
         B(slides[ newSlideIdx ]).addClass('visible');
      },

      nextSlide = function(currSlideIdx){
        var nextSlideIdx = slides[currSlideIdx+1] !== undefined ? currSlideIdx+1 : 0;

        switchSlide(currSlideIdx, nextSlideIdx);
        history.pushState([(nextSlideIdx+1), 0], 'Slide: '+(nextSlideIdx+1), '#slide-'+(nextSlideIdx+1));

        return nextSlideIdx;
      },

      prevSlide = function(currSlideIdx){
        var prevSlideIdx = slides[currSlideIdx-1] !== undefined ? currSlideIdx-1 : slides.length-1;

        switchSlide(currSlideIdx, prevSlideIdx);
        history.pushState([(prevSlideIdx+1), 0], 'Slide: '+(prevSlideIdx+1), '#slide-'+(prevSlideIdx+1));

        return prevSlideIdx;
      },

      goToState = function(slideIdx, stepIdx){

        switchSlide(currSlideIdx, slideIdx);
        if(stepIdx !== undefined) makeStepsVisible(slideIdx, stepIdx);

        currSlideIdx = slideIdx;

      };

  //if hash available
  //extract slideIdx and stepIdx
  //and go to slideIdx and stepIdx
  if(location.hash !== ''){

    var hash = location.hash,
        slideIdx = Number(hash.match(/slide\-(\d+)/)[1])-1,

        stepMatch = hash.match(/step\-(\d+)/),
        stepIdx = stepMatch ? Number(stepMatch[1])-1 : undefined;

    goToState(slideIdx, stepIdx);

  } else {
    //make first slide visible
    B(slides[currSlideIdx]).addClass('visible');
  }

  //listen for back or forward button on browser
  window.addEventListener('popstate', function(e){

    var state = e.state;

    if(state !== null) {
      goToState(state[0]-1, state[1]-1);
    } else {
      goToState(0,0);
    }

  });

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