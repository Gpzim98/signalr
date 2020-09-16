var auditToolHub = {};
var auditToolHubProxy;
var theTimer = null;

$(function () {
    var signalrConnectionId;
    var fadeSpeed = 500;
    var messageTime = 5000;
    var reconnectTime = 5000;
    var keepAlive = 1800000;
    var reconnectTimeout;

    $.connection.hub.url = "https://dailytest.lime-energy.com/signalr";

    var attemptReconnect = function () {
		Ti.API.info('QAQC Hub Socket attempting to reconnect...');
        clearTimeout(reconnectTimeout);
        reconnectTimeout = setTimeout(startHubConnection, reconnectTime);
    };

    var startHubConnection = function () {
        $.connection.hub.start().done(function () {
            signalrConnectionId = $.connection.hub.id;
            Ti.API.info(signalrConnectionId);
            Ti.API.info('AT Hub Socket connected.');
        }).fail(function (reason) {
            Ti.API.info('AT Hub Socket connection failed: ' + reason + '.');
            Ti.API.info('AT Hub Socket attempting to reconnect...');
            attemptReconnect();
        });
        
    };

    Ti.App.addEventListener("HUB:connect", function(e) {
        Ti.API.info('Hub Setup');
        auditToolHub.diHub = 'auditToolHub';
	    auditToolHub.signalRHost = e.hostUrl;
	    auditToolHub.userName = e.userName;
	    Ti.API.info('Hub Start');
        $.connection.hub.url = auditToolHub.signalRHost;
        $.connection.hub.disconnected(function () {
	        attemptReconnect();
	    });
        auditToolHubProxy = $.connection.auditToolHub;
        auditToolHubProxy.client.showMessage = function (message) {
	        Ti.API.info(message);
	        if (message == 'Calculation finished') {
	        		if (theTimer != null) {
	       			clearTimeout(theTimer);
	       			theTimer = null;
	       		}
	       		Ti.App.fireEvent('FinishIncentiveTier',eventArgs);
	        }
	    };
	    auditToolHubProxy.client.raiseEvent = function (eventCode, eventArgs) {
	       Ti.API.info(eventCode);
	       if (eventCode == 'ValidationCompleted') {
	       		Ti.App.fireEvent('QAQC:results',eventArgs);
	       }
	       if (eventCode == 'FinishIncentiveTier') {
	       		if (theTimer != null) {
	       			clearTimeout(theTimer);
	       			theTimer = null;
	       		}
	       		Ti.App.fireEvent('FinishIncentiveTier',eventArgs);
	       }
	    };
        startHubConnection();
  	});
  	
  	Ti.App.addEventListener("HUB:subscribe", function(e) {
        if (!auditToolHub.signalRHost) {
        	Ti.API.info('AuditTool Hub Info not configured');
        	return;
        }
        Ti.API.info('AuditTool Hub Subscribe to Audit ' + e.auditId);
        auditToolHubProxy.server.joinGroup(e.auditId);
        if (e.kind == 'QAQC') {
        		Ti.API.info('Running QAQC on Audit ' + e.auditId);
        		Ti.App.fireEvent('QAQC:subscribed',{auditId:e.auditId});
        }
        else {
        		theTimer = setTimeout(function() { 
        			Ti.API.info('Incentive Tier timeout expired');
        			Ti.App.fireEvent('FinishIncentiveTier');
        			clearTimeout(theTimer);
       			theTimer = null;
        		 }, 60000);
        }
  	});
  	
  	Ti.App.addEventListener("HUB:unsubscribe", function(e) {
        if (!auditToolHub.signalRHost) {
	        	Ti.API.info('AuditTool Hub Info not configured');
	        	return;
        }
        Ti.API.info('AuditTool Hub Unsubscribe from Audit ' + e.EntityId);
        auditToolHubProxy.server.leaveGroup(e.EntityId);
  	});
});