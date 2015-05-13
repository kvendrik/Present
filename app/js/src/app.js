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

                    if(history.pushState){
                        history.pushState([(slideIdx+1), (i+1)], 'Slide: '+(slideIdx+1), '#slide-'+(slideIdx+1)+'&step-'+(i+1));
                    }

                    return { result: false, newStepIdx: i };
                }

            }

            return { result: true };
        },

        checkPrevStep = function(slideIdx){
            var currSlide = slides[slideIdx],
                steps = currSlide.getElementsByClassName('step');

            for(var i = steps.length-1; i >= 0; i--){
                var curr = B(steps[i]);

                if(curr.hasClass('done')){
                    //step found thats done
                    curr.removeClass('done');
                    if(history.pushState){
                        history.pushState([(slideIdx+1), i], 'Slide: '+(slideIdx+1), '#slide-'+(slideIdx+1)+(i !== 0 ? '&step-'+i : ''));
                    }
                    return { result: false, newStepIdx: i-1 };
                }
            }

            return { result: true };
        },

        switchSlide = function(currSlideIdx, newSlideIdx){
            B(slides[ currSlideIdx ]).removeClass('visible');
            B(slides[ newSlideIdx ]).addClass('visible');
        },

        nextSlide = function(currSlideIdx){
            var nextSlideIdx = slides[currSlideIdx+1] !== undefined ? currSlideIdx+1 : 0;

            switchSlide(currSlideIdx, nextSlideIdx);
            if(history.pushState){
                history.pushState([(nextSlideIdx+1), 0], 'Slide: '+(nextSlideIdx+1), '#slide-'+(nextSlideIdx+1));
            }

            return nextSlideIdx;
        },

        prevSlide = function(currSlideIdx){
            var prevSlideIdx = slides[currSlideIdx-1] !== undefined ? currSlideIdx-1 : slides.length-1;

            switchSlide(currSlideIdx, prevSlideIdx);
            if(history.pushState){
                history.pushState([(prevSlideIdx+1), 0], 'Slide: '+(prevSlideIdx+1), '#slide-'+(prevSlideIdx+1));
            }

            return prevSlideIdx;
        },

        goToState = function(slideIdx, stepIdx, pushHistory){
            if(pushHistory === undefined){
                pushHistory = true;
            }

            switchSlide(currSlideIdx, slideIdx);

            if(stepIdx !== undefined && stepIdx !== null){
                makeStepsVisible(slideIdx, stepIdx);
            }

            if(history.pushState && pushHistory){
                history.pushState([(slideIdx+1), i], 'Slide: '+(slideIdx+1), '#slide-'+(slideIdx+1)+(stepIdx !== undefined && stepIdx !== null && stepIdx > -1 ? '&step-'+(stepIdx+1) : ''));
            }

            currSlideIdx = slideIdx;
        },

        toNext = function(){
            var checkStep = checkNextStep(currSlideIdx);

            if(checkStep.result){
                currSlideIdx = nextSlide(currSlideIdx);
            }

            socket.emit('change', [currSlideIdx, checkStep.newStepIdx]);
        },

        toPrev = function(){
            var checkStep = checkPrevStep(currSlideIdx);

            if(checkStep.result){
                currSlideIdx = prevSlide(currSlideIdx);
            }

            socket.emit('change', [currSlideIdx, checkStep.newStepIdx]);
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

    //init sockets
    var socket = io(':3000');

    //on change go to corresponding slide
    //trigger change on every change made to slides
    socket.on('change', function(idxs){
        goToState(idxs[0], idxs[1]);
    });

    //listen for back or forward button on browser
    window.addEventListener('popstate', function(e){
        var state = e.state,
            newSlideIdx,
            newStepIdx;

        if(state !== null) {
            newSlideIdx = state[0]-1;
            newStepIdx = state[1]-1;
        } else {
            newSlideIdx = newStepIdx = 0;
        }

        goToState(newSlideIdx, newStepIdx, false);
        socket.emit('change', [newSlideIdx, newStepIdx]);
    });

    document.addEventListener('keyup', function(e){
        if(e.keyCode === 39 || e.keyCode === 32){
            //next (arrow or space)
            toNext();
        } else if(e.keyCode === 37){
            //prev
            toPrev();
        }
    }, false);

    document.addEventListener('ontouchstart' in window ? 'touchstart' : 'click', toNext, false);

}());
