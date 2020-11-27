const Main = {
  data() {
    return {
      h1  : "htw-webdev-todo",
      time: Date.now(),
    };
  },
  mounted() {
    setInterval( () => {
      this.time = Date.now();
    }, 1000 );
  },
};

Vue.createApp( Main ).mount( "#main" ); // eslint-disable-line no-undef