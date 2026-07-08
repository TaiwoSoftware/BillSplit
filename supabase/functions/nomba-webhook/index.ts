import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const NOMBA_SIGNATURE_KEY = Deno.env.get("NOMBA_SIGNATURE_KEY")!;
const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

async function hmacSha256Hex(message: string, secret: string) {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw", enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false, ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(message));
  return [...new Uint8Array(sig)].map(b => b.toString(16).padStart(2, "0")).join("");
}

Deno.serve(async (req) => {
  try {
    const rawBody = await req.text();
    const payload = JSON.parse(rawBody);
    console.log("Raw body:", rawBody);

    if (!rawBody) {
      return new Response(
        JSON.stringify({
          message: "Webhook is alive",
        }),
        { status: 200 }
      );
    }

    const payload = JSON.parse(rawBody);

    const receivedSignature = req.headers.get("nomba-signature");
    const timestamp = req.headers.get("nomba-timestamp");

    // Rebuild the exact string Nomba signed
    const t = payload.data.transaction;
    const m = payload.data.merchant;
    const hashingPayload = [
      payload.event_type,
      payload.requestId,
      m.userId,
      m.walletId,
      t.transactionId,
      t.type,
      t.time,
      t.responseCode ?? "",
    ].join(":");
    const message = `${hashingPayload}:${timestamp}`;

    const computedSignature = await hmacSha256Hex(message, NOMBA_SIGNATURE_KEY);

    if (computedSignature !== receivedSignature) {
      return new Response(JSON.stringify({ error: "Invalid signature" }), { status: 401 });
    }

    // ✅ Signature verified — now handle the event
    if (payload.event_type === "payment_success") {
      await supabase.from("payments").insert({
        transaction_id: t.transactionId,
        amount: t.transactionAmount,
        reference: t.merchantTxRef || t.aliasAccountNumber,
        sender_name: payload.data.customer?.senderName,
        status: "paid",
        raw_payload: payload,
      });
    }

    return new Response(JSON.stringify({ received: true }), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Server error" }), { status: 500 });
  }
});