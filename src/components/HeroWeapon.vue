<template>
  <div>
    <h4>Super Weapon</h4>
    <WeaponButt />
    <WeaponHolder />
  </div>
</template>

<script>
import WeaponButt from '@/components/WeaponButt'
import WeaponHolder from '@/components/WeaponHolder'
export default {
  name: 'HeroWeapon',
  components: { WeaponHolder, WeaponButt }
}
</script>

<style scoped></style>
