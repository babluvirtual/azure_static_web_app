import React, { useState } from "react";
import Slider from "react-slider";

function MyForm() {
  const [ratings, setRatings] = useState({
    SaaS_Security_Risk_Mitigation: 0,
    Data_Loss_Prevention_over_SaaS: 0,
    SaaS_Application_Classification: 0,
    SaaS_Risk_Assessment_Reporting_And_Compliance: 0,
    SaaS_Application_Discovery: 0,
  });

  const handleChange = (parameter, value) => {
    setRatings({ ...ratings, [parameter]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch("/update-use-case-importance", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(ratings),
      });
      if (response.ok) {
        console.log("Table updated successfully");
      } else {
        console.log("Error while updating table");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {Object.keys(ratings).map((parameter) => (
        <div key={parameter}>
          <label htmlFor={parameter}>{parameter}</label>
          <Slider
            id={parameter}
            min={0}
            max={100}
            value={ratings[parameter]}
            onChange={(value) => handleChange(parameter, value)}
          />
        </div>
      ))}

      <button type="submit">Submit</button>
    </form>
  );
}

export default MyForm;
