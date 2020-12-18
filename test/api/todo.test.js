const express = require( "express" );
const bodyParser = require( "body-parser" );
const request = require( "supertest" );

// apiErrorHandler middleware logs errors
global.console = {
  error: jest.fn(),
};

const DBresolvedReq = ( data = {} ) => jest.fn( () => Promise.resolve( data ) );
const DBrejectedReq  = err => jest.fn( () => Promise.reject( err ) );

let app, TodoMock;

beforeEach( () => {
  // setup app, different instances for paralell execution w/ seperate mocks
  app = express();
  app.use( bodyParser.json() );
  app.use( bodyParser.urlencoded( { extended: true } ) );

  TodoMock = {
    findAll: DBresolvedReq(),
    update: DBresolvedReq(),
    destroy: DBresolvedReq(),
    create: DBresolvedReq(),
  }
  app.use( ( req, res, next ) => {
    req.models = { Todo: TodoMock };
    next();
  } );
  app.use( "/api", require( "../../routes/api" ) );
  app.use( "/api", require( "../../routes/apiErrorHandler" ) );
} );


describe( "GET /api/todos", () => {
  test( "success", async () => {
    const expectedTodos = [
      { id: "123", text: "my todo", createdAt: "now" }
    ];
    TodoMock.findAll = DBresolvedReq( expectedTodos );

    const res = await request( app )
      .get( "/api/todos")

    expect( res.status ).toBe( 200 );
    expect( res.body.error ).toBeFalsy();
    expect( res.body.todos ).toEqual( expectedTodos );
  } );
});

describe( "POST /api/todo", () => {
  test( "success", async () => {
    const expectedUUID = "123";
    TodoMock.create = DBresolvedReq( { id: expectedUUID } );

    const res = await request( app )
      .post( "/api/todo")
      .send( { text: "a todo" } );

    expect( res.status ).toBe( 200 );
    expect( res.body.error ).toBeFalsy();
    expect( res.body.id ).toBe( expectedUUID );
  } );

  test( "empty todo text - send none", async () => {
    const res = await request( app )
      .post( "/api/todo")

    expect( res.status ).toBe( 400 );
    expect( res.body.error ).toBeTruthy();
    expect( res.body.errorMsg ).toBe( "empty todo text" );
  } );
  test( "empty todo text - send empty", async () => {
    const res = await request( app )
      .post( "/api/todo")
      .send( { text: "" } );

    expect( res.status ).toBe( 400 );
    expect( res.body.error ).toBeTruthy();
    expect( res.body.errorMsg ).toBe( "empty todo text" );
  } );
} );

describe( "PUT /api/todo", () => {
  test( "update text", async () => {
    const data = { id: "123", text: "myText" };

    const res = await request( app )
      .put( "/api/todo")
      .send( data );

    expect( res.status ).toBe( 200 );
    expect( res.body.error ).toBeFalsy();
    expect( TodoMock.update.mock.calls[0][0].text ).toBe( data.text );
  } );
  test( "update done", async () => {
    const data = { id: "123", done: false };

    const res = await request( app )
      .put( "/api/todo")
      .send( data );

    expect( res.status ).toBe( 200 );
    expect( res.body.error ).toBeFalsy();
    expect( TodoMock.update.mock.calls[0][0].done ).toBe( data.done );
  } );
  test( "update both", async () => {
    const data = { id: "123", text: "myText", done: true };

    const res = await request( app )
      .put( "/api/todo")
      .send( data );

    expect( res.status ).toBe( 200 );
    expect( res.body.error ).toBeFalsy();
    expect( TodoMock.update.mock.calls[0][0].text ).toBe( data.text );
    expect( TodoMock.update.mock.calls[0][0].done ).toBe( data.done );
  } );
  test( "missing todo id", async () => {
    const data = { id: "", text: "myText", done: true };

    const res = await request( app )
      .put( "/api/todo")
      .send( data );

    expect( res.status ).toBe( 400 );
    expect( res.body.error ).toBeTruthy();
    expect( res.body.errorMsg ).toBe( "missing todo id" );
  } );
  test( "empty todo text", async () => {
    const data = { id: "213", text: "", done: true };

    const res = await request( app )
      .put( "/api/todo")
      .send( data );

    expect( res.status ).toBe( 400 );
    expect( res.body.error ).toBeTruthy();
    expect( res.body.errorMsg ).toBe( "empty todo text" );
  } );
  test( "nothing to update", async () => {
    const data = { id: "213" };

    const res = await request( app )
      .put( "/api/todo")
      .send( data );

    expect( res.status ).toBe( 400 );
    expect( res.body.error ).toBeTruthy();
    expect( res.body.errorMsg ).toBe( "nothing to update" );
  } );
});

describe( "DELETE /api/todo", () => {
  test( "success", async () => {
    const data = { id: "123" };

    const res = await request( app )
      .delete( "/api/todo")
      .send( data );

    expect( res.status ).toBe( 200 );
    expect( res.body.error ).toBeFalsy();
  } );
  test( "missing todo id", async () => {
    const data = { id: "" };

    const res = await request( app )
      .delete( "/api/todo")
      .send( data );

    expect( res.status ).toBe( 400 );
    expect( res.body.error ).toBeTruthy();
    expect( res.body.errorMsg ).toBe( "missing todo id" );
  } );

} );
