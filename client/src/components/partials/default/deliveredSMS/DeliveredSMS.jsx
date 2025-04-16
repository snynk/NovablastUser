import React from "react";
import { CardTitle } from "reactstrap";
import { Icon, TooltipComponent } from "@/components/Component";
import { BarChart } from "@/components/partials/charts/default/Charts";

const DeliveredSMS = () => {
  return (
    <React.Fragment>
      {" "}
      <div className="card-title-group align-start mb-2">
        <CardTitle>
          <h6 className="title">Delivered SMS</h6>
        </CardTitle>
        <div className="card-tools">
          <TooltipComponent
            icon="calendar"
            iconClass="card-hint"
            direction="left"
            id="Tooltip-3"
            text="Daily Avg. subscription"
          />
        </div>
      </div>
      <div className="align-end flex-sm-wrap g-4 flex-md-nowrap">
        <div className="nk-sale-data">
          <span className="amount">0</span>
          <span className="sub-title">
            <span className="change up text-success">
              <Icon name="arrow-long-up" />
              2.45%
            </span>
            Completed Campaign
          </span>
        </div>
        <div className="nk-sales-ck">
          <BarChart />
        </div>
      </div>
    </React.Fragment>
  );
};
export default DeliveredSMS;
