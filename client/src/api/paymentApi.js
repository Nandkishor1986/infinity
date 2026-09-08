import axios from "axios";

const API_URL = "http://localhost:5000/api/v1";

export async function createPaymentOrder(studentFeeId, amount, token) {
  const response = await axios.post(
    `${API_URL}/payments/create-order`,
    {
      studentFeeId,
      amount,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  return response.data;
}

export async function verifyPayment(paymentData, token) {
  const response = await axios.post(
    `${API_URL}/payments/verify`,
    paymentData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  return response.data;
}