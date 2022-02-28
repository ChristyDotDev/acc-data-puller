const ftp = require("basic-ftp")
const stream = require('stream');
import { createClient } from '@supabase/supabase-js'

async function getFileContents(filename){
  const client = new ftp.Client()
    await client.access({
        secure: true,
        host: `${process.env.RACE_DATA_FTP_ADDRESS}`,
        port: process.env.RACE_DATA_FTP_PORT,
        user: `${process.env.RACE_DATA_FTP_USER}`,
        password: `${process.env.RACE_DATA_FTP_PASS}`,
        secureOptions: {rejectUnauthorized:false}
    })
    let fileContents = "";
    const writable = new stream.Writable({
      write: function(chunk, encoding, next) {
        fileContents += chunk.toString();
        next();
      }
    });
    await client.downloadTo(writable, process.env.RACE_DATA_FTP_REMOTE_DIR + filename);
    //TODO - think encoding is fucked here, detect and parse properly?
    return fileContents;
}

export default async function handler(req, res) {
  const supabaseOptions = {
    schema: 'public',
  }
  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY, supabaseOptions)

  const { data: results_files, error } = await supabase
    .from('results_files')
    .select("*")
    .eq('status', 'WANT')
    //.like('id', '%_R.json') - just for when we want to specifically test certain types
    .order('timestamp', { ascending: false })
    .limit(1)
  
  console.log(results_files)

  results_files.forEach(async (file) => {
    const resultsFile = await getFileContents(file.id)
    //TODO - parse results contents
    //TODO - store results in database
    //TODO - mark storage as done
    //await supabase.from('results_files').update(file.id, {status: "DONE"})
  });

  res.status(200).json({ status: "OK" });
}
