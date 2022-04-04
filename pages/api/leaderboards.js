const ftp = require("basic-ftp")
const stream = require('stream');
import { readFile, readFileSync } from 'fs';
import { createClient } from '@supabase/supabase-js'

export default async function handler(req, res) {
  const supabaseOptions = {
    schema: 'public',
  }
  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY, supabaseOptions)

  const { data: leaderboard, error } = await supabase
    .from('time_trial_laps')
    .select("*")
    .eq('session_track', 'zandvoort')
    .order('bestLap', { ascending: true })

    //TODO - check the pruning code re: car class
    //TODO - track as path param
    //TODO - render results filtered by class
    //TODO - filter in code here by driver ID as well to double check dupes

  console.log(leaderboard)

  res.status(200).json({ leaderboard });
}
