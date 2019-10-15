const catchStuff = CatchStuff()
const renderer = Renderer()

$("#start").on("click", function(){
    newGame_handler()
})

$("#animal-land").on("click",".try-again", function(){
    $("#animal-land").empty()
    newGame_handler()
})

let myInterval=[]

function timer(){
    let time = catchStuff.getInfo().time / 1000
    console.log(time)
    $("#time-bar").text(time + " seconds left")

    myInterval = setInterval(function(){ 
        time --
        console.log(time)
        $("#time-bar").text(time + " seconds left")

        if (time == 0){ 
            renderer.renderLose()

            $("#animal-land").off("click", ".target", target_handeler) 
            $("#animal-land").find(".target").css({cursor:"default"});

            clearInterval(myInterval) 
        }
    },1000)
}

function newGame_handler(){  
    catchStuff.newGame()
    renderer.renderTargets(catchStuff.getInfo())
    renderer.renderGameInfo(catchStuff.getInfo())
    
    timer()

    $("#animal-land").on("click", ".target", target_handeler) 
}

function target_handeler(){
    catchStuff.removeTarget($(this).data().id)
    renderer.renderTargets(catchStuff.getInfo()) 
    renderer.renderGameInfo(catchStuff.getInfo()) 

    let isWinning = catchStuff.checkWin() 

    if (isWinning == true){ 
        clearInterval(myInterval) 
        renderer.renderWin()
        $("#animal-land").on("click",".yes", function(){
            catchStuff.levelUp()
            renderer.renderTargets(catchStuff.getInfo())
            renderer.renderGameInfo(catchStuff.getInfo()) 

            timer() 

            $("#animal-land").off("click",".yes")
        }) 

        $("#animal-land").on("click",".no", function(){
            renderer.renderPoop()
        })
    }
}
