// templates/orderDeliveredTemplate.ts

export function orderDeliveredTemplate({
    order_id,
    name,
    delivery_address,
    delivered_at,
    support_email
  }) {
    return `
  <!doctype html>
  <html>
  <head><meta charset="utf-8"><meta name="viewport" content="width=device-width"></head>
  
  <body style="margin:0;padding:0;background:#f4f4f5;font-family:Arial,Helvetica,sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td align="center" style="padding:24px 12px;">
          <table width="600" style="max-width:600px;background:#ffffff;border-radius:8px;" cellpadding="0" cellspacing="0">
  
            <tr>
              <td style="padding:20px;border-bottom:1px solid #ececec;">
                <table width="100%">
                  <tr>
                    <td style="font-weight:700;color:#333;font-size:20px;">Way4Track</td>
                    <td align="right" style="font-size:12px;color:#888;">Order: <strong>${order_id}</strong></td>
                  </tr>
                </table>
              </td>
            </tr>
  
            <tr>
              <td style="padding:28px 30px;color:#333;">
                <h1 style="margin:0 0 8px;font-size:20px;font-weight:700;color:#111;">Delivered — Enjoy!</h1>
                <p style="margin:0 0 16px;color:#555;line-height:1.4;">
                  Hi ${name}, your order <strong>#${order_id}</strong> has been delivered to <strong>${delivery_address}</strong>.
                </p>
  
                <p style="margin:0 0 16px;color:#555;line-height:1.4;">
                  <strong>Delivered on:</strong> ${delivered_at}<br>
                </p>
  
                
  
                <p style="margin:0;color:#777;font-size:13px;line-height:1.4;">
                  Need help or want to give feedback? Reply to this email or contact 
                  <a href="mailto:${support_email}" style="color:#60A442;text-decoration:none;">${support_email}</a>.
                </p>
              </td>
            </tr>
  
            <tr>
              <td style="padding:16px 30px;background:#fafafa;font-size:12px;color:#888;text-align:center;">
                ©️ ${new Date().getFullYear()} Way4Track
              </td>
            </tr>
  
          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>`;
  }
  