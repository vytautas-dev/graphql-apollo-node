const { google } = require("googleapis");

const payload = {
  type: "authorized_user",
  client_id:
    "104598434138-3dlgpk8edkmtm6lo0opsogr94s3c6td1.apps.googleusercontent.com",
  client_secret: "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",
  refresh_token:
    "1//0cs5SPMYIiFEGCgYIARAAGAwSNwF-L9Ire2GHqjU2CXNwkE83SCVdeEg6X9DOtF5P1gbcRT_yPWlEofH_ouglbYbN-m4b0e8lGZY",
};

const client = google.auth.fromJSON(payload);

console.log(client);

// export interface JWTInput {
//   type?: string;
//   client_email?: string;
//   private_key?: string;
//   private_key_id?: string;
//   project_id?: string;
//   client_id?: string;
//   client_secret?: string;
//   refresh_token?: string;
//   quota_project_id?: string;
// }
