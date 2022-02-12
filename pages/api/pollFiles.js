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
    .limit(1)
  const maxDateString = maxTs?.data[0]?.timestamp ?? "2000-01-01"
  const maxDate = new Date(maxDateString);

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
    
    const wanted = files.map(f => {
      return {id: f.name, timestamp: extractDateTime(f.name), status: "WANT"}
    }).filter(f => {
      return f.timestamp > maxDate;
    });
    //TODO - only insert not there
    if(wanted.length > 0){
      await supabase.from("results_files").upsert(wanted).then(r => {
        console.log(r)
      });
    }
  } catch(err) {
      console.log(err)
  } finally {
    client.close();
  }
  
  //TODO - add files wanted to DB or queue

  res.status(200).json({ status: "OK" });
}
