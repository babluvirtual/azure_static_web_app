const sql = require("mssql");
const config = require("./config");

async function fetchOfferData() {
  try {
    await sql.connect(config);
    const result = await sql.query(
      `SELECT Vendor_Name, Offer_Name, Offer_Relevance_Mandatory_Percent, Offer_Utilisation_Mandatory_Percent
            FROM [BuyerGuide].[dbo].[Offer_Metrics]
            where Bundle_Option='Bundle Type- Yes only'
            order by Offer_Relevance_Mandatory_Percent desc, Offer_Utilisation_Mandatory_Percent desc;`
    );

    return result.recordset;
  } catch (err) {
    console.error("Error fetching data:", err);
    throw err;
  } finally {
    sql.close();
  }
}

module.exports = async function (context, req) {
  try {
    const offerData = await fetchOfferData();
    context.res = {
      body: offerData,
    };
  } catch (err) {
    context.res = {
      status: 500,
      body: "Error fetching offer data",
    };
  }
};
