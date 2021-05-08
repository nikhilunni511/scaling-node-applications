/**
 * One of the advantages of running multiple processes is that your app never has to go down, it can always be available to your users,
 * this is called zero downtime. Sometimes our apps go down, this could be due to some mysterious and obscure bug, it could be due to high 
 * traffic or sometimes we just need to update the code and restart the process, in a cluster when a single instance fails, the traffic will 
 * use the remaining worker instances, and the main process can detect worker failures and automatically restart those workers. 
 * When you need to update your app you no longer need to tell your customers that the website will be down due to maintenance.
 * You can simply program your cluster to restart each instance with the updated code. Let's take a look at what this looks like in our sample 
 * from the last snippet.
 */
const http = require('http')
const cluster = require('cluster')
const numCPUs = require('os').cpus().length

if (cluster.isMaster) {
  console.log('this is the master process: ', process.pid)
  for (let i=0; i<numCPUs; i++) {
    cluster.fork()
  }

  /**
   *  I wanna listen for failures. So I can do cluster.on exit, now the cluster module implements the event emitter so exit events will 
   * be raised when any worker process dies.
   */

  cluster.on('exit', worker => {
    console.log(`worker process ${process.pid} had died`);
    console.log(`only ${Object.keys(cluster.workers).length} remaining`);
    console.log(`Starting a new worker`);
    cluster.fork()//  to truly make this zero downtime we have to actually restart our instance,  When a worker dies, we'll just go ahead and fork the process and start another worker


  })
} else {
  console.log(`started worker at ${process.pid}`);
  http.createServer((req, res) => {
    res.end(`process: ${process.pid}...`);

    /** So now we need a way for our server to die, and the easiest way we can implement for our server to die is for our user to simply kill it. */
    if (req.url === '/kill') {
      process.exit();
    } else if (req.url === '/') {
      console.log(`serving from ${process.pid}...`);
      
    }

  }).listen(3000)
}

/**
 * I'm just going to go head and kill one of them, by sending a kill request, and now we see that worker 8409 has died, 
 * but we've started a new worker, 8418. So every time we try to kill a worker, one pops up in its place and no matter how many kill events
 * I issue we still have our website running. So I can still browse localhost 3000. It never goes down, it always stays up.
 * If we look at the logs here we can see that we've killed multiple worker processes but we've started a new one each time that worker has died,
 * so this is pretty cool, this is called zero downtime.
 */
