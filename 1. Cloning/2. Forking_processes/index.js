/**
 * Because Node.js is single threaded, we've run into the need to scale our applications much sooner that we would if we were using another 
 * programming language. It's not a problem. This is actually a benefit of Node because we get to talk about scaling much earlier in the 
 * application lifecycle because Node applications are made to scale. Node.js is designed to clone your application and then run it using 
 * multiple instances simultaneously. This process is called forking. Let's take a look at how we can fork our advice server.
 */

const { fork } = require('child_process');

const processes = [
    fork('./app.js', [3001]),
    fork('./app.js', [3002]),
    fork('./app.js', [3003])
]

console.log(`forked ${processes.length} processes`)

/**
 * So now, when I run the index file, we will actually fork our application. We will clone it into three processes, each running on its own port.
 * They each have their own memory, and they each have their own processID.
 * 
 * This is a small example of how we can use the fork method available to us within the child_process module. Here, we took our application,
 * our app.js file, and forked it into three separate instances that use the same code. There is another module that we can use to fork our 
 * application into a pool of processes. In the next lesson, we'll take a look at how we can create a process pool using the cluster module.
 */