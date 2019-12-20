<template>
  <div class="home">
    <Hero />
    <Hero />
  </div>
</template>

<script>
import HelloWorld from '@/components/HelloWorld'
import Hero from '@/components/Hero'
export default {
  name: 'home',
  components: { Hero, HelloWorld }
}
</script>
