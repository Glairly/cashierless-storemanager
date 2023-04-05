import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import CheckMarked from "./svgs/CheckMarked";
import CrossMarked from "./svgs/CrossMarked";

interface CustomModalProps {
  show: boolean;
  onHide: () => void;
  title: string;
  body: string;
  footer?: JSX.Element;
  status: boolean;
}

const CustomModal: React.FC<CustomModalProps> = ({
  show,
  onHide,
  title,
  body,
  footer,
  status = true,
}) => {
  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="d-flex flex-column justify-content-center align-items-center">
          {status ? <CheckMarked /> : <CrossMarked />}
          {body}
        </div>
      </Modal.Body>
      <Modal.Footer>
        {footer || (
          <Button variant="secondary" onClick={onHide}>
            Close
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default CustomModal;
