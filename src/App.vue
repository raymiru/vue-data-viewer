<template>
  <div id="app">
    <vue-data-viewer :w="300" :h="300" :t="0" />
    <Home />
    <Home />
  </div>
</template>
<script>
import VueDataViewer from '../vue-data-viewer/dv'
import Home from '@/views/Home'
import About from '@/views/About'
export default {
  name: 'App',
  components: {
    Home,
    About,
    // eslint-disable-next-line vue/no-unused-components
    VueDataViewer
  }
}
</script>
<style lang="scss">
body {
  margin: 0;
  padding: 0;
}
#app {
  position: relative;
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
