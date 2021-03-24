function request( route, method, data = {} ) {
  return fetch( `/api/${route}`, { method, body: method === "GET" ? null : JSON.stringify( data ), headers: { "Content-Type": "application/json" } } )
    .catch( err => console.log( err ) );
}

const App = {
  data() {
    return {
      newTodo       : "",
      todos         : [],
      lists         : [],
      currentList   : -1, // index on lists
      isEditingLists: false,
    };
  },
  mounted() {
    fetch( "/api/lists" )
      .then( res => res.json() )
      .then( data => {
        if ( data.error )
          throw new Error( data.errorMsg );

        this.todos = data.todos;
        this.lists = data.lists;
        this.currentList = 0;
        this.updateListsColoredBorder();

        // inital hide, so that when new lists are added the trash can is visible
        setTimeout( () => {
          [ ...document.querySelectorAll( ".trash" ) ].forEach( trash => trash.style.display = "none" );
        }, 10 );
      } );
  },
  computed: {
    remaining() {
      return this.todos.filter( t => !t.done ).length;
    },
    list() { // shorthand to active list
      return this.lists[this.currentList];
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

      request( "/todo", "POST", { text: value, listId: this.list.id } )
        .then( res => res.json() )
        .then( ( { id } ) => {
          this.todos.unshift( { id, text: value, done: false } );
        } );

      this.newTodo = "";
    },
    removeTodo( todo ) {
      request( "/todo", "DELETE", { id: todo.id } );

      const index = this.todos.indexOf( todo );
      this.todos.splice( index, 1 );
    },
    edit( todo ) {
      todo.text = todo.text.trim();
      if ( !todo.text )
        this.removeTodo( todo );

      request( "/todo", "PUT", { id: todo.id, text: todo.text, listId: this.list.id } );
    },
    toggleCompleted( todo ) {
      request( "/todo", "PUT", { id: todo.id, done: !todo.done } ); // done inverted bc it has not updated yet via v-model
    },
    removeCompleted() {
      this.todos = this.todos.filter( t => !t.done );
      request( "/todos", "DELETE" );
    },
    switchActiveList( list ) {
      if ( !this.isEditingLists ) {
        const newIndex = this.lists.indexOf( list );
        if ( this.currentList != newIndex ) {
          this.currentList = newIndex;
          this.updateListsColoredBorder();
          request( `/todos?listId=${  this.list.id}`, "GET" )
            .then( res => res.json() )
            .then( data => this.todos = data.todos );
        }
      }
    },
    updateListsColoredBorder() {
      setTimeout( () => {
        [ ...document.querySelector( "#lists-list" ).children ].forEach( ( list, index ) => {
          if ( index === this.currentList )
            list.style.border = `1px solid ${this.list.color}`;
          else
            list.style.border = "1px solid white";

        } );
      }, 10 ); // w/o wait vue hasn't generated the spans yet
    },
    toggleEditListMode() {
      this.isEditingLists = !this.isEditingLists;
      [ ...document.querySelector( "#lists-list" ).children ].forEach( list =>
        [ ...list.children ].forEach( item => item.disabled = !item.disabled )
      );
      const plus = document.querySelector( "#plus" );
      plus.style.visibility = !plus.style.visibility || plus.style.visibility === "hidden" ? "visible" : "hidden";
      const brush = document.querySelector( "#brush" );
      brush.style.opacity = brush.style.opacity == 1 ? 0.3 : 1;

      [ ...document.querySelectorAll( ".trash" ) ].forEach( trash => trash.style.display = !trash.style.display || trash.style.display === "none" ? "inline-block" : "none" );
    },
    addNewList() {
      request( "/list", "POST" )
        .then( res => res.json() )
        .then( data => this.lists.push( data ) );
    },
    editList( list ) {
      this.updateListsColoredBorder();
      request( "/list", "PUT", list );
    },
    deleteList( list ) {
      if ( list.id === this.list.id )
        this.currentList = 0;

      request( "/list", "DELETE", { id: list.id } )
        .then( r => this.lists.splice( this.lists.indexOf( list ), 1 ) );
    },
  },
};

Vue.createApp( App ).mount( "#main" ); // eslint-disable-line no-undef
