const {
    Builder
} = require('selenium-webdriver');

async function robot(url) {
    const SeleniumDriver = await new Builder()
        .forBrowser('chrome')
        .build();

    try {
        await SeleniumDriver.get(url);
        return true
    } catch (err) {
        throw err
    }
}

module.exports = robot