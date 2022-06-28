import EloRating from 'elo-rating';
import { createClient } from '@supabase/supabase-js'

const ftp = require("basic-ftp");
const stream = require('stream');


async function getFileContents(filename){
    const client = new ftp.Client()
      await client.access({
          secure: process.env.RACE_DATA_FTP_SECURE == 'false' ? false : true,
          host: `${process.env.RACE_DATA_FTP_ADDRESS}`,
          port: process.env.RACE_DATA_FTP_PORT,
          user: `${process.env.RACE_DATA_FTP_USER}`,
          password: `${process.env.RACE_DATA_FTP_PASS}`,
          secureOptions: {rejectUnauthorized:false}
      })
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

async function getResultsFiles(supabase){
    const { data: results_files, error } = await supabase
        .from('results_files_elo')
        .select("*")
        .eq('status', 'WANT')
        //.like('id', '%_R%.json') //- just for when we want to specifically test certain types
        .order('timestamp', { ascending: false })
        .limit(1);
    return results_files;
}

async function getDriverElo(supabase){
    const { data: results_files, error } = await supabase
        .from('driver_elo')
        .select("*");
    return results_files;
}

async function markFileDone(supabase, fileId){
    const { data: updated, error } = await supabase
        .from('results_files_elo')
        .update({status: 'DONE'}) //TODO - MARK DONE
        .eq('id', fileId)
    if (error){
        console.log(error)
    }
    console.log(updated);
}

export default async function handler(req, res) {
    console.log("Updating Elo Ratings")
    const supabaseOptions = {
        schema: 'public',
    }
    const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY, supabaseOptions)
    const results_files = await getResultsFiles(supabase);
    const eloBefore = await getDriverElo(supabase);

    results_files.forEach(async (file) => {
        const fileContents = await getFileContents(file.id)
        console.log(`${fileContents.sessionType} @ ${fileContents.trackName}`);
        if(!fileContents.sessionType.startsWith('R')){
            console.log(`Not a race, skipping...`);
            markFileDone(supabase, file.id);
            return;
        }
        const leaderboardLines = []
        for(const [index,lbl] of fileContents.sessionResult.leaderBoardLines.entries()){
            const driverElo = eloBefore.find( ({ driver }) => driver.playerId == lbl.currentDriver.playerId );

            leaderboardLines.push({
                position: index,
                shortName: lbl.currentDriver.shortName,
                firstName: lbl.currentDriver.firstName,
                lastName: lbl.currentDriver.lastName,
                playerId: lbl.currentDriver.playerId,
                elo: driverElo ? driverElo : 1800
            });
        }
        console.log(leaderboardLines)
        
        //TODO - grab every racer's current ELO (with default/starting ELO if none found)
        //TODO - calculate new ELO per racer
        //TODO - persist new ELOs
        //console.log(EloRating.calculate(2100, 1400));
        //markFileDone(supabase, file.id);
    });
    

    
    console.log("Updated Elo Ratings")
    await res.status(200).send();
}