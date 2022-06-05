const puppeteer = require('puppeteer');
const fs = require('fs');
const fetch = require('node-fetch');

async function autoScroll(page) {
    await page.evaluate(async () => {
        await new Promise((resolve, reject) => {
            var totalHeight = 0;
            var distance = 100;
            var timer = setInterval(() => {
                var scrollHeight = document.body.scrollHeight;
                window.scrollBy(0, distance);
                totalHeight += distance;

                if (totalHeight >= scrollHeight) {
                    clearInterval(timer);
                    resolve();
                }
            }, 100);
        });
    });
}

function delay(time) {
    return new Promise(function (resolve) {
        setTimeout(resolve, time);
    });
}

(async () => {
    try {
        const browser = await puppeteer.launch({ headless: false });
        const page = await browser.newPage();
        await page.setViewport({
            width: 1920,
            height: 1080,
        });
        console.log('Going to page...');
        await page.goto('https://starcraft.fandom.com/wiki/List_of_StarCraft_II_units');
        console.log('Finished going to page...');

        console.log('Scrolling...');
        await autoScroll(page);
        console.log('Finished scrolling...');

        console.log('Waiting 5000ms in case images havent loaded...');
        await delay(5000);
        console.log('Finished waiting...');

        const whatever = await page.evaluate(() => {
            let lastUnitsInList = {
                Disruptor: 'Terran',
                Cyclone: 'Zerg',
                'Lurker Den': null,
            };

            let currentFaction = 'Protoss';

            let pageTableRows = Array.from(
                document.querySelectorAll('#mw-content-text > div > table tr')
            );

            let data = [];

            for (let i = 0; i < pageTableRows.length; i++) {
                (() => {
                    const row = pageTableRows[i];

                    const unitnameNode = row.querySelector('td:nth-child(2) a');
                    const iconNode = row.querySelector('td:nth-child(1) img');
                    const descriptionNode = row.querySelector('td:nth-child(3)');

                    if (!unitnameNode || !descriptionNode) return;

                    const name = unitnameNode.textContent;
                    const description = descriptionNode.textContent.replaceAll('\n', '');
                    const wikiLink = unitnameNode.getAttribute('href');
                    const imageLink = iconNode.src;

                    data.push({
                        faction: currentFaction,
                        name,
                        description,
                        wikiLink,
                        imageLink,
                    });

                    const nextFaction = lastUnitsInList[unitnameNode.textContent];
                    if (nextFaction) currentFaction = nextFaction;
                })();
            }

            return data;
        });

        for (let i = 0; i < whatever.length; i++) {
            console.log(whatever[i]);
        }

        console.log('Saving to drive...')
        fs.mkdirSync('./out/images', { recursive: true });
        for (let i = 0; i < whatever.length; i++) {
            const unit = whatever[i];
            const id = i + 1;
            unit.id = id;

            const response = await fetch(unit.imageLink);
            const buffer = await response.buffer();
            fs.writeFileSync(`./out/images/${id}.png`, buffer, () => console.log('finished downloading!'));
        }

        fs.writeFileSync('./out/gamedata.json', JSON.stringify(whatever));

        await browser.close();
    } catch (e) {
        console.log(e);
    }
})();

console.log('Script complete!');
