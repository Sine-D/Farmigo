const twilio = require("twilio");

const sendWhatsApp = async (toNumber, body) => {
  try {
    if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN || !process.env.TWILIO_WHATSAPP_FROM) {
      console.warn("Twilio WhatsApp env vars missing. Skipping WhatsApp message.");
      return null;
    }

    if (!toNumber) {
      console.warn("No user phone number. Skipping WhatsApp message.");
      return null;
    }

    const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

    // Ensure Twilio WhatsApp format
    const to = toNumber.startsWith("whatsapp:") ? toNumber : `whatsapp:${toNumber}`;

    const msg = await client.messages.create({
      from: process.env.TWILIO_WHATSAPP_FROM, // whatsapp:+14155238886 (sandbox)
      to, // whatsapp:+94xxxxxxxxx
      body,
    });

    console.log("WhatsApp sent:", msg.sid);
    return msg.sid;
  } catch (err) {
    console.error("WhatsApp sending failed:", err.message);
    return null; // don't crash API
  }
};

module.exports = { sendWhatsApp };