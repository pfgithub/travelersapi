// https://thetravelers.online/signalr/hubs

/*!
 * ASP.NET SignalR JavaScript Library v2.3.0-rtm
 * http://signalr.net/
 *
 * Copyright (c) .NET Foundation. All rights reserved.
 * Licensed under the Apache License, Version 2.0. See License.txt in the project root for license information.
 *
 */

//// <reference path="..\..\SignalR.Client.JS\Scripts\jquery-1.6.4.js" />
//// <reference path="jquery.signalR.js" />
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

                        // Use the actual user-provided callback as the "identity" value for the registration.
                        subscriptionMethod.call(hub, memberKey, makeProxyCallback(hub, memberValue), memberValue);
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

        proxies['logHub'] = this.createHubProxy('logHub'); 
        proxies['logHub'].client = { };
        proxies['logHub'].server = {
            cl_break: function (job, PLAY_AUTH) {
                return proxies['logHub'].invoke.apply(proxies['logHub'], $.merge(["cl_break"], $.makeArray(arguments)));
             },

            cl_build: function (job, PLAY_AUTH) {
                return proxies['logHub'].invoke.apply(proxies['logHub'], $.merge(["cl_build"], $.makeArray(arguments)));
             },

            cl_cancel_break: function (job, PLAY_AUTH) {
                return proxies['logHub'].invoke.apply(proxies['logHub'], $.merge(["cl_cancel_break"], $.makeArray(arguments)));
             },

            cl_chat: function (job, PLAY_AUTH) {
                return proxies['logHub'].invoke.apply(proxies['logHub'], $.merge(["cl_chat"], $.makeArray(arguments)));
             },

            cl_craft: function (job, PLAY_AUTH) {
                return proxies['logHub'].invoke.apply(proxies['logHub'], $.merge(["cl_craft"], $.makeArray(arguments)));
             },

            cl_craft_cancelall: function (job, PLAY_AUTH) {
                return proxies['logHub'].invoke.apply(proxies['logHub'], $.merge(["cl_craft_cancelall"], $.makeArray(arguments)));
             },

            cl_craft_cancelone: function (job, PLAY_AUTH) {
                return proxies['logHub'].invoke.apply(proxies['logHub'], $.merge(["cl_craft_cancelone"], $.makeArray(arguments)));
             },

            cl_dequip: function (job, PLAY_AUTH) {
                return proxies['logHub'].invoke.apply(proxies['logHub'], $.merge(["cl_dequip"], $.makeArray(arguments)));
             },

            cl_doublestep: function (job, PLAY_AUTH) {
                return proxies['logHub'].invoke.apply(proxies['logHub'], $.merge(["cl_doublestep"], $.makeArray(arguments)));
             },

            cl_equip: function (job, PLAY_AUTH) {
                return proxies['logHub'].invoke.apply(proxies['logHub'], $.merge(["cl_equip"], $.makeArray(arguments)));
             },

            cl_equipment: function (job, PLAY_AUTH) {
                return proxies['logHub'].invoke.apply(proxies['logHub'], $.merge(["cl_equipment"], $.makeArray(arguments)));
             },

            cl_event_choice: function (job, PLAY_AUTH) {
                return proxies['logHub'].invoke.apply(proxies['logHub'], $.merge(["cl_event_choice"], $.makeArray(arguments)));
             },

            cl_genmsg: function (job, PLAY_AUTH) {
                return proxies['logHub'].invoke.apply(proxies['logHub'], $.merge(["cl_genmsg"], $.makeArray(arguments)));
             },

            cl_gettree: function (job, PLAY_AUTH) {
                return proxies['logHub'].invoke.apply(proxies['logHub'], $.merge(["cl_gettree"], $.makeArray(arguments)));
             },

            cl_hands: function (job, PLAY_AUTH) {
                return proxies['logHub'].invoke.apply(proxies['logHub'], $.merge(["cl_hands"], $.makeArray(arguments)));
             },

            cl_int_acceptchal: function (job, PLAY_AUTH) {
                return proxies['logHub'].invoke.apply(proxies['logHub'], $.merge(["cl_int_acceptchal"], $.makeArray(arguments)));
             },

            cl_int_exchange: function (job, PLAY_AUTH) {
                return proxies['logHub'].invoke.apply(proxies['logHub'], $.merge(["cl_int_exchange"], $.makeArray(arguments)));
             },

            cl_int_getmsg: function (job, PLAY_AUTH) {
                return proxies['logHub'].invoke.apply(proxies['logHub'], $.merge(["cl_int_getmsg"], $.makeArray(arguments)));
             },

            cl_int_killoffline: function (job, PLAY_AUTH) {
                return proxies['logHub'].invoke.apply(proxies['logHub'], $.merge(["cl_int_killoffline"], $.makeArray(arguments)));
             },

            cl_int_leavemsg: function (job, PLAY_AUTH) {
                return proxies['logHub'].invoke.apply(proxies['logHub'], $.merge(["cl_int_leavemsg"], $.makeArray(arguments)));
             },

            cl_int_lootoffline: function (job, PLAY_AUTH) {
                return proxies['logHub'].invoke.apply(proxies['logHub'], $.merge(["cl_int_lootoffline"], $.makeArray(arguments)));
             },

            cl_int_next: function (job, PLAY_AUTH) {
                return proxies['logHub'].invoke.apply(proxies['logHub'], $.merge(["cl_int_next"], $.makeArray(arguments)));
             },

            cl_int_removemsg: function (job, PLAY_AUTH) {
                return proxies['logHub'].invoke.apply(proxies['logHub'], $.merge(["cl_int_removemsg"], $.makeArray(arguments)));
             },

            cl_int_takeall: function (job, PLAY_AUTH) {
                return proxies['logHub'].invoke.apply(proxies['logHub'], $.merge(["cl_int_takeall"], $.makeArray(arguments)));
             },

            cl_learn: function (job, PLAY_AUTH) {
                return proxies['logHub'].invoke.apply(proxies['logHub'], $.merge(["cl_learn"], $.makeArray(arguments)));
             },

            cl_leave_int: function (job, PLAY_AUTH) {
                return proxies['logHub'].invoke.apply(proxies['logHub'], $.merge(["cl_leave_int"], $.makeArray(arguments)));
             },

            cl_loot_exchange: function (job, PLAY_AUTH) {
                return proxies['logHub'].invoke.apply(proxies['logHub'], $.merge(["cl_loot_exchange"], $.makeArray(arguments)));
             },

            cl_loot_next: function (job, PLAY_AUTH) {
                return proxies['logHub'].invoke.apply(proxies['logHub'], $.merge(["cl_loot_next"], $.makeArray(arguments)));
             },

            cl_loot_takeall: function (job, PLAY_AUTH) {
                return proxies['logHub'].invoke.apply(proxies['logHub'], $.merge(["cl_loot_takeall"], $.makeArray(arguments)));
             },

            cl_pvp_attack: function (job, PLAY_AUTH) {
                return proxies['logHub'].invoke.apply(proxies['logHub'], $.merge(["cl_pvp_attack"], $.makeArray(arguments)));
             },

            cl_pvp_battleopt: function (job, PLAY_AUTH) {
                return proxies['logHub'].invoke.apply(proxies['logHub'], $.merge(["cl_pvp_battleopt"], $.makeArray(arguments)));
             },

            cl_pvp_endchat: function (job, PLAY_AUTH) {
                return proxies['logHub'].invoke.apply(proxies['logHub'], $.merge(["cl_pvp_endchat"], $.makeArray(arguments)));
             },

            cl_pvp_execute: function (job, PLAY_AUTH) {
                return proxies['logHub'].invoke.apply(proxies['logHub'], $.merge(["cl_pvp_execute"], $.makeArray(arguments)));
             },

            cl_pvp_startready: function (job, PLAY_AUTH) {
                return proxies['logHub'].invoke.apply(proxies['logHub'], $.merge(["cl_pvp_startready"], $.makeArray(arguments)));
             },

            cl_reenter: function (job, PLAY_AUTH) {
                return proxies['logHub'].invoke.apply(proxies['logHub'], $.merge(["cl_reenter"], $.makeArray(arguments)));
             },

            cl_reincarnate: function (job, PLAY_AUTH) {
                return proxies['logHub'].invoke.apply(proxies['logHub'], $.merge(["cl_reincarnate"], $.makeArray(arguments)));
             },

            cl_reset_skills: function (job, PLAY_AUTH) {
                return proxies['logHub'].invoke.apply(proxies['logHub'], $.merge(["cl_reset_skills"], $.makeArray(arguments)));
             },

            cl_setDir: function (job, PLAY_AUTH) {
                return proxies['logHub'].invoke.apply(proxies['logHub'], $.merge(["cl_setDir"], $.makeArray(arguments)));
             },

            cl_skill_upgrade: function (job, PLAY_AUTH) {
                return proxies['logHub'].invoke.apply(proxies['logHub'], $.merge(["cl_skill_upgrade"], $.makeArray(arguments)));
             },

            cl_suicide: function (job, PLAY_AUTH) {
                return proxies['logHub'].invoke.apply(proxies['logHub'], $.merge(["cl_suicide"], $.makeArray(arguments)));
             },

            cl_tut_inc: function (job, PLAY_AUTH) {
                return proxies['logHub'].invoke.apply(proxies['logHub'], $.merge(["cl_tut_inc"], $.makeArray(arguments)));
             },

            cl_tut_skip: function (job, PLAY_AUTH) {
                return proxies['logHub'].invoke.apply(proxies['logHub'], $.merge(["cl_tut_skip"], $.makeArray(arguments)));
             }
        };

        return proxies;
    };

    signalR.hub = $.hubConnection("/signalr", { useDefaultPath: false });
    $.extend(signalR, signalR.hub.createHubProxies());

}(window.jQuery, window));
