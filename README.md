[![ACC Server Poller Status](https://github.com/christytc10/acc-data-puller/actions/workflows/pollResults.yml/badge.svg)](https://github.com/christytc10/acc-data-puller/actions/workflows/pollResults.yml)

Temporary nextjs project to test using serverless routes to process ACC data

## Getting Started

First, run the development server:

```bash
npm run dev
```

See `.env.example` for list of required env variables

### Flow

TODO - describe flow (github action to poll files, webhook on DB etc.)

#### Scheduled polling
A github action `pollResults.yml` kicks off the process by calling the "pollResults function. This connects to the ACC FTP server and grabs any files newer than the latest one in the DB. It marks them as "WANT" so that later calls can pull the file

There's a trigger on the DB that calls the "parseFiles" function when a new results file is added as "WANT", it also is called on a schedule by the `parseFiles.yml` action. This calls the parseFiles function which takes the first "WANT" entry from the files table, pulls the JSON into memory, parses it and stores the results (currently just best laps).

There's a trigger on the DB that calls the "pruneLaps" function when new laps are persisted. This cleans up the laps table to only retain each driver's best lap per track, splitting on wet/dry and car class.


### Local FTP for testing

```ftp-srv ftp://localhost:9876 --username root --password root --root examples/ACC_Files/```