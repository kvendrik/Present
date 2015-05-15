(function(io){

    var present = {

        init: function(){
            this._slides = document.getElementsByClassName('slide');
            this._currSlideIdx = 0;

            this._checkHash();
            this._initSockets();
            this._bindEvents();
        },

        _bindEvents: function(){
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
                this._emitChange([newSlideIdx, newStepIdx]);
            }.bind(this));

            document.addEventListener('keyup', function(e){
                if(e.keyCode === 39 || e.keyCode === 32){
                    //next (arrow or space)
                    this._toNext();
                } else if(e.keyCode === 37){
                    //prev
                    this._toPrev();
                }
            }.bind(this), false);

            document.addEventListener('ontouchstart' in window ? 'touchstart' : 'click', this._toNext.bind(this), false);
        },

        _checkHash: function(){
            //if hash available
            //extract slideIdx and stepIdx
            //and go to slideIdx and stepIdx
            if(location.hash !== ''){

                var hash = location.hash,
                    slideIdx = Number(hash.match(/slide\-(\d+)/)[1])-1,

                    stepMatch = hash.match(/step\-(\d+)/),
                    stepIdx = stepMatch ? Number(stepMatch[1])-1 : undefined;

                this._goToState(slideIdx, stepIdx);

            } else {
                //make first slide visible
                B(this._slides[this._currSlideIdx]).addClass('visible');
            }
        },

        _initSockets: function(){
            //init sockets
            var socket = this._socket = io();

            //on change go to corresponding slide
            //trigger change on every change made to slides
            socket.on('change', function(idxs){
                this._goToState(idxs[0], idxs[1]);
            }.bind(this));
        },

        _emitChange: function(details){
            this._socket.emit('change', details);
        },

        _makeStepsVisible: function(slideIdx, stepsAmount){
            var currSlide = this._slides[slideIdx],
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

        _checkNextStep: function(slideIdx){
            var currSlide = this._slides[slideIdx],
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

        _checkPrevStep: function(slideIdx){
            var currSlide = this._slides[slideIdx],
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

        _goToState: function(slideIdx, stepIdx, pushHistory){
            if(pushHistory === undefined){
                pushHistory = true;
            }

            this._switchSlide(this._currSlideIdx, slideIdx);

            if(stepIdx !== undefined && stepIdx !== null){
                this._makeStepsVisible(slideIdx, stepIdx);
            }

            if(history.pushState && pushHistory){
                history.pushState([(slideIdx+1), i], 'Slide: '+(slideIdx+1), '#slide-'+(slideIdx+1)+(stepIdx !== undefined && stepIdx !== null && stepIdx > -1 ? '&step-'+(stepIdx+1) : ''));
            }

            this._currSlideIdx = slideIdx;
        },

        _switchSlide: function(currSlideIdx, newSlideIdx){
            var slides = this._slides;
            B(slides[ currSlideIdx ]).removeClass('visible');
            B(slides[ newSlideIdx ]).addClass('visible');
        },

        _nextSlide: function(currSlideIdx){
            var slides = this._slides,
                nextSlideIdx = slides[currSlideIdx+1] !== undefined ? currSlideIdx+1 : 0;

            this._switchSlide(currSlideIdx, nextSlideIdx);
            if(history.pushState){
                history.pushState([(nextSlideIdx+1), 0], 'Slide: '+(nextSlideIdx+1), '#slide-'+(nextSlideIdx+1));
            }

            return nextSlideIdx;
        },

        _prevSlide: function(currSlideIdx){
            var slides = this._slides,
                prevSlideIdx = slides[currSlideIdx-1] !== undefined ? currSlideIdx-1 : slides.length-1;

            this._switchSlide(currSlideIdx, prevSlideIdx);
            if(history.pushState){
                history.pushState([(prevSlideIdx+1), 0], 'Slide: '+(prevSlideIdx+1), '#slide-'+(prevSlideIdx+1));
            }

            return prevSlideIdx;
        },

        _toNext: function(){
            var currSlideIdx = this._currSlideIdx,
                checkStep = this._checkNextStep(currSlideIdx);

            if(checkStep.result){
                this._currSlideIdx = currSlideIdx = this._nextSlide(currSlideIdx);
            }

            this._emitChange([currSlideIdx, checkStep.newStepIdx]);
        },

        _toPrev: function(){
            var currSlideIdx = this._currSlideIdx,
                checkStep = this._checkPrevStep(currSlideIdx);

            if(checkStep.result){
                this._currSlideIdx = currSlideIdx = this._prevSlide(currSlideIdx);
            }

            this._emitChange([currSlideIdx, checkStep.newStepIdx]);
        }

    };

    present.init();

}(io));
