import { createClient } from '@supabase/supabase-js'

export async function fetchTracks() {
    const supabaseOptions = {
        schema: 'public',
    }
    const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY, supabaseOptions)

    const { data: tracks, error } = await supabase
        .from('distinct_track')
        .select()

    if (error) {
        console.log(error)
    }
    return tracks.map(t => t.session_track);
}

export async function fetchTrackLeaderboard(trackId) {
    const supabaseOptions = {
        schema: 'public',
    }
    const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY, supabaseOptions)

    const { data: leaderboard, error } = await supabase
        .from('time_trial_laps')
        .select("*")
        .eq('session_track', trackId)
        .order('bestLap', { ascending: true })
    //TODO - only return best lap per user (and per car class? Wet/Dry?)

    if (error) {
        console.log(error)
    }
    return leaderboard;
}
