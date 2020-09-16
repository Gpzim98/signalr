var auditQAQCHub = {};
var auditQAQCHubProxy;

function setupAuditQAQCHub(auditId, hostUrl, userName, notificationDiv) {
    auditQAQCHub.diHub = 'auditQAQCHub';
    auditQAQCHub.auditId = auditId;
    auditQAQCHub.signalRHost = hostUrl;
    auditQAQCHub.userName = userName;
    auditQAQCHub.notificationDiv = notificationDiv;
}

function initializeAuditQAQCHub() {
    auditQAQCHubProxy.server.joinGroup(auditQAQCHub.auditId);
}

$(function () {
    var signalrConnectionId;
    var fadeSpeed = 500;
    var messageTime = 5000;
    var reconnectTime = 5000;
    var keepAlive = 1800000;
    var reconnectTimeout;

    $.connection.hub.url = auditQAQCHub.signalRHost;

    var attemptReconnect = function () {
        clearTimeout(reconnectTimeout);
        reconnectTimeout = setTimeout(startHubConnection, reconnectTime);
    };

    $.connection.hub.disconnected(function () {
        attemptReconnect();
    });

    auditQAQCHubProxy = $.connection.auditQAQCHub;

    var startHubConnection = function () {
        $.connection.hub.start().done(function () {
            signalrConnectionId = $.connection.hub.id;

            initializeAuditQAQCHub();

            Ti.API.info('SignalR connected.');
        }).fail(function (reason) {
            Ti.API.info('SignalR connection failed: ' + reason + '.');
            Ti.API.info('SignalR attempting to reconnect...');

            attemptReconnect();
        });
    };

    startHubConnection();

    auditQAQCHubProxy.client.showMessage = function (message) {
        Ti.API.info(message);

        /*var notificationItemDiv = $('<div></div>');

        notificationItemDiv.css({
            'width': '278px',
            'padding': '10px',
            'margin-top': '10px',
            'background-color': '#FFFFFF',
            'border': '1px solid #BBBBBB',
            'border-radius': '10px'
        });

        notificationItemDiv.html(message).hide();

        notificationQueueDiv.css({ 'display': 'block' }).append(notificationItemDiv);

        notificationItemDiv.fadeIn(fadeSpeed);

        setTimeout(auditQAQCHub.removeOldestMessage, messageTime);*/
    };

    var removeOldestMessage = function () {
        notificationQueueDiv.children().first().fadeOut(fadeSpeed, function () {
            var itemsLeft = $(this).parent().children().length - 1;

            $(this).remove();

            if (itemsLeft <= 0) {
                notificationQueueDiv.css({ 'display': 'none' });
            }
        });
    };

    var notificationQueueDiv = $('<div></div>').attr('id', 'auditQAQCHubNotificationQueue').css({
        'position': 'fixed',
        'top': '10px',
        'right': '20px',
        'width': '300px',
        'height': '500px',
        'z-index': '999',
        'display': 'none'
    });

    $('body').append(notificationQueueDiv);

    auditQAQCHubProxy.client.raiseEvent = function (eventCode, eventArgs) {
        //Ti.API.info(eventCode);
        //Ti.API.info(eventArgs);
    };

    auditQAQCHubProxy.client.getOrUpdateQAQCResultsForEntity = function () {
        getOrUpdateQAQCResultsForEntity();
    };

    auditQAQCHub.removeOldestMessage = removeOldestMessage;
});