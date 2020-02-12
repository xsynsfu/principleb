// PennController.DebugOff() // activate command before launching experiment --> this is to detect errors in the script when trial-running the experiment. 

PennController.Sequence("setcounter","consent","instructions","scaleinstr","distract", randomize("Class"), "debrief","send","thanks") 

PennController.ResetPrefix(null);


var items = [ 

    ["setcounter", "__SetCounter__", { } ] // this is still an old Ibex command but works. This automatically sets the counter at the beginning. Could be problematic for Latin-Square, and separate lists work best. 
    ,    
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
    ["instructions", "PennController", PennController(
        newHtml("instructions", "TaskInstructions-Sp-belief.html")
            .print()
        ,
        newButton("continue btn", "Continue")
            .print()
            .wait()
    )]
    ,
     ["scaleinstr", "PennController", PennController(                                   // scaleinstr is a file (in German, can be in English) instructing participants that they can either use full scale or not. 
        newHtml("scale form", "Scale.html")                                             // .htmls can be removed from here, then they also need to be removed from PennController.Sequence.
            .print()
        ,
        newButton("continue btn", "Continue.")  
            .print()
            .wait( getHtml("scale form").test.complete().failure(getHtml("scale form").warn()) )
    )]
    ,     
    ["distract", "PennController", PennController(                                   // scaleinstr is a file (in German, can be in English) instructing participants to put away other distractions. Attached
        newHtml("distract form", "DistractionsOff.html")                            // to this experiment, can be changed to an English form -- or be deleted. 
            .print()
        ,
        newButton("continue btn", "Continue.")
            .print()
            .wait( getHtml("distract form").test.complete().failure(getHtml("distract form").warn()) )
    )]
    ,      

       ["debrief", "PennController", PennController(
        newHtml("debrief", "debrief_form.html")
            .settings.log()
            .print()
        ,
         newButton("continue to confirm", "Klicken Sie hier, um fortzufahren.")
            .print()
            .wait()                       
    )] 
    ,
    
    ["send", "__SendResults__", {}]   
    ,
    ["thanks", "PennController", PennController(
        newHtml("thanks", "end_form.html")
            .settings.log()
            .print()
        ,
        newButton("continue btn", "Jag &auml;r klar.")
            .settings.bold()
     //       .print()
            .wait()                 
    )]                     
 , ];
 
 //PennController.Header(
  // defaultCanvas
  //     .settings.cssContainer("outline", "solid 1px green")
// );

 PennController.Template( "CSV_Template.csv", // See description about how to set up csv-file in CSV.txt in the template folder. -- PennController.Template is the command to call in .csv, and opens a new command sequence below, where you can manipulate how exactly you want everything to show up. 
  item => PennController("Class",  // this line commands that the extraction from the file takes the "Class" column for primary reference. This is important for randomization -- this "text" needs to be the same as the "text" in PennController.Sequence randomize() command.                             
  newText( "sentence" , item.Sentence ) // Don't exactly know what this does, but pick a column and call it in by the name you assign + call it in with the item.Columnname command. 
 
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
              .settings.css("border", "solid 1px green")
                   .settings.add(25,40,
                newText("context", item.Sentence) // in this Canvas we first get the context sentence, which is listed under column Sentence, hence calling it in with item.Sentence. 
                    .settings.size(700, 30)
                    
            )
                 
            .settings.add(25,85,                // calling in another part of the text (printed simultaneously with the entire canvas), but at a different position. This is useful if you don't just want a long string of text that is your context. If you want to split up your context into different chunks/lines, you can put them in different columns that are called in separately and positioned on command.
                 newText("says", item.Says)
                     .settings.size(700, 30)                  
           )
          
            .settings.add(25, 130,              // Idem to above. Separate column in CSV so called in separately with its own position. 
                newText("claim", item.Claim)
                    .settings.italic()
                    .settings.size(700, 30)                  
            )
                    .print()
            
                 
            ,
           newCanvas("empty", 800, 40)          // when you create a line around your canvas, create another one without a line, that is not very high, but high enough to create vertical space between the two canvasses. 
                 .print()                       // 2 canvases are ideal to create some space between your context sentence and target question and answer buttons. Using the entire screen. 
          
        ,
        newTimer("transit", 1000)               // So here there's a timer between the above canvas, and the one below, called "answerbox". You could also decide to do this with newButton, or to put .wait() before .print() of the new canvas. Then it will only be printed after any button (any keyboard key) press. 
            .start()
            .wait()
        ,   
        newScale("answer", 9)               // scale needs to be created before calling it into the canvas below. "text" gives name to the scale, the number behind is the number of options on the scale. So you can 
            .settings.log() // do 7 for 7-point Likert, or 2 for forced choice. settings.log is necessary to record the responses in the results file. 
          
        ,
        newCanvas("answerbox", 800, 130) 
        .settings.css("border", "solid 1px green")
            .settings.add(25,40, newText("target", item.Question).settings.size(700, 30) )
            .settings.add(23,75, newText("labelLeft", "Unnatural").settings.bold() )
            .settings.add(100,80, getScale("answer").settings.size(200, 0) )
            .settings.add(300,80, newText("labeRight", "Very natural").settings.bold() )
            .settings.add(175,105, newText("labelMid", "Neither").settings.bold() )     
                         .print()    
        ,
        newText("warning","Please pick an answer")
            .settings.hidden()
            .settings.color("red")
            .settings.bold()
            .settings.css("margin-left", 50 )
            .print()
        ,
        newButton("validate", "Continue.")
            .settings.center()
            .print()    
            .wait(getScale("answer")
                  .test.selected()
                  .failure(getText("warning")
                           .settings.visible()
                        )
                            )              
                                ) .log("Class", item.Class)   // Because items are inserted from .csv, the variable names aren't automatically recorded. by putting this right before the last closing parenthesis of the full PennController script, you make sure that for every item, the value in column "Class" is recorded in the results file, for analysis in R and grouping the variables together. 
                                )  ; 
        
       
        
    