import React from "react";
import ReactSlider from "react-slider";
import styled from "styled-components";

const StyledSlider = styled(ReactSlider)`
  width: 100%;
  height: 20px;
`;

const StyledThumb = styled.div`
  height: 20px;
  width: 20px;
  line-height: 20px;
  text-align: center;
  background-color: #333333; /* Darker thumb color */
  color: #ffffff;
  border: 2px solid #3498db;
  border-radius: 50%;
  cursor: grab;
  font-size: 12px;

  &:hover {
    background-color: #3498db;
    color: #ffffff;
  }
`;

const Thumb = (props, state) => (
  <StyledThumb {...props}>{state.valueNow}</StyledThumb>
);

const StyledTrack = styled.div`
  top: 0;
  bottom: 0;
  background: linear-gradient(
    to right,
    #b7d9ff,
    #b7d9ff
  ); /* Lighter track background color */
  border-radius: 999px;
`;

const Track = (props, state) => <StyledTrack {...props} index={state.index} />;

const Slider = ({ value, onChange }) => {
  return (
    <StyledSlider
      renderTrack={Track}
      renderThumb={Thumb}
      min={0}
      max={100}
      value={value}
      onChange={(value) => onChange(value)}
    />
  );
};

export default Slider;
