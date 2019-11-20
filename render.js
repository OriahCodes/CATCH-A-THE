const Renderer = function(){

    let tarType= ""
    const renderTargets = function(gameInfo){

        $("#animal-land").empty()
        let ind = gameInfo.playerInfo.level % 9
        if (ind == 0){
            tarType = gameInfo.targetTypes[8]
        }
        else {
            tarType = gameInfo.targetTypes[ind -1]
        }

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

    return{
        renderTargets: renderTargets,
        renderGameInfo: renderGameInfo,
        renderScore: renderScore,
    }
}



