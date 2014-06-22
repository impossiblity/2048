function AI(GameManager) {
  this.events = {};
  this.GameManager = GameManager;
  
  this.state=GameManager.grid.serialize();
  this.action=0;
  this.value=0;
  
  this.dp = this.empty();
  
  this.GameManager.on("feedback",this.resolve.bind(this));
}

AI.prototype.empty = function () {
  var arr = [];
  for(var i=0; i < 4; i++)
    arr[i] = {};
  return arr;
}

AI.prototype.on = function (event, callback) {
  if (!this.events[event]) {
    this.events[event] = [];
  }
  this.events[event].push(callback);
};

AI.prototype.emit = function (event, data) {
  var callbacks = this.events[event];
  if (callbacks) {
    callbacks.forEach(function (callback) {
      callback(data);
    });
  }
};

AI.prototype.resolve = function(reward, nextState){
  this.value = this.value + reward;
  this.dp[state][action] += 0.1 * ( this.getMaxReward(nextState) - this.dp[state][action] );

  this.state = nextState;
  this.action = this.getAction(nextState);
}; 

AI.prototype.getMaxReward = function(nextState){
  return Math.max( Math.max(this.dp[0][nextState], this.dp[1][nextState]) 
  , Math.max(this.dp[2][nextState], this.dp[3][nextState]));
}

AI.prototype.getAction = function(nextState){
  if(Math.random()<0.1){
    return Math.floor(Math.random()*4);
  }
  var maxReward = this.getMaxReward(nextState);
  if(this.dp[0][nextState]==maxReward)
    return 0;
  else if(this.dp[1][nextState]==maxReward)
    return 1;
  else if(this.dp[2][nextState]==maxReward)
    return 2;
  else
    return 3;
}

