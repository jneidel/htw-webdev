# htw-webdev-todo

>

[![Travis Build Status](https://img.shields.io/travis/jneidel/htw-webdev-todo.svg?style=flat-square)](https://travis-ci.org/jneidel/htw-webdev-todo)
[![Heroku Deployment master](https://img.shields.io/badge/deployment-master-brightgreen?style=flat-square)](https://htw-wd-todo.herokuapp.com)
[![License MIT](https://img.shields.io/badge/license-GPLv3-green.svg?style=flat-square)](LICENSE)

[View App Deployment](https://htw-wd-todo.herokuapp.com)

## Stack

- Node (backend)
- Express (http server)
- MariaDB (SQL database)
- Vue@3 (spa framework)
- jest (test runner)
- pug (html template)
- eslint (linter)

## Installation

```sh
npm install
```

Install database

```sh
yay -S mariadb
```

## Usage

Start the server:

```sh
npm start
```

Start the database:

```sh
sudo systemctl start mysql
```

## ER Diagram

edit on [draw.io](https://app.diagrams.net/#Hjneidel%2Fhtw-webdev-todo%2Fer-diagramm%2Fhtw-wd-todo.drawio)

## API

Response format:
```json
{
  "error": false,
  "errorMsg": "",
  ...
}
```

### GET `/api/todos`

Get all todos.

Res:
```json
{
  "todos": []
}
```

### DELETE `/api/todos`

Remove all completed todos.

Res:
```json
{}
```

### POST `/api/todo`

Insert a todo.

Req:
```json
{
  "text": "todo text"
}
```

Res:
```
{
  "id": "uuid"
}
```

### PUT `/api/todo`

Update a todo.

Req:
```json
{
  "id": "uuid",
  "text?": "updated todo text",
  "done?": true
}
```

### DELETE `/api/todo`

Delete a todo.

Req:
```json
{
  "id": "uuid"
}
```

## Attribution

**Icons**

- [Plus](https://www.flaticon.com/free-icon/plus_1828925)
- [Paint Brush](https://www.flaticon.com/free-icon/paint-brush_587377)
