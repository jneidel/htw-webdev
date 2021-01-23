function request( route, method, data ) { // non get
  return fetch( "/api/" + route, { method, body: JSON.stringify( data ), headers: { 'Content-Type': 'application/json' } } )
    .catch( e => console.log( e ) );
}

const App = {
  data() {
    return {
      newTodo: "",
      todos  : [],
    };
  },
  mounted: function() {
    fetch( "/api/todos" )
      .then( res => res.json() )
      .then( data => {
        if ( data.error )
          throw new Error( data.errorMsg );

        this.todos = data.todos;
      } );
  },
  computed: {
    remaining() {
      return this.todos.filter( t => !t.done ).length;
    },
  },
  methods: {
    pluralize( word, count ) {
      return word + ( count === 1 ? "" : "s" );
    },
    addTodo() {
      const value = this.newTodo && this.newTodo.trim();
      if ( !value )
        return;

      request( "/todo", "POST", { text: value } )
        .then( res => res.json() )
        .then( ({ id }) => {
          this.todos.push( { id, text: value, done: false } );
        } );

      this.newTodo = "";
    },
    removeTodo( todo ) {
      request( "/todo", "DELETE", { id: todo.id } )

      const index = this.todos.indexOf( todo );
      this.todos.splice( index, 1 );
    },
    edit( todo ) {
      todo.text = todo.text.trim();
      if ( !todo.text )
        this.removeTodo( todo );

      request( "/todo", "PUT", { id: todo.id, text: todo.text } )
    },
    toggleCompleted( todo ) {
      request( "/todo", "PUT", { id: todo.id, done: !todo.done } ) // done inverted bc it has not updated yet via v-model
    },
    removeCompleted() {
      this.todos = this.todos.filter( t => !t.done );
      // sync w/ db
    },
  },
};

Vue.createApp( App ).mount( "#main" ); // eslint-disable-line no-undef
