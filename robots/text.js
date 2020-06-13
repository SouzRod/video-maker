const algorithmia = require('algorithmia')
const sentenceBoundaryDetection = require('sbd')
const NaturalLanguageUnderstandingV1 = require('ibm-watson/natural-language-understanding/v1')
const {
    IamAuthenticator
} = require('ibm-watson/auth')

const algorithmiaApiKey = require('../credentials/algorithmia.json').apiKey
const watson = require('../credentials/watson-nlu.json')

const nlu = new NaturalLanguageUnderstandingV1({
    version: '2019-07-12',
    authenticator: new IamAuthenticator({
        apikey: watson.apikey,
    }),
    url: watson.url,
})


async function robot(content) {
    await fetchContentFromWikipedia(content)
    sanitizeContent(content)
    breakContentIntoSentences(content)
    limitMaximumSentences(content)
    await fetchKeywordsOfAllSentences(content)
    
    
    async function fetchContentFromWikipedia(content) {
        const algorithmiaAuthenticated = algorithmia(algorithmiaApiKey)
        const wikipediaAlgorithm = algorithmiaAuthenticated.algo('web/WikipediaParser/0.1.2')
        const wikipediaResponse = await wikipediaAlgorithm.pipe(content.searchTerm)
        const wikipediaContent = wikipediaResponse.get()

        content.sourceContentOriginal = wikipediaContent.content
    }
    
    function sanitizeContent(content) {
        const withoutBlankLinesAndMarkdown = removeBlankLinesAndMarkdown(content.sourceContentOriginal)
        const withoutDatesInParentheses = removeDatesInParentheses(withoutBlankLinesAndMarkdown)
        
        content.sourceContentSanitized = withoutDatesInParentheses
        
        function removeBlankLinesAndMarkdown(text) {
            const allLines = text.split('\n')
            const withoutBlankLinesAndMarkdown = allLines.filter(line => {
                if (line.trim().length === 0 || line.trim().startsWith('=')) {
                    return false
                }
                return true
            })
            
            return withoutBlankLinesAndMarkdown.join(' ')
        }
        
        function removeDatesInParentheses(text) {
            return text.replace(/\((?:\([^()]*\)|[^()])*\)/gm, '').replace(/  /g, ' ')
        }
    }
    
    function breakContentIntoSentences(content) {
        content.sentences = []
        const sentences = sentenceBoundaryDetection.sentences(content.sourceContentSanitized)
        sentences.forEach(sentence => {
            content.sentences.push({
                text: sentence,
                keywords: [],
                images: []
            })
        })
    }

    async function fetchKeywordsOfAllSentences(content){
        for(const sentence of content.sentences){
            sentence.keywords = await fetchWatsonAdnReturnKeywords(sentence.text)
        }
    }

    async function fetchWatsonAdnReturnKeywords(sentence) {
        const response = await nlu.analyze({
            'text': sentence,
            'features': {
                'keywords': {}
            }
        })
        // console.log(JSON.stringify(response))
        return response.result.keywords.map(keyword => keyword.text)
    }

    function limitMaximumSentences(content){
        content.sentences = content.sentences.slice(0, content.maximumSentences)
    }
}

module.exports = robot