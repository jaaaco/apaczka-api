export declare enum Service {
    UPS_STANDARD = 0,
    DHL_STANDARD = 1
}
interface ServiceDetailsInterface {
    id: string;
    name: string;
    pickup_code: string;
}
declare type ServicesType = {
    [service in Service]: ServiceDetailsInterface;
};
declare const Services: ServicesType;
interface PickupHourInterface {
    timeFrom: string;
    timeTo: string;
    interval: string;
}
interface PickupHoursInterface {
    [date: string]: PickupHourInterface[];
}
export { Services };
export default class Apaczka {
    private appId;
    private appSecret;
    /**
     * Class Constructor
     * @param appId
     * @param appSecret
     */
    constructor({ appId, appSecret }: {
        appId: string;
        appSecret: string;
    });
    /**
     * Generates request signature
     * @param data JSON object
     * @param route method route without slash
     * @param expires unix timestamp
     * @returns {string} request signature
     */
    private getSignature;
    /**
     * Makes actual API call
     * @param route method route without slash
     * @param data optional JSON object containing request data
     * @returns {*}
     */
    call({ route, data, }: {
        route: string | null;
        data: Record<string, unknown> | null;
    }): Promise<any>;
    PickupHours({ service, postalCode, }: {
        service: Service;
        postalCode: string;
    }): Promise<PickupHoursInterface>;
    Structure(): Promise<any>;
}
