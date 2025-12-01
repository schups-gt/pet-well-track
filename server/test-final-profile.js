import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

async function testCompleteFlow() {
  try {
    console.log('═'.repeat(70));
    console.log('  TESTE COMPLETO DE ATUALIZAÇÃO E PERSISTÊNCIA DE PERFIL');
    console.log('═'.repeat(70) + '\n');

    // 1. REGISTRAR
    console.log('PASSO 1: Registrando novo usuário');
    console.log('─'.repeat(70));
    const email = `final-test-${Date.now()}@example.com`;
    const registerRes = await axios.post(`${API_URL}/auth/register`, {
      email,
      password: 'Teste@12345',
      name: 'Final Test User'
    });
    const userId = registerRes.data.data.id;
    console.log(`✓ Usuário criado com ID: ${userId}`);
    console.log(`  Email: ${email}\n`);

    // 2. VERIFICAR EMAIL
    console.log('PASSO 2: Verificando email');
    console.log('─'.repeat(70));
    const { dbs } = await import('./src/database/sqlite.js');
    dbs.cliente.prepare(`UPDATE users SET email_verified = 1 WHERE id = ?`).run(userId);
    console.log('✓ Email verificado\n');

    // 3. FAZER LOGIN
    console.log('PASSO 3: Fazendo login');
    console.log('─'.repeat(70));
    const loginRes = await axios.post(`${API_URL}/auth/login`, {
      email,
      password: 'Teste@12345'
    });
    const token = loginRes.data.data.token;
    console.log('✓ Login realizado com sucesso\n');

    // 4. CARREGAR PERFIL (estado inicial vazio)
    console.log('PASSO 4: Carregando perfil inicial (tudo vazio)');
    console.log('─'.repeat(70));
    const initialMe = await axios.get(`${API_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✓ Perfil carregado:');
    console.log(`  Nome: ${initialMe.data.data.name}`);
    console.log(`  Telefone: ${initialMe.data.data.telefone || '(vazio)'}`);
    console.log(`  Endereço: ${initialMe.data.data.endereco || '(vazio)'}`);
    console.log(`  Cidade: ${initialMe.data.data.cidade || '(vazio)'}`);
    console.log(`  Estado: ${initialMe.data.data.estado || '(vazio)'}`);
    console.log(`  CEP: ${initialMe.data.data.cep || '(vazio)'}\n`);

    // 5. ATUALIZAR PERFIL COM DADOS COMPLETOS
    console.log('PASSO 5: Preenchendo e salvando todos os campos');
    console.log('─'.repeat(70));
    const updateRes = await axios.put(
      `${API_URL}/auth/user/profile`,
      {
        name: 'João Silva Santos',
        telefone: '(11) 98765-4321',
        endereco: 'Rua das Flores, 123, Apto 456',
        cidade: 'São Paulo',
        estado: 'SP',
        cep: '01310-100'
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    console.log('✓ Perfil atualizado com sucesso:');
    console.log(`  Nome: ${updateRes.data.user.name}`);
    console.log(`  Telefone: ${updateRes.data.user.telefone}`);
    console.log(`  Endereço: ${updateRes.data.user.endereco}`);
    console.log(`  Cidade: ${updateRes.data.user.cidade}`);
    console.log(`  Estado: ${updateRes.data.user.estado}`);
    console.log(`  CEP: ${updateRes.data.user.cep}\n`);

    // 6. SIMULAR TROCAR DE ABA E VOLTAR
    console.log('PASSO 6: Simulando trocar de aba e voltar (fazer logout/login virtual)');
    console.log('─'.repeat(70));
    console.log('  • Usuário sai da aba de perfil');
    console.log('  • Usuário volta para a aba de perfil');
    console.log('  • Frontend carrega os dados novamente\n');

    // 7. CARREGAR PERFIL NOVAMENTE
    console.log('PASSO 7: Carregando perfil novamente (após voltar)');
    console.log('─'.repeat(70));
    const finalMe = await axios.get(`${API_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✓ Perfil carregado após voltar:');
    console.log(`  Nome: ${finalMe.data.data.name}`);
    console.log(`  Telefone: ${finalMe.data.data.telefone}`);
    console.log(`  Endereço: ${finalMe.data.data.endereco}`);
    console.log(`  Cidade: ${finalMe.data.data.cidade}`);
    console.log(`  Estado: ${finalMe.data.data.estado}`);
    console.log(`  CEP: ${finalMe.data.data.cep}\n`);

    // 8. VALIDAR PERSISTÊNCIA
    console.log('PASSO 8: Validando se os dados persistiram corretamente');
    console.log('─'.repeat(70));
    const userData = finalMe.data.data;
    const allFieldsCorrect = 
      userData.name === 'João Silva Santos' &&
      userData.telefone === '(11) 98765-4321' &&
      userData.endereco === 'Rua das Flores, 123, Apto 456' &&
      userData.cidade === 'São Paulo' &&
      userData.estado === 'SP' &&
      userData.cep === '01310-100';

    if (allFieldsCorrect) {
      console.log('✅ SUCESSO! Todos os dados foram salvos e carregados corretamente.\n');
      console.log('═'.repeat(70));
      console.log('  O PROBLEMA FOI RESOLVIDO!');
      console.log('═'.repeat(70));
      console.log('\nResumo das mudanças:');
      console.log('  1. Backend: Adicionados campos telefone, endereco, cidade, estado, cep na tabela users');
      console.log('  2. Backend: Atualizado findUserById() para retornar todos os campos');
      console.log('  3. Backend: Atualizado meController() para retornar todos os campos');
      console.log('  4. Frontend: Adicionado useEffect() para carregar dados ao montar o componente');
      console.log('  5. Frontend: Atualizado handleSubmit() para atualizar formData após sucesso');
      console.log('  6. Frontend: Atualizado handleSubmit() para atualizar o contexto com todos os campos\n');
      process.exit(0);
    } else {
      console.log('❌ ERRO! Dados não persistiram corretamente.\n');
      console.log('Esperado:', {
        name: 'João Silva Santos',
        telefone: '(11) 98765-4321',
        endereco: 'Rua das Flores, 123, Apto 456',
        cidade: 'São Paulo',
        estado: 'SP',
        cep: '01310-100'
      });
      console.log('Recebido:', userData);
      process.exit(1);
    }
  } catch (error) {
    console.error('\n❌ ERRO DURANTE O TESTE:', error.response?.data || error.message);
    console.error('Stack:', error.stack);
    process.exit(1);
  }
}

testCompleteFlow();
