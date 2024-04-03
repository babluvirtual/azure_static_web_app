const sql = require("mssql");
const cors = require("cors");
const config = require("../config");

const corsOptions = {
  origin: "*", // Your React app URL
  methods: ["GET", "PUT", "POST"],
  allowedHeaders: ["Content-Type", "Authorization"],
  Credential: true,
};

module.exports = async function (context, req) {
  context.log("JavaScript HTTP trigger function processed a request.");

  // Enable CORS
  const corsMiddleware = cors(corsOptions);
  corsMiddleware(req, context.res, () => {});

  try {
    await sql.connect(config); // Assuming config is defined in "../config.js"

    const result =
      await sql.query`SELECT Offer_Relevance_Mandatory_Percent, Offer_Utilisation_Mandatory_Percent
  FROM Offer_Metrics
  where Bundle_Option='Bundle Type- Yes only'
  order by Offer_Relevance_Mandatory_Percent desc, Offer_Utilisation_Mandatory_Percent desc`;

    context.res = {
      status: 200,
      body: result.recordset,
    };
  } catch (err) {
    context.res = {
      status: 500,
      body: err.message,
    };
  } finally {
    sql.close();
  }
};
