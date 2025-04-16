import React, { useState } from "react";
import { Row, Col, Button, Block, BlockHead, BlockBetween, BlockHeadContent, BlockTitle } from "@/components/Component";
import "@/assets/css/contacts.css";

const ImportContacts = () => {
  const [fileSelected, setFileSelected] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [entries, setEntries] = useState([
    {
      id: 0,
      title: "amirsfd",
      video_link: "https://www.youtube.com/watch?v=i32NHRtzgLin=FLb2CZ4bLzduS8u#QiuFMq-qLhb02&index=17",
      thumbnail_image: "pingme_facebook-messenger-android-application-package-mobile-app-instant-messaging-phones.png",
      created_at: "3/31/25",
      updated_at: "3/31/25"
    }
  ]);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [importing, setImporting] = useState(false);
  const [importComplete, setImportComplete] = useState(false);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setFileSelected(true);
    }
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
    // Simulate import process
    setTimeout(() => {
      setImporting(false);
      setImportComplete(true);
    }, 2000);
  };

  const resetImport = () => {
    setCurrentStep(1);
    setFileSelected(false);
    setImportComplete(false);
  };

  return (
    <>
      <BlockHead size="lg">
        <BlockBetween>
          <BlockHeadContent>
            <BlockTitle tag="h2" className="fw-normal">Import Contacts</BlockTitle>
            <p className="text-soft">Import bulk contacts into database</p>
          </BlockHeadContent>
          <BlockHeadContent>
            <div className="toggle-wrap nk-block-tools-toggle">
              <Button color="primary" className="btn-icon btn-download">
                <span className="icon-wrap">
                  <em className="icon ni ni-download-cloud"></em>
                </span>
                <span>DOWNLOAD CSV FILE</span>
              </Button>
            </div>
          </BlockHeadContent>
        </BlockBetween>
      </BlockHead>

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
                    <h5 className="title mb-3">Upload File <span className="text-danger">(*Please select CSV file)</span></h5>
                    <div className="upload-zone">
                      <div className="dz-message" data-dz-message>
                        <span className="dz-message-text">Drag & drop files here ...</span>
                      </div>
                    </div>
                    <Row className="g-3 pt-4">
                      <Col size="12">
                        <div className="form-control-wrap">
                          <div className="form-file">
                            <input 
                              type="file" 
                              className="form-file-input" 
                              id="customFile"
                              accept=".csv"
                              onChange={handleFileChange}
                            />
                            <label className="form-file-label" htmlFor="customFile">
                              {/* <span className="form-file-text">Select file...</span> */}
                              {/* <span className="form-file-button btn-browse">Browse...</span> */}
                            </label>
                          </div>
                        </div>
                      </Col>
                    </Row>
                  </div>
                  <div className="nk-stepper-footer pt-4">
                    <div className="form-group text-center">
                      <Button 
                        className="btn-next"
                        color="primary" 
                        disabled={!fileSelected}
                        onClick={handleNextStep}
                      >
                        NEXT
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Step 2: Spreadsheet Details */}
                <div className={`step-content ${currentStep === 2 ? "active" : ""}`}>
                  <div className="nk-upload-form">
                    <h5 className="title mb-4">Spreadsheet Details</h5>
                    
                    <Row className="g-4 mb-4">
                      <Col md="6">
                        <div className="form-group">
                          <label className="form-label" htmlFor="name">Name:</label>
                          <div className="form-control-wrap">
                            <div className="form-control-select">
                              <select className="form-control" id="name">
                                <option value="">Select value</option>
                                <option value="name">Name</option>
                                <option value="full_name">Full Name</option>
                              </select>
                              <div className="dropdown-indicator"></div>
                            </div>
                          </div>
                        </div>
                      </Col>
                      <Col md="6">
                        <div className="form-group">
                          <label className="form-label" htmlFor="mobile">Mobile Number:</label>
                          <div className="form-control-wrap">
                            <div className="form-control-select">
                              <select className="form-control" id="mobile">
                                <option value="">Select value</option>
                                <option value="phone">Phone</option>
                                <option value="mobile">Mobile</option>
                              </select>
                              <div className="dropdown-indicator"></div>
                            </div>
                          </div>
                        </div>
                      </Col>
                    </Row>

                    <Row className="g-4 mb-4">
                      <Col md="6">
                        <div className="form-group">
                          <label className="form-label" htmlFor="city">City:</label>
                          <div className="form-control-wrap">
                            <div className="form-control-select">
                              <select className="form-control" id="city">
                                <option value="">Select value</option>
                                <option value="city">City</option>
                                <option value="town">Town</option>
                              </select>
                              <div className="dropdown-indicator"></div>
                            </div>
                          </div>
                        </div>
                      </Col>
                      <Col md="6">
                        <div className="form-group">
                          <label className="form-label" htmlFor="address">Address:</label>
                          <div className="form-control-wrap">
                            <div className="form-control-select">
                              <select className="form-control" id="address">
                                <option value="">Select value</option>
                                <option value="address">Address</option>
                                <option value="street_address">Street Address</option>
                              </select>
                              <div className="dropdown-indicator"></div>
                            </div>
                          </div>
                        </div>
                      </Col>
                    </Row>

                    <Row className="g-4 mb-5">
                      <Col md="6">
                        <div className="form-group">
                          <label className="form-label" htmlFor="zipcode">Zip Code:</label>
                          <div className="form-control-wrap">
                            <div className="form-control-select">
                              <select className="form-control" id="zipcode">
                                <option value="">Select value</option>
                                <option value="zipcode">Zip Code</option>
                                <option value="postal_code">Postal Code</option>
                              </select>
                              <div className="dropdown-indicator"></div>
                            </div>
                          </div>
                        </div>
                      </Col>
                      <Col md="6">
                        <div className="form-group">
                          <label className="form-label" htmlFor="state">State:</label>
                          <div className="form-control-wrap">
                            <div className="form-control-select">
                              <select className="form-control" id="state">
                                <option value="">Select value</option>
                                <option value="state">State</option>
                                <option value="province">Province</option>
                              </select>
                              <div className="dropdown-indicator"></div>
                            </div>
                          </div>
                        </div>
                      </Col>
                    </Row>

                    <h5 className="title mb-3">Current Sheet Details</h5>
                    
                    <div className="mb-3 d-flex justify-content-between align-items-center">
                      <div className="dataTables_length">
                        <label>
                          <span className="d-none d-sm-inline-block">Show</span>
                          <div className="form-control-select">
                            <select 
                              className="custom-select form-select form-select-sm" 
                              onChange={(e) => setEntriesPerPage(Number(e.target.value))}
                              value={entriesPerPage}
                            >
                              <option value="10">10</option>
                              <option value="25">25</option>
                              <option value="50">50</option>
                              <option value="100">100</option>
                            </select>
                          </div>
                          <span className="d-none d-sm-inline-block">entries</span>
                        </label>
                      </div>
                      <div className="dataTables_filter">
                        <label>
                          <span>Search:</span>
                          <input 
                            type="search" 
                            className="form-control form-control-sm" 
                            placeholder="" 
                            onChange={(e) => setSearchTerm(e.target.value)}
                            value={searchTerm}
                          />
                        </label>
                      </div>
                    </div>

                    <div className="table-responsive">
                      <table className="table table-bordered">
                        <thead>
                          <tr>
                            <th>id</th>
                            <th>title</th>
                            <th>video_link</th>
                            <th>thumbnail_image</th>
                            <th>created_at</th>
                            <th>updated_at</th>
                          </tr>
                        </thead>
                        <tbody>
                          {entries.map((entry) => (
                            <tr key={entry.id}>
                              <td>{entry.id}</td>
                              <td>{entry.title}</td>
                              <td>{entry.video_link}</td>
                              <td>{entry.thumbnail_image}</td>
                              <td>{entry.created_at}</td>
                              <td>{entry.updated_at}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <div className="d-flex justify-content-between align-items-center mt-3">
                      <div>
                        Showing 1 to {Math.min(entriesPerPage, entries.length)} of {entries.length} entries
                      </div>
                      <div className="pagination-wrap">
                        <ul className="pagination">
                          <li className="page-item"><a className="page-link" href="#">Previous</a></li>
                          <li className="page-item active"><a className="page-link" href="#">1</a></li>
                          <li className="page-item"><a className="page-link" href="#">Next</a></li>
                        </ul>
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
                        <Button color="primary" className="btn-next" onClick={handleNextStep}>
                          Next Step
                        </Button>
                      </Col>
                    </Row>
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
                            <p className="lead">You are about to import <strong>1</strong> contact(s) to your database. Please confirm to proceed.</p>
                            <div className="my-4">
                              <div className="row justify-content-center">
                                <div className="col-xl-8">
                                  <ul className="list-group">
                                    <li className="list-group-item d-flex justify-content-between align-items-center">
                                      <span>Total Records</span>
                                      <span>1</span>
                                    </li>
                                    <li className="list-group-item d-flex justify-content-between align-items-center">
                                      <span>Mapped Fields</span>
                                      <span>6</span>
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
                                <p>Once you confirm, the import process will begin. This may take a few moments depending on the size of your file.</p>
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
                                    <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                                    Importing...
                                  </>
                                ) : "Confirm Import"}
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
                          <p className="text-soft">Your contacts have been successfully imported into the database.</p>
                          <ul className="list-group mt-4">
                            <li className="list-group-item d-flex justify-content-between align-items-center">
                              <span>Total Records Processed</span>
                              <span>1</span>
                            </li>
                            <li className="list-group-item d-flex justify-content-between align-items-center">
                              <span>Successfully Imported</span>
                              <span className="text-success">1</span>
                            </li>
                            <li className="list-group-item d-flex justify-content-between align-items-center">
                              <span>Failed Records</span>
                              <span className="text-danger">0</span>
                            </li>
                          </ul>
                        </div>
                        <div className="nk-modal-action">
                          <Button color="primary" onClick={resetImport}>Import Another File</Button>
                          <Button color="secondary" className="ms-2">View Contacts</Button>
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