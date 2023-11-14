<template>
    <div class="empregados">
      <h1>Gerencie Empregados</h1>
      <form @submit.prevent="cadastrarEmpregado">
        <div>
          <label for="ctps">CTPS: </label>
          <input type="text" id="ctps" v-model="novoEmpregado.ctps">
        </div>
        <div>
          <label for="email">Email: </label>
          <input type="text" id="email" v-model="novoEmpregado.email">
        </div>
        <div>
          <label for="nomeCompleto">Nome Completo: </label>
          <input type="text" id="nomeCompleto" v-model="novoEmpregado.nomeCompleto">
        </div>
        <div>
          <label for="cargaHoraria">Carga Horária: </label>
          <input type="text" id="cargaHoraria" v-model="novoEmpregado.cargaHoraria">
        </div>
        <div>
          <label for="dataHoraCadastro">Data e Hora de Cadastro: </label>
          <input type="datetime-local" id="dataHoraCadastro" v-model="novoEmpregado.dataHoraCadastro">
        </div>
  
        <button type="submit">Cadastrar</button>
        <p v-if="erroCadastro">{{ erroCadastro }}</p>
        <div>
        <label for="ctpsConsulta">CTPS/Email para consulta: </label>
        <input type="text" id="ctpsConsulta" v-model="ctpsConsulta">
      </div>
      <button @click="consultarEmpregado">Consultar</button>
    </form>
    <ul v-if="mostrarLista && empregados.length > 0">
      <li v-for="empregado in empregados" :key="empregado.id">
        <span> CTPS/Email: {{ empregado.ctpsEmail }} -</span>
        <span> Nome Completo: {{ empregado.nomeCompleto }} -</span>
        <span> Carga Horária: {{ empregado.cargaHoraria }} </span>
      </li>
    </ul>
    <p v-else-if="mostrarLista && empregados.length === 0 && ctpsConsulta">
      Nenhum empregado foi encontrado para os critérios fornecidos.
    </p>
    <p v-else>{{ mensagemConsulta }}</p>
  </div>
</template>

  
  <script setup lang="ts">
  import { onMounted, ref } from 'vue';
  import axios from 'axios';
  
    const empregados = ref([]);
    const novoEmpregado = ref({ ctps: '', email: '', nomeCompleto: '', cargaHoraria: '', dataHoraCadastro: '' });
    const erroCadastro = ref('');
    const mostrarLista = ref(true);
    const mensagemConsulta = ref('');
    const ctpsConsulta = ref('');

    async function atualizar() {
    try {
        empregados.value = (await axios.get("empregado")).data.map((empregado) => ({
        ...empregado,
        ctpsEmail: `${empregado.ctps}/${empregado.email}`
        }));
    } catch (ex) {
        erroCadastro.value = (ex as Error).message;
    }
    }

  async function cadastrarEmpregado() {
    try {
      if (!novoEmpregado.value.ctps || !novoEmpregado.value.email || !novoEmpregado.value.nomeCompleto || !novoEmpregado.value.cargaHoraria) {
        erroCadastro.value = "Preencha todos os campos antes de cadastrar.";
        return;
      }
  
      const dataHoraAtual = new Date().toLocaleString('sv-SE').replace(' ', 'T');
  
      await axios.post("empregado", {
        ctps: novoEmpregado.value.ctps,
        email: novoEmpregado.value.email,
        nomeCompleto: novoEmpregado.value.nomeCompleto,
        cargaHoraria: novoEmpregado.value.cargaHoraria,
        dataHoraCadastro: dataHoraAtual
      });
  
      novoEmpregado.value = { ctps: '', email: '', nomeCompleto: '', cargaHoraria: '', dataHoraCadastro: '' };
      erroCadastro.value = '';
  
      await atualizar();
    } catch (ex) {
      erroCadastro.value = (ex as Error).message;
    }
  }
  
  async function consultarEmpregado() {
  try {
    const response = await axios.get(`empregado/${encodeURIComponent(ctpsConsulta)}/${encodeURIComponent(emailConsulta)}`);
    empregados.value = response.data.map((empregado) => ({
      ...empregado,
      ctpsEmail: `${empregado.ctps}/${empregado.email}`
    }));

    mostrarLista.value = true;
    if (empregados.value.length === 0 && ctpsConsulta) {
      mensagemConsulta.value = "Nenhum empregado foi encontrado para os critérios fornecidos.";
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