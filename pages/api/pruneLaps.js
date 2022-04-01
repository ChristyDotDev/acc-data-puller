const ftp = require("basic-ftp")
const stream = require('stream');
import { readFile, readFileSync } from 'fs';
import { createClient } from '@supabase/supabase-js'

export default async function handler(req, res) {
  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY, {schema: 'public'})

  const { data: results_files, error } = await supabase
    .from('time_trial_laps')
    .select("*")
    .limit(15)

  console.log(results_files)

  res.status(200).json({ status: "OK" });
}
