const ftp = require("basic-ftp")
const stream = require('stream');
import { readFile, readFileSync } from 'fs';
import { createClient } from '@supabase/supabase-js'

export default async function handler(req, res) {
  const supabaseOptions = {
    schema: 'public',
  }
  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY, supabaseOptions)

  const { data: results_files, error } = await supabase
    .from('time_trial_laps')
    .select("*")
    .eq('session_track', 'hungaroring')
    .order('bestLap', { ascending: true })

  console.log(results_files)

  res.status(200).json({ results_files });
}
