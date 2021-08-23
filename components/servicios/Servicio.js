import { Col, Row } from "antd";
import React from "react";
import ServicioRead from "./ServicioRead";
import ServicioCreate from "./ServicioCreate";
import ServicioDelete from "./ServicioDelete";
import ServicioUpdate from "./ServicioUpdate";

const Material = ({ menu }) => {
  return (
    <div>
      <Row align="middle" style={{ height: "100%" }}>
        <Col span={1} />
        <Col span={22}>
          {menu === "31" ? <ServicioRead /> : null}
          {menu === "32" ? <ServicioCreate /> : null}
          {menu === "33" ? <ServicioUpdate /> : null}
          {menu === "34" ? <ServicioDelete /> : null}
        </Col>
        <Col span={1} />
      </Row>
    </div>
  );
};

export default Material;
