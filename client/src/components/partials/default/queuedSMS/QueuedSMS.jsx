import React from "react";
import { CardTitle } from "reactstrap";
import { Icon, TooltipComponent } from "@/components/Component";
import { BarChart } from "@/components/partials/charts/default/Charts";

const DeliveredSMS = () => {
  const data = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri"],
    datasets: [
      {
        label: "Delivered SMS",
        data: [100, 180, 150, 210, 190],
        backgroundColor: "#2196f3",
      },
    ],
  };

  return (
    <div>
      <div className="card-title-group align-start mb-2">
        <CardTitle><h6 className="title">Queued SMS
        </h6></CardTitle>
        <TooltipComponent
          icon="users"
          iconClass="card-hint"
          direction="left"
          id="Tooltip-3"
          text="Daily Delivered SMS"
        />
      </div>

      <div className="align-end flex-sm-wrap g-4 flex-md-nowrap">
        <div className="nk-sale-data">
          <span className="amount">0</span>
          <span className="sub-title">
            <span className="change up text-success">
              <Icon name="arrow-long-up" />
              2.45%
            </span>
            Failed SMS
          </span>
        </div>
        <div className="nk-sales-ck">
          <BarChart data={data} />
        </div>
      </div>
    </div>
  );
};

export default DeliveredSMS;
