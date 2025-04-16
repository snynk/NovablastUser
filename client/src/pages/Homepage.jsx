import React, { useState } from "react";
import Head from "@/layout/head/Head";
import Content from "@/layout/content/Content";
import SentSMS from "@/components/partials/default/sentSMS/SentSMS";
import DeliveredSMS from "@/components/partials/default/deliveredSMS/DeliveredSMS";
import FailedSMS from "@/components/partials/default/failedSMS/FailedSMS";
import QueuedSMS from "@/components/partials/default/queuedSMS/QueuedSMS";
import SalesOverview from "@/components/partials/default/sales-overview/SalesOverview";
import { Row, Col } from "reactstrap";
import 'bootstrap-icons/font/bootstrap-icons.css';
import {
  Block,
  BlockDes,
  BlockHead,
  BlockHeadContent,
  BlockTitle,
  BlockBetween,
} from "@/components/Component";

// Import the CSS file
import "@/assets/css/style.css";

// Create a custom card component with balloon animation
const BalloonCard = ({ children }) => {
  return (
    <div className="card-balloon">
      <div className="balloon-container">
        {/* Top balloons */}
        <div className="balloon balloon-top balloon-1"></div>
        <div className="balloon balloon-top balloon-2"></div>
        
        {/* Center balloons */}
        <div className="balloon balloon-center balloon-3"></div>
        
        {/* Bottom balloons */}
        <div className="balloon balloon-bottom balloon-4"></div>
        <div className="balloon balloon-bottom balloon-5"></div>
      </div>
      <div className="card-inner">{children}</div>
    </div>
  );
};

const Homepage = () => {
  const [sm, updateSm] = useState(false);

  return (
    <>
      <Head title="Homepage"></Head>
      <Content>
        <BlockHead size="sm">
          <BlockBetween>
            <BlockHeadContent>
              <BlockTitle page tag="h3">
                Dashboard
              </BlockTitle>
              <BlockDes className="text-soft">
                {/* <p>Welcome to Dashboard Template</p> */}
              </BlockDes>
            </BlockHeadContent>
          </BlockBetween>
        </BlockHead>
        
        <Block>
            <Row className="g-3"> {/* Spacing between cards */}
              {/* First Row with 4 Cards */}
            {/* First Row with 4 Cards */}
        <Col xs="12" sm="6" md="4" lg="3" xxl="3">
          <BalloonCard>
            <SentSMS />
          </BalloonCard>
        </Col>
        <Col xs="12" sm="6" md="4" lg="3" xxl="3">
          <BalloonCard>
            <DeliveredSMS />
          </BalloonCard>
        </Col>
        <Col xs="12" sm="6" md="4" lg="3" xxl="3">
          <BalloonCard>
            <FailedSMS />
          </BalloonCard>
        </Col>
        <Col xs="12" sm="6" md="4" lg="3" xxl="3">
          <BalloonCard>
            <QueuedSMS />
          </BalloonCard>
        </Col>

        {/* Center Report Section */}
        <Col xs="12">
          <div className="report-section mb-4">
            <div className="card">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h5 className="mb-0">Report</h5>
                  <div className="report-actions">
                    <i className="bi bi-chevron-left"></i>
                  </div>
                </div>
                <Row>
          <Col md="3">
            <div className="report-item">
              <div className="report-title">Published Campaign</div>
              <div className="report-value">
                <span>10</span><span className="text-muted ms-2">%</span>
              </div>
              <div className="progress-wrapper">
                <span className="type-ring danger"></span>
                <div className="progress-indicator danger"></div>
              </div>
            </div>
          </Col>

          <Col md="3">
            <div className="report-item">
              <div className="report-title">Completed Campaign</div>
              <div className="report-value">
                <span>15</span><span className="text-muted ms-2">%</span>
              </div>
              <div className="progress-wrapper">
                <span className="type-ring primary"></span>
                <div className="progress-indicator primary"></div> {/* CHANGED from danger to primary */}
              </div>
            </div>
          </Col>

          <Col md="3">
            <div className="report-item">
              <div className="report-title">Successful Sent</div>
              <div className="report-value">
                <span>100</span><span className="text-muted ms-2">%</span>
              </div>
              <div className="progress-wrapper">
                <span className="type-ring success"></span>
                <div className="progress-indicator success"></div> {/* CHANGED from danger to success */}
              </div>
            </div>
          </Col>

          <Col md="3">
            <div className="report-item">
              <div className="report-title">Failed SMS</div>
              <div className="report-value">
                <span>10</span><span className="text-muted ms-2">%</span>
              </div>
              <div className="progress-wrapper">
                <span className="type-ring danger"></span>
                <div className="progress-indicator danger"></div>
              </div>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  </div>
</Col>

{/* Chart Section */}
          <Col xs="12">
            <SalesOverview />
          </Col>
          </Row>
        </Block>
      </Content>
    </>
  );
};

export default Homepage;