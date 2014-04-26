(function() {
  var state = {links: [], byId: {}};
  var svg = d3.select("body").append("svg");
  var container = svg.append("g")
    .classed("container", true)
    .attr("transform", "translate(400,400)");

  function addWorker() {
    var w = new Worker('js/workers/main.js');
    return w;
  }

  function workerEvent(ev) { 
    console.log("Worker event:", ev);
  }

  function broadcast(state, from, event) {
    var i = 0;
    for(i=0; i < state.links.length; i++) {
      if(state.links[i][0] == from) {
        state.byId[state.links[i][1]].postMessage(event);
      }
    }
  }

  var color = d3.scale.category20();

  function draw(state) {
    var container = d3.select(".container");
    var data = d3.values(state.byId);
    console.log(data);
    var angle = d3.scale.ordinal();
    var nodes = container.selectAll(".node").data(data, function(d) { return d.id;});

    angle.rangePoints([0,2 * Math.PI]).domain(d3.range(data.length));
    nodes.enter()
      .append("circle")
      .classed("node", true);
    nodes.attr({
        cx: function(d,i) { return Math.sin(angle(i)) * 200; },
        cy: function(d,i) { return Math.cos(angle(i)) * 200; },
        r: 20
      });
    nodes.exit().remove();
  }

  var newbutton = d3.select("#new-worker")
    .on("click", function() {
      var worker = addWorker(), id = new Date().valueOf(), i=0, others = d3.values(state.byId);
      worker.onmessage = workerEvent;

      for(i=0; i < others.length; i++) {
        state.links.push([id, others[i].id]);
      }
      state.byId[id] = {worker: worker, id: id};
      worker.postMessage({command: "set-id", value: id});
      draw(state);
    });

  var resetButton = d3.select("#reset")
    .on("click", function() {
      var i;
      for(i=0; i < d3.values(state.byId).length;i++) {
        d3.values(state.byId)[i].worker.postMessage({command: "terminate"});
      }
      state.byId = {};
      state.links = [];
      draw(state);
    });
}());

