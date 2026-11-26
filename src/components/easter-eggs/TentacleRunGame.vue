<script setup lang="ts">

import { onBeforeUnmount, onMounted, ref } from "vue";
import { supabase } from "../../lib/supabase";
import { getTentacleStats, saveTentacleResult, getTentacleLeaderboard, type TentacleScoreRow } from "../../services/tentacle-run.service";

import hyldaSprite from "../../assets/images/hylda.png";

import citaSprite from "../../assets/images/Cita.png";



type GameStatus = "ready" | "running" | "over";

type CharacterId = "hylda" | "cita";

type ObstacleType = "coral" | "rock" | "fish-low" | "fish-high";



interface Obstacle {

  x: number;

  y: number;

  width: number;

  height: number;

  type: ObstacleType;

  phase: number;

}

interface Bubble { x: number; y: number; radius: number; speed: number; phase: number }

interface Seaweed { x: number; height: number; phase: number }



const WIDTH = 760;

const HEIGHT = 260;

const FLOOR = 216;

const PLAYER_X = 78;

const PLAYER_SIZE = 48;

const GRAVITY = 1500;

const JUMP = -560;

const BEST_KEY = "couaxia:tentacle-run:best";

const CHARACTER_KEY = "couaxia:tentacle-run:character";



const characters = [

  { id: "hylda" as const, name: "Hylda", image: hyldaSprite },

  { id: "cita" as const, name: "Cita", image: citaSprite }

];



const canvas = ref<HTMLCanvasElement | null>(null);

const score = ref(0);

const best = ref(0);
const totalGames = ref(0);
const leaderboard = ref<TentacleScoreRow[]>([]);
const scoreError = ref("");
const savingScore = ref(false);
const isLoggedIn = ref(false);
let resultSavePending = false;

async function refreshScores() {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    isLoggedIn.value = Boolean(user);
    if (user) {
      try { localStorage.setItem(`couaxia:tentacle-run:discovered:${user.id}`, "1"); } catch { /* stockage facultatif */ }
    }
    const [stats, ranking] = await Promise.all([getTentacleStats(), getTentacleLeaderboard()]);
    if (stats) {
      best.value = Math.max(best.value, stats.best_score);
      totalGames.value = stats.games_played;
    }
    leaderboard.value = ranking;
  } catch (error) {
    console.error("Tentacle Run : chargement des scores", error);
    scoreError.value = "Classement indisponible pour le moment.";
  }
}

async function persistGameResult(finalScore: number, character: CharacterId) {
  if (resultSavePending) return;
  resultSavePending = true;
  savingScore.value = true;
  scoreError.value = "";
  try {
    const result = await saveTentacleResult(finalScore, character);
    if (result) {
      totalGames.value = result.games_played;
      best.value = Math.max(best.value, result.best_score);
      window.dispatchEvent(new CustomEvent("couaxia:tentacle-run-updated", {
        detail: { userId: result.user_id, bestScore: result.best_score, gamesPlayed: result.games_played }
      }));
      leaderboard.value = await getTentacleLeaderboard();
    }
  } catch (error) {
    console.error("Tentacle Run : sauvegarde du score", error);
    scoreError.value = "Impossible d’enregistrer le score sur ton profil.";
  } finally {
    resultSavePending = false;
    savingScore.value = false;
  }
}


const status = ref<GameStatus>("ready");

const selectedCharacter = ref<CharacterId>("hylda");



let ctx: CanvasRenderingContext2D | null = null;

let frame = 0;

let lastTime = 0;

let elapsed = 0;

let y = FLOOR - PLAYER_SIZE;

let velocity = 0;

let distance = 0;

let nextObstacleDistance = 340;

let obstacles: Obstacle[] = [];

let bubbles: Bubble[] = [];

let seaweeds: Seaweed[] = [];

let active = false;



// Each character is loaded once and cached for the canvas.

const sprites: Partial<Record<CharacterId, HTMLImageElement>> = {};



function loadSprites() {

  for (const character of characters) {

    const image = new Image();

    image.onload = () => { if (active) draw(); };

    image.onerror = () => console.error(`Impossible de charger ${character.name} : ${character.image}`);

    image.src = character.image;

    sprites[character.id] = image;

  }

}



function chooseCharacter(id: CharacterId) {

  if (status.value === "running") return;

  selectedCharacter.value = id;

  try { localStorage.setItem(CHARACTER_KEY, id); } catch { /* Storage optional */ }

  draw();

}



function random(min: number, max: number) { return min + Math.random() * (max - min); }

function clamp(value: number, min: number, max: number) { return Math.max(min, Math.min(max, value)); }



function createDecorations() {

  bubbles = Array.from({ length: 28 }, () => ({

    x: random(0, WIDTH), y: random(0, HEIGHT), radius: random(1.5, 4),

    speed: random(9, 27), phase: random(0, Math.PI * 2)

  }));

  seaweeds = Array.from({ length: 17 }, (_, index) => ({

    x: index * 52 + random(-12, 12), height: random(15, 40), phase: random(0, Math.PI * 2)

  }));

}



function getSpeed() { return Math.min(450, 260 + distance / 35); }

function getObstacleGap() {

  if (score.value < 500) return random(330, 460);

  if (score.value < 1500) return random(300, 420);

  return random(280, 390);

}



function spawnObstacle() {

  const types: ObstacleType[] = ["coral", "rock", "fish-low", "fish-high"];

  const type = types[Math.floor(Math.random() * types.length)] ?? "coral";

  let obstacle: Obstacle;

  if (type === "coral") {

    const height = random(26, 43);

    obstacle = { x: WIDTH + 20, y: FLOOR - height, width: random(24, 32), height, type, phase: 0 };

  } else if (type === "rock") {

    const height = random(20, 33);

    obstacle = { x: WIDTH + 20, y: FLOOR - height, width: random(27, 38), height, type, phase: 0 };

  } else if (type === "fish-low") {

    obstacle = { x: WIDTH + 20, y: FLOOR - 30, width: 34, height: 20, type, phase: random(0, Math.PI * 2) };

  } else {

    obstacle = { x: WIDTH + 20, y: FLOOR - 84, width: 38, height: 20, type, phase: random(0, Math.PI * 2) };

  }

  obstacles.push(obstacle);

}



function reset() {

  score.value = 0;

  y = FLOOR - PLAYER_SIZE;

  velocity = 0;

  distance = 0;

  elapsed = 0;

  obstacles = [];

  nextObstacleDistance = 340;

}



function start() {

  reset();

  status.value = "running";

  lastTime = 0;

  if (!frame) frame = requestAnimationFrame(tick);

}



function jump() {

  if (status.value !== "running") { start(); return; }

  if (y >= FLOOR - PLAYER_SIZE - 1) velocity = JUMP;

}



function onKey(event: KeyboardEvent) {

  if (event.code !== "Space" && event.code !== "ArrowUp") return;

  // Do not steal keyboard events while a different UI control has focus.

  const target = event.target;

  if (target instanceof HTMLElement &&

      (target.matches("input, textarea, select, button, [contenteditable='true']"))) return;

  if (event.repeat) return;

  event.preventDefault();

  jump();

}




/* =========================================================
   FIN DE PARTIE
   - Arrête la partie
   - Met à jour le record local
   - Enregistre le score dans Supabase
   - Actualise le classement des POUP
========================================================= */

function end() {

    // Évite d'enregistrer plusieurs fois la même partie
    if (status.value !== "running") {
        return;
    }

    // Arrête la partie
    status.value = "over";

    // Récupère le score final
    const finalScore = score.value;

    // Récupère le personnage utilisé
    const character = selectedCharacter.value;

    // Met à jour le record personnel
    if (finalScore > best.value) {

        best.value = finalScore;

        try {

            localStorage.setItem(
                BEST_KEY,
                String(best.value)
            );

        } catch {
            // Stockage local facultatif
        }

    }

    // Enregistre le résultat dans Supabase.
    // persistGameResult gère déjà :
    // - la sauvegarde du score
    // - le nombre de parties
    // - l'actualisation du classement
    // - l'événement pour les succès du profil

    void persistGameResult(
        finalScore,
        character
    );

}




function isColliding(obstacle: Obstacle) {

  const playerLeft = PLAYER_X + 12;

  const playerRight = PLAYER_X + PLAYER_SIZE - 12;

  const playerTop = y + 12;

  const playerBottom = y + PLAYER_SIZE - 6;

  const obstacleLeft = obstacle.x + 4;

  const obstacleRight = obstacle.x + obstacle.width - 4;

  const obstacleTop = obstacle.y + 3;

  const obstacleBottom = obstacle.y + obstacle.height - 3;

  return playerRight > obstacleLeft && playerLeft < obstacleRight &&

    playerBottom > obstacleTop && playerTop < obstacleBottom;

}



function update(delta: number) {

  elapsed += delta;

  for (const bubble of bubbles) {

    bubble.y -= bubble.speed * delta;

    bubble.x += Math.sin(elapsed * 2 + bubble.phase) * delta * 5;

    if (bubble.y < -10) { bubble.y = HEIGHT + 10; bubble.x = random(0, WIDTH); }

  }

  if (status.value !== "running") return;

  const speed = getSpeed();

  distance += speed * delta;

  score.value = Math.floor(distance / 10);

  velocity += GRAVITY * delta;

  y = Math.min(FLOOR - PLAYER_SIZE, y + velocity * delta);

  if (y === FLOOR - PLAYER_SIZE) velocity = 0;

  nextObstacleDistance -= speed * delta;

  if (nextObstacleDistance <= 0) {

    spawnObstacle();

    nextObstacleDistance = getObstacleGap();

  }

  for (const obstacle of obstacles) {

    obstacle.x -= speed * delta;

    if (obstacle.type.startsWith("fish")) obstacle.phase += delta * 3;

  }

  obstacles = obstacles.filter(obstacle => obstacle.x + obstacle.width > -20);

  for (const obstacle of obstacles) {

    if (isColliding(obstacle)) { end(); break; }

  }

}



function drawBackground(c: CanvasRenderingContext2D) {

  const gradient = c.createLinearGradient(0, 0, 0, HEIGHT);

  gradient.addColorStop(0, "#092642");

  gradient.addColorStop(0.5, "#12325a");

  gradient.addColorStop(1, "#291342");

  c.fillStyle = gradient;

  c.fillRect(0, 0, WIDTH, HEIGHT);

  c.fillStyle = "rgba(132, 211, 255, 0.045)";

  for (let i = 0; i < 5; i++) {

    const x = i * 180 + 30;

    c.beginPath();

    c.moveTo(x, 0); c.lineTo(x + 34, 0);

    c.lineTo(x + 105, FLOOR); c.lineTo(x + 20, FLOOR);

    c.closePath(); c.fill();

  }

  c.fillStyle = "#18365a";

  c.beginPath(); c.moveTo(0, FLOOR);

  for (let x = 0; x <= WIDTH; x += 8) {

    const wave = Math.sin((x + distance * 0.12) / 80) * 11;

    c.lineTo(x, FLOOR - 34 + wave);

  }

  c.lineTo(WIDTH, FLOOR); c.closePath(); c.fill();

  for (const bubble of bubbles) {

    c.beginPath(); c.arc(bubble.x, bubble.y, bubble.radius, 0, Math.PI * 2);

    c.strokeStyle = "rgba(168, 229, 255, 0.3)";

    c.lineWidth = 1; c.stroke();

  }

}



function drawSeabed(c: CanvasRenderingContext2D) {

  c.fillStyle = "#332047";

  c.fillRect(0, FLOOR, WIDTH, HEIGHT - FLOOR);

  c.fillStyle = "#76517d";

  c.fillRect(0, FLOOR, WIDTH, 3);

  for (let i = 0; i < 65; i++) {

    const x = (i * 79 - distance * 0.4) % WIDTH;

    const wrappedX = (x + WIDTH) % WIDTH;

    c.fillStyle = i % 2 === 0 ? "#84628d" : "#5a456d";

    c.fillRect(wrappedX, FLOOR + 8 + (i * 13) % 30, 3, 2);

  }

  for (const seaweed of seaweeds) {

    const x = ((seaweed.x - distance * 0.25) % WIDTH + WIDTH) % WIDTH;

    const sway = Math.sin(elapsed * 2 + seaweed.phase) * 6;

    c.strokeStyle = "#3d9d91";

    c.lineWidth = 4; c.lineCap = "round";

    c.beginPath(); c.moveTo(x, FLOOR + 5);

    c.quadraticCurveTo(x + sway, FLOOR - seaweed.height / 2,

      x + sway * 1.4, FLOOR - seaweed.height);

    c.stroke();

  }

}



function drawPlayer(c: CanvasRenderingContext2D) {

  const image = sprites[selectedCharacter.value];

  if (!image || !image.complete || image.naturalWidth === 0) return;

  const onGround = y >= FLOOR - PLAYER_SIZE - 1;

  const bob = status.value === "running" && onGround ? Math.sin(elapsed * 10) * 2 : 0;

  const scale = status.value === "running" ? 1 + Math.sin(elapsed * 9) * 0.025 : 1;

  const rotation = status.value === "running" && !onGround

    ? clamp(velocity / 2500, -0.16, 0.16)

    : Math.sin(elapsed * 5) * 0.025;

  c.save();

  c.translate(PLAYER_X + PLAYER_SIZE / 2, y + PLAYER_SIZE / 2 + bob);

  c.rotate(rotation); c.scale(scale, scale);

  c.drawImage(image, -PLAYER_SIZE / 2, -PLAYER_SIZE / 2, PLAYER_SIZE, PLAYER_SIZE);

  c.restore();

}



function drawObstacle(c: CanvasRenderingContext2D, obstacle: Obstacle) {

  const { x, y, width, height, type } = obstacle;

  if (type === "rock") {

    c.fillStyle = "#806e9c";

    c.beginPath(); c.moveTo(x, FLOOR); c.lineTo(x + 5, y + 7);

    c.lineTo(x + width * 0.45, y); c.lineTo(x + width - 5, y + 9);

    c.lineTo(x + width, FLOOR); c.closePath(); c.fill();

    c.fillStyle = "#a18db9"; c.fillRect(x + 8, y + 9, 8, 4);

    return;

  }

  if (type === "coral") {

    c.strokeStyle = "#ff729c"; c.lineWidth = 7; c.lineCap = "round";

    c.beginPath(); c.moveTo(x + width / 2, FLOOR);

    c.lineTo(x + width / 2, y + 3);

    c.moveTo(x + width / 2, y + height * 0.55);

    c.lineTo(x + 3, y + height * 0.3);

    c.moveTo(x + width / 2, y + height * 0.7);

    c.lineTo(x + width - 3, y + height * 0.4);

    c.stroke(); return;

  }

  const fishY = y + Math.sin(obstacle.phase) * 3;

  c.fillStyle = type === "fish-low" ? "#ffb65c" : "#7de1e4";

  c.beginPath();

  c.ellipse(x + width * 0.5, fishY + height * 0.5,

    width * 0.35, height * 0.43, 0, 0, Math.PI * 2);

  c.fill();

  c.beginPath(); c.moveTo(x + width * 0.24, fishY + height / 2);

  c.lineTo(x, fishY + 2); c.lineTo(x, fishY + height - 2);

  c.closePath(); c.fill();

  c.fillStyle = "#19243c";

  c.fillRect(x + width * 0.67, fishY + height * 0.36, 3, 3);

}



function draw() {

  if (!ctx) return;

  const c = ctx;

  c.clearRect(0, 0, WIDTH, HEIGHT);

  drawBackground(c);

  drawSeabed(c);

  for (const obstacle of obstacles) drawObstacle(c, obstacle);

  drawPlayer(c);

  if (status.value !== "running") {

    c.fillStyle = "rgba(8, 10, 28, 0.55)";

    c.fillRect(0, 0, WIDTH, HEIGHT);

    c.textAlign = "center"; c.fillStyle = "#ffffff";

    c.font = "bold 24px system-ui";

    c.fillText(status.value === "ready" ? "Prêt à plonger ?" : "Partie terminée !", WIDTH / 2, 102);

    c.font = "16px system-ui";

    c.fillText("Espace / ↑ / toucher pour jouer", WIDTH / 2, 138);

  }

}



function tick(timestamp: number) {

  frame = 0;

  if (!active || !ctx) return;

  const delta = lastTime ? clamp((timestamp - lastTime) / 1000, 0, 0.035) : 0;

  lastTime = timestamp;

  update(delta);

  draw();

  frame = requestAnimationFrame(tick);

}



onMounted(() => {

  ctx = canvas.value?.getContext("2d") ?? null;

  try {

    best.value = Math.max(0, Number(localStorage.getItem(BEST_KEY)) || 0);

    const saved = localStorage.getItem(CHARACTER_KEY);

    if (saved === "hylda" || saved === "cita") selectedCharacter.value = saved;

  } catch { /* Storage optional */ }

  createDecorations();

  active = true;

  loadSprites();
  void refreshScores();

  window.addEventListener("keydown", onKey);

  draw();

});



onBeforeUnmount(() => {

  active = false;

  window.removeEventListener("keydown", onKey);

  if (frame) { cancelAnimationFrame(frame); frame = 0; }

});

</script>



<template>

  <div class="tentacle-game">

    <div class="tentacle-game__character-picker" aria-label="Choisir son personnage">

      <span class="tentacle-game__character-label">✦ Choisis ton compagnon ✦</span>

      <div class="tentacle-game__character-options">

        <button

          v-for="character in characters"

          :key="character.id"

          type="button"

          class="tentacle-game__character-option"

          :class="{ 'is-selected': selectedCharacter === character.id }"

          :aria-pressed="selectedCharacter === character.id"

          :disabled="status === 'running'"

          @click="chooseCharacter(character.id)"

        >

          <img :src="character.image" :alt="character.name" draggable="false" />

          <span>{{ character.name }}</span>

          <small v-if="selectedCharacter === character.id">✓ Sélectionné</small>

        </button>

      </div>

    </div>



    <div class="tentacle-game__stats">

      <span>🏆 Record : {{ best }}</span>

      <span>⭐ Score : {{ score }}</span>
      <span v-if="isLoggedIn">🎮 Parties : {{ totalGames }}</span>

    </div>



    <canvas

      ref="canvas"

      :width="WIDTH"

      :height="HEIGHT"

      aria-label="Tentacle Run : saute pour éviter les coraux, les rochers et les poissons"

      @pointerdown="jump"

    ></canvas>



    <div class="tentacle-game__actions">

      <button type="button" @click="start">

        {{ status === 'running' ? '↻ Recommencer' : '▶ Jouer' }}

      </button>

      <span>Espace / ↑ ou toucher le jeu pour sauter</span>

    </div>

    <p v-if="savingScore" class="tentacle-game__notice">💜 Enregistrement du score...</p>
    <p v-if="scoreError" class="tentacle-game__notice" role="alert">{{ scoreError }}</p>
    <p v-if="!isLoggedIn" class="tentacle-game__notice">Connecte-toi à ton compte POUP pour enregistrer tes scores et débloquer des succès.</p>
    <section class="tentacle-game__leaderboard" aria-label="Classement Tentacle Run">
      <h3>🏆 Classement des POUP</h3>
      <ol v-if="leaderboard.length">
        <li v-for="(entry, index) in leaderboard" :key="entry.user_id">
          <span>{{ index + 1 }}. {{ entry.display_name }}</span>
          <strong>{{ entry.best_score }} pts</strong>
        </li>
      </ol>
      <p v-else>Aucun score enregistré pour le moment.</p>
    </section>

  </div>

</template>



<style scoped>

.tentacle-game__character-picker {

  display: flex;

  flex-direction: column;

  align-items: center;

  gap: 10px;

  margin-bottom: 18px;

}

.tentacle-game__character-label {

  color: #ff9add;

  font-size: .85rem;

  font-weight: 800;

  letter-spacing: .08em;

  text-align: center;

}

.tentacle-game__character-options {

  display: flex;

  justify-content: center;

  flex-wrap: wrap;

  gap: 12px;

  width: 100%;

}

.tentacle-game__character-option {

  display: flex;

  flex-direction: column;

  align-items: center;

  gap: 5px;

  min-width: 122px;

  padding: 10px 16px;

  color: #fff;

  background: #271333;

  border: 2px solid #654278;

  border-radius: 14px;

  cursor: pointer;

  transition: border-color .2s, box-shadow .2s, transform .2s;

}

.tentacle-game__character-option:not(:disabled):hover {

  transform: translateY(-2px);

  border-color: #e97ad5;

}

.tentacle-game__character-option.is-selected {

  border-color: #ff80d7;

  background: #3c194c;

  box-shadow: 0 0 18px #ed38b34d;

}

.tentacle-game__character-option:focus-visible {

  outline: 2px solid #fff;

  outline-offset: 3px;

}

.tentacle-game__character-option:disabled { cursor: default; opacity: .75; }

.tentacle-game__character-option img {

  display: block;

  width: 65px;

  height: 65px;

  object-fit: contain;

}

.tentacle-game__character-option span { font-weight: 800; }

.tentacle-game__character-option small {

  color: #ff9add;

  font-size: .7rem;

}

@media (max-width: 480px) {

  .tentacle-game__character-option { min-width: 105px; padding: 8px 12px; }

  .tentacle-game__character-option img { width: 54px; height: 54px; }

}


.tentacle-game__notice { margin: 12px 0; text-align:center; color:#f5b8e9; font-size:.85rem; }
.tentacle-game__leaderboard { margin-top:20px; padding:18px; border:1px solid #654278; border-radius:16px; background:#1e102b; color:#fff; }
.tentacle-game__leaderboard h3 { margin:0 0 12px; text-align:center; color:#ff9add; }
.tentacle-game__leaderboard ol { margin:0; padding:0; list-style:none; }
.tentacle-game__leaderboard li { display:flex; justify-content:space-between; gap:12px; padding:9px 4px; border-bottom:1px solid #65427866; }
.tentacle-game__leaderboard li:last-child { border-bottom:0; }
.tentacle-game__leaderboard strong { color:#65f4ef; white-space:nowrap; }
</style>
