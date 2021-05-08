/**
 * In Node.js, a single application instance only uses one processor because Node.js is single threaded. Forking your application into multiple 
 * instances is required to take full advantage of your hardware. A cluster is a group of node instances that all work together. 
 * A cluster is made up of worker processes, the four instances of our app, in a main process, which is the instance that spawns and controls 
 * the workers.
 * Let's create a cluster to take advantage of every CPU that is available to us.
 */
const http = require('http');
const cluster = require('cluster');
const cpus = require('os').cpus();  //this will give me information about every processor that I have available on this machine.
const numCPUs = cpus.length;    // this will give the number of cpus that we have

// console.log(cpus)
// console.log(`You have ${numCPUs} CPU`)

if (cluster.isMaster) {
    console.log('This is the master process: ', process.pid);
    // we call cluster.fork for each of the CPUs that we have available to us. So this should start about 13 processes. 12 worker processes and the main process.
    for (let i=0; i<numCPUs; i++) {
        cluster.fork();
    }

} else {
    http.createServer((req, res) => {
        const message = `worker ${process.pid}...`;
        console.log(message);
        res.end(message);
    }).listen(3000);
}

/**
 * we can see that we're hitting the same worker process. Now, what you'll notice is is every time I hit the browser, I am hitting worker process.
 * That's because we're not getting enough traffic to really use the rest of the processes.
 * Let's go ahead and install an NPM that will allow us to run a node test : npm install loadtest -g
 * run: $ loadtest -n 300 http://localhost:3000
 * 
 * So now we'll simulate some traffic and let's watch this traffic spread out. 
 * So what you'll notice is each of these workers are actually being hit. We can see the different process IDs. 
 * Remember, every time we make a web request, on line 23, we are creating a server that's gonna let us know what the worker process ID is 
 * and then we are logging that on line 25. So in the terminal, that's what we're seeing, the line 25 log, and you can notice that when 
 * we have 300 requests, we're actually spreading the load out across 12 different processors and taking full advantage of our machine.
 */