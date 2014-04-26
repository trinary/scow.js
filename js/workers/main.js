
onmessage = function(e) {
  switch (e.data.command) {
    case "terminate":
      terminate();
      break;
    case "set-id":
      setId(e.data.value);
      break;
    default:
      console.log("Unknown commend: " + e.data.command);
      break;
  }
};

function setId(id) {
  workerState.id = id;
  console.log(workerState);
}

function terminate() {
  console.log("terminating");
  self.close();
}
var workerState = {state: "follower", term: 0, id: null};
