#!/bin/bash

nginx -c `pwd`/config/nginx.local.conf -s restart
