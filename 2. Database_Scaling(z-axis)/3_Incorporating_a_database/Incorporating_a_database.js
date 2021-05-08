const http = require('http')
const { LocalStorage } = require('node-localstorage')

const db = new LocalStorage('./data')

const server = http.createServer((req, res) => {
    if (req.url === '/') {
        let requests = db.getItem('requests')
        db.setItem('requests', ++requests)
        console.log(`${process.pid}: ${requests}`)
        res.end(JSON.stringify(requests))
    }
})

server.listen(3000)
console.log(`counting requests`)

/**
 *  I'm gonna use the most light weight database possible. A file database called node local storage.
 *  Now it appears that our application is working. And that's because we have a single store for all of the data. 
 * So even though all of these processes are running, they're still using a single source of truth for our request count.
 */
