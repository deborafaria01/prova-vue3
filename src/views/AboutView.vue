<template>
  <div class="about">
    <h1>Bem-vindo, {{ nome }}!</h1>
    <p><input type="text" v-model="nome"/></p>
    <p v-if="nome.length > 6">Texto longo!</p>
    <p v-else>Texto curto!</p>
    <p><input type="password" v-model="senha"/></p>
    <button @click="buscarUsuarios">Atualizar</button>
    <button @click="incluir">Incluir</button>
    <p>{{ erro }}</p>

    <table>
      <thead>
        <td>Id</td>
        <td>Nome</td>
      </thead>
      <tbody>
        <tr v-for="usuario in usuarios" :key="usuario.id">
          <td>{{ usuario.id }}</td>
          <td>{{ usuario.nome }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
  import { onMounted, ref } from 'vue';
  import axios from 'axios';
  
  const nome = ref("Debora");
  const senha = ref("1234");
  const usuarios = ref([
    { id: 1, nome: "Lucas", senha: "123" },
    { id: 2, nome: "Paulo", senha: "456" }
    ]);
  const erro = ref("");

  async function incluir() {
    erro.value = "";
    try{
      await axios.post("usuario", 
        {
          nome: nome.value,
          senha: senha.value
        });
    }
    catch(e) {
      erro.value = (e as Error).message;
    }
    buscarUsuarios();
  }

  async function buscarUsuarios() {
    usuarios.value = (await axios.get("usuario")).data;
  }

  onMounted(() => {
    buscarUsuarios();
  });
</script>