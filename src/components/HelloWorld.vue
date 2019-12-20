<template>
  <div class="hello">
    <hello-heaven />
    <hello-heaven />
  </div>
</template>

<script>
import HelloHeaven from '@/components/HelloHeaven'
import Home from '@/views/Home'
import About from '@/views/About'
export default {
  name: 'HelloWorld',
  components: { HelloHeaven }
}
</script>

<style scoped lang="scss">
.hello {
  background-color: #42b983;
  width: 300px;
  height: 100px;
}
</style>
