//array rotate function for graphs
Array.prototype.remove = function(index) {
    this.splice(index, 1);
}


function ShowcaseViewModel() 
{
	var self = this;
	self.fakeData = false;

  self.consoleText = ko.observable("");
	self.servers = ko.observableArray();
  self.activeUsers = ko.observable(0);

	//TODO: load server info from a json file or something?
	self.servers.push(new ServerViewModel("192.168.1.11", "p61", "Appliance A"));
	self.servers.push(new ServerViewModel("192.168.1.12", "p62", "Appliance B"));
	self.servers.push(new ServerViewModel("192.168.1.13", "p63", "Appliance C"));

	self.keepUpdating = ko.observable(true);
	self.powerUpdateIntervalMs = 5000;
  self.gossipUpdateIntervalMs = 2000;

  self.graphData = [ {
    name: "Reads",
    color: '#2E9625',
    data: []
    },
    {
      name: "Writes",
      color: '#E1163C',
      data: []
    }
  ];

  //fill with 60s of 0
  for(i = 0; i < 180; i++)
  {
    self.graphData[0].data.push({x:i+1, y:1});
    self.graphData[1].data.push({x:i+1, y:1});
  }

  self.graph = new Rickshaw.Graph({
    element: document.querySelector("#graph"),
    series: self.graphData,
    renderer: "line",
    interpolation: "basis",
    max: 7500
  });

  var legend = new Rickshaw.Graph.Legend({
      graph: self.graph,
      element: document.querySelector('#legend')
  });
  
  var format = function(n) { return "";};

  self.graph.render();
  var yAxis = new Rickshaw.Graph.Axis.Y({
    graph: self.graph,
    tickFormat: format
  });

  yAxis.render();

  jQuery(window).on('resize', function() {
      var graphEl = $("#graph");
      self.graph.configure({width: graphEl.width(), height: graphEl.height()});
      self.graph.render();
  });

        var graphEl = $("#graph");
      self.graph.configure({width: graphEl.width(), height: graphEl.height()});
      self.graph.render();

  //websocket stuff
  self.alchemyServer = new Alchemy({
    Server: "ha.geteventstore.com",
    Port: 80,
    Action: "ws/geteventstore",
    DebugMode: false
  });

  self.alchemyServer.Connected = function () {
    self.writeToConsole("Websocket connected!");
  };

  self.alchemyServer.Disconnected = function () {
    self.writeToConsole("Websocket connection failed, please reload the page.")
  };

  self.updatesSoFar = 180;

  self.alchemyServer.MessageReceived = function (event) {
    var data = JSON.parse(event.data);
    //ping
    if(data.ResponseTypeInt === 0) {
      //pong
      self.alchemyServer.Send({ ResponseTypeInt: 1 });
    }

    //log message
    if(data.ResponseTypeInt === 2) {
      self.writeToConsole(data.Line);
    }

    
    //events per second stats
    if(data.ResponseTypeInt === 3) {

      //self.writeToConsole("r: " + data.ReadRate + " w: " + data.WriteRate);

      self.graphData[0].data.remove(0);
      self.graphData[1].data.remove(0);

      //reads
      self.graphData[0].data.push({ x: self.updatesSoFar, y: data.ReadRate });
      //writes
      self.graphData[1].data.push({ x: self.updatesSoFar, y: data.WriteRate });
      self.updatesSoFar++;
      self.graph.update();
    }

    if(data.ResponseTypeInt === 4) {
      //includes this client, so -1
      self.activeUsers(data.Count - 1);
    }
  };

	self.startPolling = function () {
		self.loadGossip();
		self.loadPower();
	};

  self.connectWebSocket = function () {
    self.writeToConsole("Creating websocket connection...");
    self.alchemyServer.Start();
  };

  self.writeToConsole = function (line) {
    self.consoleText(self.consoleText() + line + "\n");
    //make the console scroll to bottom
    document.getElementById("console").scrollTop = document.getElementById("console").scrollHeight;
  };

  self.loadGossip = function () {
		if(self.fakeData)
		{
			self.processGossip(fakeGossip);
			if(self.keepUpdating()) {
				setTimeout(self.loadGossip, self.gossipUpdateIntervalMs);
			}
		} else {
			$.ajax({
				url: "http://ha.geteventstore.com/showcase/gossip",
				error: function (jqXHR, textStatus, errorThrown) {
					self.displayError("An error occurred contacting the cluster, try reloading the page.");
          setTimeout(self.loadGossip, self.gossipUpdateIntervalMs);
				},
				success: function (data, textStatus, jqXHR)
				{
					self.processGossip(data);
					if(self.keepUpdating()) {
						setTimeout(self.loadGossip, self.gossipUpdateIntervalMs);
					}
				}
			});	
		}
	};

	self.loadPower = function () {
		if(self.fakeData)
		{
			self.processPower("<html>p61=1,p62=0,p63=1,p64=1<html>");
			if(self.keepUpdating()) {
				setTimeout(self.loadPower, self.powerUpdateIntervalMs);
			}
		} else {
			$.ajax({
				url: "http://ha.geteventstore.com/showcase/power/status",
				error: function (jqXHR, textStatus, errorThrown) {
					self.displayError("An error occurred contacting the cluster, try reloading the page.");
          setTimeout(self.loadPower, self.powerUpdateIntervalMs);
				},
				success: function (data, textStatus, jqXHR)
				{
					self.processPower(data);
					if(self.keepUpdating()) {
						setTimeout(self.loadPower, self.powerUpdateIntervalMs);
					}
				}
			});	
		}
	};	

	self.processGossip = function (gossipData) {
		for (var index = 0; index < gossipData.members.length; ++index)	{
			var currentMember = gossipData.members[index];
			//we don't care about managers
			if(currentMember.state === "Manager")
				continue;

			for(var serverIndex = 0; serverIndex < self.servers().length; ++serverIndex) {
				if(self.servers()[serverIndex].ip === currentMember.externalTcpIp) {
					self.servers()[serverIndex].populateFromGossip(currentMember);
				}
			}
		}
	};

	self.processPower = function (powerData) {
		//power data is of the format
		//<html>p61=1,p62=1,p63=1,p64=1</html>

    //trim the stupid html
    powerData = powerData.substring(6,powerData.length - 9);
		//split by comma
		var powers = powerData.split(",");

		if(powers.length != 4) {
			self.displayError("Power data is not in the expected format");
			return;
		}

		for (var index = 0; index < powers.length; ++index) {
    		var values = powers[index].split("=");
    		if(values.length != 2) {
    			self.displayError("Power data is not in the expected format");
    		}

    		//find the matching server and update the power status
    		for(var serverIndex = 0; serverIndex < self.servers().length; ++serverIndex) {
    			if(self.servers()[serverIndex].powerCode === values[0]) {
    				self.servers()[serverIndex].poweredOn(values[1] === "1" ? true : false);
    			}
    		}
		}
	};

	self.displayError = function(message) {
		//kill off the auto updates
		//self.keepUpdating(false);
		//alert(message);
	};
}

function ServerViewModel(ip, powerCode, displayName) {
	var self = this;

	self.serverName = ko.observable(displayName);
  self.hasData = ko.observable(false);
	self.ip = ip;
	self.powerCode = powerCode;

  self.powerCodeNumber = powerCode.charAt(powerCode.length-1);

	self.poweredOn = ko.observable(false);
	self.powerText = ko.computed(function () {
		if(self.poweredOn())
			return "ON";

		return "OFF";
	});
	
	self.isAlive = ko.observable(false);
	self.aliveText = ko.computed(function () {
		if(self.isAlive() && self.poweredOn())
			return "Alive";

    if(self.isAlive() && !self.poweredOn())
      return "Powering off";

    if(!self.isAlive() && self.poweredOn())
      return "Booting";

		return "Dead";
	});

	self.state = ko.observable("");

	self.writerCheckpoint = ko.observable(0);
	self.chaserCheckpoint = ko.observable(0);

	self.populateFromGossip = function (gossipMember) {
		self.isAlive(gossipMember.isAlive);
		self.state(gossipMember.state);
		self.writerCheckpoint(gossipMember.writerCheckpoint);
		self.chaserCheckpoint(gossipMember.chaserCheckpoint);
	};

  self.togglePower = function () {
    if(!self.isAlive() && self.poweredOn()) {
      alert("Please wait for the node to finish booting");
      return;
    }

    if(self.isAlive() && !self.poweredOn())
    {
      alert("Please wait for the node to finish shutting down");
      return;
    }

    var currentStatus = self.poweredOn();
    self.poweredOn(!currentStatus);

    var powerUrl = "power/" + self.powerCodeNumber + "/";
    if(currentStatus)
      powerUrl += "0";
    if(!currentStatus)
      powerUrl += "1";

    $.ajax({
      url: powerUrl,
      error: function (jqXHR, textStatus, errorThrown) {
        alert(data.status.message);
      },
      success: function (data, textStatus, jqXHR)
      {
        var expectedValue = "0";
        if(!currentStatus)
          expectedValue = "1";
      }
    });
  };

}

var fakeGossip = 
{
  "members": [
    {
      "state": "Master",
      "isAlive": true,
      "externalTcpIp": "192.168.1.11",
      "writerCheckpoint": 1632951848,
      "chaserCheckpoint": 1632951848,
    },
    {
      "state": "Slave",
      "isAlive": false,
      "externalTcpIp": "192.168.1.12",
      "writerCheckpoint": 1632951848,
      "chaserCheckpoint": 1632951848,
    },
    {
      "state": "Slave",
      "isAlive": true,
      "externalTcpIp": "192.168.1.13",
      "writerCheckpoint": 1632951848,
      "chaserCheckpoint": 1632951848,
    }
  ]
};
