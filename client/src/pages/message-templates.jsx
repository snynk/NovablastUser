import React, { useState, useEffect } from "react";
import Content from "@/layout/content/Content";
import Head from "@/layout/head/Head";
import { Block, BlockHead, BlockHeadContent, BlockTitle, BlockDes, Button } from "@/components/Component";
import { FormGroup, Label, Input } from "reactstrap";
import Select from "react-select";
import { FaPaperPlane } from "react-icons/fa";

// Sample SMS Templates
const smsTemplates = [
  { value: "promo_discount", label: "Promo: Get 20% Off Today!" },
  { value: "account_update", label: "Your Account Has Been Updated" },
  { value: "event_invite", label: "You're Invited to Our Special Event" },
  { value: "reminder", label: "Payment Reminder: Due Date Approaching" },
  { value: "welcome_message", label: "Welcome to Our Service!" },
  { value: "verification_code", label: "Your Verification Code is 123456" },
  { value: "thank_you", label: "Thank You for Your Purchase" },
  { value: "survey_request", label: "We Value Your Feedback" },
  { value: "holiday_offer", label: "Exclusive Holiday Offer Inside" },
  { value: "shipping_update", label: "Your Order Has Shipped" },
];

// List of Time Zones
const timeZones = [
  "UTC", "GMT", "EST", "PST", "CST", "MST", "IST", "CET", "JST", "AEST",
  "ACDT", "AEDT", "AKST", "AST", "AWST", "AZT", "BST", "CDT", "CEST", "EAT",
  "HST", "KST", "MSK", "NST", "PKT", "SGT", "UTC+1", "UTC+2", "UTC+3",
  "UTC+4", "UTC+5", "UTC+6", "UTC+7", "UTC+8", "UTC+9", "UTC+10", "UTC+11", "UTC+12",
  "UTC-1", "UTC-2", "UTC-3", "UTC-4", "UTC-5", "UTC-6", "UTC-7", "UTC-8", "UTC-9", "UTC-10"
];

const BulkMessage = () => {
  const [formData, setFormData] = useState({
    campaignTitle: "",
    senderIdType: "Local",
    group: "Group 1",
    smsTemplate: null,
    dateTime: new Date().toISOString().slice(0, 16), // Default current date-time
    timeZone: "UTC", // Default TimeZone
  });

  // Update Date-Time when TimeZone changes
  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      const options = { timeZone: formData.timeZone, timeZoneName: "short" };
      const formatter = new Intl.DateTimeFormat("en-US", options);
      const formattedDate = formatter.format(now);
      const updatedDate = new Date(formattedDate);
      setFormData((prev) => ({
        ...prev,
        dateTime: updatedDate.toISOString().slice(0, 16),
      }));
    };

    updateDateTime(); // Initial update
    const interval = setInterval(updateDateTime, 60000); // Update every minute

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, [formData.timeZone]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleTemplateChange = (selectedOption) => {
    setFormData({ ...formData, smsTemplate: selectedOption });
  };

  const handleSendNow = () => {
    console.log("Sending SMS with data:", formData);
    alert("SMS Sent Successfully!");
  };

  return (
    <>
      <Head title="Bulk Message" />
      <Content>
        <BlockHead size="sm">
          <BlockHeadContent>
            <BlockTitle page>Bulk Message</BlockTitle>
            <BlockDes className="text-soft">
              <p>Compose your SMS and send or receive it.</p>
            </BlockDes>
          </BlockHeadContent>
        </BlockHead>

        <div className="block">
          <form>
            <FormGroup>
              <Label for="campaignTitle">Campaign Title</Label>
              <Input
                type="text"
                name="campaignTitle"
                id="campaignTitle"
                placeholder="Enter Campaign Title"
                value={formData.campaignTitle}
                onChange={handleChange}
              />
            </FormGroup>

            <FormGroup>
              <Label for="senderIdType">Sender ID Type</Label>
              <Input
                type="select"
                name="senderIdType"
                id="senderIdType"
                value={formData.senderIdType}
                onChange={handleChange}
              >
                <option value="Local">Local</option>
                <option value="Toll-Free">Toll-Free</option>
              </Input>
            </FormGroup>

            <FormGroup>
              <Label for="group">Group</Label>
              <Input
                type="select"
                name="group"
                id="group"
                value={formData.group}
                onChange={handleChange}
              >
                {["Group 1", "Group 2", "Group 3", "Group 4", "Group 5", "Group 6", "Group 7", "Group 8", "Group 9", "Group 10"].map((group) => (
                  <option key={group} value={group}>
                    {group}
                  </option>
                ))}
              </Input>
            </FormGroup>

            <FormGroup>
              <Label for="smsTemplate">SMS Template</Label>
              <Select
                options={smsTemplates}
                value={formData.smsTemplate}
                onChange={handleTemplateChange}
                placeholder="Select SMS Template"
                isClearable
              />
            </FormGroup>

            <FormGroup>
              <Label for="dateTime">Date and Time</Label>
              <Input
                type="datetime-local"
                name="dateTime"
                id="dateTime"
                value={formData.dateTime}
                onChange={handleChange}
              />
            </FormGroup>

            <FormGroup>
              <Label for="timeZone">TimeZone</Label>
              <Input
                type="select"
                name="timeZone"
                id="timeZone"
                value={formData.timeZone}
                onChange={handleChange}
              >
                {timeZones.map((zone) => (
                  <option key={zone} value={zone}>
                    {zone}
                  </option>
                ))}
              </Input>
            </FormGroup>

            <Button color="primary" onClick={handleSendNow}>
              <FaPaperPlane style={{ marginRight: "8px" }} />
              Send Now
            </Button>
          </form>
        </div>
      </Content>
    </>
  );
};

export default BulkMessage;
