const catchStuff = CatchStuff()
const renderer = Renderer()



$("#start").on("click", function(){
    newGame_handler()
})

$("#animal-land").on("click",".try-again", function(){
    $("#animal-land").empty()
    newGame_handler()
})




function newGame_handler(){
    catchStuff.newGame()
    renderer.renderTargets(catchStuff.getInfo())
    renderer.renderGameInfo(catchStuff.getInfo())
    
    $("#animal-land").on("click", ".target", target_handeler) 

    catchStuff.startTimer()
    
    let myInterval = setInterval(function(){
        
        console.log("checking")
        let loseStat = catchStuff.checkLose()
        if (loseStat){
            renderer.renderLose()
            clearInterval(myInterval) 

            $("#animal-land").off("click", ".target", target_handeler) 

            $("#animal-land").find(".target").css({cursor:"default"});  
        }
    },10)
}

function target_handeler(){
    let isWinning = catchStuff.removeTarget($(this).data().id)
    renderer.renderTargets(catchStuff.getInfo())
    renderer.renderGameInfo(catchStuff.getInfo())        

    if (isWinning == true){
        renderer.renderWin()
        $("#animal-land").on("click",".yes", function(){
            catchStuff.levelUp()

            renderer.renderTargets(catchStuff.getInfo())
            renderer.renderGameInfo(catchStuff.getInfo())  
            catchStuff.startTimer()      
        })
    }
}




