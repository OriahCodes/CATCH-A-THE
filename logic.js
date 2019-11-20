const CatchStuff = function(){
     _game= {
        targetTypes: ["fish", "hippo", "kiwi-bird", "dog", "horse", "cat", "spider", "frog", "dragon"],
        targetType: 0,
        level: 0,
        targets: [],
        time: 0,
    }

    const newGame = function(){ 
        addTargets(1)
        _game.level = 1
        targetType =  0
        _game.time = 20000
    }

    const getInfo = function(){
        return _game
    }

    const addTargets = function(numTargets){
        _game.targets = []

        const colorList = ["#9b59b6", "#ecf0f1", "#d35400", "#e74c3c", "#1abc9c", "#bdc3c7", "#f3a683", "#3dc1d3", "#ffaf40", "#fffa65", "#c7ecee"]

        for (i=0; i<numTargets; i++){
            let randomposition = [Math.floor((Math.random() * 560) + 0), Math.floor((Math.random() * 185) + 0.1)]
            let randomColor = Math.floor((Math.random() * colorList.length) + 0)

            _game.targets.push({
                id: i+1,
                position: [randomposition[0] + "px", randomposition[1] + "px"],
                size: randomposition[1] * 0.0054 * 30 + 10 +"px",
                color: colorList[randomColor],
            })
        }
    }

    const removeTarget = function(targetId){
        for (let tar in _game.targets){
            if (_game.targets[tar].id == targetId){
                _game.targets.splice(tar,1)
            }
        }
    }

    const checkWin = function(){
        if (_game.targets == ""){
            return true
        }
        return false
    }

    const levelUp = function(){ 
        _game.level ++
        _game.time = _game.level * 20000
        if (_game.targetType <= 7) {_game.targetType ++}
        else if (_game.targetType = 8) {_game.targetType = 0}
        addTargets(_game.level)
    }

    return{
        newGame: newGame,
        getInfo: getInfo,
        addTargets: addTargets,
        removeTarget: removeTarget,
        checkWin: checkWin, 
        levelUp: levelUp,
    }

}

