const sql = require("mssql");
const config = require("./config");

async function updateUseCaseImportance(req) {
  try {
    await sql.connect(config);

    const params = req.body;

    const request = new sql.Request();

    Object.keys(params).forEach((key) => {
      request.input(key, sql.Int, params[key]);
    });

    const result = await request.query(
      `UPDATE [dbo].[Use_Case_User_Scenario_Importance_Master]
            SET [Use_Case_Importance] =
                CASE
                    WHEN [Base_Use_Case] = 'SaaS Security Risk Mitigation' THEN @SaaS_Security_Risk_Mitigation
                    WHEN [Base_Use_Case] = 'Data Loss Prevention over SaaS' THEN @Data_Loss_Prevention_over_SaaS
                    WHEN [Base_Use_Case] = 'SaaS Application Classification' THEN @SaaS_Application_Classification
                    WHEN [Base_Use_Case] = 'SaaS Risk Assessment Reporting & Compliance' THEN @SaaS_Risk_Assessment_Reporting_&_Compliance
                    WHEN [Base_Use_Case] = 'SaaS Application Discovery' THEN @SaaS_Application_Discovery
                    ELSE [Use_Case_Importance] -- Keep the current value for other cases
                END
            WHERE [Base_Use_Case] IN ('SaaS Security Risk Mitigation', 'Data Loss Prevention over SaaS','SaaS Application Classification','SaaS Risk Assessment Reporting & Compliance','SaaS Application Discovery');
            `
    );

    console.log("Update successful!");
    return { status: 200, body: result };
  } catch (err) {
    console.error("Error executing update:", err);
    return { status: 500, body: "Error executing update" };
  } finally {
    sql.close();
  }
}

module.exports = async function (context, req) {
  const result = await updateUseCaseImportance(req);

  context.res = result;
};
