$(document).ready(function() {
    
    
    var playbutton = "on";
    var clicks = "off";
    var strictmode = "off";
    var replay = "no";
    var masterpattern = [];
    var userpattern = [];
    var counter = 0;
    var checkcounter = 0;
    var greenaudio = "https://s3.amazonaws.com/freecodecamp/simonSound1.mp3";
    var greenchange = "#13FF7C";
    var greenoriginal = "#00A74A";
    var redaudio = "https://s3.amazonaws.com/freecodecamp/simonSound2.mp3";
    var redchange = "#FF4C4C";
    var redoriginal = "#9F0F17";
    var yellowaudio = "https://s3.amazonaws.com/freecodecamp/simonSound3.mp3";
    var yellowchange = "#FED93F";
    var yelloworiginal = "#CCA707";
    var blueaudio = "https://s3.amazonaws.com/freecodecamp/simonSound4.mp3";
    var bluechange = "#1C8CFF";
    var blueoriginal = "#094A8F";
    var buzzer = "http://www.freesfx.co.uk//rx2/mp3s/5/16884_1461333022.mp3";
    var clickdelay = 0;
    var clickpulse = 250;
    var cleartimer = "";



    function generator(replay) {
      clicks = "off";

      //Every time we replay or generate new move we need to reset userpattern and checkcounter
        userpattern = [];
        checkcounter = 0;

      //Create a function to play pattern
      function play() {
        //Playback function needed to save variables to then pass to setTimeout function
            function playback(color, change, original, sound, delay, pulse, last) {
                setTimeout(function() {
                      $("." + color).css("background", change);
                      var audio = new Audio(sound);
                      audio.play();
                }, delay);
                setTimeout(function() {
                      $("." + color).css("background", original);
                      if (last === "yes") {
                          clicks = "on";
                          //Add timer for max time user has to click
                          timer();
                      }
                }, (delay + pulse));

            } //End playback function


        //Set up initial delay (how long before first button pushed) and pulse
        var delay = 2500;
        var pulse = 500;

        //Loop through each move in the master pattern
        for (var i in masterpattern) {
              //Figure out which i is last one so that we can re-enable clicks on board
              if (Number(i) === (masterpattern.length -1)) {
                var last = "yes";
              }

              //Get the pattern color and the color of the pressed button
              var color = masterpattern[i];

              if (color === "green") {
                var change = "#13FF7C";
                var original = "#00A74A";
                var sound = "https://s3.amazonaws.com/freecodecamp/simonSound1.mp3";
              }
              if (color === "red") {
                var change = "#FF4C4C";
                var original = "#9F0F17";
                var sound = "https://s3.amazonaws.com/freecodecamp/simonSound2.mp3";
              }
              if (color === "yellow") {
                var change = "#FED93F";
                var original = "#CCA707";
                var sound = "https://s3.amazonaws.com/freecodecamp/simonSound3.mp3";
              }
              if (color === "blue") {
                var change = "#1C8CFF";
                var original = "#094A8F";
                var sound = "https://s3.amazonaws.com/freecodecamp/simonSound4.mp3";
              }

        //Save the variables and run them through playback function
        playback(color, change, original, sound, delay, pulse, last);

        //Set delay between each move
        if (masterpattern.length < 6) {
          delay += 1500;
        }
        else if (masterpattern.length >= 6 && masterpattern.length < 12) {
          delay += 1000;
        }
        else if (masterpattern.length >= 12) {
          delay += 500;
        }

        } //End for statement
      } //End play function


      //List all options available
      var moves = ["green", "red", "yellow", "blue"];

      //If we are adding to the pattern
      if (replay === "no") {

        //Add to board counter and display on board
        counter++;
        $(".counter").html("<h2 class='text-center'>" + counter + "</h2>");

        var random = Math.floor(Math.random() * 4);
        masterpattern.push(moves[random]);
        play();
      }

      //If we are replaying pattern
      if (replay === "yes") {
        play();
      }

    } //End generator function


    function patterncheck(checkcounter) {

      //Slice masterpattern list up to where user is currently at (checkcounter) and create userpattern copy
      var check = masterpattern.slice(0, checkcounter);
      var usercopy = userpattern.slice();

      //Convert check and user to a string for comparison
      check = check.join("");
      usercopy = usercopy.join("");

      //Check to see if move was correct or incorrect
      if (check === usercopy) {
        return "correct";

      }
      else {
        return "incorrect";
      }

    } //End patterncheck function


    function visibleclick(color, change, original, sound, delay, pulse) {

      setTimeout(function() {
        $("." + color).css("background", change);
        var audio = new Audio(sound);
        audio.play();
      }, delay)
      setTimeout(function() {
        $("." + color).css("background", original);
      }, (delay + pulse))

    } //End visibleclick function

    function reset() {
        //Reset all of the relevant variables
        clicks = "off";
        replay = "no";
        masterpattern = [];
        userpattern = [];
        counter = 0;
        $(".counter").html("<h2 class='text-center'>0</h2>");
        checkcounter = 0;

        //Clear anything that may be running right now
        var highesttimer = setTimeout(";");
        for (var i=0; i < highesttimer; i++) {
          clearTimeout(i);
        }

        //Put colors back to original (they may get stuck in the "clicked" position if you reset at that time)
        $(".green").css("background", "#00A74A");
        $(".red").css("background", "#9F0F17");
        $(".yellow").css("background", "#CCA707");
        $(".blue").css("background", "#094A8F");

        generator(replay);

    }

    function timer() {
      //Get current time and add 5 seconds to it
      var current = Date.now();
      var expired = current + 5000;

        //When current time catches up to the expired time then..
        function display() {
          current = Date.now();
          var datesec = Math.round(current/1000);
          var diff = (Math.round(expired/1000)) - datesec;

          if (diff <= 0 && strictmode === "on") {
            var buzzer = new Audio("http://www.freesfx.co.uk//rx2/mp3s/5/16884_1461333022.mp3");
            buzzer.play();
            reset();
          }
          else if (diff <= 0 && strictmode === "off") {
            var buzzer = new Audio("http://www.freesfx.co.uk//rx2/mp3s/5/16884_1461333022.mp3");
            buzzer.play();
            clearInterval(cleartimer);
            replay = "yes";
            generator(replay);
            replay = "no";
          }
        } //End display function

      display();
      cleartimer = setInterval(display, 1000);

    } //End timer

    function winner() {
      var audio = new Audio("http://www.freesfx.co.uk/rx2/mp3s/5/17024_1461336944.mp3");

      setTimeout(function() {
        $(".simongame").css("visibility", "hidden");
      }, 500)
      setTimeout(function() {
        audio.play();
        $(".simongame").css("visibility", "visible");
      }, 1000)
      setTimeout(function() {
        $(".simongame").css("visibility", "hidden");
      }, 1500)
      setTimeout(function() {
        audio.play();
        $(".simongame").css("visibility", "visible");
      }, 2000)
      setTimeout(function() {
        $(".simongame").css("visibility", "hidden");
      }, 2500)
      setTimeout(function() {
        audio.play();
        $(".simongame").css("visibility", "visible");
        reset();
      }, 3000)


    } //End winner function

    $(".play").click(function() {
       if (playbutton === "on") { 
          clicks = "on";
          generator(replay);
          $(".play").prop("disabled", "disabled");
          $(".reset").prop("disabled", false);
          playbutton = "off";
       }
    })

    $(".reset").click(function() {
        reset();
    })

    $(".strictbutton").click(function() {
      if (strictmode === "off") {
          $(".badge").css("background", "#00A74A");
          strictmode = "on";
      }
      else if (strictmode === "on") {
          $(".badge").css("background", "#EBEEF5");
          strictmode = "off";
      }
    })


    $(".green").click(function() {
      //Clear the timeout clause
      clearInterval(cleartimer);

      if (clicks === "on") { 
        //Count what number of user move this is
        checkcounter++;
        //Add move to userpattern list
        userpattern.push("green");

        //See if the move was correct
        var x = patterncheck(checkcounter);

        //If move was correct and pattern finished then...
        if (x === "correct" && userpattern.length === masterpattern.length) {
            //If user has not reached 20 correct moves then...
            if(userpattern.length < 20) {
              generator(replay);
            }
            else {
              winner();
            }
        } //End if
        else if (x === "correct" && userpattern.length < masterpattern.length) {
          timer();
        }
        if (x === "incorrect" && strictmode === "off") {
          replay = "yes";
          generator(replay);
          replay = "no";
        }
        if (x === "incorrect" && strictmode === "on") {
          reset();
        }

        //Show click on CSS and play sound
        if (x === "correct") {
            visibleclick("green", greenchange, greenoriginal, greenaudio, clickdelay, clickpulse);
        }
        else if (x === "incorrect") {
            visibleclick("green", greenchange, greenoriginal, buzzer, clickdelay, clickpulse);
        }

      } //End clicks
    })

    $(".red").click(function() {
      //Clear the timeout clause
      clearInterval(cleartimer);

      if (clicks === "on") {
        //Count what number of user move this is
        checkcounter++;
        //Add move to userpattern list
        userpattern.push("red");

        //See if the move was correct
        var x = patterncheck(checkcounter);

        //If move was correct and pattern finished then...
        if (x === "correct" && userpattern.length === masterpattern.length) {
            //If user has not reached 20 correct moves then...
            if(userpattern.length < 20) {
              generator(replay);
            }
            else {
              winner();
            }
        } //End if
        else if (x === "correct" && userpattern.length < masterpattern.length) {
          timer();
        }
        if (x === "incorrect" && strictmode === "off") {
          replay = "yes";
          generator(replay);
          replay = "no";
        }
        if (x === "incorrect" && strictmode === "on") {
          reset();
        }

        //Show click on CSS and play sound
        if (x === "correct") {
            visibleclick("red", redchange, redoriginal, redaudio, clickdelay, clickpulse);
        }
        else if (x === "incorrect") {
            visibleclick("red", redchange, redoriginal, buzzer, clickdelay, clickpulse);
        }

      } //End clicks
    })


    $(".yellow").click(function() {
      //Clear the timeout clause
      clearInterval(cleartimer);

      if (clicks === "on") {
        //Count what number of user move this is
        checkcounter++;
        //Add move to userpattern list
        userpattern.push("yellow");

        //See if the move was correct
        var x = patterncheck(checkcounter);

        //If move was correct and pattern finished then...
        if (x === "correct" && userpattern.length === masterpattern.length) {
            //If user has not reached 20 correct moves then...
            if(userpattern.length < 20) {
              generator(replay);
            }
            else {
              winner();
            }
        } //End if
        else if (x === "correct" && userpattern.length < masterpattern.length) {
          timer();
        }
        if (x === "incorrect" && strictmode === "off") {
          replay = "yes";
          generator(replay);
          replay = "no";
        }
        if (x === "incorrect" && strictmode === "on") {
          reset();
        }

        //Show click on CSS and play sound
        if (x === "correct") {
            visibleclick("yellow", yellowchange, yelloworiginal, yellowaudio, clickdelay, clickpulse);
        }
        else if (x === "incorrect") {
            visibleclick("yellow", yellowchange, yelloworiginal, buzzer, clickdelay, clickpulse);
        }

      } // End clicks
    })


    $(".blue").click(function() {
      //Clear the timeout clause
      clearInterval(cleartimer);

      if (clicks === "on") {
        //Count what number of user move this is
        checkcounter++;
        //Add move to userpattern list
        userpattern.push("blue");

        //See if the move was correct
        var x = patterncheck(checkcounter);

        //If move was correct and pattern finished then...
        if (x === "correct" && userpattern.length === masterpattern.length) {
            //If user has not reached 20 correct moves then...
            if(userpattern.length < 20) {
              generator(replay);
            }
            else {
              winner();
            }
        } //End if
        else if (x === "correct" && userpattern.length < masterpattern.length) {
          timer();
        }
        if (x === "incorrect" && strictmode === "off") {
          replay = "yes";
          generator(replay);
          replay = "no";
        }
        if (x === "incorrect" && strictmode === "on") {
          reset();
        }

        //Show click on CSS and play sound
        if (x === "correct") {
            visibleclick("blue", bluechange, blueoriginal, blueaudio, clickdelay, clickpulse);
        }
        else if (x === "incorrect") {
            visibleclick("blue", bluechange, blueoriginal, buzzer, clickdelay, clickpulse);
        }

      } //End clicks
    })

    
    
    
    
    
}); //End whole document




