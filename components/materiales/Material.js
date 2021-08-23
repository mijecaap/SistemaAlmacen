import { Col, Row } from "antd";
import React from "react";
import MaterialCreate from "./MaterialCreate";
import MaterialDelete from "./MaterialDelete";
import MaterialRead from "./MaterialRead";
import MaterialUpdate from "./MaterialUpdate";

const Material = ({ menu }) => {
  return (
    <div>
      <Row align="middle" style={{ height: "100%" }}>
        <Col span={1} />
        <Col span={22}>
          {menu === "21" ? <MaterialRead /> : null}
          {menu === "22" ? <MaterialCreate /> : null}
          {menu === "23" ? <MaterialUpdate /> : null}
          {menu === "24" ? <MaterialDelete /> : null}
        </Col>
        <Col span={1} />
      </Row>
    </div>
  );
};

export default Material;
