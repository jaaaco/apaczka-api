import * as moment from "moment";
import * as crypto from "crypto";
import got from "got";

export enum Service {
  UPS_STANDARD,
  DHL_STANDARD,
}

interface ServiceDetailsInterface {
  id: string;
  name: string;
  pickup_code: string;
}

type ServicesType = {
  [service in Service]: ServiceDetailsInterface;
};

const Services: ServicesType = {
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
  private appId: string;
  private appSecret: string;

  /**
   * Class Constructor
   * @param appId
   * @param appSecret
   */
  constructor({ appId, appSecret }: { appId: string; appSecret: string }) {
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
  private getSignature(
    data: Record<string, unknown> | null,
    route: string | null,
    expires: number
  ) {
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
  async call({
    route = null,
    data = null,
  }: {
    route: string | null;
    data: Record<string, unknown> | null;
  }): Promise<any> {
    const expires = moment().add(10, "minutes").unix();
    return got
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
  async PickupHours({
    service,
    postalCode,
  }: {
    service: Service;
    postalCode: string;
  }) {
    const {
      response: { hours },
    } = await this.call({
      route: "pickup_hours",
      data: {
        postal_code: postalCode,
        service_id: Services[service].id,
        remove_index: false,
      },
    });
    const dates = Object.keys(hours);

    const availableDates: PickupHoursInterface = {};

    dates.forEach((date) => {
      hours[date].services.forEach(
        (foundService: {
          service: string;
          timefrom: any;
          timeto: any;
          interval: any;
        }) => {
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
        }
      );
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
