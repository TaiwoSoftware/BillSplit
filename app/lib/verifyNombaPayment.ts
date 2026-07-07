import { getNombaToken } from "./nomba";

export async function verifyNombaPayment(orderId: string) {
    console.log("Verifying:", orderId);

    const token = await getNombaToken();

    const response = await fetch(
        `${process.env.NOMBA_BASE_URL}/v1/checkout/order/${orderId}`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
                accountId: process.env.NOMBA_ACCOUNT_ID!,
            },
        }
    );

    const result = await response.json();

    console.log(result);

    return result;
}