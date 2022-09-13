const ftp = require("basic-ftp")
import { createClient } from '@supabase/supabase-js'

function extractDateTime(timeString){
  const dateTime = timeString.split("_")
  const year = 20 + dateTime[0].substring(0,2)
  const month = dateTime[0].substring(2,4)
  const day = dateTime[0].substring(4,6)

  const hour = dateTime[1].substring(0,2);
  const minute = dateTime[1].substring(2,4);
  const second = dateTime[1].substring(4,6);

  const date = new Date(year, month-1, day, hour, minute, second);
  return date;
}

export default async function handler(req, res) {
  const supabaseOptions = {
    schema: 'public',
  }
  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY, supabaseOptions)
  const maxTs = await supabase.from('results_files')
    .select('timestamp')
    .order('timestamp', { ascending: false })
    .limit(1);
  let maxDateString = "2000-01-01";
  if (maxTs?.data[0]?.timestamp) {
    maxDateString =maxTs?.data[0]?.timestamp;
  }
  const maxDate = new Date(maxDateString);
  console.log(`Getting files newer than ${maxDate}`);

  const client = new ftp.Client();
  try {
    await client.access({
        secure: process.env.RACE_DATA_FTP_SECURE == 'false' ? false : true,
        host: `${process.env.RACE_DATA_FTP_ADDRESS}`,
        port: process.env.RACE_DATA_FTP_PORT,
        user: `${process.env.RACE_DATA_FTP_USER}`,
        password: `${process.env.RACE_DATA_FTP_PASS}`,
        secureOptions: {rejectUnauthorized:false}
    });
    const files = await client.list(process.env.RACE_DATA_FTP_REMOTE_DIR);
    
    const wanted = files.map(f => {
      return {id: f.name, timestamp: extractDateTime(f.name), status: "WANT"}
    }).filter(f => {
      return f.timestamp > maxDate;
    });
    console.log(`Found ${wanted.length} files newer than ${maxDate}`);
    if(wanted.length > 0){
      await supabase.from("results_files").upsert(wanted).then(r => {
        console.log(r);
      });
      await supabase.from("results_files_elo").upsert(wanted).then(r => {
        console.log(r);
      });
    }
  } catch(err) {
      console.log(err);
      res.status(500).json({ status: "Unexpected Error: Check the lambda logs" });
      return;
  } finally {
    client.close();
  }
  res.status(200).json({ status: "OK" });
  return;
}
