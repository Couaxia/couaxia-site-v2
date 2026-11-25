<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref } from "vue";
import { onBadgeUnlocked, type BadgeUnlockNotification } from "../../services/badge-notifications.service";

/* Couleurs des raretés : valeur Supabase normalisée (accents et casse). */
function badgeRarityClass(rarity: string | null | undefined): string {
    const value = (rarity ?? "")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .trim();

    if (value.includes("legendaire") || value.includes("legendary")) return "rarity-legendary";
    if (value.includes("epique") || value.includes("epic")) return "rarity-epic";
    if (value.includes("rare")) return "rarity-rare";
    return "rarity-common";
}

const current = ref<BadgeUnlockNotification | null>(null);
const queue: BadgeUnlockNotification[] = [];
let stopListening: (() => void) | null = null;
let hideTimer: ReturnType<typeof setTimeout> | null = null;
let transitionTimer: ReturnType<typeof setTimeout> | null = null;

function next() {
  if (current.value || !queue.length) return;
  current.value = queue.shift() ?? null;
  if (!current.value) return;
  hideTimer = setTimeout(() => {
    current.value = null;
    transitionTimer = setTimeout(next, 350);
  }, 4500);
}
function enqueue(badge: BadgeUnlockNotification) {
  if (current.value?.id === badge.id || queue.some(item => item.id === badge.id)) return;
  queue.push(badge);
  next();
}
function dismiss() {
  if (hideTimer) clearTimeout(hideTimer);
  current.value = null;
  transitionTimer = setTimeout(next, 350);
}
onMounted(() => { stopListening = onBadgeUnlocked(enqueue); });
onBeforeUnmount(() => {
  stopListening?.();
  if (hideTimer) clearTimeout(hideTimer);
  if (transitionTimer) clearTimeout(transitionTimer);
});
</script>

<template>
  <div class="couaxia-badge-toast-host" aria-live="polite" aria-atomic="true">
    <Transition name="couaxia-badge-pop">
      <div v-if="current" :key="current.id" class="couaxia-badge-toast" :class="badgeRarityClass(current.rarity)" role="status">
        <div class="couaxia-badge-toast__glow" aria-hidden="true"></div>
        <div class="couaxia-badge-toast__icon" aria-hidden="true">{{ current.icon }}</div>
        <div class="couaxia-badge-toast__body">
          <div class="couaxia-badge-toast__eyebrow">🏆 SUCCÈS DÉBLOQUÉ !</div>
          <strong class="couaxia-badge-toast__title">{{ current.title }}</strong>
          <span class="couaxia-badge-toast__rarity">{{ current.rarity }} · Badge ajouté à ta collection</span>
        </div>
        <button class="couaxia-badge-toast__close" type="button" aria-label="Fermer la notification" @click="dismiss">×</button>
        <div class="couaxia-badge-toast__progress" aria-hidden="true"></div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>

.couaxia-badge-toast-host {
    position:fixed;
    z-index:2147483647;
    left:20px;
    right:auto;
    bottom:24px;
    pointer-events:none;
    max-width:calc(100vw - 32px)
}


.couaxia-badge-toast {
    position:relative;
    isolation:isolate;
    display:flex;
    align-items:center;
    gap:14px;
    width:min(390px,calc(100vw - 32px));
    min-height:104px;
    padding:18px 38px 20px 17px;
    overflow:hidden;
    pointer-events:auto;
    color:#fff;
    border:1px solid #bf44d9;
    border-radius:20px;
    background:linear-gradient(125deg,#2b093e 0%,#170923 54%,#370a40 100%);
    box-shadow:0 12px 42px #0009,0 0 24px #ed2bb555
}


.couaxia-badge-toast__glow {
    position:absolute;
    inset:-60% 60% -60% -20%;
    z-index:-1;
    background:radial-gradient(circle,#ff27b533,transparent 68%)
}


.couaxia-badge-toast__icon {
    display:grid;
    place-items:center;
    flex:none;
    width:62px;
    height:62px;
    font-size:34px;
    border-radius:17px;
    background:linear-gradient(140deg,#8c0a9c66,#ff2dbd44);
    border:1px solid #fa67d888;
    box-shadow:0 0 18px #ff35c844
}


.couaxia-badge-toast__body {
    display:flex;
    flex-direction:column;
    gap:4px;
    min-width:0
}


.couaxia-badge-toast__eyebrow {
    font-size:11px;
    font-weight:900;
    letter-spacing:1.1px;
    color:#59f4f1
}


.couaxia-badge-toast__title {
    font-size:17px;
    line-height:1.2;
    overflow-wrap:anywhere
}


.couaxia-badge-toast__rarity {
    font-size:12px;
    color:#eebce9
}


.couaxia-badge-toast__close {
    position:absolute;
    top:9px;
    right:11px;
    cursor:pointer;
    border:0;
    background:transparent;
    color:#f4c8eb;
    font-size:25px;
    line-height:1
}


.couaxia-badge-toast__progress {
    position:absolute;
    bottom:0;
    left:0;
    height:4px;
    width:100%;
    background:linear-gradient(90deg,#9a00ff,#ff25a9,#55e9f4);
    transform-origin:left;
    animation:couaxia-badge-timer 4.5s linear forwards
}


.couaxia-badge-pop-enter-active,.couaxia-badge-pop-leave-active {
    transition:opacity .3s ease,transform .3s ease
}


.couaxia-badge-pop-enter-from,.couaxia-badge-pop-leave-to {
    opacity:0;
    transform:translateY(22px) scale(.96)
}


@keyframes couaxia-badge-timer {
    to {
    transform:scaleX(0)
}


}


@media(max-width:600px) {
    .couaxia-badge-toast-host {
    left:12px;
    right:auto;
    bottom:12px
}

.couaxia-badge-toast {
    padding:14px 34px 17px 13px;
    gap:10px
}

.couaxia-badge-toast__icon {
    width:50px;
    height:50px;
    font-size:28px
}


}


@media(prefers-reduced-motion:reduce) {
    .couaxia-badge-pop-enter-active,.couaxia-badge-pop-leave-active {
    transition:none
}

.couaxia-badge-toast__progress {
    animation:none
}


}



/* Couleurs du toast selon la rareté du succès */
.couaxia-badge-toast.rarity-common { --badge-accent: #a6a8b6; --badge-glow: rgba(166,168,182,.24); }
.couaxia-badge-toast.rarity-rare { --badge-accent: #42b8ff; --badge-glow: rgba(66,184,255,.27); }
.couaxia-badge-toast.rarity-epic { --badge-accent: #b777ff; --badge-glow: rgba(183,119,255,.28); }
.couaxia-badge-toast.rarity-legendary { --badge-accent: #f4bf4c; --badge-glow: rgba(244,191,76,.32); }
.couaxia-badge-toast[class*="rarity-"] {
    border-color: var(--badge-accent);
    box-shadow: 0 12px 42px #0009, 0 0 24px var(--badge-glow);
}
.couaxia-badge-toast[class*="rarity-"] .couaxia-badge-toast__icon {
    border-color: var(--badge-accent);
    box-shadow: 0 0 18px var(--badge-glow);
}
.couaxia-badge-toast[class*="rarity-"] .couaxia-badge-toast__progress {
    background: linear-gradient(90deg, var(--badge-accent), #ff25a9);
}
.couaxia-badge-toast.rarity-legendary {
    animation: couaxia-toast-gold 2.5s ease-in-out infinite;
}
@keyframes couaxia-toast-gold {
    0%, 100% { box-shadow: 0 12px 42px #0009, 0 0 12px rgba(244,191,76,.2); }
    50% { box-shadow: 0 12px 42px #0009, 0 0 30px rgba(244,191,76,.48); }
}
@media (prefers-reduced-motion: reduce) {
    .couaxia-badge-toast.rarity-legendary { animation: none; }
}
</style>
