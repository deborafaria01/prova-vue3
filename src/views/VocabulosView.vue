<template>
  <div class="vocabulos">
    <h1>Gerencie Vocábulos</h1>
    <form @submit.prevent="cadastrarVocabulo">
      <div>
        <label for="termo">Termo:</label>
        <input type="text" id="termo" v-model="novoVocabulo.termo" required>
      </div>
      <div>
        <label for="significado">Significado:</label>
        <input type="text" id="significado" v-model="novoVocabulo.significado" required>
      </div>
      <div>
        <label for="versao">Versão:</label>
        <input type="text" id="versao" v-model="novoVocabulo.versao" required>
      </div>
      <button type="submit">Cadastrar</button>
    </form>
    <ul>
      <li v-for="vocabulo in vocabulos" :key="vocabulo.id">
        <span> ID: {{ vocabulo.id }}</span>
        <span> Termo: {{ vocabulo.termo }}</span>
        <span> Significado: {{ vocabulo.significado }}</span>
        <span> Versão: {{ vocabulo.versao }}</span>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import axios from 'axios';

const vocabulos = ref([]);
const novoVocabulo = ref({ termo: '', significado: '', versao: '' });

async function atualizar() {
  vocabulos.value = (await axios.get("https://8080-deborafaria01-test2back-uepe8isfhxz.ws-us106.gitpod.io/vocabulo")).data;
}

async function cadastrarVocabulo() {
  const response = await axios.post("https://8080-deborafaria01-test2back-uepe8isfhxz.ws-us106.gitpod.io/vocabulo", novoVocabulo.value);
  if (response.status === 201) {
    // Se o cadastro foi bem-sucedido, limpe os campos de entrada e atualize a lista de vocábulos
    novoVocabulo.value = { termo: '', significado: '', versao: '' };
    atualizar();
  } else {
    console.error("Erro ao cadastrar o vocábulo.");
  }
}

onMounted(() => {
  atualizar();
});
</script>
