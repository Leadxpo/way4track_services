// templates/orderMail.js

// export function orderMailTemplate({ order_id, name, order_summary, order_total,  support_email }) {
//   console.log("order_summary:::::",order_summary)
//     return `
//   <!doctype html>
//   <html>
//   <head>
//     <meta charset="utf-8">
//     <meta name="viewport" content="width=device-width">
//   </head>
//   <body style="margin:0;padding:0;background:#f4f4f5;font-family:Arial,Helvetica,sans-serif;">
  
//     <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
//       <tr>
//         <td align="center" style="padding:24px 12px;">
//           <table role="presentation" width="600" style="max-width:600px;background:#ffffff;border-radius:8px;overflow:hidden;" cellpadding="0" cellspacing="0">
  
//             <tr>
//               <td style="padding:20px;border-bottom:1px solid #ececec;">
//                 <table width="100%"><tr>
//                   <td style="font-weight:700;color:#333;font-size:20px;">Way4Track</td>
//                   <td align="right" style="font-size:12px;color:#888;">Order: <strong>${order_id}</strong></td>
//                 </tr></table>
//               </td>
//             </tr>
  
//             <tr>
//               <td style="padding:28px 30px 16px;color:#333;">
//                 <h1 style="margin:0 0 8px;font-size:20px;font-weight:700;color:#111;">Thanks, ${name} — we received your order</h1>
//                 <p style="margin:0 0 16px;color:#555;line-height:1.4;">
//                   Your order <strong>#${order_id}</strong> has been placed successfully. We’ll notify you when it ships.
//                 </p>
  
//                 <table width="100%" cellpadding="0" cellspacing="0" style="margin:12px 0 18px;">
//                   <tr>
//                     <td style="font-size:14px;color:#666;">Items</td>
//                     <td align="right" style="font-size:14px;color:#666;">${order_summary}</td>
//                   </tr>
//                   <tr>
//                     <td style="font-size:14px;color:#666;padding-top:8px;">Total</td>
//                     <td align="right" style="font-size:14px;color:#111;padding-top:8px;"><strong>${order_total}</strong></td>
//                   </tr>
//                 </table>
//                 <p style="margin:0;color:#777;font-size:13px;line-height:1.4;">
//                   Questions? Reply to this email or contact <a href="mailto:${support_email}" style="color:#60A442;text-decoration:none;">${support_email}</a>.
//                 </p>
//               </td>
//             </tr>
  
//             <tr>
//               <td style="padding:16px 30px;background:#fafafa;font-size:12px;color:#888;text-align:center;">
//                 ©️ ${new Date().getFullYear()} Way4Track — All rights reserved
//               </td>
//             </tr>
  
//           </table>
//         </td>
//       </tr>
//     </table>
  
//   </body>
//   </html>`;
//   }
  

export function orderMailTemplate({ order_id, name, order_summary, order_total, support_email }) {

  const itemsHTML = order_summary
    .map(item => {
      return `
        <tr>
          <td style="padding:6px 0;font-size:14px;color:#444;">${item.name} (x${item.qty})</td>
          <td align="right" style="padding:6px 0;font-size:14px;color:#444;">₹${item.amount}</td>
        </tr>
      `;
    })
    .join("");

  return `
  <!doctype html>
  <html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width">
  </head>
  <body style="margin:0;padding:0;background:#f4f4f5;font-family:Arial,Helvetica,sans-serif;">
  
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td align="center" style="padding:24px 12px;">
          <table role="presentation" width="600" style="max-width:600px;background:#ffffff;border-radius:8px;overflow:hidden;" cellpadding="0" cellspacing="0">
  
            <tr>
              <td style="padding:20px;border-bottom:1px solid #ececec;">
                <table width="100%"><tr>
                  <td style="font-weight:700;color:#333;font-size:20px;">Way4Track</td>
                  <td align="right" style="font-size:12px;color:#888;">Order: <strong>${order_id}</strong></td>
                </tr></table>
              </td>
            </tr>
  
            <tr>
              <td style="padding:28px 30px 16px;color:#333;">
                <h1 style="margin:0 0 8px;font-size:20px;font-weight:700;color:#111;">Thanks, ${name} — we received your order</h1>
                <p style="margin:0 0 16px;color:#555;line-height:1.4;">
                  Your order <strong>#${order_id}</strong> has been placed successfully. We’ll notify you when it ships.
                </p>
  
                <table width="100%" cellpadding="0" cellspacing="0" style="margin:12px 0 18px;">
                  
                  <tr>
                    <td colspan="2" style="font-size:14px;color:#666;padding-bottom:6px;"><strong>Items</strong></td>
                  </tr>

                  ${itemsHTML}

                  <tr>
                    <td style="font-size:14px;color:#666;padding-top:12px;"><strong>Total</strong></td>
                    <td align="right" style="font-size:14px;color:#111;padding-top:12px;"><strong>₹${order_total}</strong></td>
                  </tr>
                </table>

                <p style="margin:0;color:#777;font-size:13px;line-height:1.4;">
                  Questions? Reply to this email or contact <a href="mailto:${support_email}" style="color:#60A442;text-decoration:none;">${support_email}</a>.
                </p>
              </td>
            </tr>
  
            <tr>
              <td style="padding:16px 30px;background:#fafafa;font-size:12px;color:#888;text-align:center;">
                ©️ ${new Date().getFullYear()} Way4Track — All rights reserved
              </td>
            </tr>
  
          </table>
        </td>
      </tr>
    </table>
  
  </body>
  </html>`;
}
  