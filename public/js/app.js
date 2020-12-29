const App = {
  data() {
    return {
      todos: [
				{ id:123, completed:false, text: "big chungus" },
			],
      newTodo: "",
    };
  },
  methods: {
		addTodo: function () {
      console.log( "adding" )
			var value = this.newTodo && this.newTodo.trim();
			if (!value) {
				return;
			}
			this.todos.push({ id: this.todos.length + 1, title: value, completed: false });
			this.newTodo = '';
		},

		removeTodo: function (todo) {
      console.log( "removing" )
			var index = this.todos.indexOf(todo);
			this.todos.splice(index, 1);
		},

		editTodo: function (todo) {
      console.log( "editing" )
			this.beforeEditCache = todo.title;
			this.editedTodo = todo;
		},

		doneEdit: function (todo) {
      console.log( "done editing" )
			if (!this.editedTodo) {
				return;
			}
			this.editedTodo = null;
			todo.title = todo.title.trim();
			if (!todo.title) {
				this.removeTodo(todo);
			}
		},
  },
  mounted() {
    // setInterval( () => {
    //   console.log( this.todos )
    // }, 1000 );
  },
};

Vue.createApp( App ).mount( "#main" ); // eslint-disable-line no-undef
