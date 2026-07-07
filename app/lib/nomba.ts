import axios from "axios";

export async function getNombaToken() {
  try {
    console.log("Base URL:", process.env.NOMBA_BASE_URL);
console.log("Client ID:", process.env.NOMBA_CLIENT_ID);
console.log("Account ID:", process.env.NOMBA_ACCOUNT_ID);
console.log("Client Secret Exists:", !!process.env.NOMBA_CLIENT_SECRET);
    const response = await axios.post(
      `${process.env.NOMBA_BASE_URL}/v1/auth/token/issue`,
      {
        grant_type: "client_credentials",
        client_id: process.env.NOMBA_CLIENT_ID,
        client_secret: process.env.NOMBA_CLIENT_SECRET,
      },
      {
        headers: {
          "Content-Type": "application/json",
          accountId: process.env.NOMBA_ACCOUNT_ID!,
        },
      }
    );

    return response.data.data.access_token;
  } catch (error: any) {
    console.error(
      "Nomba Authentication Error:",
      error.response?.data || error.message
    );

    throw new Error("Failed to authenticate with Nomba");
  }
}