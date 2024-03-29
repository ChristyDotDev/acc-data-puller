const ftp = require("basic-ftp")
const stream = require('stream');
import { createClient } from '@supabase/supabase-js'

async function getFileContents(filename){
  console.log("Getting file: " + filename)
  const client = new ftp.Client()
    await client.access({
        secure: process.env.RACE_DATA_FTP_SECURE == 'false' ? false : true,
        host: `${process.env.RACE_DATA_FTP_ADDRESS}`,
        port: process.env.RACE_DATA_FTP_PORT,
        user: `${process.env.RACE_DATA_FTP_USER}`,
        password: `${process.env.RACE_DATA_FTP_PASS}`,
        secureOptions: {rejectUnauthorized:false}
    })
    .then(res => console.log("FTP Access Successful"))
    .catch(err => console.log(err));

    let fileContents = "";
    const writable = new stream.Writable({
      write: function(chunk, encoding, next) {
        fileContents += chunk.toString('utf16le');
        next();
      }
    });
    await client.downloadTo(writable, process.env.RACE_DATA_FTP_REMOTE_DIR + filename);
    return JSON.parse(fileContents);
}

export default async function handler(req, res) {
  const supabaseOptions = {
    schema: 'public',
  }
  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY, supabaseOptions)

  console.log("getting files from DB")

  const { data: results_files, error } = await supabase
    .from('results_files')
    .select("*")
    .eq('status', 'WANT')
    //.like('id', '%_FP%.json') //- just for when we want to specifically test certain types
    .order('timestamp', { ascending: true })
    .limit(1)

  console.log(results_files)

  const resultsPromise = results_files.forEach(async (file) => {
    const fileContents = await getFileContents(file.id)
    console.log(fileContents?.laps?.length)
    if (fileContents?.laps?.length > 0){
      const ttEntries = fileContents.sessionResult.leaderBoardLines.map((line) => {
        const timeTrialEntry = {
          session_track: fileContents.trackName,
          session_is_wet: fileContents.sessionResult.isWetSession,
          session_timestamp: file.timestamp,
          driver_id: line.currentDriver.playerId,
          driver_first_name: line.currentDriver.firstName,
          driver_last_name: line.currentDriver.lastName,
          driver_short_name: line.currentDriver.shortName,
          bestLap :line.timing.bestLap,
          carModel: line.car.carModel
        }
        return timeTrialEntry;
      }).filter((entry) => {
        return entry.bestLap !== 2147483647
      });
      if (ttEntries.length > 0){
        const { data: savedLaps, error } = await supabase
            .from('time_trial_laps')
            .upsert(ttEntries);
        if (error){
          console.log(error)
          console.log(ttEntries)
        }
      }
      console.log(`Updated ${file.id}`)
    }
    const { data: updated, error } = await supabase
      .from('results_files')
      .update({status: 'DONE'})
      .eq('id', file.id)
    if (error){
      console.log(error)
    }
    console.log(updated)
    return;
  });
  await resultsPromise;

  res.status(200).json({ status: "OK" });
}
