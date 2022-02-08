const jsftp = require("jsftp");

export default function handler(req, res) {
  const ftp = new jsftp({
    host: `${process.env.RACE_DATA_FTP_ADDRESS}`,
    port: process.env.RACE_DATA_FTP_PORT,
    user: `${process.env.RACE_DATA_FTP_USER}`,
    pass: `${process.env.RACE_DATA_FTP_PASS}`,
  });

  ftp.list(process.env.RACE_DATA_FTP_REMOTE_DIR, (err, res) => {
    if (err) console.log(res, err);
  });
  //TODO - add files wanted to DB or queue

  res.status(200).json({ status: "OK" });
}
