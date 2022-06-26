import EloRating from 'elo-rating';

export default async function handler(req, res) {
    console.log("Updating Elo Ratings")
    console.log(EloRating.calculate(2100, 1400));
    //TODO - when new file detected and type is race, stick it in the elo table
    //TODO - Parse the file and get the results ordering
    //TODO - grab every racer's current ELO (with default/starting ELO if none found)
    //TODO - calculate new ELO per racer
    //TODO - persist new ELOs
    
    console.log("Updated Elo Ratings")
    res.status(200).send();
}