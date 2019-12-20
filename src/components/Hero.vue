<template>
  <div>
    <HeroName />
    <HeroWeapon />
    <HeroWeapon />
    <HeroWeapon />
    <HeroWeapon />
  </div>
</template>

<script>
import HeroName from '@/components/HeroName'
import HeroWeapon from "@/components/HeroWeapon";
export default {
  name: 'Hero',
  components: {HeroWeapon, HeroName }
}
</script>

<style scoped></style>
