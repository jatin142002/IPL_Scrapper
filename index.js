import request from "request";
import cheerio from "cheerio";
import chalk from "chalk";
import  ProcessScoreCard  from "./scoreCard.js";

const url = "https://www.espncricinfo.com/series/indian-premier-league-2022-1298423";

console.log(chalk.green("Scrapping Started"));

request(url, (error, response, html)=>{
    if(error)
    {
        console.log("Error : ", error);
    }
    else
    {
        console.log(chalk.yellow("Status Code : "+response.statusCode));
        handleHTML(html);
    }
})

console.log(chalk.green("Scrapping Ended"));

function handleHTML(html)
{
    const $ = cheerio.load(html);

    const href_ipl = $(".ds-py-3.ds-px-4 > span >a");
     // console.log(href_ipl.length);

    const link = "https://www.espncricinfo.com" + $(href_ipl[0]).attr("href");
    console.log(chalk.bgBlueBright(link));

    getAllMatches(link);
}

function getAllMatches(link)
{
    request(link, (error , response , html)=>{
        if(error)
        {
            console.log(chalk.red("Error : ",error));
        }
        else
        {
            console.log(chalk.yellow("Status Code : ",response.statusCode));

            handleMatches(html);
        }
    })
}

function handleMatches(html)
{
    const $ = cheerio.load(html);

    // const matchArr = $(".ds-flex.ds-flex-wrap > div");

    const matchArr = $(".ds-flex.ds-mx-4.ds-pt-2.ds-pb-3.ds-space-x-4.ds-border-t.ds-border-line-default-translucent > span > a");

    // console.log(matchArr.length);
    for(let i=2 ; i<matchArr.length ; i+=4)
    {
        const scoretablelink = "https://www.espncricinfo.com" + $(matchArr[i]).attr("href");
        console.log(chalk.bgWhiteBright(scoretablelink));

        ProcessScoreCard(scoretablelink);
    }
   
}