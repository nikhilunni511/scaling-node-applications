/**
 *  In the last few examples, we built our own simple cluster. In the real world, there are already many tools that we can use to help us manage 
 * clusters in production. The tool I want to look at is called PM2. PM2 is a no JS process manager. It will allow you to manage zero down time 
 * clusters in production.
 */
const http = require('http')
const options = [
    "Go for it!",
    "Maybe sleep on it",
    // "Do some more research",
    // "I don't know",
    // "I wouldn't"
]

const server = http.createServer((req, res) => {
    const randomIndex = Math.floor(Math.random() * options.length)
    const advice = options[randomIndex]
    const payload = JSON.stringify({
        processID: process.pid,
        advice
    })
    console.log(`advice from ${process.pid}: ${advice}`)
    res.writeHead(200, { 'Content-Type': 'application/json'})
    res.end(payload)
})

server.listen(3000)
console.log(`advice service running`)

/**
 * $ pm2 start app.js -i <num of instances>
 * $ pm2 start app.js -i -1 // PM2 will actually automatically select the number of instances that it should run for your current processor.
 *
 * pm2 runs in the background 
 * $ pm2 list
 * $ pm2 stop <app name>  : stops the app
 * $ pm2 delete <app name>  : remove the app from pm2
 * 
 * $ loadtest -n <number of request> http://localhost:3000
 * 
 * $ pm2 logs   // will show you the logs for all of the processes. So you can see here that each number of process
 * $ pm2 monit
 * 
 * $ pm2 reload <app>
 * When any update made in code, we can do is called PM2 reload app and what PM2 does 
 * is it automatically starts cluster one by one and diverts the user traffic to clusters that aren't being restarted. 
 * 
 * When it comes to scaling along the Z axis, we don't have to reinvent the wheel. There are already great tools out there that we can use.
 * Also, cloud services like AWS or Roku, Cloudflair, or Azure have tools that manager clusters baked into their environments. It's important 
 * to know that sheer no JS websites at API will run in production on many instances and they never have to go down.
 */