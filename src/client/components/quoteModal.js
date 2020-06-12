import React from 'react';
import { Modal, Button } from 'antd';

const QuoteModal = (props) => {

  let { containerCost, shippingCost, deliveryHub, container } = props.details
  const handleOk = ( ) => {
    props.handleOk();
  };

  return (
    <React.Fragment>
      <Modal
          title={`Delivery Quote for ${container}`}
          visible={props.visible}
          onOk={handleOk}
          onCancel={handleOk}
          footer={[
            <Button key="back" onClick={handleOk}>
              Got it, thanks!
            </Button>,
            <Button key="submit" type="primary" onClick={handleOk}>
              Create Order
            </Button>,
          ]}
        >
          <p>Container Cost: {containerCost}</p>
          <p>Shipping Cost: {shippingCost}</p>
          <p>Delivering from {deliveryHub}</p>
      </Modal>
    </React.Fragment>
  )
}

export default QuoteModal;