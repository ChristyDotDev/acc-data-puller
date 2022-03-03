const ftp = require("basic-ftp")
const stream = require('stream');
import { readFile, readFileSync } from 'fs';
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
    const downloadResult = await client.downloadTo(`./_tmp${filename}`, process.env.RACE_DATA_FTP_REMOTE_DIR + filename)
    console.log(downloadResult)
    const fileContents = await readFileSync(`./_tmp${filename}`, 'utf16le');
    return JSON.parse(fileContents);
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
    const fileContents = await getFileContents(file.id)
    console.log(`Pulled ${fileContents.sessionType} session ${file.id} @${fileContents.trackName}`)

    //TODO - parse results contents
    //TODO - store results in database
    //TODO - mark storage as done
    //await supabase.from('results_files').update(file.id, {status: "DONE"})
  });

  res.status(200).json({ status: "OK" });
}
