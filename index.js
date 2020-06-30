const robots = {
    text: require('./robots/text'),
    input: require('./robots/input'),
    state: require('./robots/state'),
    image: require('./robots/image'),
    video: require('./robots/video'),
    youtube: require('./robots/youtube')
}
async function start(){
    // robots.input()
    // await robots.text()
    // await robots.image()
    // await robots.video()
    await robots.youtube()
    

}

start()