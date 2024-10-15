import React, {useEffect, useState} from "react";
import {Card, Progress, Row} from "antd";

function App() {

  const [listening, setListening] = useState(false);
  const [data, setData] = useState({value: 0, target: 100});
  let eventSource = undefined;

  useEffect(() => {
    if (!listening) {
      eventSource = new EventSource("http://localhost:8080/service/buyer/supplier/rest/v1.0/run");

      eventSource.addEventListener("Progress", (event) => {
        const result = JSON.parse(event.data);
        console.log("received:", result);
        setData(result)
      });

      eventSource.onerror = (event) => {
        console.log(event.target.readyState)
        if (event.target.readyState === EventSource.CLOSED) {
          console.log('SSE closed (' + event.target.readyState + ')')
        }
        eventSource.close();
      }

      eventSource.onopen = (event) => {
        console.log("connection opened")
      }
      setListening(true);
    }
    return () => {
      eventSource.close();
      console.log("event closed")
    }

  }, [])

  return (

    <>
      <Card title="Progress Circle">
        <Row justify="center">
          <Progress type="circle" percent={data.value / data.target * 100}/>
        </Row>
      </Card>
      <Card title="Progress Line">
        <Row justify="center">
          <Progress percent={data.value / data.target * 100} />
        </Row>
      </Card>
    </>


  );
}
