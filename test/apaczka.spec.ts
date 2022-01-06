import Apaczka, { Service } from "../src/apaczka/apaczka";
import { expect } from "earljs";
import { Cassettes } from "mocha-cassettes";
import * as moment from "moment";

const appId = "512653_5e8ce70d3cd203.64862140";
const appSecret = "6v388f7nahwwt7ycd4m5pu9xpmnsa7j6";
const cassette = new Cassettes("./test/cassettes");

describe("structure call", function () {
  cassette
    .createTest("structure call", async () => {
      const apaczka = new Apaczka({ appId, appSecret });
      const structure = await apaczka.Structure();
      expect(structure.status).toEqual(200);
      expect(structure).toMatchSnapshot();
    })
    .register(this);
});

describe.only("pickup_hours", function () {
  cassette
    .createTest("UPS Standard", async () => {
      const apaczka = new Apaczka({ appId, appSecret });
      const pickup_hours = await apaczka.PickupHours({
        postalCode: "00-999",
        service: Service.UPS_STANDARD,
      });
      console.info(JSON.stringify(pickup_hours));

      // expect(pickup_hours).toEqual(
      //   expect.objectWith({
      //     [moment().add(1, "day").format("YYYY-MM-DD")]: expect.objectWith({
      //       timeTo: expect.stringMatching(/^[0-9]{2}:[0-9]{2}$/),
      //       timeFrom: expect.stringMatching(/^[0-9]{2}:[0-9]{2}$/),
      //       interval: expect.a(Number),
      //     }),
      //   })
      // );
    })
    .register(this);

  cassette
    .createTest("DHL Standard Domestic", async () => {
      const apaczka = new Apaczka({ appId, appSecret });
      const pickup_hours = await apaczka.PickupHours({
        postalCode: "00-999",
        service: Service.DHL_STANDARD,
      });
      console.info(JSON.stringify(pickup_hours));

      // expect(pickup_hours).toEqual(
      //   expect.objectWith({
      //     [moment().add(1, "day").format("YYYY-MM-DD")]: expect.objectWith({
      //       timeTo: expect.stringMatching(/^[0-9]{2}:[0-9]{2}$/),
      //       timeFrom: expect.stringMatching(/^[0-9]{2}:[0-9]{2}$/),
      //       interval: expect.a(Number),
      //     }),
      //   })
      // );
    })
    .register(this);

  // it.only("DHL Standard Domestic", async () => {
  //   const apaczka = new Apaczka({ appId, appSecret });
  //   const pickup_hours = await apaczka.PickupHours({
  //     postalCode: "00-999",
  //     service: Service.DHL_STANDARD,
  //   });
  //   expect(pickup_hours).toBeAnObjectWith({
  //     [moment().add(1, "day").format("YYYY-MM-DD")]: expect.objectWith({
  //       timeTo: expect.stringMatching(/^[0-9]{2}:[0-9]{2}$/),
  //       timeFrom: expect.stringMatching(/^[0-9]{2}:[0-9]{2}$/),
  //       interval: expect.a(Number),
  //     }),
  //   });
  //   console.info(JSON.stringify(pickup_hours));
  //   // console.info({ service: Apaczka.SERVICES.DHL_STANDARD, pickup_hours })
  //   // expect(pickup_hours).toEqual(
  //   //   expect.objectWith({
  //   //     [moment().add(1, "day").format("YYYY-MM-DD")]: expect.objectWith({
  //   //       timeTo: expect.stringMatching(/^[0-9]{2}:[0-9]{2}$/),
  //   //       timeFrom: expect.stringMatching(/^[0-9]{2}:[0-9]{2}$/),
  //   //       interval: expect.a(Number),
  //   //     }),
  //   //   })
  //   // );
  // });
});
