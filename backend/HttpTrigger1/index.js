const sql = require("mssql");
const config = require("../config");
const cors = require("cors");

async function createTableIfNotExists() {
  try {
    await sql.connect(config);

    const checkTableQuery = `
      SELECT *
      FROM INFORMATION_SCHEMA.TABLES
      WHERE TABLE_NAME = 'Use_Case_User_Scenario_Importance_Master'
    `;
    const result = await sql.query(checkTableQuery);

    if (result.recordset.length === 0) {
      await createTable();
      await insertInitialData();
      console.log("Table created successfully.");
    } else {
      console.log("Table already exists.");
    }
  } catch (error) {
    console.error("Error creating table:", error);
  } finally {
    sql.close();
  }
}

async function createTable() {
  try {
    await sql.connect(config);

    const createTableQuery = `
      CREATE TABLE Use_Case_User_Scenario_Importance_Master (
        ID INT IDENTITY(1,1) PRIMARY KEY,
        Base_Use_Case NVARCHAR(255) NOT NULL,
        Use_Case_Importance INT NOT NULL,
        status BIT NOT NULL
      )
    `;

    await sql.query(createTableQuery);

    console.log("Table created successfully.");
  } catch (error) {
    console.error("Error creating table:", error);
  } finally {
    sql.close();
  }
}

async function updateUseCaseImportance(req) {
  try {
    await sql.connect(config);

    const rowCount =
      await sql.query`SELECT COUNT(*) AS count FROM Use_Case_User_Scenario_Importance_Master`;

    if (rowCount.recordset[0].count === 0) {
      // If no rows exist, insert initial data
      await insertInitialData();
    }

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
                    WHEN [Base_Use_Case] = 'SaaS Risk Assessment Reporting & Compliance' THEN @SaaS_Risk_Assessment_Reporting_Compliance
                    WHEN [Base_Use_Case] = 'SaaS Application Discovery' THEN @SaaS_Application_Discovery
                    ELSE [Use_Case_Importance] -- Keep the current value for other cases
                END
            WHERE [Base_Use_Case] IN ('SaaS Security Risk Mitigation', 'Data Loss Prevention over SaaS','SaaS Application Classification','SaaS Risk Assessment Reporting & Compliance','SaaS Application Discovery');
            `
    );

    console.log("Update successful!");

    const checkTableQuery = `
    SELECT *
    FROM INFORMATION_SCHEMA.TABLES
    WHERE TABLE_NAME = 'Offer_Metrics'
  `;
    const checkTableQueryResult = await sql.query(checkTableQuery);

    if (checkTableQueryResult.recordset.length === 0) {
      await createOfferMetricsTable();
    } else {
      // await insertDummyData();
      await updateDummyData();
    }

    return { status: 200, body: result };
  } catch (err) {
    console.error("Error executing update:", err);
    return { status: 500, body: "Error executing update" };
  } finally {
    sql.close();
  }
}

async function insertInitialData() {
  try {
    const request = new sql.Request();

    // Insert initial data into the table
    await request.query(`
      INSERT INTO Use_Case_User_Scenario_Importance_Master (Base_Use_Case, Use_Case_Importance, status)
      VALUES
        ('SaaS Security Risk Mitigation', 0, 0),
        ('Data Loss Prevention over SaaS', 0, 0),
        ('SaaS Application Classification', 0, 0),
        ('SaaS Risk Assessment Reporting & Compliance', 0, 0),
        ('SaaS Application Discovery', 0, 0)
    `);

    console.log("Initial data inserted successfully.");
  } catch (error) {
    console.error("Error inserting initial data:", error);
  }
}

async function createOfferMetricsTable() {
  try {
    await sql.connect(config);

    const createTableQuery = `
      CREATE TABLE Offer_Metrics (
        Vendor_Name VARCHAR(100),
        Offer_Name VARCHAR(100),
        Offer_Relevance_Mandatory_Percent INT,
        Offer_Utilisation_Mandatory_Percent INT,
        Bundle_Option VARCHAR(50)
      )
    `;

    await sql.query(createTableQuery);

    console.log("Offer_Metrics table created successfully.");

    // Insert dummy data into the Offer_Metrics table
    await insertDummyData();

    console.log("Dummy data inserted into Offer_Metrics table.");
  } catch (error) {
    console.error("Error creating Offer_Metrics table:", error);
  } finally {
    sql.close();
  }
}

async function insertDummyData() {
  try {
    const request = new sql.Request();

    // Insert dummy values with random percentage values
    await request.query(`
      INSERT INTO Offer_Metrics (Vendor_Name, Offer_Name, Offer_Relevance_Mandatory_Percent, Offer_Utilisation_Mandatory_Percent, Bundle_Option)
      VALUES
          ('Vendor A', 'Offer 1', CAST(RAND() * 100 AS INT), CAST(RAND() * 100 AS INT), 'Bundle Type- Yes only'),
          ('Vendor B', 'Offer 2', CAST(RAND() * 100 AS INT), CAST(RAND() * 100 AS INT), 'Bundle Type- Yes only'),
          ('Vendor C', 'Offer 3', CAST(RAND() * 100 AS INT), CAST(RAND() * 100 AS INT), 'Bundle Type- Yes only'),
          ('Vendor D', 'Offer 4', CAST(RAND() * 100 AS INT), CAST(RAND() * 100 AS INT), 'Bundle Type- Yes only'),
          ('Vendor E', 'Offer 5', CAST(RAND() * 100 AS INT), CAST(RAND() * 100 AS INT), 'Bundle Type- Yes only')
    `);

    console.log("Dummy data inserted successfully.");
  } catch (error) {
    console.error("Error inserting dummy data:", error);
  }
}

async function updateDummyData() {
  try {
    const request = new sql.Request();

    // Update existing records with random percentage values
    await request.query(`
    UPDATE Offer_Metrics
    SET 
        Offer_Relevance_Mandatory_Percent = CAST(ABS(CHECKSUM(NEWID())) % 101 AS INT), 
        Offer_Utilisation_Mandatory_Percent = CAST(ABS(CHECKSUM(NEWID())) % 101 AS INT); 
    


    `);

    console.log("Dummy data updated successfully.");
  } catch (error) {
    console.error("Error updating dummy data:", error);
  }
}

const corsOptions = {
  origin: "*", // Your React app URL
  methods: ["GET", "PUT", "POST"],
  allowedHeaders: ["Content-Type", "Authorization"],
  Credential: true,
};

module.exports = async function (context, req) {
  await createTableIfNotExists(); // Create the table before executing the update

  // Enable CORS with options
  const corsMiddleware = cors(corsOptions);
  corsMiddleware(req, context.res, () => {});

  const result = await updateUseCaseImportance(req);

  if (req.method === "OPTIONS") {
    context.res = {
      status: 204, // 204 No Content for preflight
      headers: {
        "Access-Control-Allow-Origin": "http://localhost:3000",
        "Access-Control-Allow-Methods": "GET, PUT, POST",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Access-Control-Allow-Credentials": true,
      },
    };
    return; // Stop further processing for OPTIONS
  }

  context.res = result;
};
