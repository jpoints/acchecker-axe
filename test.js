const { AxePuppeteer } = require('@axe-core/puppeteer');
const puppeteer = require('puppeteer');
const fs = require('fs');

let pages = [
    {url:'https://dequeuniversity.com/demo/mars/',filename:"case1"},
    {url:'https://moderncampus.com',filename:"case2"},
    {url:'https://moderncampus.com/why-modern-campus.html',filename:"case3"},
    {url:'https://moderncampus.com/products/web-content-management.html',filename:"case4"},
    {url:'https://moderncampus.com/about/leadership-bios.html',filename:"case5"},
    {url:'https://moderncampus.com/about/diversity-equity-inclusion.html',filename:"case6"},
    {url:'https://moderncampus.com/blog/index.html',filename:"case7"}
]

//runnerOne(pages);
runnerAll(pages);


async function runnerOne(){
    for (let page of pages){
        console.log(page);
        await test(page.url,page.filename);
        console.log("--done--", page.url , );
    }
}


//this will test all the pages at the same time
//would need a queue for this to be a reasonable approach
function runnerAll(){
    for (let page of pages){
        console.log(page);
        test(page.url,page.filename);
        console.log("--done--", page.url);
    }
}

async function test(path,report) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setBypassCSP(true);

  await page.goto(path);

  const results = await new AxePuppeteer(page).analyze();
  //console.log(results);

  if (!fs.existsSync('./report')){
    fs.mkdirSync('./report');
  }

  fs.writeFile(`./report/${report}.json`, JSON.stringify(results.violations,null,2), err => {
    if (err) {
      console.error(err)
      return
    }
  })

  await page.close();
  await browser.close();
};