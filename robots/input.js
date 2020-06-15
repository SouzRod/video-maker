const readline = require('readline-sync')
const state = require('./state')

function robot() {

    const content = {
        maximumSentences: 7
    }

    content.searchTerm = askAndReturnSearch()
    content.prefix = askAndReturnPrefix()
    state.save(content)
    
    function askAndReturnSearch(){
        return readline.question('Type a Wikipedia search term: ')
    }
    
    function askAndReturnPrefix(){
        const prefixes = ['Who is', 'What is', 'The history of']
        const selectedPrefixIndex = readline.keyInSelect(prefixes, 'Choose one option: ')
        return prefixes[selectedPrefixIndex]
    }
}

module.exports = robot