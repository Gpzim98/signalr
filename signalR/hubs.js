/*!
 * ASP.NET SignalR JavaScript Library v2.2.2
 * http://signalr.net/
 *
 * Copyright (c) .NET Foundation. All rights reserved.
 * Licensed under the Apache License, Version 2.0. See License.txt in the project root for license information.
 *
 */

/// <reference path="..\..\SignalR.Client.JS\Scripts\jquery-1.6.4.js" />
/// <reference path="jquery.signalR.js" />
(function ($, window, undefined) {
    /// <param name="$" type="jQuery" />
    "use strict";

    if (typeof ($.signalR) !== "function") {
        throw new Error("SignalR: SignalR is not loaded. Please ensure jquery.signalR-x.js is referenced before ~/signalr/js.");
    }

    var signalR = $.signalR;

    function makeProxyCallback(hub, callback) {
        return function () {
            // Call the client hub method
            callback.apply(hub, $.makeArray(arguments));
        };
    }

    function registerHubProxies(instance, shouldSubscribe) {
        var key, hub, memberKey, memberValue, subscriptionMethod;

        for (key in instance) {
            if (instance.hasOwnProperty(key)) {
                hub = instance[key];

                if (!(hub.hubName)) {
                    // Not a client hub
                    continue;
                }

                if (shouldSubscribe) {
                    // We want to subscribe to the hub events
                    subscriptionMethod = hub.on;
                } else {
                    // We want to unsubscribe from the hub events
                    subscriptionMethod = hub.off;
                }

                // Loop through all members on the hub and find client hub functions to subscribe/unsubscribe
                for (memberKey in hub.client) {
                    if (hub.client.hasOwnProperty(memberKey)) {
                        memberValue = hub.client[memberKey];

                        if (!$.isFunction(memberValue)) {
                            // Not a client hub function
                            continue;
                        }

                        subscriptionMethod.call(hub, memberKey, makeProxyCallback(hub, memberValue));
                    }
                }
            }
        }
    }

    $.hubConnection.prototype.createHubProxies = function () {
        var proxies = {};
        this.starting(function () {
            // Register the hub proxies as subscribed
            // (instance, shouldSubscribe)
            registerHubProxies(proxies, true);

            this._registerSubscribedHubs();
        }).disconnected(function () {
            // Unsubscribe all hub proxies when we "disconnect".  This is to ensure that we do not re-add functional call backs.
            // (instance, shouldSubscribe)
            registerHubProxies(proxies, false);
        });

        proxies['auditHub'] = this.createHubProxy('auditHub'); 
        proxies['auditHub'].client = { };
        proxies['auditHub'].server = {
            addUpdateEntityConnection: function (connection, entityId) {
                return proxies['auditHub'].invoke.apply(proxies['auditHub'], $.merge(["AddUpdateEntityConnection"], $.makeArray(arguments)));
             },

            blockAudit: function (auditID) {
                return proxies['auditHub'].invoke.apply(proxies['auditHub'], $.merge(["BlockAudit"], $.makeArray(arguments)));
             },

            clearOldEntityConnections: function () {
                return proxies['auditHub'].invoke.apply(proxies['auditHub'], $.merge(["ClearOldEntityConnections"], $.makeArray(arguments)));
             },

            deleteEntityConnection: function (connectionId, entityId) {
                return proxies['auditHub'].invoke.apply(proxies['auditHub'], $.merge(["DeleteEntityConnection"], $.makeArray(arguments)));
             },

            raiseEvent: function (entityID, eventCode, eventArgs) {
                return proxies['auditHub'].invoke.apply(proxies['auditHub'], $.merge(["RaiseEvent"], $.makeArray(arguments)));
             },

            refreshEntityHeader: function (entityID) {
                return proxies['auditHub'].invoke.apply(proxies['auditHub'], $.merge(["RefreshEntityHeader"], $.makeArray(arguments)));
             },

            refreshEntityIncentiveTiers: function (entityID) {
                return proxies['auditHub'].invoke.apply(proxies['auditHub'], $.merge(["RefreshEntityIncentiveTiers"], $.makeArray(arguments)));
             },

            refreshFinancingOptions: function (entityID) {
                return proxies['auditHub'].invoke.apply(proxies['auditHub'], $.merge(["RefreshFinancingOptions"], $.makeArray(arguments)));
             },

            refreshSavingsDollarRates: function (entityID) {
                return proxies['auditHub'].invoke.apply(proxies['auditHub'], $.merge(["RefreshSavingsDollarRates"], $.makeArray(arguments)));
             },

            sendConsoleMessage: function (entityId, message) {
                return proxies['auditHub'].invoke.apply(proxies['auditHub'], $.merge(["SendConsoleMessage"], $.makeArray(arguments)));
             }
        };

        proxies['auditQAQCHub'] = this.createHubProxy('auditQAQCHub'); 
        proxies['auditQAQCHub'].client = { };
        proxies['auditQAQCHub'].server = {
            getOrUpdateQAQCResultsForEntity: function (groupId) {
                return proxies['auditQAQCHub'].invoke.apply(proxies['auditQAQCHub'], $.merge(["GetOrUpdateQAQCResultsForEntity"], $.makeArray(arguments)));
             },

            joinGroup: function (groupId) {
                return proxies['auditQAQCHub'].invoke.apply(proxies['auditQAQCHub'], $.merge(["JoinGroup"], $.makeArray(arguments)));
             },

            leaveGroup: function (groupId) {
                return proxies['auditQAQCHub'].invoke.apply(proxies['auditQAQCHub'], $.merge(["LeaveGroup"], $.makeArray(arguments)));
             },

            raiseEvent: function (groupId, eventCode, eventArgs) {
                return proxies['auditQAQCHub'].invoke.apply(proxies['auditQAQCHub'], $.merge(["RaiseEvent"], $.makeArray(arguments)));
             },

            sendMessage: function (groupId, message) {
                return proxies['auditQAQCHub'].invoke.apply(proxies['auditQAQCHub'], $.merge(["SendMessage"], $.makeArray(arguments)));
             }
        };

        proxies['auditToolHub'] = this.createHubProxy('auditToolHub'); 
        proxies['auditToolHub'].client = { };
        proxies['auditToolHub'].server = {
            joinGroup: function (groupId) {
                return proxies['auditToolHub'].invoke.apply(proxies['auditToolHub'], $.merge(["JoinGroup"], $.makeArray(arguments)));
             },

            leaveGroup: function (groupId) {
                return proxies['auditToolHub'].invoke.apply(proxies['auditToolHub'], $.merge(["LeaveGroup"], $.makeArray(arguments)));
             },

            raiseEvent: function (groupId, eventCode, eventArgs) {
                return proxies['auditToolHub'].invoke.apply(proxies['auditToolHub'], $.merge(["RaiseEvent"], $.makeArray(arguments)));
             },

            sendMessage: function (groupId, message) {
                return proxies['auditToolHub'].invoke.apply(proxies['auditToolHub'], $.merge(["SendMessage"], $.makeArray(arguments)));
             }
        };

        proxies['entityHub'] = this.createHubProxy('entityHub'); 
        proxies['entityHub'].client = { };
        proxies['entityHub'].server = {
            addUpdateEntityConnection: function (connection, entityId) {
                return proxies['entityHub'].invoke.apply(proxies['entityHub'], $.merge(["AddUpdateEntityConnection"], $.makeArray(arguments)));
             },

            blockAudit: function (auditID) {
                return proxies['entityHub'].invoke.apply(proxies['entityHub'], $.merge(["BlockAudit"], $.makeArray(arguments)));
             },

            clearOldEntityConnections: function () {
                return proxies['entityHub'].invoke.apply(proxies['entityHub'], $.merge(["ClearOldEntityConnections"], $.makeArray(arguments)));
             },

            deleteEntityConnection: function (connectionId, entityId) {
                return proxies['entityHub'].invoke.apply(proxies['entityHub'], $.merge(["DeleteEntityConnection"], $.makeArray(arguments)));
             },

            raiseEvent: function (entityID, eventCode, eventArgs) {
                return proxies['entityHub'].invoke.apply(proxies['entityHub'], $.merge(["RaiseEvent"], $.makeArray(arguments)));
             },

            refreshEntityHeader: function (entityID) {
                return proxies['entityHub'].invoke.apply(proxies['entityHub'], $.merge(["RefreshEntityHeader"], $.makeArray(arguments)));
             },

            refreshEntityIncentiveTiers: function (entityID) {
                return proxies['entityHub'].invoke.apply(proxies['entityHub'], $.merge(["RefreshEntityIncentiveTiers"], $.makeArray(arguments)));
             },

            refreshFinancingOptions: function (entityID) {
                return proxies['entityHub'].invoke.apply(proxies['entityHub'], $.merge(["RefreshFinancingOptions"], $.makeArray(arguments)));
             },

            refreshSavingsDollarRates: function (entityID) {
                return proxies['entityHub'].invoke.apply(proxies['entityHub'], $.merge(["RefreshSavingsDollarRates"], $.makeArray(arguments)));
             },

            sendConsoleMessage: function (entityId, message) {
                return proxies['entityHub'].invoke.apply(proxies['entityHub'], $.merge(["SendConsoleMessage"], $.makeArray(arguments)));
             }
        };

        proxies['programECMCatalogHub'] = this.createHubProxy('programECMCatalogHub'); 
        proxies['programECMCatalogHub'].client = { };
        proxies['programECMCatalogHub'].server = {
            getOrUpdateQAQCResultsForEntity: function (groupId) {
                return proxies['programECMCatalogHub'].invoke.apply(proxies['programECMCatalogHub'], $.merge(["GetOrUpdateQAQCResultsForEntity"], $.makeArray(arguments)));
             },

            joinGroup: function (groupId) {
                return proxies['programECMCatalogHub'].invoke.apply(proxies['programECMCatalogHub'], $.merge(["JoinGroup"], $.makeArray(arguments)));
             },

            leaveGroup: function (groupId) {
                return proxies['programECMCatalogHub'].invoke.apply(proxies['programECMCatalogHub'], $.merge(["LeaveGroup"], $.makeArray(arguments)));
             },

            raiseEvent: function (groupId, eventCode, eventArgs) {
                return proxies['programECMCatalogHub'].invoke.apply(proxies['programECMCatalogHub'], $.merge(["RaiseEvent"], $.makeArray(arguments)));
             },

            sendMessage: function (groupId, message) {
                return proxies['programECMCatalogHub'].invoke.apply(proxies['programECMCatalogHub'], $.merge(["SendMessage"], $.makeArray(arguments)));
             }
        };

        proxies['programLineItemsHub'] = this.createHubProxy('programLineItemsHub'); 
        proxies['programLineItemsHub'].client = { };
        proxies['programLineItemsHub'].server = {
            getOrUpdateQAQCResultsForEntity: function (groupId) {
                return proxies['programLineItemsHub'].invoke.apply(proxies['programLineItemsHub'], $.merge(["GetOrUpdateQAQCResultsForEntity"], $.makeArray(arguments)));
             },

            joinGroup: function (groupId) {
                return proxies['programLineItemsHub'].invoke.apply(proxies['programLineItemsHub'], $.merge(["JoinGroup"], $.makeArray(arguments)));
             },

            leaveGroup: function (groupId) {
                return proxies['programLineItemsHub'].invoke.apply(proxies['programLineItemsHub'], $.merge(["LeaveGroup"], $.makeArray(arguments)));
             },

            raiseEvent: function (groupId, eventCode, eventArgs) {
                return proxies['programLineItemsHub'].invoke.apply(proxies['programLineItemsHub'], $.merge(["RaiseEvent"], $.makeArray(arguments)));
             },

            sendMessage: function (groupId, message) {
                return proxies['programLineItemsHub'].invoke.apply(proxies['programLineItemsHub'], $.merge(["SendMessage"], $.makeArray(arguments)));
             }
        };

        proxies['programQAQCHub'] = this.createHubProxy('programQAQCHub'); 
        proxies['programQAQCHub'].client = { };
        proxies['programQAQCHub'].server = {
            getOrUpdateQAQCResultsForEntity: function (groupId) {
                return proxies['programQAQCHub'].invoke.apply(proxies['programQAQCHub'], $.merge(["GetOrUpdateQAQCResultsForEntity"], $.makeArray(arguments)));
             },

            joinGroup: function (groupId) {
                return proxies['programQAQCHub'].invoke.apply(proxies['programQAQCHub'], $.merge(["JoinGroup"], $.makeArray(arguments)));
             },

            leaveGroup: function (groupId) {
                return proxies['programQAQCHub'].invoke.apply(proxies['programQAQCHub'], $.merge(["LeaveGroup"], $.makeArray(arguments)));
             },

            raiseEvent: function (groupId, eventCode, eventArgs) {
                return proxies['programQAQCHub'].invoke.apply(proxies['programQAQCHub'], $.merge(["RaiseEvent"], $.makeArray(arguments)));
             },

            sendMessage: function (groupId, message) {
                return proxies['programQAQCHub'].invoke.apply(proxies['programQAQCHub'], $.merge(["SendMessage"], $.makeArray(arguments)));
             }
        };

        proxies['programSolomonHub'] = this.createHubProxy('programSolomonHub'); 
        proxies['programSolomonHub'].client = { };
        proxies['programSolomonHub'].server = {
            getOrUpdateQAQCResultsForEntity: function (groupId) {
                return proxies['programSolomonHub'].invoke.apply(proxies['programSolomonHub'], $.merge(["GetOrUpdateQAQCResultsForEntity"], $.makeArray(arguments)));
             },

            joinGroup: function (groupId) {
                return proxies['programSolomonHub'].invoke.apply(proxies['programSolomonHub'], $.merge(["JoinGroup"], $.makeArray(arguments)));
             },

            leaveGroup: function (groupId) {
                return proxies['programSolomonHub'].invoke.apply(proxies['programSolomonHub'], $.merge(["LeaveGroup"], $.makeArray(arguments)));
             },

            raiseEvent: function (groupId, eventCode, eventArgs) {
                return proxies['programSolomonHub'].invoke.apply(proxies['programSolomonHub'], $.merge(["RaiseEvent"], $.makeArray(arguments)));
             },

            sendMessage: function (groupId, message) {
                return proxies['programSolomonHub'].invoke.apply(proxies['programSolomonHub'], $.merge(["SendMessage"], $.makeArray(arguments)));
             }
        };

        proxies['programTRMHub'] = this.createHubProxy('programTRMHub'); 
        proxies['programTRMHub'].client = { };
        proxies['programTRMHub'].server = {
            getOrUpdateQAQCResultsForEntity: function (groupId) {
                return proxies['programTRMHub'].invoke.apply(proxies['programTRMHub'], $.merge(["GetOrUpdateQAQCResultsForEntity"], $.makeArray(arguments)));
             },

            joinGroup: function (groupId) {
                return proxies['programTRMHub'].invoke.apply(proxies['programTRMHub'], $.merge(["JoinGroup"], $.makeArray(arguments)));
             },

            leaveGroup: function (groupId) {
                return proxies['programTRMHub'].invoke.apply(proxies['programTRMHub'], $.merge(["LeaveGroup"], $.makeArray(arguments)));
             },

            raiseEvent: function (groupId, eventCode, eventArgs) {
                return proxies['programTRMHub'].invoke.apply(proxies['programTRMHub'], $.merge(["RaiseEvent"], $.makeArray(arguments)));
             },

            sendMessage: function (groupId, message) {
                return proxies['programTRMHub'].invoke.apply(proxies['programTRMHub'], $.merge(["SendMessage"], $.makeArray(arguments)));
             }
        };

        proxies['projectHub'] = this.createHubProxy('projectHub'); 
        proxies['projectHub'].client = { };
        proxies['projectHub'].server = {
            addUpdateEntityConnection: function (connection, entityId) {
                return proxies['projectHub'].invoke.apply(proxies['projectHub'], $.merge(["AddUpdateEntityConnection"], $.makeArray(arguments)));
             },

            blockAudit: function (auditID) {
                return proxies['projectHub'].invoke.apply(proxies['projectHub'], $.merge(["BlockAudit"], $.makeArray(arguments)));
             },

            clearOldEntityConnections: function () {
                return proxies['projectHub'].invoke.apply(proxies['projectHub'], $.merge(["ClearOldEntityConnections"], $.makeArray(arguments)));
             },

            deleteEntityConnection: function (connectionId, entityId) {
                return proxies['projectHub'].invoke.apply(proxies['projectHub'], $.merge(["DeleteEntityConnection"], $.makeArray(arguments)));
             },

            raiseEvent: function (entityID, eventCode, eventArgs) {
                return proxies['projectHub'].invoke.apply(proxies['projectHub'], $.merge(["RaiseEvent"], $.makeArray(arguments)));
             },

            refreshEntityHeader: function (entityID) {
                return proxies['projectHub'].invoke.apply(proxies['projectHub'], $.merge(["RefreshEntityHeader"], $.makeArray(arguments)));
             },

            refreshEntityIncentiveTiers: function (entityID) {
                return proxies['projectHub'].invoke.apply(proxies['projectHub'], $.merge(["RefreshEntityIncentiveTiers"], $.makeArray(arguments)));
             },

            refreshFinancingOptions: function (entityID) {
                return proxies['projectHub'].invoke.apply(proxies['projectHub'], $.merge(["RefreshFinancingOptions"], $.makeArray(arguments)));
             },

            refreshSavingsDollarRates: function (entityID) {
                return proxies['projectHub'].invoke.apply(proxies['projectHub'], $.merge(["RefreshSavingsDollarRates"], $.makeArray(arguments)));
             },

            sendConsoleMessage: function (entityId, message) {
                return proxies['projectHub'].invoke.apply(proxies['projectHub'], $.merge(["SendConsoleMessage"], $.makeArray(arguments)));
             }
        };

        proxies['projectQAQCHub'] = this.createHubProxy('projectQAQCHub'); 
        proxies['projectQAQCHub'].client = { };
        proxies['projectQAQCHub'].server = {
            getOrUpdateQAQCResultsForEntity: function (groupId) {
                return proxies['projectQAQCHub'].invoke.apply(proxies['projectQAQCHub'], $.merge(["GetOrUpdateQAQCResultsForEntity"], $.makeArray(arguments)));
             },

            joinGroup: function (groupId) {
                return proxies['projectQAQCHub'].invoke.apply(proxies['projectQAQCHub'], $.merge(["JoinGroup"], $.makeArray(arguments)));
             },

            leaveGroup: function (groupId) {
                return proxies['projectQAQCHub'].invoke.apply(proxies['projectQAQCHub'], $.merge(["LeaveGroup"], $.makeArray(arguments)));
             },

            raiseEvent: function (groupId, eventCode, eventArgs) {
                return proxies['projectQAQCHub'].invoke.apply(proxies['projectQAQCHub'], $.merge(["RaiseEvent"], $.makeArray(arguments)));
             },

            sendMessage: function (groupId, message) {
                return proxies['projectQAQCHub'].invoke.apply(proxies['projectQAQCHub'], $.merge(["SendMessage"], $.makeArray(arguments)));
             }
        };

        proxies['userHub'] = this.createHubProxy('userHub'); 
        proxies['userHub'].client = { };
        proxies['userHub'].server = {
            blockAudit: function (userID, auditID) {
                return proxies['userHub'].invoke.apply(proxies['userHub'], $.merge(["BlockAudit"], $.makeArray(arguments)));
             },

            joinGroup: function (userID) {
                return proxies['userHub'].invoke.apply(proxies['userHub'], $.merge(["JoinGroup"], $.makeArray(arguments)));
             },

            leaveGroup: function (userID) {
                return proxies['userHub'].invoke.apply(proxies['userHub'], $.merge(["LeaveGroup"], $.makeArray(arguments)));
             },

            sendNotification: function (userID, notification) {
                return proxies['userHub'].invoke.apply(proxies['userHub'], $.merge(["SendNotification"], $.makeArray(arguments)));
             }
        };

        proxies['userQAQCHub'] = this.createHubProxy('userQAQCHub'); 
        proxies['userQAQCHub'].client = { };
        proxies['userQAQCHub'].server = {
            getOrUpdateQAQCResultsForEntity: function (groupId) {
                return proxies['userQAQCHub'].invoke.apply(proxies['userQAQCHub'], $.merge(["GetOrUpdateQAQCResultsForEntity"], $.makeArray(arguments)));
             },

            joinGroup: function (groupId) {
                return proxies['userQAQCHub'].invoke.apply(proxies['userQAQCHub'], $.merge(["JoinGroup"], $.makeArray(arguments)));
             },

            leaveGroup: function (groupId) {
                return proxies['userQAQCHub'].invoke.apply(proxies['userQAQCHub'], $.merge(["LeaveGroup"], $.makeArray(arguments)));
             },

            raiseEvent: function (groupId, eventCode, eventArgs) {
                return proxies['userQAQCHub'].invoke.apply(proxies['userQAQCHub'], $.merge(["RaiseEvent"], $.makeArray(arguments)));
             },

            sendMessage: function (groupId, message) {
                return proxies['userQAQCHub'].invoke.apply(proxies['userQAQCHub'], $.merge(["SendMessage"], $.makeArray(arguments)));
             }
        };

        return proxies;
    };

    signalR.hub = $.hubConnection("/signalr", { useDefaultPath: false });
    $.extend(signalR, signalR.hub.createHubProxies());

}(window.jQuery, window));