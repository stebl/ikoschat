# Installation

## Pre-reqs

Requires node 6.
Install nvm https://github.com/creationix/nvm

Install node 6
`nvm install 6`

## Server

Simple package install, then start to launch the server.
Defaults to port 1337.

`cd server`
`npm install`
`npm start`

## Client

`cd client`
`npm install`
`npm start <name> <channel>`

# Test Procedure

* Launch the server
* Open a new terminal and launch the client
  ex. `npm start steve random`
* Open a new terminal and launch another client with the same room
  ex. `npm start steveblass random`
* chat between the two clients

# dev notes
had to do a weird bootstrapping process to get sails to work without
creating a custom docker image (sails prefers a global install)

chose not to setup git due to short nature of project.

opted to test first w/ sails socket io - it provides
some extra magic that vanilla socket io does not,
this necessitated a language switch

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
