<script setup lang="ts">
import { onBeforeUnmount, watch } from 'vue';
import TentacleRunGame from './TentacleRunGame.vue';
import '../../assets/styles/components/tentacle-run.css';
const props = defineProps<{ open: boolean }>();
const emit = defineEmits<{ close: [] }>();
function close() { emit('close'); }
function onKey(event: KeyboardEvent) { if (event.key === 'Escape' && props.open) close(); }
watch(() => props.open, (open) => { document.body.style.overflow = open ? 'hidden' : ''; });
window.addEventListener('keydown', onKey);
onBeforeUnmount(() => { window.removeEventListener('keydown', onKey); document.body.style.overflow = ''; });
</script>
<template>
  <Teleport to="body">
    <div v-if="open" class="tentacle-lightbox" role="presentation" @click.self="close">
      <section class="tentacle-lightbox__panel" role="dialog" aria-modal="true" aria-labelledby="tentacle-title">
        <header class="tentacle-lightbox__header">
          <div><span class="tentacle-lightbox__eyebrow">✦ SECRET DE SAPHIRA ✦</span><h2 id="tentacle-title">🐙 Tentacle Run</h2><p>Saute par-dessus les obstacles et bats ton record !</p></div>
          <button type="button" class="tentacle-lightbox__close" aria-label="Fermer le mini-jeu" @click="close">✕</button>
        </header>
        <TentacleRunGame />
      </section>
    </div>
  </Teleport>
</template>
