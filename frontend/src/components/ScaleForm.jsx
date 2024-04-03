import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Slider from "./Slider";
import ScatterChart from "./ChartSection";

const Container = styled.div`
  display: flex;
`;

const Header = styled.h2`
  margin-bottom: 20px;
`;

const FormContainer = styled.div`
  flex: 0 0 40%;
  padding: 0 50px; /* Add padding for spacing */
  display: flex;
  flex-direction: column;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
`;

const ChartContainer = styled.div`
  flex: 0 0 60%;
  padding: 0 20px; /* Add padding for spacing */
`;

const Label = styled.label`
  display: block;
  margin-bottom: 20px; /* Add margin between label and slider */
`;

const SubmitButton = styled.button`
  padding: 10px 20px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  &:hover {
    background-color: #0056b3;
  }
`;

const ScaleForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isChartDataLoading, setIsChartDataLoading] = useState(false);
  const [chartData, setChartData] = useState([]);
  const [ratings, setRatings] = useState({
    SaaS_Security_Risk_Mitigation: 0,
    Data_Loss_Prevention_over_SaaS: 0,
    SaaS_Application_Classification: 0,
    SaaS_Risk_Assessment_Reporting_Compliance: 0,
    SaaS_Application_Discovery: 0,
  });

  const handleChange = (value, parameter) => {
    setRatings({ ...ratings, [parameter]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await fetch(
        "https://azurestaticwebappfunction.azurewebsites.net/api/HttpTrigger1",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(ratings),
        }
      );
      if (response.ok) {
        console.log("Table updated successfully", response.json());
        setIsSubmitting(false);
        fetchData();
      } else {
        console.log("Error while updating table");
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  function fetchData() {
    setIsChartDataLoading(true);
    fetch(
      "https://azurestaticwebappfunction.azurewebsites.net/api/HttpTrigger2",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json", // Depending on your API, adjust headers if needed
          // Add any other headers if necessary
        },
      }
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json(); // Parse the JSON from the response
      })
      .then((data) => {
        // Do something with the data received
        setChartData(data);
        setIsChartDataLoading(false);
        // You can also return the data or call another function passing the data here
      })
      .catch((error) => {
        console.error("There was a problem with your fetch operation:", error);
        setIsChartDataLoading(false);
      });
  }

  // Call the function to execute the GET request
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Container>
      <FormContainer>
        <Header>Rating System</Header>
        <form onSubmit={handleSubmit}>
          {Object.keys(ratings).map((parameter) => (
            <div key={parameter} style={{ marginBottom: "20px" }}>
              {" "}
              {/* Add margin bottom here */}
              <Label htmlFor={parameter}>{parameter}</Label>
              <Slider
                id={parameter}
                value={ratings[parameter]}
                onChange={(value) => handleChange(value, parameter)}
              />
            </div>
          ))}
          <ButtonContainer>
            <SubmitButton type="submit">Submit</SubmitButton>{" "}
            {/* Styled SubmitButton */}
          </ButtonContainer>
        </form>
      </FormContainer>
      <ChartContainer>
        <ScatterChart
          chartData={chartData}
          isSubmitting={isSubmitting}
          isChartDataLoading={isChartDataLoading}
        />
      </ChartContainer>
    </Container>
  );
};

export default ScaleForm;
