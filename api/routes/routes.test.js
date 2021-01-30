const request = require("supertest");
const app = require("../../server");

describe("API Endpoints", () => {
  it("default: default route should guide the user", async () => {
    const res = await request(app).get("/points/");
    expect(res.body).toEqual({
      message:
        "Welcome to the points maintainance system. Go to one of the specified routes to do add points, get balance or deduct points for a user.",
    });
  });

  it("deduct: deducting without points should return valid response", async () => {
    const res = await request(app).post("/points/deduct").send(["300"]);
    expect(res.statusCode).toEqual(400);
    expect(res.body).toEqual({
      msg: "No points are available",
    });
  });

  it("balance: showing balance without points should return valid response", async () => {
    const res = await request(app).get("/points/balance");
    expect(res.statusCode).toEqual(400);
    expect(res.body).toEqual({
      msg: "No points available",
    });
  });

  it("add: adding negative points for a payer for the first time shouldn't be allowed and should return valid response", async () => {
    const res = await request(app)
      .post("/points/add")
      .send(["DANNON", "-300 points", "10/31 10AM"]);
    expect(res.statusCode).toEqual(400);
    expect(res.body).toEqual({
      msg: "Total points can't be negative for a payer",
    });
  });

  it("add: adding invalid input should return valid response", async () => {
    const res = await request(app)
      .post("/points/add")
      .send(["DANNON", "points", "10/31 10AM"]);
    expect(res.statusCode).toEqual(400);
    expect(res.body).toEqual({
      msg: "Need valid points!",
    });
  });

  it("add: should add points for the payer(Dannon)", async () => {
    const res = await request(app)
      .post("/points/add")
      .send(["DANNON", "300 points", "10/31 10AM"]);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual({
      Added: "300 points to DANNON",
    });
  });

  it("add: should add points for the payer (Unilever)", async () => {
    const res = await request(app)
      .post("/points/add")
      .send(["UNILEVER", "200 points", "10/31 11AM"]);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual({
      Added: "200 points to UNILEVER",
    });
  });

  it("add: should handle negative input points for an existing payer", async () => {
    const res = await request(app)
      .post("/points/add")
      .send(["DANNON", "-200 points", "10/31 3PM"]);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual({
      Added: "-200 points to DANNON",
    });
  });

  it("add: should add points for the payer(Miller Coors)", async () => {
    const res = await request(app)
      .post("/points/add")
      .send(["MILLER COORS", "10000 points", "11/1 2PM"]);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual({
      Added: "10000 points to MILLER COORS",
    });
  });

  it("add: should add points for the payer(Dannon)", async () => {
    const res = await request(app)
      .post("/points/add")
      .send(["DANNON", "1000 points", "11/2 2PM"]);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual({
      Added: "1000 points to DANNON",
    });
  });

  it("balance: should return balance", async () => {
    const res = await request(app).get("/points/balance");
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual({
      "List of Payers and points": {
        DANNON: 1100,
        UNILEVER: 200,
        "MILLER COORS": 10000,
      },
    });
  });

  it("deduct: should deduct", async () => {
    const res = await request(app).post("/points/deduct").send(["5000"]);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual({
      deduction: {
        DANNON: {
          value: -100,
          time: "now",
        },
        "MILLER COORS": {
          value: -4700,
          time: "now",
        },
        UNILEVER: {
          value: -200,
          time: "now",
        },
      },
    });
  });

  it("deduct: deducting points more than total available points should return valid response", async () => {
    const res = await request(app).post("/points/deduct").send(["100000"]);
    expect(res.statusCode).toEqual(400);
    expect(res.body).toEqual({
      msg: "Can't deduct points more than total available points",
    });
  });

  it("add: should handle negative input points for an existing payer when total points for this payer would be 0", async () => {
    const res = await request(app)
      .post("/points/add")
      .send(["MILLER COORS", "-5300 points", "11/2 3PM"]);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual({
      Added: "-5300 points to MILLER COORS",
    });
  });

  it("deduct: invalild points should return valid response", async () => {
    const res = await request(app).post("/points/deduct").send(["points"]);
    expect(res.statusCode).toEqual(400);
    expect(res.body).toEqual({
      msg: "Need valid points!",
    });
  });
});
