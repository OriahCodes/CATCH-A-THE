const Renderer = function(){

    const renderTargets = function(gameInfo){
        $("#animal-land").empty()
        
        let tarType = gameInfo.targetTypes[gameInfo.playerInfo.level -1]

        for (let target of gameInfo.targets){
            let divTarget = "<i class='fas fa-" + tarType + " target'></i>"
            let tar = $(divTarget)
            tar.css("color", target.color)
            tar.css("margin-left", target.position[0])
            tar.css("margin-top", target.position[1])
            tar.css("font-size", target.size)
            tar.data().id = target.id

            $("#animal-land").append(tar)
        }

    }

    const renderGameInfo = function(gameInfo){
        let tarType = gameInfo.targetTypes[gameInfo.playerInfo.level -1]

        $("#title").text("CATCH - A - " + tarType.toUpperCase())  
        
        if (gameInfo.targets.length == 1){animalsLeft = " left"}
        else {animalsLeft = "'s left"} 
        $("#animal-counter").text(gameInfo.targets.length + ' ' +tarType + animalsLeft)
        
        $("#level-counter").text("Level " + gameInfo.playerInfo.level) 
    }

    const renderScore = function(scoreCount, player, competitor){
        $("#my-score").text(scoreCount[player])
        $("#competitor-score").text(scoreCount[competitor])
    }

    // const renderWin = function(){ 
    //     $("#animal-land").append(`<div id="win"><div> WIN </div><div class='message'>Would you like to continue to the next level?</div><div class='yes'> yes!</div><div class='no'>nah</div></div>`)
    // }

    const renderLose = function(){ 
        $("#animal-land").append(`<div id="lose"> <div> LOSER </div><div class='try-again'>Try again</div> </div>`)
    }

    // const renderPoop = function(){
    //     $("#animal-land").empty()
    //     $("#animal-land").append(`<i class="fas fa-poo poop"></i>`)       
    // }

    return{
        renderTargets: renderTargets,
        renderGameInfo: renderGameInfo,
        // renderWin: renderWin,
        renderScore: renderScore,
        renderLose: renderLose,
        // renderPoop: renderPoop,
    }
}



