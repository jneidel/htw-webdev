const App = {
  data() {
    return {
      newTodo: "",
      todos  : [ // load from db
        { id: 123, completed: false, text: "big chungus" },
      ],
    };
  },

  computed: {
    remaining() {
      return this.todos.filter( t => !t.completed ).length;
    },
  },
  methods: {
    pluralize( word, count ) {
      return word + ( count === 1 ? "" : "s" );
    },
    addTodo() {
      const value = this.newTodo && this.newTodo.trim();
      console.log( `Adding: ${  value}` );
      if ( !value ) return;
      this.todos.push( { id: this.todos.length + 1, text: value, completed: false } ); // put tempId, to be replaced w/ uuid from db
      this.newTodo = "";
      // sync w/ db
    },
    removeTodo( todo ) {
      const index = this.todos.indexOf( todo );
      console.log( `Removing: ${  this.todos[index].text}` );
      this.todos.splice( index, 1 );
      // sync w/ db
    },
    edit( todo ) {
      console.log( `Done editing: ${  todo.text}` );
      todo.text = todo.text.trim();
      if ( !todo.text ) this.removeTodo( todo );
      // sync w/ db
    },
    removeCompleted() {
      this.todos = this.todos.filter( t => !t.completed );
      // sync w/ db
    },
  },
};

Vue.createApp( App ).mount( "#main" ); // eslint-disable-line no-undef
