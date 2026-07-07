import { getNombaToken } from "./nomba";

export async function verifyNombaPayment(orderReference: string) {
  console.log("Verifying Order Reference:", orderReference);

  const token = await getNombaToken();

  const url = new URL(
    `${process.env.NOMBA_BASE_URL}/v1/transactions/accounts/single`
  );

  url.searchParams.set("orderReference", orderReference);

  const response = await fetch(url.toString(), {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      accountId: process.env.NOMBA_ACCOUNT_ID!,
    },
  });

  const result = await response.json();

  console.log("Verification Response:");
  console.dir(result, { depth: null });

  return result;
}