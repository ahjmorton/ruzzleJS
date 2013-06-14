RuzzleJS
=======

A basic Ruzzle solver written in Javascript.

Running It
=======
Currently you need [NGINX](http://nginx.com) installed with the [EchoHTTPModule](http://wiki.nginx.org/NginxHttpEchoModule) to serve the wordlist required for solving.

Once you have NGINX installed you can use the start-local.sh to run NGINX with the configuration file located under config.

Once NGINX is running look at http://localhost:8082/ to see it run.

Don't like NGINX? Would rather have < Insert favourite web server here>? Patches welcome :). 

Caveats
======

The wordlist is that standard /usr/share/dict/words file available on Mac OS X which can be changed simply by replacing the wordList.json file.

We assume the browser you're running on has Javascript enabled (specifically [ES5](http://es5.github.io)), HTML5 and WebWorkers.