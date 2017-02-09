#!/bin/bash

# branches
git checkout master
docpad generate --env static
git checkout 1.9.x
docpad generate --env static
git checkout 2.x.x
docpad generate --env static

# tags
git checkout v2.0.0
docpad generate --env static

# back to normal
git checkout master
