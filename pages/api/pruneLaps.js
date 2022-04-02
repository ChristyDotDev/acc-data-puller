const ftp = require("basic-ftp")
const stream = require('stream');
import { readFile, readFileSync } from 'fs';
import { createClient } from '@supabase/supabase-js'

export default async function handler(req, res) {
  const supabaseOptions = {
    schema: 'public',
  }
  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY, supabaseOptions)

  //run prune_laps stored procedure on supabase
  let { data, error } = await supabase
    .rpc('prune_laps')

  if (error) {
    console.log(error)
    res.status(500).send(error)
  }
  
  res.status(200).json({ status: "OK" });
}
