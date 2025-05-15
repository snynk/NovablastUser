
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
    "FirstName", "LastName", "City", "State", "Zip", "Address", 
    "PropertyAddress", "PropertyCity", "PropertyState", "PropertyZip", 
    "Phone1", "Phone2", "Phone3"
  ];
  const [sampleName, setSampleName] = useState("");
  const [selectedFileName, setSelectedFileName] = useState("");

  // New function for auto-filling field mappings
  const handleAutoFill = () => {
    const autoMappedFields = {};
    
    // Define common CSV header variations
    const headerMappings = {
      "FirstName": ["firstname", "first name", "first_name", "fname"],
      "LastName": ["lastname", "last name", "last_name", "lname"],
      "City": ["city", "town"],
      "State": ["state", "st"],
      "Zip": ["zip", "zipcode", "postal code", "postalcode"],
      "Address": ["address", "street", "streetaddress"],
      "PropertyAddress": ["property address", "propertyaddress"],
      "PropertyCity": ["property city", "propertycity"],
      "PropertyState": ["property state", "propertystate"],
      "PropertyZip": ["property zip", "propertyzip"],
      "Phone1": ["phone", "phone1", "primaryphone", "primary phone"],
      "Phone2": ["phone2", "secondary phone", "secondaryphone"],
      "Phone3": ["phone3", "alternate phone", "alternatephone"]
    };

    // Try to match headers case-insensitively
    requiredFields.forEach(field => {
      const possibleMatches = headerMappings[field];
      const matchedHeader = headers.find(header => 
        possibleMatches.some(match => 
          header.toLowerCase().replace(/[_\s]/g, '') === match
        )
      );
      
      if (matchedHeader) {
        autoMappedFields[field] = matchedHeader;
      }
    });

    // Update mapped fields state
    setMappedFields(autoMappedFields);
  };

  // New function to clear all field mappings
  const handleClearMapping = () => {
    setMappedFields({});
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const fileName = file.name.split(".")[0];
      setSampleName(fileName);
      setSelectedFileName(file.name);
      setFileSelected(true);

      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          const parsedData = results.data;
          setEntries(parsedData);
          setHeaders(Object.keys(parsedData[0]));
          setFileSelected(true);
        },
        error: (error) => {
          console.error("Error Parsing CSV:", error);
        },
      });
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      setSelectedFileName(file.name);
      setFileSelected(true);
      handleFileChange({ target: { files: [file] } });
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
  
    const mappedData = entries.map((entry) => {
      const contact = {};
      requiredFields.forEach((field) => {
        const selectedHeader = mappedFields[field];
        contact[field] = selectedHeader ? entry[selectedHeader] : "";
      });
      return contact;
    });
  
    fetch("http://localhost:3000/api/contacts/import", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ sampleName, contacts: mappedData }),
    })
      .then(async (response) => {
        const result = await response.json();
        if (response.ok) {
          setImportComplete(true);
          setTimeout(() => {
            navigate("/contact-list");
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
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
    <h1 
      className="dashboard-title" 
      style={{ fontSize: '2rem', fontWeight: 700, color: '#0f172a', margin: '0 20px 10px' }}
    >
      Import Contacts
    </h1>
    <div 
      style={{ 
        height: '4px', 
        width: '140px', 
        backgroundColor: '#22c55e',
        borderRadius: '9999px', 
        marginLeft: '20px'
      }} 
    />
  </div>
</BlockHeadContent>

      <BlockHeadContent>
  <div className="toggle-wrap nk-block-tools-toggle">
    <Button
      color="primary"
      className="btn-icon btn-download"
      onClick={() => window.location.href = "/sample.csv"}
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
                      <Col md="12">
                        <div
                          className="upload-zone"
                          onClick={() => document.getElementById("customFile").click()}
                          onDragOver={handleDragOver}
                          onDrop={handleDrop}
                        >
                          <div className="dz-message">
                            <span className="dz-message-text">
                              {selectedFileName ? `Selected File: ${selectedFileName}` : "Drag & drop files here or click to upload..."}
                            </span>
                          </div>
                        </div>
                      </Col>

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

                    <div className="nk-stepper-footer pt-4">
                      <div className="form-group2 text-center">
                        <Button
                          className="btn-next6"
                          color="primary"
                          disabled={!fileSelected}
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
                  <div className="nk-upload-form" style={{ position: "relative" }}>
                    <div className="d-flex justify-content-between align-items-center mb-4" style={{ background: "#fff", zIndex: "10", padding: "10px 0" }}>
                      <h5 className="title mb-0">Spreadsheet Details</h5>
                      <div className="button-group">
                        {headers.length > 0 && (
                          <Button 
                            color="primary" 
                            outline 
                            onClick={handleAutoFill}
                            className="btn-sm me-2"
                          >
                            Auto Fill Mapping
                          </Button>
                        )}
                        {Object.keys(mappedFields).length > 0 && (
                          <Button 
                            color="secondary" 
                            outline 
                            onClick={handleClearMapping}
                            className="btn-sm"
                          >
                            Clear Mapping
                          </Button>
                        )}
                      </div>
                    </div>

                    {/* Field mapping section with fixed height and scrolling */}
                    <div style={{ height: "300px", overflowY: "auto", marginBottom: "20px" }}>
                      {headers.length > 0 && (
                        <div className="field-mapping-section" style={{ paddingRight: "10px" }}>
                          {requiredFields.reduce((rows, field, index) => {
                            if (index % 2 === 0) {
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
                                          )
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
                    </div>
                    
                    {/* Table section outside the field mapping with separate scrolling */}
                    <div style={{ marginTop: "30px", borderTop: "1px solid #e5e9f2", paddingTop: "20px" }}>
                      <h5 className="title mb-3">Current Sheet Details</h5>
                      
                      <div className="table-responsive" style={{ height: "150px", overflowY: "auto", marginBottom: "20px", border: "1px solid #e5e9f2", borderRadius: "4px" }}>
                        <table className="table table-bordered" style={{ marginBottom: "0" }}>
                          <thead style={{ position: "sticky", top: "0", background: "#f5f6fa", zIndex: "5" }}>
                            <tr>
                              {requiredFields.map((field, index) => (
                                <th key={index} style={{ whiteSpace: "nowrap" }}>{field}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {entries.slice(0, 5).map((entry, index) => (
                              <tr key={index}>
                                {requiredFields.map((field, i) => (
                                  <td key={i}>{entry[mappedFields[field]] || ""}</td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    <div className="nk-stepper-footer pt-4" style={{ background: "#fff", padding: "15px 0", borderTop: "1px solid #e5e9f2" }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Button color="secondary" onClick={handlePrevious}>
                          Previous
                        </Button>
                        <Button 
                          color="primary" 
                          onClick={handleNextStep}
                          disabled={Object.keys(mappedFields).length < requiredFields.length}
                        >
                          Next Step
                        </Button>
                      </div>
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