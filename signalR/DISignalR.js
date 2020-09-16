var auditHub = {};
var auditHubProxy;

$(function () {
    var signalrConnectionId;
    var fadeSpeed = 500;
    var messageTime = 5000;
    var reconnectTime = 5000;
    var keepAlive = 1800000;
    var reconnectTimeout;

    $.connection.hub.url = auditHub.signalRHost;

    var attemptReconnect = function () {
		Ti.API.info('AuditHub Socket attempting to reconnect...');
        clearTimeout(reconnectTimeout);
        reconnectTimeout = setTimeout(startHubConnection, reconnectTime);
    };

    var startHubConnection = function () {
        $.connection.hub.start().done(function () {
            signalrConnectionId = $.connection.hub.id;
            Ti.API.info(signalrConnectionId);
            Ti.API.info('AuditHub Socket connected.');
        }).fail(function (reason) {
            Ti.API.info('AuditHub Socket connection failed: ' + reason + '.');
            Ti.API.info('AuditHub Socket attempting to reconnect...');
            attemptReconnect();
        });
    };
    
    var addUpdateEntityConnection = function (e) {
        Ti.API.info('Audit Hub Subscribe ' + e.auditId + ' on ' + auditHub.diHub + ' by ' + auditHub.userName);
        auditHubProxy.server.addUpdateEntityConnection({ ID: signalrConnectionId, Type: 'audit', UserName: auditHub.userName }, e.auditId);
        setTimeout(addUpdateEntityConnection, keepAlive);
    };
    
    var removeEntityConnection = function (entityId) {
        auditHubProxy.server.deleteEntityConnection(signalrConnectionId, entityId);
    };
  	
    Ti.App.addEventListener("AuditHub:connect", function(e) {
        Ti.API.info('AuditHub Setup');
        auditHub.diHub = 'auditHub';
	    auditHub.signalRHost = e.hostUrl;
	    auditHub.userName = e.userName;
	    Ti.API.info('AuditHub Start');
        $.connection.hub.url = auditHub.signalRHost;
        $.connection.hub.disconnected(function () {
	        attemptReconnect();
	    });
	    auditHubProxy = $.connection.auditHub;
        auditHubProxy.client.receiveConsoleMessage = function (message) {
	        Ti.API.info(message);
	    };
	    auditHubProxy.client.RaiseEvent = function (eventCode, eventArgs) {
	       Ti.API.info(eventCode);
	       if (eventCode == 'FinishIncentiveTierCalculation') {
	       		Ti.App.fireEvent('FinishIncentiveTierCalculation',eventArgs);
	       		Ti.API.info('Hub Unsubscribe from Audit ' + e.auditId);
        			auditHubProxy.server.deleteEntityConnection(signalrConnectionId, e.auditId);
	       }
	    };
	    auditHubProxy.client.receiveEntityUsageMessage = function (message) {
	        Ti.API.info(message);
	    };
	    auditHubProxy.client.RaiseEvent = function (eventCode, eventArgs) {
	       Ti.API.info(eventCode);
	       if (eventCode == 'FinishIncentiveTierCalculation') {
	       		Ti.App.fireEvent('FinishIncentiveTierCalculation',eventArgs);
	       }
	    };
	    currentHub.client.RefreshEntityHeader = function () {
	        Ti.API.info('Header');
	    };
        startHubConnection();
  	});
  	
  	Ti.App.addEventListener("AuditHub:subscribe", function(e) {
        if (!auditHub.signalRHost) {
        	Ti.API.info('Audit Hub Audit Info not configured');
        		return;
        }
        addUpdateEntityConnection(e);
  	});
  	
  	Ti.App.addEventListener("AuditHub:unsubscribe", function(e) {
        if (!auditHub.signalRHost) {
        	Ti.API.info('Audit Hub Audit Info not configured');
        	return;
        }
        Ti.API.info('Hub Unsubscribe from Audit ' + e.auditId);
        auditHubProxy.server.deleteEntityConnection(signalrConnectionId, e.auditId);
  	});
});