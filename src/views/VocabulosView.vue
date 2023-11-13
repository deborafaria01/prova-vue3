<template>
  <div class="vocabulos">
    <h1>Gerencie Vocábulos</h1>
    <form @submit.prevent="cadastrarVocabulo">
      <div>
        <label for="termo">Termo: </label>
        <input type="text" id="termo" v-model="novoVocabulo.termo">
      </div>
      <div>
        <label for="significado">Significado: </label>
        <input type="text" id="significado" v-model="novoVocabulo.significado">
      </div>
      <div>
        <label for="versao">Versão: </label>
        <input type="text" id="versao" v-model="novoVocabulo.versao">
      </div>
      <button type="submit">Cadastrar</button>
      <p v-if="erroCadastro">{{ erroCadastro }}</p>
      <div>
        <label for="termoConsulta">Termo para consulta: </label>
        <input type="text" id="termoConsulta" v-model="termoConsulta">
      </div>
      <div>
        <label for="versaoConsulta">Versão para consulta: </label>
        <input type="text" id="versaoConsulta" v-model="versaoConsulta">
      </div>
      <button @click="consultarVocabulo">Consultar</button>
    </form>
    <ul v-if="mostrarLista && vocabulos.length > 0">
      <li v-for="vocabulo in vocabulos" :key="vocabulo.id">
        <span> ID: {{ vocabulo.id }} -</span>
        <span> Termo: {{ vocabulo.termo }} -</span>
        <span> Significado: {{ vocabulo.significado }} -</span>
        <span> Versão: {{ vocabulo.versao }} </span>
      </li>
    </ul>
    <p v-else-if="mostrarLista && vocabulos.length === 0 && termoConsulta && versaoConsulta">
      Nenhum vocábulo foi encontrado para os critérios fornecidos.
    </p>
    <p v-else>{{ mensagemConsulta }}</p>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import axios from 'axios';

const vocabulos = ref([]);
const novoVocabulo = ref({ termo: '', significado: '', versao: '' });
const erroCadastro = ref('');
const termoConsulta = ref('');
const versaoConsulta = ref('');
const mostrarLista = ref(true);
const mensagemConsulta = ref('');

async function atualizar() {
  try {
    vocabulos.value = (await axios.get("vocabulo")).data;
  } catch (ex) {
    erroCadastro.value = (ex as Error).message;
  }
}

async function cadastrarVocabulo() {
  try {
    if (!novoVocabulo.value.termo || !novoVocabulo.value.significado || !novoVocabulo.value.versao) {
      erroCadastro.value = "Preencha todos os campos antes de cadastrar.";
      return;
    }

    await axios.post("vocabulo", {
      termo: novoVocabulo.value.termo,
      significado: novoVocabulo.value.significado,
      versao: novoVocabulo.value.versao
    });

    novoVocabulo.value = { termo: '', significado: '', versao: '' };
    erroCadastro.value = '';

    await atualizar();
  } catch (ex) {
    erroCadastro.value = (ex as Error).message;
  }
}

async function consultarVocabulo() {
  try {
    const response = await axios.get(`vocabulo/${termoConsulta.value}/${versaoConsulta.value}`);
    vocabulos.value = response.data;

    mostrarLista.value = true;
    if (vocabulos.value.length === 0 && termoConsulta && versaoConsulta) {
      mensagemConsulta.value = "Nenhum vocábulo foi encontrado para os critérios fornecidos.";
    } else {
      mensagemConsulta.value = '';
    }
  } catch (ex) {
    erroCadastro.value = (ex as Error).message;
  }
}


onMounted(() => {
  atualizar();
});
</script>