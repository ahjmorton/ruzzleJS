#!/usr/bin/python

from sys import argv, stdin
import json

def get_source() :
    source = stdin
    if len(argv) == 2 :
        source = open(argv[1], "r");
    return source

with get_source() as input :
    input_lines = input.readlines()

result = dict()
for aline in input_lines :
    first, second, prob = aline.split(":")
    if first not in result :
        result[first] = dict()
    result[first][second] = float(prob)
print json.dumps(result)
