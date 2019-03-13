        /////////////////////////////////////////////////
        ///////// INITIALIZE APPLET /////////////////////
        /////////////////////////////////////////////////

        window.onload = function() {

            var parameters = {
                appName: 'classic',
                filename: "../ggb/function-quiz.ggb",
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
        ///////////// FUNCTION QUIZ /////////////////////
        /////////////////////////////////////////////////

        function drawRandomFunction() {
            ggbApplet.reset();
            $('#pointsShown').hide();
            $('#pointsHidden').hide();
            let p = getRandomInt(-5, 5);
            let q = getRandomInt(1, 5);
            let d = getRandomInt(-5, 4);
            let command = 'f(x)=' + p + '/' + q + '*x' + '+' + d;
            ggbApplet.evalCommand(command);
            let command2 = 'g(x)=?';
            ggbApplet.setColor('f', 255, 0, 0);
            let fInLatex = ggbApplet.getLaTeXBase64('f', false);
            let inner = "&nbsp;&nbsp;<span>Correct answer as LaTeX image: </span><img src='data:image/png;base64," + fInLatex + "'>";
            document.getElementById('latex').innerHTML = inner;
            $('#checkform').show()
            $('#latex').show();
        }

        function checkRandomFunction(func) {
            if (func && (func.match(/^\d/) || (func.startsWith('-') && func != '-' && !func.startsWith('--') && !func.startsWith('-+')) || func.startsWith('x') || (func.startsWith('+') && !func.startsWith('++') && func != '+' && !func.startsWith('+-')) || func.startsWith('('))) {
                ggbApplet.evalCommand('g(x)=' + func);
                ggbApplet.evalCommand('isequal=f==g');
                if (ggbApplet.getValue('isequal') == true) {
                    $('#correctModal').modal();
                    $('#checkform').hide();
                    $('#latex').hide();
                    ggbApplet.reset();
                } else {
                    $('#falseModal').modal();
                    ggbApplet.evalCommand('g(x)=?');
                };
            }
        }

        /////////////////////////////////////////////////
        ///////////// EXECUTE COMMAND ///////////////////
        /////////////////////////////////////////////////

        function evalInput(strInput) {
            ggbApplet.evalCommand(strInput);
            return false;
        }