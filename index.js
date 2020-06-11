const readline = require('readline-sync')

function start(){
    const content = {}

    content.searchTerm = askAndReturnSearch()
    content.prefix = askAndReturnPrefix()
    
    function askAndReturnSearch(){
        return readline.question('Type a Wikipedia search term: ')
    }

    function askAndReturnPrefix(){
        const prefixes = ['Who is', 'What is', 'The history of']
        const selectedPrefixIndex = readline.keyInSelect(prefixes, 'Choose one option: ')
        return prefixes[selectedPrefixIndex]
    }
    console.log(content)
}

start()