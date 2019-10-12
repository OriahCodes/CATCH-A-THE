const Renderer = function(){

    const renderTargets = function(gameInfo){
        $("#animal-land").empty()

        for (let target of gameInfo.targets){

            let tar = $(`<i class='fas fa-hippo target'></i>`)//$(`<div class='target'><i class='fas fa-hippo'></i></div>`)
            tar.css("color", target.color)
            tar.css("margin-left", target.position[0])
            tar.css("margin-top", target.position[1])
            tar.data().id = target.id

            $("#animal-land").append(tar)
        }

    }

    const renderGameInfo = function(gameInfo){
        $("#title").text("CATCH - A - " + gameInfo.targetType.toUpperCase())  // target's name in title
        $("#animal-counter").text(gameInfo.targets.length + ' ' + gameInfo.targetType +"'s left") //targt counter
        $("#level-counter").text("Level " + gameInfo.level) //Level counter
    }

    const renderWin = function(){
        $("#animal-land").append(`<div id="win"><div> WIN </div><div class='message'>Would you like to continue to the next level?</div><div class='yes'> yes!</div><div class='no'>nah</div></div>`)
    }

    const renderLose = function(){
        $("#animal-land").append(`<div id="lose"> <div> LOSER </div><div class='try-again'>Try again</div> </div>`)
    }

    return{
        renderTargets: renderTargets,
        renderGameInfo: renderGameInfo,
        renderWin: renderWin,
        renderLose: renderLose,
    }
}

{/* <div><i class="fas fa-hippo"></i></div> */}


