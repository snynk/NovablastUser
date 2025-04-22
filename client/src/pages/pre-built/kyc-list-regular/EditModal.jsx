import React, { useEffect } from "react";
import { Modal, ModalBody, Form } from "reactstrap";
import { Icon, Col, Button } from "@/components/Component";
import { useForm } from "react-hook-form";

const EditModal = ({ modal, closeModal, onSubmit, formData, setFormData }) => {
    const { register, handleSubmit, reset, formState: { errors } } = useForm({
        defaultValues: formData, // ✅ Set default values correctly
      });

   useEffect(() => {
    if (formData) {
      reset(formData); // ✅ Reset form with correct existing contact data
    }
  }, [formData, reset]); // ✅ Added reset in dependency list


  return (
    <Modal isOpen={modal} toggle={() => closeModal()} className="modal-dialog-centered" size="lg">
      <ModalBody>
        <a
          href="#cancel"
          onClick={(ev) => {
            ev.preventDefault();
            closeModal();
          }}
          className="close"
        >
          <Icon name="cross-sm"></Icon>
        </a>
        <div className="p-2">
          <h5 className="title">Update Contact</h5>
          <div className="mt-4">
            <Form className="row gy-4" noValidate onSubmit={handleSubmit(onSubmit)}>
              <Col md="6">
                <div className="form-group">
                  <label className="form-label">First Name</label>
                  <input
                    className="form-control"
                    type="text"
                    {...register("FirstName", { required: "This field is required" })}
                    placeholder="Enter First Name"
                  />
                  {errors.FirstName && <span className="invalid">{errors.FirstName.message}</span>}
                </div>
              </Col>
              <Col md="6">
                <div className="form-group">
                  <label className="form-label">Last Name</label>
                  <input
                    className="form-control"
                    type="text"
                    {...register("LastName", { required: "This field is required" })}
                    placeholder="Enter Last Name"
                  />
                  {errors.LastName && <span className="invalid">{errors.LastName.message}</span>}
                </div>
              </Col>
              <Col md="6">
                              <div className="form-group">
                                <label className="form-label">City</label>
                                <input
                                  className="form-control"
                                  type="text"
                                  {...register("City", { required: "This field is required" })}
                                  placeholder="Enter City Name"
                                />
                                {errors.City && <span className="invalid">{errors.City.message}</span>}
                              </div>
                            </Col>
                            <Col md="6">
                              <div className="form-group">
                                <label className="form-label">State</label>
                                <input
                                  className="form-control"
                                  type="text"
                                  {...register("State", { required: "This field is required" })}
                                  placeholder="Enter State Name"
                                />
                                {errors.State && <span className="invalid">{errors.State.message}</span>}
                              </div>
                            </Col>
                            <Col md="6">
                              <div className="form-group">
                                <label className="form-label">Zip</label>
                                <input
                                  className="form-control"
                                  type="text"
                                  {...register("Zip", { required: "This field is required" })}
                                  placeholder="Enter Zip Number"
                                />
                                {errors.Zip && <span className="invalid">{errors.Zip.message}</span>}
                              </div>
                            </Col>
                            <Col md="6">
                              <div className="form-group">
                                <label className="form-label">Property Address</label>
                                <input
                                  className="form-control"
                                  type="text"
                                  {...register("PropertyAddress", { required: "This field is required" })}
                                  placeholder="Enter Property Address Name"
                                />
                                {errors.PropertyAddress && <span className="invalid">{errors.PropertyAddress.message}</span>}
                              </div>
                            </Col>
                            <Col md="6">
                              <div className="form-group">
                                <label className="form-label">Property City</label>
                                <input
                                  className="form-control"
                                  type="text"
                                  {...register("PropertyCity", { required: "This field is required" })}
                                  placeholder="Enter Property City Name"
                                />
                                {errors.PropertyCity && <span className="invalid">{errors.PropertyCity.message}</span>}
                              </div>
                            </Col>
                            <Col md="6">
                              <div className="form-group">
                                <label className="form-label">Property State</label>
                                <input
                                  className="form-control"
                                  type="text"
                                  {...register("PropertyState", { required: "This field is required" })}
                                  placeholder="Enter Property State Name"
                                />
                                {errors.PropertyState && <span className="invalid">{errors.PropertyState.message}</span>}
                              </div>
                            </Col>
                            <Col md="6">
                              <div className="form-group">
                                <label className="form-label">Property Zip</label>
                                <input
                                  className="form-control"
                                  type="text"
                                  {...register("PropertyZip", { required: "This field is required" })}
                                  placeholder="Enter Property Zip Name"
                                />
                                {errors.PropertyZip && <span className="invalid">{errors.PropertyZip.message}</span>}
                              </div>
                            </Col>
                          
                            <Col md="6">
                              <div className="form-group">
                                <label className="form-label">Phone1</label>
                                <input
                                  className="form-control"
                                  type="number"
                                  {...register("Phone1", { required: "This field is required" })}
                                  placeholder="Enter Phone Number"
                                />
                                {errors.Phone1 && <span className="invalid">{errors.Phone1.message}</span>}
                              </div>
                            </Col>
                            <Col md="6">
                              <div className="form-group">
                                <label className="form-label">Phone2</label>
                                <input
                                  className="form-control"
                                  type="number"
                                  {...register("Phone2", { required: "This field is required" })}
                                  placeholder="Enter Phone Number"
                                />
                                {errors.Phone2 && <span className="invalid">{errors.Phone2.message}</span>}
                              </div>
                            </Col>
                            <Col md="6">
                              <div className="form-group">
                                <label className="form-label">Phone3</label>
                                <input
                                  className="form-control"
                                  type="number"
                                  {...register("Phone3", { required: "This field is required" })}
                                  placeholder="Enter Phone Number"
                                />
                                {errors.Phone3 && <span className="invalid">{errors.Phone3.message}</span>}
                              </div>
                            </Col>
            
              <Col size="12">
                <ul className="align-center flex-wrap flex-sm-nowrap gx-4 gy-2">
                  <li>
                    <Button color="primary" size="md" type="submit">
                      Update Contact
                    </Button>
                  </li>
                  <li>
                    <a
                      href="#cancel"
                      onClick={(ev) => {
                        ev.preventDefault();
                        closeModal();
                      }}
                      className="link link-light"
                    >
                      Cancel
                    </a>
                  </li>
                </ul>
              </Col>
            </Form>
          </div>
        </div>
      </ModalBody>
    </Modal>
  );
};

export default EditModal;
