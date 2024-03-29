var firebaseConfig = {
  apiKey: "AIzaSyBlyGvh4-3D3FCukK9QrsVDsEvM0tCSthk",
  authDomain: "catch-a-the.firebaseapp.com",
  databaseURL: "https://catch-a-the.firebaseio.com",
  projectId: "catch-a-the",
  storageBucket: "catch-a-the.appspot.com",
  messagingSenderId: "443733075448",
  appId: "1:443733075448:web:5c5348c35dcff3d2b1e20d",
  measurementId: "G-P1E58Y82PY"
}
firebase.initializeApp(firebaseConfig);
var db = firebase.firestore()

  
function LocalData(){
  const _renderer = Renderer()

  let _game = { 
    roomInfo: {},
    playerInfo: {}, 
    targets:[],

    targetTypes : ["fish", "hippo", "kiwi-bird", "dog", "horse", "cat", "spider", "frog", "dragon"]

  }

  function InitListeners(){

    function roomListener(roomID){
      db.doc('rooms/' + roomID).onSnapshot(roomSnapShot => {
          _game.roomInfo = roomSnapShot.data() //

          if (_game.playerInfo){ // scoreCount
            const thisPlayer = _game.playerInfo.numPlayer
            let competitor = ""
            const playerList = Object.keys(_game.roomInfo.scoreCount)
            
            if (playerList[0] == thisPlayer){
              competitor = playerList[1]
            }
            else if (playerList[1] == thisPlayer){
              competitor = playerList[0]
            }

            _renderer.renderScore(_game.roomInfo.scoreCount, thisPlayer, competitor)
          }
      })
    }

    function playerListener(playerID){
      db.doc('players/' +playerID).onSnapshot(playerSnapshot => {
        _game.playerInfo= playerSnapshot.data()
        _game.playerInfo.id = playerID
      })
    }

    function levelListner(playerID){
      db.doc('players/' +playerID + '/levelInfo/level').onSnapshot(levelSnapShot => {
        levelUp(levelSnapShot.data().level)
        console.log("leveled up in local data")
        if (levelSnapShot.data().level > 1){ 
          _renderer.renderTargets(_game)
          _renderer.renderGameInfo(_game)
        }
      })
    }

    return{
      roomListener: roomListener,
      playerListener: playerListener,
      levelListner: levelListner,
    }
  }

  function getLocalInfo(){
    return _game
  }

  function addTargets(numTargets){
    
      const colorList = ["#9b59b6", "#ecf0f1", "#d35400", "#e74c3c", "#1abc9c", "#bdc3c7", "#f3a683", "#3dc1d3", "#ffaf40", "#fffa65", "#c7ecee"]

      for (let i = 0; i < numTargets; i ++){
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
              _renderer.renderTargets(_game) 
              _renderer.renderGameInfo(_game)
          }
      }
  }

  const levelUp = function(level){ 
      _game.playerInfo.level = level
      _game.playerInfo.levelDuration = levelDurationCalc(level)
      if (_game.targetType = 8) {_game.targetType = 0}
      addTargets(_game.playerInfo.level)
  }

  function levelDurationCalc(level){
    return (Math.round((-Math.log10(1.4 *2) + 2) * level)) * 1000
  }

  const restartLevel = function(level){
      _game.targets = []
      addTargets(_game.playerInfo.level)
  }

  const checkWin = function(){
    if (_game.targets.length == 0){
        return true
    }
    return false
}

  return{
      InitListeners: InitListeners,
      
      getLocalInfo: getLocalInfo,
      addTargets: addTargets,
      removeTarget: removeTarget,
      levelUp: levelUp,
      levelDurationCalc: levelDurationCalc,
      restartLevel: restartLevel,
      checkWin: checkWin, 
  }
}
