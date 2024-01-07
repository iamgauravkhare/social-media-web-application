exports.passwordUpdateEmailTemplate = (email, name) => {
  return `<!DOCTYPE html>
  <html>
    <head>
      <meta charset="UTF-8" />
      <title>Password Update Confirmation</title>
      <style>
        body {
          background-color: #ffffff;
          font-family: Arial, sans-serif;
          font-size: 16px;
          line-height: 1.5;
          color: rgba(0, 0, 0, 0.8);
          margin: 0;
          padding: 0;
        }
  
        .container {
          max-width: 450px;
          margin: 0 auto;
          padding: 5px;
          text-align: center;
          background-color: #dbeafe;
        }
  
        .sub-container {
          background-color: white;
          padding: 10px;
        }
  
        .head {
          font-size: 32px;
          color: rgba(0, 0, 0, 0.8);
          background-color: #dbeafe;
          padding: 10px 30px;
          border-radius: 7.5px;
          display: inline-block;
        }
  
        .message {
          font-size: 18px;
          color: rgba(0, 0, 0, 1);
          text-decoration: underline;
          font-weight: bold;
          margin-bottom: 25px;
        }
  
        .body {
          font-size: 15px;
          margin-bottom: 25px;
          text-align: start;
        }
  
        .support {
          font-size: 14px;
          color: #999999;
        }
  
        .highlight {
          font-weight: bold;
          color: #000000;
        }
      </style>
    </head>
  
    <body>
      <div class="container">
        <div class="sub-container">
          <h1 class="head">.....</h1>
          <div class="message">Password Update Confirmation</div>
          <div class="body">
            <p>Hey ${name},</p>
            <p>
              Your password has been successfully updated for the email
              <span class="highlight">${email}</span>.
            </p>
            <p>
              If you did not request this password change, please contact us
              immediately to secure your account.
            </p>
          </div>
          <div class="support">
            If you have any further questions or need immediate assistance, please
            feel free to reach out to us at
            <a href="mailto:webdevworld.info@gmail.com"
             >webdevworld.info@gmail.com</a
            >. We are here to help!
          </div>
        </div>
      </div>
    </body>
  </html>`;
};
