# Installation

## Pre-reqs

* Install nvm https://github.com/creationix/nvm
* `nvm install 6`

## Server

Simple package install, then start to launch the server.
Defaults to port 1337.

* `cd server`
* `npm install`
* `npm start`

## Client

* `cd client`
* `npm install`
* `npm start <username> [channel]`

## client usage

* `npm start <username> [channel]`
* `<username>` - required username
* `[channel]` - optional channel to join, defaults to 'general'. will be created if it does not exist.

After starting the client,

* `/help` - display in-chat help
* `/channels` - display all existing channels
* `/join <channel>` - will join a new channel.  will be created if it does not exist.

# Test Procedure

* Launch the server
* Open a new terminal and launch the client
  ex. `npm start steve random`
* Open a new terminal and launch another client with the same room
  ex. `npm start steveblass random`
* chat between the two clients
* use `/channels` to list other channels
* use `/join <channel>` switch channels

# dev notes
opted to test first w/ sails socket io - it provides
some extra magic that vanilla socket io does not,
this necessitated a language switch


opted to drop docker due to networking issues.  npm portability should be
sufficient

# TODO
* TESTS
* robustness, particularly input handling for name & channel name, reconnect events
* after refactored for better testing, function docs.
* help messages for CLI program
* turn users into a model
* fix the extra GET to improve performance
* should switch over to UUIDs rather than iterable indices
* properly setup prod vs test environments
* lint everything
* resolve docker networking issues
