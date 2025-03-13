# Getting started

This is a sample to-do list web-application that will be extended as part of your coding interview. Please read the notes below before you get started, and good luck!

Run `npm install` and `npm start` from the root of this directory to get started! Your tasks are defined in INSTRUCTIONS.md

# Files

`src` contains all of our react code for this web app. For simplicity, we'll only discuss the files there.

All code in `src`, with the exception of the `pages` directory, configures the common logic that all of our routes/components are built from.

## Pages

This folder defines the pages that are rendered for the `Route` associated with each URL path. Inside we have source code and CSS for the following pages:

- Homepage
- To-do list
- Completed Tasks

# Interacting with the DB

We use json-server to create a mock server/DB based on the schema in `database/db.json`. You can perform CRUD operations on the DB using `axios`. Specifically, the following functions in `axios` represent the corresponding CRUD operations:

- Create: `axios.post`
- Read: `axios.get`
- Update: `axios.put`
- Delete: `axios.delete`

You can request all items in the DB by making a GET request to `http://localhost:3001/items`.

You can request _specific_ items in the DB by using query parameters, i.e. `http://localhost:3001/items?isComplete=false`.
