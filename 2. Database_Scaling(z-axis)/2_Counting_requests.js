/**
 * So we can see that we're counting requests. If I come over to the browser and I navigate to locohost 3000 I can see one, two, three.
 * Every time I make a request I see the count go up. If we come over here to the terminal, we can see that this is being handled by one process.
 * A process with the PID and it's just incrementing the count for each http request. So I'm gonna go ahead and stop this. And type clear 
 * just to save that for me for later. And then I'll come over to the file and check it out. So we can see that we're saving the request in memory 
 * here on line 24. And on line seven we're incrementing the request and then we are responding with the request to the user as well as logging 
 * them to the console. 
 * 
 * So our app appears to work until we run several instances of it. 
 * 
 * So I'm gonna come over here to the terminal and run:
 * $ pm2 start app.js -i three
 * 
 * So now I'm running three instances of my app. And what happens is when I come over here and make a request, I see one. 
 * But if I hit refresh, I'm not getting the right number. In fact we can see this problem if we run pm2 monit, where we can see our logs. 
 * And what we'll notice is, is every time we hit refresh, it's taking a while for the number to increment. The reason is is we are running this application 
 * across three processes. And each process is saving their own request value in memory. So we're only incrementing it every once in a while.
 * 
 * So we can fix this problem by adding a database in the next snippet.
 */

const http = require('http')

let requests = 0

const server = http.createServer((req, res) => {
    if (req.url === '/') {
        requests++
        console.log(`${process.pid}: ${requests}`)
        res.end(JSON.stringify(requests))
    }
})

server.listen(3000)
console.log(`counting requests`)
