// PennController.DebugOff() // activate command before launching experiment --> this is to detect errors in the script when trial-running the experiment. 

PennController.Sequence("setcounter","consent", "demographic", "instructions", "Practice", "PracticeEnd", shuffle( 
                              rshuffle( "a", "b", "c", "d",), 
                              rshuffle("filler", "sturt-a", "sturt-b", "sturt-c", "sturt-d")), "endform","send", "prolific") 

//See ibex manual for randomize/shuffling options; you can specify labels from your csv file here as long as they are in the column you call under PennController.Template below

PennController.ResetPrefix(null);


var items = [ 

    ["setcounter", "__SetCounter__", { } ] // this is still an old Ibex command but works. This automatically sets the counter at the beginning. Could be problematic for Latin-Square, and separate lists work best. 
    ,    
    
//here are all the html files you need for your experiment
    
    ["consent", "PennController", PennController(
        newHtml("consent", "example_intro.html") // Inserting the .html document with consent form. First "text" after newHtml( is the name you assign (for in PennController.Sequence), second "text.html" is filename.
            .settings.log() // log the response (which means that once they press the button, it is logged that they accept)
            .print() // print the .html. without this command, you won't see it. 
        ,
        newButton("consent btn", "I agree") // Creating a button to go to next page.
            .print() // command to print the button
            .wait( getHtml("consent").test.complete().failure( getHtml("consent").warn() ) ) // this means that the next page will waited for until button is pressed. Create radio button for accept in your html,
                )]                                                                          // the .failure and .warn mean that first everything in the HTML needs to be fulfilled before being able to press cont. 
    ,
    
    ["demographic", "PennController", PennController(
        newHtml("demographic", "demographic_form.html")
            .print()
        ,
        newButton("continue btn", "Continue")
            .print()
            .wait()
    )]
    ,   
    
    ["instructions", "PennController", PennController(
        newHtml("instructions", "instruction_form.html")
            .print()
        ,
        newButton("continue btn", "Continue")
            .print()
            .wait()
    )]
    ,
     
         ["PracticeEnd", "PennController", PennController(
        newHtml("PracticeEnd", "PracticeEnd.html")
            .print()
        ,
        newButton("continue btn", "Continue")
            .print()
            .wait()
    )]
    ,
    
       ["endform", "PennController", PennController(
        newHtml("endform", "end_form.html")
            .settings.log()
            .print()
        ,
         newButton("continue to confirm", "Continue")
            .print()
            .wait()                       
    )] 
    ,
    
    ["send", "__SendResults__", {}]   
    ,
    ["prolific", "PennController", PennController(
        newHtml("prolific", "prolific-1.html")
            .settings.log()
            .print()
        ,
        newButton("continue btn", "Continue")
            .settings.bold()
           //.print()
            .wait()                 
    )]                     
 , 
 
       ["finish", "PennController", PennController(
        newHtml("finish", "finish.html")
            .settings.log()
            .print()
                            
    )] 
    ,
    
 
 ];
 
  
	
 //PennController.Header(
  // defaultCanvas
  //     .settings.cssContainer("outline", "solid 1px green")
// );

//to create practice items in your experiment, you'll need to create a separate csv (or you could create a table - see PennController manual) 

PennController.Template( "Practice.csv", // See description about how to set up csv-file in CSV.txt in the template folder. -- PennController.Template is the command to call in .csv, and opens a new command sequence below, where you can manipulate how exactly you want everything to show up. 
  item => PennController("Practice",  // this is what we named the practice items in the PennController.Sequence command above                          
  newText(item.Sentence ) // Don't exactly know what this does, but pick a column and call it in by the name you assign + call it in with the item.Columnname command. 
 
  ,
    newTimer("blank", 1000) // timer inserted which causes a 1000ms (1sec) wait before the item shows up in the order you assign for within the item.
        .settings.log()
        .start()
        .wait()
        ,
       
       newTooltip("instructions", "Press space bar to continue") // This command seems obsolete. It doesn't have a function in my experiment but don't know what deletion would mean. 
            .settings.size(180, 25)
            .settings.position("bottom center")
            .settings.key(" ", "no click")
        ,
       newCanvas("stimbox", 800, 160)                      // First manipulation in PennController.Template() Creating a canvas with a black border of size 800 width, 160 height.
              .settings.css("border", "solid 1px black")
                   .settings.add(25,40,
                newText("context", item.Sentence) // in this Canvas we first get the sentence, which is listed under column Sentence, hence calling it in with item.Sentence. 
                    .settings.size(700, 30)
                    
            )
            
                    .print()
            
                 
            ,
            newText("warning2","Please choose an answer") // technically not needed here but it's not being used
            .settings.hidden()
            .settings.color("red")
            .settings.bold()
            .settings.css("margin-left", 50 )
            .print()
        ,
            
               newButton("newsentence", "Continue")               // Button press between the above canvas, and the one below, called "answerbox". You could also decide to do this with a timer, or to put .wait() before .print() of the new canvas. Then it will only be printed after any button (any keyboard key) press. 
            .settings.center()
            .print()
             .wait()
            
        , 
        
    

           newCanvas("empty", 800, 40)          // when you create a line around your canvas, create another one without a line, that is not very high, but high enough to create vertical space between the two canvasses. 
                 .print()                       // 2 canvases are ideal to create some space between your context sentence and target question and answer buttons. Using the entire screen. 
                 								// this one creates space between the canvas and the "Continue" button
          
        ,
        
        newScale("answer", 2)               // scale needs to be created before calling it into the canvas below. "text" gives name to the scale, the number behind is the number of options on the scale. So you can 
            .settings.log() // do 7 for 7-point Likert, or 2 for forced choice. settings.log is necessary to record the responses in the results file. 
          
        ,
          newCanvas("answerbox", 800, 130) //new Canvas for CQ 

          .settings.css("border", "solid 1px black")

             .settings.add(25,40, newText("target", item.Question).settings.size(700, 30) ) //here you specify which column contains the CQ 
            
           .settings.add("middle at 400",80, getScale("answer").settings.size(200, 20)
            .settings.before(newText("labelLeft", item.Option1).settings.bold()) //Option1 is the column with the first option in the csv file 
    		.settings.after(newText("labelRight", item.Option2).settings.bold()) ) //Option2 is the column with the second option in the csv file 
            
                         .print()
                		  ,

 
        newText("warning","Please choose an answer") //warning if they don't choose an answer
            .settings.hidden()
            .settings.color("red")
            .settings.bold()
            .settings.css("margin-left", 50 )
            .print()
        ,
        newButton("validate", "Continue") //press Continue once selection is made 
            .settings.center()
            .print()    
            .wait(getScale("answer")
                  .test.selected()
                  .failure(getText("warning")
                           .settings.visible()
                        )
                            ) 
                            )        
                             )  ;

 PennController.Template( "Omaki_List_1.csv", // See description about how to set up csv-file in CSV.txt in the template folder. -- PennController.Template is the command to call in .csv, and opens a new command sequence below, where you can manipulate how exactly you want everything to show up. 
  item => PennController(item.Class,  // this line commands that the extraction from the file takes the "Class" column for primary reference. This is important for randomization -- this "text" needs to be the same as the "text" in PennController.Sequence randomize() command.                             
  newText(item.Sentence ) // Don't exactly know what this does, but pick a column and call it in by the name you assign + call it in with the item.Columnname command. 
 
  ,
    newTimer("blank", 1000) // timer inserted which causes a 1000ms (1sec) wait before the item shows up in the order you assign for within the item.
        .settings.log()
        .start()
        .wait()
        ,
       
       newTooltip("instructions", "Press space bar to continue") // This command seems obsolete. It doesn't have a function in my experiment but don't know what deletion would mean. 
            .settings.size(180, 25)
            .settings.position("bottom center")
            .settings.key(" ", "no click")
        ,
        newCanvas("stimbox", 800, 160)                      // First manipulation in PennController.Template() Creating a canvas with a green border of size 800 width, 160 height.
              .settings.css("border", "solid 1px black")
                   .settings.add(25,40,
                newText("context", item.Sentence) // in this Canvas we first get the context sentence, which is listed under column Sentence, hence calling it in with item.Sentence. 
                    .settings.size(700, 30)
                    
            )
            
                    .print()
            
                 
            ,
            
              newText("warning2","Please choose an answer")
            .settings.hidden()
            .settings.color("red")
            .settings.bold()
            .settings.css("margin-left", 50 )
            .print()
        ,
            
               newButton("newsentence", "Continue")               // So here there's a timer between the above canvas, and the one below, called "answerbox". You could also decide to do this with newButton, or to put .wait() before .print() of the new canvas. Then it will only be printed after any button (any keyboard key) press. 
            .settings.center()
            .print()
             .wait()
            
        , 
        
    

           newCanvas("empty", 800, 40)          // when you create a line around your canvas, create another one without a line, that is not very high, but high enough to create vertical space between the two canvasses. 
                 .print()                       // 2 canvases are ideal to create some space between your context sentence and target question and answer buttons. Using the entire screen. 
          
        ,
       
        newScale("answer", 2) // scale needs to be created before calling it into the canvas below. "text" gives name to the scale, the number behind is the number of options on the scale. So you can 
            .settings.log() // do 7 for 7-point Likert, or 2 for forced choice. settings.log is necessary to record the responses in the results file. 
          
        ,
          newCanvas("answerbox", 800, 130)

        .settings.css("border", "solid 1px black")

            .settings.add(25,40, newText("target", item.Question).settings.size(700, 30) )
            
           .settings.add("middle at 400",80, getScale("answer").settings.size(200, 20)
            .settings.before(newText("labelLeft", item.Option1).settings.bold())
    		.settings.after(newText("labelRight", item.Option2).settings.bold()) )

            
                         .print()        
        ,

 
        newText("warning","Please choose an answer")
            .settings.hidden()
            .settings.color("red")
            .settings.bold()
            .settings.css("margin-left", 50 )
            .print()
        ,
        newButton("validate", "Continue")
            .settings.center()
            .print()    
            .wait(getScale("answer")
                  .test.selected()
                  .failure(getText("warning")
                           .settings.visible()
                        )
                            )              
                                ) .log("Class", item.Class) 
                                .log("Sentence", item.Sentence) 
                                .log("Option1", item.Option1)
                                .log("Option2", item.Option2)
                                .log("Question", item.Question) // Because items are inserted from .csv, the variable names aren't automatically recorded. by putting this right before the last closing parenthesis of the full PennController script, you make sure that for every item, the value in column "Class" is recorded in the results file, for analysis in R and grouping the variables together. 
                                )  ; 
        
        //specify here any columns you want to appear in your results file
       
        
    