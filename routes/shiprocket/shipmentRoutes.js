const express = require('express');
const axios = require('axios');
const router = express.Router();
require('dotenv').config();

// Middleware to handle JSON requests
router.use(express.json());

router.post('/create-shipment', async (req, res) => {
    const orderInfo = req.body;

    try {
        // Ensure required fields are present
        if (!orderInfo.addressInfo || !orderInfo.cartItems || orderInfo.cartItems.length === 0) {
            return res.status(400).json({ message: "Missing shipment information." });
        }

        const response = await axios.post('https://apiv2.shiprocket.in/v1/external/orders/create/adhoc', {
            order_id: orderInfo.uniqueOrderId,
            order_date: new Date().toISOString(),
            pickup_location: "Primary",
            billing_customer_name: orderInfo.addressInfo.name,
            billing_last_name: "",
            billing_address: orderInfo.addressInfo.address,
            billing_address_2: "",
            billing_city: orderInfo.addressInfo.city,
            billing_state: orderInfo.addressInfo.city,
            billing_country: "India",
            billing_pincode: orderInfo.addressInfo.pincode,
            billing_email: orderInfo.email || "",
            billing_phone: orderInfo.addressInfo.phoneNumber,
            shipping_is_billing: true,
            order_items: orderInfo.cartItems.map(item => ({
                name: item._id,
                sku: item._id,
                units: item.quantity,
                selling_price: item.price.toString(),
                discount: "",
                tax: "",
                hsn: "441122"
            })),
            payment_method: orderInfo.paymentMethod === 'COD' ? 'Cash on Delivery' : 'Prepaid',
            shipping_charges: 0,
            giftwrap_charges: 0,
            transaction_charges: 0,
            total_discount: 0,
            sub_total: orderInfo.cartItems.reduce((total, item) => total + (item.price * item.quantity), 0),
            length: 10,
            breadth: 15,
            height: 20,
            weight: 2.5
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.SHIPROCKET_API_KEY}` // Use environment variable
            },
        });

        if (response.data.shipment_id) {
            return res.status(200).json({ shipmentId: response.data.shipment_id });
        } else {
            return res.status(400).json({ message: 'Failed to create shipment: ' + response.data.message });
        }
    } catch (error) {
        console.error('Error creating shipment:', error);
        return res.status(500).json({ message: 'Error creating shipment. ' + (error.response?.data?.message || error.message) });
    }
});

module.exports = router;
