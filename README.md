RuzzleJS
=

A basic Ruzzle solver written in Javascript.

Running It
-
Currently you need [NGINX](http://nginx.com) installed with the [EchoHTTPModule](http://wiki.nginx.org/NginxHttpEchoModule) to serve the wordlist required for solving.

1. Install NGINX 
2. Once you have NGINX installed you can need to modify the config/nginx.local.conf file and change the root to where you checked out the files
3. Use the start-local.sh to run NGINX with the configuration file located under config.

Once NGINX is running look at http://localhost:8082/ to see it run.

Don't like NGINX? Would rather have < Insert favourite web server here>? Patches welcome :). 

Caveats
-

The wordlist is that standard /usr/share/dict/words file available on Mac OS X which can be changed simply by replacing the wordList.json file.

We assume the browser you're running on has Javascript enabled (specifically [ES5](http://es5.github.io)), HTML5 and WebWorkers.

Currently NGINX is only serving static content which could just be included in the Javascript files, this is intentional to allow dynamic content to be added later. 