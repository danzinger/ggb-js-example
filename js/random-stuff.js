        /////////////////////////////////////////////////
        ///////// INITIALIZE APPLET /////////////////////
        /////////////////////////////////////////////////

        window.onload = function() {

            var parameters = {
                appName: 'classic',
                filename: "../ggb/random-stuff.ggb",
                enableRightClick: false,
                enableShiftDragZoom: false,
                width: 600,
                height: 600,
                borderColor:'#007bff'

            };

            var applet = new GGBApplet(parameters, true);
            applet.inject('applet_container');

        }

        /////////////////////////////////////////////////
        ///////////// HELPER FUNCTIONS //////////////////
        /////////////////////////////////////////////////

        /**
         * Returns a random integer between min (inclusive) and max (inclusive)
         * Using Math.round() will give a non-uniform distribution!
         */
        function getRandomInt(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }

        //this centers the view
        function centerView() {
            ggbApplet.evalCommand('CenterView((0, 0))');
        }

        /////////////////////////////////////////////////
        ///////////// RANDOM POINTS /////////////////////
        /////////////////////////////////////////////////


        function iterator() {
            let iterator = []
            for (i = 0; i < 80; i++) {
                iterator.push(i);
            }
            return iterator;
        }

        function toggleVisibility() {
            // this function toggles the visibility of the points

            // if the points are dancing stop the dance
            if (IntervalId) {
                stopDance();
            }
            // toggle the visibility of each point
            for (let i of iterator()) {
                if (ggbApplet.getVisible('P_' + i)) {
                    ggbApplet.setVisible('P_' + i, false);
                } else {
                    ggbApplet.setVisible('P_' + i, true);
                }
            }
            // update the DOM
            if (ggbApplet.getVisible('P_0')) {
                $('#pointsShown').show()
                $('#pointsHidden').hide()
            } else {
                $('#pointsShown').hide()
                $('#pointsHidden').show()
            }
        }
        //this function draws random points in [-5,5]x[-5,5] and connects
        //a (somewhat) arbitrary subset of them with lines.
        function drawRandomPoints() {
            $('#pointsShown').show()
            $('#pointsHidden').hide()
            ggbApplet.reset();
            let randomArrayX = [];
            let randomArrayY = [];
            for (let x of iterator()) {
                randomArrayX.push(getRandomInt(-5, 5));
                randomArrayY.push(getRandomInt(-5, 5));
                pointToDraw = 'P_{' + x + '}=(' + randomArrayX[x] + ',' + randomArrayY[x] + ')';
                ggbApplet.evalCommand(pointToDraw);
                if (x > 2 && 4 * x < iterator().length) {
                    lineToDraw = 'l_{' + x + '}=Line(P_' + x + ',P_' + (x - 1) + ')';
                    ggbApplet.evalCommand(lineToDraw);
                }

            }
        }
        
        
        let IntervalId;
        function letsDance() {
            //regenerates the points and lines every 200ms
            $('#stopDanceButton').show()
            $('#startDanceButton').hide()
            IntervalId = setInterval(function() {
                drawRandomPoints()
            }, 200);
        }

        function stopDance() {
            //stops the dance
            $('#stopDanceButton').hide()
            $('#startDanceButton').show()
            clearInterval(IntervalId);
        }