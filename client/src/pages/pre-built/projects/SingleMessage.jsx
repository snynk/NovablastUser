import React, { useState } from "react";
import Head from "@/layout/head/Head";
import Content from "@/layout/content/Content";
import {
  DropdownMenu,
  DropdownToggle,
  UncontrolledDropdown,
  Progress,
  DropdownItem,
  Badge,
  FormGroup,
  Input,

} from "reactstrap";
import {
  Block,
  BlockHead,
  BlockBetween,
  BlockHeadContent,
  BlockTitle,
  BlockDes,
  Icon,
  Button,
  UserAvatar,
  PaginationComponent,
  DataTable,
  DataTableBody,
  DataTableHead,
  DataTableRow,
  DataTableItem,
} from "@/components/Component";
import { projectData } from "./ProjectData";
import { findUpper, setDeadline, setDeadlineDays, calcPercentage } from "@/utils/Utils";
import FormModal from "./FormModal";
import { FaPaperPlane } from "react-icons/fa"; // Import icons

export const SingleMessage = () => {


  return <>
    <Head title="Single Message"></Head>
    <Content>
      <BlockHead size="sm">
        <BlockBetween>
          <BlockHeadContent>
            <BlockTitle page> Send Single SMS</BlockTitle>
            <p>Compose and send a <code>single SMS</code> message.</p>
            </BlockHeadContent>
        
        </BlockBetween>
      </BlockHead>
      <Block>
          <FormGroup>
            <label>Recipient Number</label>
            <Input
              type="text"
              placeholder="Enter recipient number"
            />
          </FormGroup>

          <FormGroup>
            <label>Sender Number</label>
            <Input
              type="select"
              
            >
              <option value="">Select a number</option>
              <option value="+1234567890">+1234567890</option>
              <option value="+1987654321">+1987654321</option>
              <option value="+1122334455">+1122334455</option>
              <option value="+5566778899">+5566778899</option>
            </Input>
          </FormGroup>
         

          <FormGroup>
            <label>Message</label>
            <Input
              type="textarea"
             
              placeholder="Type your message here"
            />
          </FormGroup>

          <Button color="primary">
          <FaPaperPlane style={{ marginRight: "8px" }} />
            Send Messages
          </Button>
        </Block>
      
      </Content>
  </>;
};

export default SingleMessage;
