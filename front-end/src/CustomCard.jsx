import React from 'react';

import {
  Card, CardBody, CardTitle, CardFooter,
  Row, Col
} from "reactstrap";

import { Link } from "react-router-dom";

const CustomCard = (props) => {
  return (
    <Card className="card-stats"> <CardBody><Row>
      <Col md="4" xs="5">
        <span style={{color:props.color}}> <i className={props.icon}/></span>
      </Col>
      <Col md="8" xs="7">
        <div className="numbers">
          <p className="card-category">{props.heading}</p> 
          <CardTitle tag="p">{props.count}</CardTitle>
        </div>
      </Col>
      </Row></CardBody>
      
    </Card>
  );
}

export default CustomCard;
