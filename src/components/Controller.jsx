import React from "react";
import { Select, Switch } from "antd";

const Controller = ({ models, setModel, toggle, setToggle, play, setPlay }) => {
  const onChange = (checked) => {
    setToggle(checked);
  };

  const handleChange = (value) => {
    setModel(value);
  };

  const handlePlay = (checked) => {
    setPlay(checked);
  };

  return (
    <div className="flex items-center p-5 gap-2">
      <div className="controls">
        <div className="flex items-center gap-5">
          <label>Product:</label>
          <Select
            defaultValue={models[0].name}
            style={{
              width: 120,
            }}
            onChange={handleChange}
            options={models.map((item) => {
              return {
                value: item.src,
                label: item.name,
              };
            })}
          />
        </div>
        <div className="flex items-center gap-5 mt-5">
          <label style={{ width: "140px" }}>Show dimensions:</label>
          <Switch
            style={{ backgroundColor: "#3578EA" }}
            onChange={onChange}
            defaultChecked={toggle}
          />
        </div>
        <div className="flex items-center gap-5 mt-5">
          <label style={{ width: "140px" }}>Play model:</label>
          <Switch
            style={{ backgroundColor: "#3578EA" }}
            onChange={handlePlay}
            defaultChecked={play}
          />
        </div>
      </div>
    </div>
  );
};

export default Controller;
