import React, { useState, useEffect } from "react";
import axios from "axios";
import Head from "@/layout/head/Head";
import Content from "@/layout/content/Content";
import {
  Block,
  BlockHead,
  BlockBetween,
  BlockHeadContent,
  BlockTitle,
  PreviewCard,
  ReactDataTable
} from "@/components/Component";
import { Badge, UncontrolledDropdown } from "reactstrap";
import { FaEdit, FaTrashAlt, FaEye } from "react-icons/fa"; // Import icons
import Swal from "sweetalert2"; // ✅ Import SweetAlert2

const ProjectCardPage = () => {
  const [campaigns, setCampaigns] = useState([]);

  useEffect(() => {
    // Fetch campaigns data from the API
    const fetchCampaigns = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/campaigns");
        console.log(response.data); // Ensure that the data is being logged correctly
        setCampaigns(response.data);
      } catch (error) {
        console.error("Error fetching campaigns:", error);
      }
    };
    fetchCampaigns();
  }, []);

  // Columns definition for the DataTable
  const dataTableColumns = [
    {
      name: "#",
      selector: (row) => row._id.slice(-4), // Show short ID
      sortable: false,
    },
    {
      name: "Title",
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: "Date",
      selector: (row) => row.createdAt,
      sortable: true,
    },
    {
      name: "Status",
      selector: (row) => row.status,
      sortable: true,
      cell: (row) => (
        <Badge
          color={
            row.status === "active"
              ? "success"
              : row.status === "inactive"
              ? "danger"
              : "warning"
          }
          pill
        >
          {row.status.charAt(0).toUpperCase() + row.status.slice(1)}
        </Badge>
      ),
    },
    {
      name: "Action",
      selector: (row) => row.action,
      sortable: false,
      cell: (row) => (
        <UncontrolledDropdown>
          <FaEye className="me-2 text-primary" />
          <FaTrashAlt
            color="red"
            className="eg-swal-av3"
            onClick={() => handleDelete(row._id)}
          />
        </UncontrolledDropdown>
      ),
    },
  ];
  

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        axios.delete(`http://localhost:3000/api/campaigns/${id}`).then(() => {
          Swal.fire("Deleted!", "Your campaign has been deleted.", "success");
          setCampaigns(campaigns.filter(campaign => campaign._id !== id));
        });
      }
    });
  };

  return (
    <>
      <Head title="Campaign Report"></Head>
      <Content>
        <BlockHead size="sm">
          <BlockBetween>
            <BlockHeadContent>
              <BlockTitle tag="h4">Campaign Reports</BlockTitle>
              <p>List of all the campaigns from your account</p>
            </BlockHeadContent>
          </BlockBetween>
        </BlockHead>

        <PreviewCard>
          {campaigns.length > 0 ? (
            <ReactDataTable
              data={campaigns}  // Ensure that campaigns state is passed here
              columns={dataTableColumns}
              expandableRows
              pagination
              actions
              keyField="_id"  // Unique identifier for rows
            />
          ) : (
            <p>Loading campaigns...</p>  // Display loading message while fetching data
          )}
        </PreviewCard>
      </Content>
    </>
  );
};

export default ProjectCardPage;
