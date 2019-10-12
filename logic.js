const CatchStuff = function(){
     _game= {
        targetType: "hippo",
        level: [],
        targets: [],
        time: [],/// this.level //* 1000,
    }
    
    _myTimeout = []    
    _myInterval = []
    _loseStat = false

    const newGame = function(){
        addTargets(1)
        _game.level = 1
        _game.targetType = "hippo"
        _game.time = _game.level * 3000/// this.level //* 1000,

        _loseStat = false

    }


    const startTimer = function(){
        _myTimeout = setTimeout(function(){   
            console.log("loser")
            clearInterval(_myInterval)
            _loseStat = true
        }, _game.time)
    }

    const getInfo = function(){
        return _game
    }

    const chooseTarget = function(chosenTarget){
        _game.target = chosenTarget
    }

    const removeTarget = function(targetId){
        let win = false

        for (let tar in _game.targets){
            if (_game.targets[tar].id == targetId){
                _game.targets.splice(tar,1)
                return checkWin()
            }
        }
    }

    const checkWin = function(){
        if (_game.targets == ""){
            win = true
            clearTimeout(_myTimeout)
            clearInterval(_myInterval)
            return win
        }
        else {
            win = false
            return win
        }
    }

    const addTargets = function(numTargets){
        _game.targets = []

        const colorList = ["#9b59b6", "#ecf0f1", "#d35400", "#e74c3c", "#1abc9c", "#bdc3c7"]
        
        for (i=0; i<numTargets; i++){
            let randomposition = [Math.floor((Math.random() * 560) + 0), Math.floor((Math.random() * 200) + 0)]
            let randomColor = Math.floor((Math.random() * 5) + 0)

            _game.targets.push({
                id: i+1,
                position: [randomposition[0] + "px", randomposition[1] + "px"],
                color: colorList[randomColor],
            })
        }

    }

    const levelUp = function(){
        _game.level += 1
        addTargets(_game.level)
    }

    // const timer = function(){
    //     setTimeout
    // }

    const checkLose = function(){
        return _loseStat
    }


    return{
        newGame: newGame,
        startTimer: startTimer,
        getInfo: getInfo,
        chooseTarget: chooseTarget,
        removeTarget: removeTarget,
        addTargets: addTargets,
        levelUp: levelUp,
        checkWin: checkWin, 
        checkLose: checkLose,
    }

}

