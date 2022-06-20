import { createClient } from '@supabase/supabase-js'

export default async function handler(req, res) {
  const supabaseOptions = {
    schema: 'public',
  }
  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY, supabaseOptions)

  const { data: tracks, error } = await supabase
    .rpc('track_list')

  if (error) {
    console.log(error)
    res.status(500).send(error)
  }
  res.status(200).json({ tracks });
}
