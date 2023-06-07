import React, { Fragment, createRef, useRef, useState } from "react";
import Breadcrumb from "../../common/breadcrumb";
import {
  Card,
  CardBody,
  CardHeader,
  Col,
  Container,
  Form,
  FormGroup,
  Input,
  Label,
  Row,
  Button,
} from "reactstrap";
import one from "../../../assets/images/pro3/1.jpg";
import user from "../../../assets/images/user.png";
import MDEditor from "@uiw/react-md-editor";

const Add_product = () => {
  const [value, setValue] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [imgData, setImgData] = useState();
  const [dummyimgs, setDummyimgs] = useState([
    { img: user },
    { img: user },
    { img: user },
    { img: user },
    { img: user },
    { img: user },
  ]);

  // form fields
  const nameRef = useRef(null);
  const brandRef = useRef(null);
  const priceRef = useRef(null);
  const discountRef = useRef(null);
  const typeRef = useRef(null);
  const categoryRef = useRef(null);
  const newRef = useRef(false);
  const saleRef = useRef(false);
  const codeRef = useRef(null);
  const sizeRef = useRef(null);
  const colorRef = useRef(null);
  const colorCodeRef = useRef(null);
  const skuRef = useRef(null);

  const onChange = (e) => {
    setValue(e);
    console.log(e);
  };

  const IncrementItem = () => {
    if (quantity < 9) {
      setQuantity(quantity + 1);
    } else {
      return null;
    }
  };
  const DecreaseItem = () => {
    if (quantity > 0) {
      setQuantity(quantity - 1);
    } else {
      return null;
    }
  };
  const handleChange = (event) => {
    setQuantity(event.target.value);
  };

  //	image upload

  const _handleImgChange = async (e, i) => {
    e.preventDefault();
    let reader = new FileReader();
    const image = e.target.files[0];
    reader.onload = () => {
      dummyimgs[i].img = reader.result;
      setDummyimgs(dummyimgs);
    };
    reader.readAsDataURL(image);

    // upload image to the server
    const formData = new FormData();
    formData.append("file", image);

    // send upload request
    const res = await fetch("http://localhost:9001/api/file/upload", {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    // update imgData state with the response data
    setImgData(data);
  };

  const handleValidSubmit = async (e) => {
    e.preventDefault();

    // body to send with request => http://localhost:9001/api/products/add-variant
    const variantsReqBody = {
      color: {
        color_name: colorRef.current.value,
        color_code: colorCodeRef.current.value,
      },
      image_id: imgData.image_id,
      size: {
        size: sizeRef.current.value,
        stock: quantity,
      },
    };

    // request to add variants
    const variantsRes = await fetch(
      `http://localhost:9001/api/products/add-variant?productId=${imgData.id}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: JSON.stringify(variantsReqBody),
      }
    );
    const variantsResData = await variantsRes.json();

    // log the response to the console
    console.log(variantsResData);

    // body to send with request => http://localhost:9001/api/products
    const productReqBody = {
      name: nameRef.current.value,
      brand: brandRef.current.value,
      description: value,
      price: priceRef.current.value,
      discount: discountRef.current.value,
      category: categoryRef.current.value,
      new: newRef.current.checked,
      sale: saleRef.current.checked,
      images: [imgData.src],
      variants: [
        {
          // color_name: colorRef.current.value,
          color_code: colorCodeRef.current.value,
          size: {
            size: sizeRef.current.value,
            stock: quantity,
          },
        },
      ],
    };

    // request to add product
    const res = await fetch("http://localhost:9001/api/products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(productReqBody),
    });
    const data = await res.json();
    console.log(data);
  };
  return (
    <Fragment>
      <Breadcrumb title="Add Product" parent="Physical" />

      <Container fluid={true}>
        <Row>
          <Col sm="12">
            <Card>
              <CardHeader>
                <h5>Add Product</h5>
              </CardHeader>
              <CardBody>
                <Row className="product-adding">
                  <Col xl="5">
                    <div className="add-product">
                      <Row>
                        <Col xl="9 xl-50" sm="6 col-9">
                          <img
                            src={one}
                            alt=""
                            className="img-fluid image_zoom_1 blur-up lazyloaded"
                          />
                        </Col>
                        <Col xl="3 xl-50" sm="6 col-3">
                          <ul className="file-upload-product">
                            {dummyimgs.map((res, i) => {
                              return (
                                <li key={i}>
                                  <div className="box-input-file">
                                    <Input
                                      className="upload"
                                      type="file"
                                      onChange={(e) => _handleImgChange(e, i)}
                                    />
                                    <img
                                      alt=""
                                      src={res.img}
                                      style={{ width: 50, height: 50 }}
                                    />
                                  </div>
                                </li>
                              );
                            })}
                          </ul>
                        </Col>
                      </Row>
                    </div>
                  </Col>
                  <Col xl="7">
                    <Form
                      className="needs-validation add-product-form"
                      onSubmit={handleValidSubmit}
                    >
                      <div className="form form-label-center">
                        <FormGroup className="form-group mb-3 row">
                          <Label className="col-xl-3 col-sm-4 mb-0">
                            Product Name :
                          </Label>
                          <div className="col-xl-8 col-sm-7">
                            <Input
                              className="form-control"
                              name="product_name"
                              id="validationCustom01"
                              type="text"
                              required
                              innerRef={nameRef}
                            />
                          </div>
                          <div className="valid-feedback">Looks good!</div>
                        </FormGroup>
                        <FormGroup className="form-group mb-3 row">
                          <Label className="col-xl-3 col-sm-4 mb-0">
                            Brand :
                          </Label>
                          <div className="col-xl-8 col-sm-7">
                            <Input
                              className="form-control mb-0"
                              name="brand"
                              id="validationCustom02"
                              type="text"
                              required
                              innerRef={brandRef}
                            />
                          </div>
                          <div className="valid-feedback">Looks good!</div>
                        </FormGroup>
                        <FormGroup className="form-group mb-3 row">
                          <Label className="col-xl-3 col-sm-4 mb-0">
                            Price :
                          </Label>
                          <div className="col-xl-8 col-sm-7">
                            <Input
                              className="form-control mb-0"
                              name="price"
                              id="validationCustom02"
                              type="number"
                              required
                              innerRef={priceRef}
                            />
                          </div>
                          <div className="valid-feedback">Looks good!</div>
                        </FormGroup>
                        <FormGroup className="form-group mb-3 row">
                          <Label className="col-xl-3 col-sm-4 mb-0">
                            Discount :
                          </Label>
                          <div className="col-xl-8 col-sm-7">
                            <Input
                              className="form-control mb-0"
                              name="discount"
                              id="validationCustom02"
                              type="number"
                              required
                              innerRef={discountRef}
                            />
                          </div>
                          <div className="valid-feedback">Looks good!</div>
                        </FormGroup>
                        <FormGroup className="form-group mb-3 row">
                          <Label className="col-xl-3 col-sm-4 mb-0">
                            Type :
                          </Label>
                          <div className="col-xl-8 col-sm-7">
                            <Input
                              className="form-control mb-0"
                              name="type"
                              id="validationCustom02"
                              type="text"
                              required
                              innerRef={typeRef}
                            />
                          </div>
                          <div className="valid-feedback">Looks good!</div>
                        </FormGroup>
                        <FormGroup className="form-group mb-3 row">
                          <Label className="col-xl-3 col-sm-4 mb-0">
                            Category :
                          </Label>
                          <div className="col-xl-8 col-sm-7">
                            <Input
                              className="form-control mb-0"
                              name="category"
                              id="validationCustom02"
                              type="text"
                              required
                              innerRef={categoryRef}
                            />
                          </div>
                          <div className="valid-feedback">Looks good!</div>
                        </FormGroup>
                        <FormGroup className="form-group mb-3 row">
                          <Label className="col-xl-3 col-sm-4 mb-0">
                            New :
                          </Label>
                          <div className="col-auto">
                            <Input
                              className="form-control mb-0"
                              name="new"
                              id="validationCustom02"
                              type="checkbox"
                              innerRef={newRef}
                            />
                          </div>
                          <div className="valid-feedback">Looks good!</div>
                        </FormGroup>
                        <FormGroup className="form-group mb-3 row">
                          <Label className="col-xl-3 col-sm-4 mb-0">
                            Sale :
                          </Label>
                          <div className="col-auto">
                            <Input
                              className="form-control mb-0"
                              name="sale"
                              id="validationCustom02"
                              type="checkbox"
                              innerRef={saleRef}
                            />
                          </div>
                          <div className="valid-feedback">Looks good!</div>
                        </FormGroup>
                        <FormGroup className="form-group mb-3 row">
                          <Label className="col-xl-3 col-sm-4 mb-0">
                            Product Code :
                          </Label>
                          <div className="col-xl-8 col-sm-7">
                            <Input
                              className="form-control "
                              name="product_code"
                              id="validationCustomUsername"
                              type="number"
                              required
                              innerRef={codeRef}
                            />
                          </div>
                          <div className="invalid-feedback offset-sm-4 offset-xl-3">
                            Please choose Valid Code.
                          </div>
                        </FormGroup>
                        <FormGroup className="form-group mb-3 row">
                          <Label className="col-xl-3 col-sm-4 mb-0">
                            Color Name :
                          </Label>
                          <div className="col-xl-8 col-sm-7">
                            <Input
                              className="form-control "
                              name="product_code"
                              id="validationCustomUsername"
                              type="text"
                              required
                              innerRef={colorRef}
                            />
                          </div>
                          <div className="invalid-feedback offset-sm-4 offset-xl-3">
                            Please choose Valid Code.
                          </div>
                        </FormGroup>
                        <FormGroup className="form-group mb-3 row">
                          <Label className="col-xl-3 col-sm-4 mb-0">
                            Color Code :
                          </Label>
                          <div className="col-2">
                            <Input
                              className="form-control "
                              name="color_code"
                              id="validationCustomUsername"
                              type="color"
                              required
                              innerRef={colorCodeRef}
                            />
                          </div>
                          <div className="invalid-feedback offset-sm-4 offset-xl-3">
                            Please choose Valid Code.
                          </div>
                        </FormGroup>
                      </div>
                      <div className="form">
                        <FormGroup className="form-group mb-3 row">
                          <Label className="col-xl-3 col-sm-4 mb-0">
                            Select Size :
                          </Label>
                          <div className="col-xl-8 col-sm-7">
                            <select
                              className="form-control digits"
                              id="exampleFormControlSelect1"
                              ref={sizeRef}
                            >
                              <option value="S">Small</option>
                              <option value="M">Medium</option>
                              <option value="L">Large</option>
                              <option value="XL">Extra Large</option>
                            </select>
                          </div>
                        </FormGroup>

                        <FormGroup className="form-group mb-3 row">
                          <Label className="col-xl-3 col-sm-4 mb-0">
                            Total Products :
                          </Label>
                          <fieldset className="qty-box ms-0">
                            <div className="input-group bootstrap-touchspin">
                              <div className="input-group-prepend">
                                <Button
                                  className="btn btn-primary btn-square bootstrap-touchspin-down"
                                  type="button"
                                  onClick={DecreaseItem}
                                >
                                  <i className="fa fa-minus"></i>
                                </Button>
                              </div>
                              <div className="input-group-prepend">
                                <span className="input-group-text bootstrap-touchspin-prefix"></span>
                              </div>
                              <Input
                                className="touchspin form-control"
                                type="text"
                                value={quantity}
                                onChange={handleChange}
                              />
                              <div className="input-group-append">
                                <span className="input-group-text bootstrap-touchspin-postfix"></span>
                              </div>
                              <div className="input-group-append ms-0">
                                <Button
                                  className="btn btn-primary btn-square bootstrap-touchspin-up"
                                  type="button"
                                  onClick={IncrementItem}
                                >
                                  <i className="fa fa-plus"></i>
                                </Button>
                              </div>
                            </div>
                          </fieldset>
                        </FormGroup>
                        <FormGroup className="form-group mb-3 row">
                          <Label className="col-xl-3 col-sm-4 mb-0">
                            SKU :
                          </Label>
                          <div className="col-2">
                            <Input
                              className="form-control "
                              name="stock"
                              id="validationCustomUsername"
                              type="text"
                              required
                              innerRef={skuRef}
                            />
                          </div>
                          <div className="invalid-feedback offset-sm-4 offset-xl-3">
                            Please choose Valid Code.
                          </div>
                        </FormGroup>
                        <FormGroup className="form-group mb-3 row">
                          <Label className="col-xl-3 col-sm-4">
                            Add Description :
                          </Label>
                          <div className="col-xl-8 col-sm-7 description-sm">
                            <MDEditor value={value} onChange={onChange} />
                          </div>
                        </FormGroup>
                      </div>
                      <div className="offset-xl-3 offset-sm-4">
                        <Button type="submit" color="primary">
                          Add
                        </Button>
                        <Button type="button" color="light">
                          Discard
                        </Button>
                      </div>
                    </Form>
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </Fragment>
  );
};

export default Add_product;
