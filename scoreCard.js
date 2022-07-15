import request from "request";
import cheerio from "cheerio";
import chalk from "chalk";

// const url = "https://www.espncricinfo.com/series/indian-premier-league-2022-1298423/gujarat-titans-vs-rajasthan-royals-final-1312200/full-scorecard";

function ProcessScoreCard(url)
{
    console.log("\n Scrapping Inside scoreCard.js ");
    request(url, (error, response, html)=>{
        if(error)
        {
            console.log(chalk.red("Error : "+error));
        }
        else
        {
            console.log(chalk.yellow("Status Code :"+response.statusCode));
            handleHTML(html);
        }
    })
}

function handleHTML(html){

    const $ = cheerio.load(html);

    // both team common data : venue , result , date  for a particular match 
    const Venue_Date = $(".ds-text-tight-m.ds-font-regular.ds-text-ui-typo-mid").text().split(", ");

    const venue = Venue_Date[1];
    const date = Venue_Date[2] + ", " + Venue_Date[3];
    console.log(venue);
    console.log(date);

    const result = $(".ds-text-tight-m.ds-font-regular.ds-truncate.ds-text-typo-title > span").text();
    console.log(result);

    const inningArr = $(".ds-bg-fill-content-prime.ds-rounded-lg");

    // let HTML_string = "";

    for(let i=0 ; i<inningArr.length ; i++)
    {
        // HTML_string += $(inningArr[i]).html();
        let Teamname = $(inningArr[i]).find(".ds-text-tight-s.ds-font-bold.ds-uppercase").text().split("INNINGS");

        let opponentIndex = i==0 ? 1 : 0;
        let opponentname = $(inningArr[opponentIndex]).find(".ds-text-tight-s.ds-font-bold.ds-uppercase").text().split("INNINGS");

        console.log(chalk.green(Teamname[0].trim() + " - "+ opponentname[0].trim()));

        let currentInning = $(inningArr[i]);

        let Allrows = currentInning.find(".ds-border-b.ds-border-line.ds-text-tight-s");

        for(let j=1 ; j<Allrows.length ; j++)
        {
            let rowData = $(Allrows[j]).find("td");

            let playername = $(rowData[0]).text();

            if(playername==="Extras")
            {
                break;
            }

            let runs = $(rowData[2]).text();
            let balls = $(rowData[3]).text();
            let fours = $(rowData[5]).text();
            let sixes = $(rowData[6]).text();
            let strikeRate = $(rowData[7]).text();

            if(strikeRate==="-")
            {
                strikeRate = 0;
            }

            console.log(chalk.bgBlackBright(playername + " - " + runs + " - " + balls + " - " + fours + " - " + sixes + " - " + strikeRate));
        }
    }

    // console.log(HTML_string);
}

// module.exports = {
//     processScoreCard: ProcessScoreCard
// }

export default ProcessScoreCard;