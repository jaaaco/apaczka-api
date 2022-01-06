"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Services = exports.Service = void 0;
const moment = require("moment");
const crypto = require("crypto");
const got_1 = require("got");
var Service;
(function (Service) {
    Service[Service["UPS_STANDARD"] = 0] = "UPS_STANDARD";
    Service[Service["DHL_STANDARD"] = 1] = "DHL_STANDARD";
})(Service = exports.Service || (exports.Service = {}));
const Services = {
    [Service.UPS_STANDARD]: {
        id: "UPS_STANDARD",
        name: "UPS Standard",
        pickup_code: "UPS",
    },
    [Service.DHL_STANDARD]: {
        id: "DHL_STANDARD",
        name: "DHL Standard",
        pickup_code: "DHL",
    },
};
exports.Services = Services;
class Apaczka {
    /**
     * Class Constructor
     * @param appId
     * @param appSecret
     */
    constructor({ appId, appSecret }) {
        this.appId = appId || process.env.APACZKA_APP_ID || "";
        this.appSecret = appSecret || process.env.APACZKA_APP_SECRET || "";
    }
    /**
     * Generates request signature
     * @param data JSON object
     * @param route method route without slash
     * @param expires unix timestamp
     * @returns {string} request signature
     */
    getSignature(data, route, expires) {
        return crypto
            .createHmac("sha256", this.appSecret)
            .update(`${this.appId}:${route}/:${JSON.stringify(data)}:${expires}`)
            .digest("hex");
    }
    /**
     * Makes actual API call
     * @param route method route without slash
     * @param data optional JSON object containing request data
     * @returns {*}
     */
    async call({ route = null, data = null, }) {
        const expires = moment().add(10, "minutes").unix();
        return got_1.default
            .post(`https://www.apaczka.pl/api/v2/${route}/`, {
            form: {
                app_id: process.env.APACZKA_APP_ID || this.appId,
                request: JSON.stringify(data),
                expires,
                signature: this.getSignature(data, route, expires),
            },
        })
            .json();
    }
    async PickupHours({ service, postalCode, }) {
        const { response: { hours }, } = await this.call({
            route: "pickup_hours",
            data: {
                postal_code: postalCode,
                service_id: Services[service].id,
                remove_index: false,
            },
        });
        const dates = Object.keys(hours);
        const availableDates = {};
        dates.forEach((date) => {
            hours[date].services.forEach((foundService) => {
                if (foundService.service === Services[service].pickup_code) {
                    availableDates[date] = !availableDates[date]
                        ? [
                            {
                                timeFrom: foundService.timefrom,
                                timeTo: foundService.timeto,
                                interval: foundService.interval,
                            },
                        ]
                        : [
                            ...availableDates[date],
                            {
                                timeFrom: foundService.timefrom,
                                timeTo: foundService.timeto,
                                interval: foundService.interval,
                            },
                        ];
                }
            });
        });
        return availableDates;
    }
    async Structure() {
        return this.call({
            route: "service_structure",
            data: null,
        });
    }
}
exports.default = Apaczka;
//# sourceMappingURL=apaczka.js.map