const ftp = require("basic-ftp")

export default async function handler(req, res) {
  const client = new ftp.Client()

  try {
    await client.access({
        secure: true,
        host: `${process.env.RACE_DATA_FTP_ADDRESS}`,
        port: process.env.RACE_DATA_FTP_PORT,
        user: `${process.env.RACE_DATA_FTP_USER}`,
        password: `${process.env.RACE_DATA_FTP_PASS}`,
        secureOptions: {rejectUnauthorized:false}
    })
    const files = await client.list(process.env.RACE_DATA_FTP_REMOTE_DIR);
    files.forEach(f => {
      console.log(f.name)
    })
  } catch(err) {
      console.log(err)
  } finally {
    client.close();
  }
  //TODO - add files wanted to DB or queue

  res.status(200).json({ status: "OK" });
}
