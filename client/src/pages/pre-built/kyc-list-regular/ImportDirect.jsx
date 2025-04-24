import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Row, Col, Button, Block, BlockHead, BlockBetween, BlockHeadContent, BlockTitle } from "@/components/Component";
import "@/assets/css/contacts.css";
import Papa from "papaparse";

const ImportContacts = () => {
  const navigate = useNavigate();
  const [fileSelected, setFileSelected] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [entries, setEntries] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [mappedFields, setMappedFields] = useState({});
  const [importing, setImporting] = useState(false); 
  const [importComplete, setImportComplete] = useState(false);
  const requiredFields = [
    "FirstName", "LastName", "City", "State", "Zip","Address", "PropertyAddress", 
    "PropertyCity", "PropertyState", "PropertyZip", "Phone1", "Phone2","Phone3"
  ]; // Required database fields
  const [sampleName, setSampleName] = useState(""); // State to store CSV file name
  const [selectedFileName, setSelectedFileName] = useState(""); // Track uploaded file name  
const handleFileChange = (e) => {
  const file = e.target.files[0];
  if (file) {
    // Extract the file name without the extension
    const fileName = file.name.split(".")[0];
    setSampleName(fileName); // Store file name in state
    setSelectedFileName(file.name); // Store file name to display
    setFileSelected(true); // Enable "NEXT" button

    Papa.parse(file, {
      header: true, // Extract headers
      skipEmptyLines: true,
      complete: (results) => {
        const parsedData = results.data;
        setEntries(parsedData); // Store parsed rows
        setHeaders(Object.keys(parsedData[0])); // Extract headers dynamically
        setFileSelected(true);
      },
      error: (error) => {
        console.error("Error Parsing CSV:", error);
      },
    });
  }
};

const handleDragOver = (e) => {
  e.preventDefault(); // Prevent default browser behavior
};

const handleDrop = (e) => {
  e.preventDefault();
  const file = e.dataTransfer.files[0]; // Get the dropped file
  if (file) {
    setSelectedFileName(file.name); // Show file name
    setFileSelected(true); // Enable "NEXT" button
    handleFileChange({ target: { files: [file] } }); // Pass the file to the input handler
  }
};


  const handleFieldMapping = (header, field) => {
    setMappedFields((prev) => ({ ...prev, [header]: field }));
  };

  const handleNextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };
const handleImport = () => {
    setImporting(true);
  
    // Prepare the mapped data for submission
    const mappedData = entries.map((entry) => {
      const contact = {};
      requiredFields.forEach((field) => {
        const selectedHeader = mappedFields[field];
        contact[field] = selectedHeader ? entry[selectedHeader] : ""; // Assign values based on selected headers
      });
      return contact;
    });
  
    // Send the data to the backend
    fetch("http://localhost:3000/api/contacts/import", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ sampleName, contacts: mappedData }), // Include SampleName in request body
    })
      // .then((response) => response.json())
      // .then(() => {
      //   setImporting(false);
      //   setImportComplete(true);
      // })
      .then(async (response) => {
        const result = await response.json(); // ✅ Store response properly
        if (response.ok) {
          setImportComplete(true); // ✅ Show success message
          setTimeout(() => {
            navigate("/contact-list"); // ✅ Auto-redirect after 2 seconds
          }, 2000);
        } else {
          console.error("Import failed:", result.error);
        }
      })
      .catch((error) => {
        console.error("Import Error:", error);
        setImporting(false);
      });
  };
  
  

  const resetImport = () => {
    setCurrentStep(1);
    setFileSelected(false);
    setImportComplete(false);
    setEntries([]);
    setMappedFields({});
  };

  return (
    <>
     <div style={{ marginTop: "100px" }}>
  <BlockHead size="lg">
    <BlockBetween>
      <BlockHeadContent>
        <h1 style={{fontSize: '2rem', fontWeight: 700, color: '#0f172a', margin: ' 0 20px 10px'}}>Import Contacts</h1>
      </BlockHeadContent>
      <BlockHeadContent>
  <div className="toggle-wrap nk-block-tools-toggle">
    <Button
      color="primary"
      className="btn-icon btn-download"
      onClick={() => window.location.href = "/sample.csv"} // Trigger file download
    >
      <span className="icon-wrap">
        <em className="icon ni ni-download-cloud"></em>
      </span>
      <span>DOWNLOAD CSV FILE</span>
    </Button>
  </div>
</BlockHeadContent>
    </BlockBetween>
  </BlockHead>
</div>


      <Block>
        <div className="card">
          <div className="card-inner">
            <div className="nk-stepper">
              <div className="nk-stepper-head mb-4">
                <div className="nk-stepper-progress">
                  <div className={`step-item ${currentStep > 1 ? "completed" : currentStep === 1 ? "active current" : ""}`}>
                    <div className="step-icon">
                      <em className="icon ni ni-file"></em>
                    </div>
                    <div className="step-text">Upload File</div>
                  </div>
                  <div className="step-line"></div>
                  <div className={`step-item ${currentStep > 2 ? "completed" : currentStep === 2 ? "active current" : ""}`}>
                    <div className="step-icon">
                      <em className="icon ni ni-file-text"></em>
                    </div>
                    <div className="step-text">Spreadsheet Details</div>
                  </div>
                  <div className="step-line"></div>
                  <div className={`step-item ${currentStep === 3 ? "active current" : ""}`}>
                    <div className="step-icon">
                      <em className="icon ni ni-check-circle"></em>
                    </div>
                    <div className="step-text">Confirm</div>
                  </div>
                </div>
              </div>

              <div className="nk-stepper-content">
                {/* Step 1: Upload File */}
                <div className={`step-content ${currentStep === 1 ? "active" : ""}`}>
                  
                  
        <div className="nk-upload-form">
    <h5 className="title mb-3">
      Upload File <span className="text-danger">(*Please select a CSV file)</span>
    </h5>

    <Row className="g-3 pt-4">
      {/* Full-width Drag & Drop Zone */}
      <Col md="12">
        <div
          className="upload-zone"
          onClick={() => document.getElementById("customFile").click()} // Clicking opens file picker
          onDragOver={handleDragOver} // Allow dragging over the area
          onDrop={handleDrop} // Handle file drop
        >
          <div className="dz-message">
            <span className="dz-message-text">
              {selectedFileName ? `Selected File: ${selectedFileName}` : "Drag & drop files here or click to upload..."}
            </span>
          </div>
        </div>
      </Col>

      {/* File Input (Visible & Functional) */}
      <Col md="12">
        <div className="form-control-wrap">
          <div className="form-file">
            <input
              type="file"
              className="form-file-input"
              id="customFile"
              accept=".csv"
              onChange={handleFileChange}
            />
            <label className="form-file-label" htmlFor="customFile"></label>
          </div>
        </div>
      </Col>
    </Row>

    {/* NEXT Button */}
    <div className="nk-stepper-footer pt-4">
      <div className="form-group text-center">
        <Button
          className="btn-next1"
          color="primary"
        
          disabled={!fileSelected} // Disabled until a file is selected
          onClick={handleNextStep}
        >
          NEXT
        </Button>
      </div>
    </div>
  </div>
                </div>

                {/* Step 2: Spreadsheet Details */}
                <div className={`step-content ${currentStep === 2 ? "active" : ""}`}>
  <div className="nk-upload-form">
    <h5 className="title mb-4">Spreadsheet Details</h5>

    {headers.length > 0 && (
      <div className="field-mapping-section">
        {requiredFields.reduce((rows, field, index) => {
          if (index % 2 === 0) {
            // Create a new row for every two selects
            rows.push([]);
          }
          rows[rows.length - 1].push(field);
          return rows;
        }, []).map((row, rowIndex) => (
          <Row key={rowIndex} className="g-3 mb-4">
            {row.map((field, colIndex) => (
              <Col md="6" key={colIndex}>
                <div className="form-group">
                  <label className="form-label">{field}</label>
                  <div className="form-control-wrap">
                    <select
                      className="form-control"
                      onChange={(e) => handleFieldMapping(field, e.target.value)}
                      value={mappedFields[field] || ""}
                    >
                      <option value="">Select Column</option>
                      {headers
                        .filter(
                          (header) =>
                            !Object.values(mappedFields).includes(header) || mappedFields[field] === header
                        ) // Filter out already selected headers
                        .map((header, i) => (
                          <option key={i} value={header}>
                            {header}
                          </option>
                        ))}
                    </select>
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        ))}
      </div>
    )}

    <h5 className="title mb-3">Current Sheet Details</h5>

    <div className="table-responsive">
      <table className="table table-bordered">
        <thead>
          <tr>
            {requiredFields.map((field, index) => (
              <th key={index}>{field}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {entries.map((entry, index) => (
            <tr key={index}>
              {requiredFields.map((field, i) => (
                <td key={i}>{entry[mappedFields[field]] || ""}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    <div className="nk-stepper-footer pt-4">
      <Row>
        <Col xs="6" className="text-left">
          <Button color="secondary" className="btn-previous" onClick={handlePrevious}>
            Previous
          </Button>
        </Col>
        <Col xs="6" className="text-right">
          <Button color="primary" className="btn-next" onClick={handleNextStep}>
            Next Step
          </Button>
        </Col>
      </Row>
    </div>
  </div>
</div>



                {/* Step 3: Confirm */}
                <div className={`step-content ${currentStep === 3 ? "active" : ""}`}>
  <div className="nk-upload-form">
    {!importComplete ? (
      <>
        <div className="text-center mb-5">
          <h5 className="title mb-4">Confirm Import</h5>
          <div className="nk-modal-head mb-3">
            <h4 className="nk-modal-title title">Ready to Import</h4>
          </div>
          <div className="nk-modal-text">
            <p className="lead">
              You are about to import <strong>{entries.length}</strong> contact(s) to your database. Please confirm to proceed.
            </p>
            <div className="my-4">
              <div className="row justify-content-center">
                <div className="col-xl-8">
                  <ul className="list-group">
                    <li className="list-group-item d-flex justify-content-between align-items-center">
                      <span>Total Records</span>
                      <span>{entries.length}</span>
                    </li>
                    <li className="list-group-item d-flex justify-content-between align-items-center">
                      <span>Mapped Fields</span>
                      <span>{Object.keys(mappedFields).length}</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="alert alert-info">
              <div className="alert-icon">
                <em className="icon ni ni-info-fill"></em>
              </div>
              <div className="alert-text">
                <p>
                  Once you confirm, the import process will begin. This may take a few moments depending on the size of your file.
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="nk-stepper-footer pt-4">
          <Row>
            <Col xs="6" className="text-left">
              <Button color="secondary" className="btn-previous" onClick={handlePrevious}>
                Previous
              </Button>
            </Col>
            <Col xs="6" className="text-right">
              <Button
                color="primary"
                className="btn-import"
                disabled={importing}
                onClick={handleImport}
              >
                {importing ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-1"
                      role="status"
                      aria-hidden="true"
                    ></span>
                    Importing...
                  </>
                ) : (
                  "Confirm Import"
                )}
              </Button>
            </Col>
          </Row>
        </div>
      </>
    ) : (
      <div className="text-center">
        <div className="nk-modal-head mb-4">
          <div className="nk-modal-icon icon-circle icon-circle-xxl bg-success">
            <em className="icon ni ni-check-circle-fill fs-5x text-white"></em>
          </div>
        </div>
        <div className="nk-modal-text mb-5">
          <h4 className="title mb-3">Import Successful!</h4>
          <p className="text-soft">
            Your contacts have been successfully imported into the database.
          </p>
          <ul className="list-group mt-4">
            <li className="list-group-item d-flex justify-content-between align-items-center">
              <span>Total Records Processed</span>
              <span>{entries.length}</span>
            </li>
            <li className="list-group-item d-flex justify-content-between align-items-center">
              <span>Successfully Imported</span>
              <span className="text-success">{entries.length}</span>
            </li>
            <li className="list-group-item d-flex justify-content-between align-items-center">
              <span>Failed Records</span>
              <span className="text-danger">0</span>
            </li>
          </ul>
        </div>
        <div className="nk-modal-action">
          <Button color="primary" onClick={resetImport}>
            Import Another File
          </Button>
          <Button color="secondary" className="ms-2">
            View Contacts
          </Button>
        </div>
      </div>
    )}
  </div>
</div>

              </div>
            </div>
          </div>
        </div>
      </Block>
    </>
  );
};

export default ImportContacts;