import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

async function testProfilePersistence() {
  try {
    console.log('[TEST] Teste de Persistência de Dados de Perfil\n');

    // 1. Registrar usuário
    console.log('[1] Registrando novo usuário...');
    const registerRes = await axios.post(`${API_URL}/auth/register`, {
      email: `testpersist${Date.now()}@example.com`,
      password: 'Test123456!',
      name: 'Persistence Test User'
    });
    console.log('✓ Usuário registrado');
    const userId = registerRes.data.data.id;

    // 2. Verificar email
    console.log('\n[2] Simulando verificação de email...');
    const { dbs } = await import('./src/database/sqlite.js');
    dbs.cliente.prepare(`UPDATE users SET email_verified = 1 WHERE id = ?`).run(userId);
    console.log('✓ Email verificado');

    // 3. Fazer login
    console.log('\n[3] Fazendo login...');
    const loginRes = await axios.post(`${API_URL}/auth/login`, {
      email: registerRes.data.data.email,
      password: 'Test123456!'
    });
    const token = loginRes.data.data.token;
    console.log('✓ Login realizado');

    // 4. Atualizar perfil
    console.log('\n[4] Atualizando perfil...');
    const updateRes = await axios.put(
      `${API_URL}/auth/user/profile`,
      {
        name: 'Updated User Name',
        telefone: '(21) 99999-8888',
        endereco: 'Av. Paulista, 1000',
        cidade: 'São Paulo',
        estado: 'SP',
        cep: '01310-150'
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    console.log('✓ Perfil atualizado');
    console.log('  - Nome:', updateRes.data.user.name);
    console.log('  - Telefone:', updateRes.data.user.telefone);
    console.log('  - Cidade:', updateRes.data.user.cidade);

    // 5. Simular sair e voltar (chamar /auth/me novamente)
    console.log('\n[5] Simulando trocar de aba e voltar (chamando /auth/me)...');
    const meRes = await axios.get(
      `${API_URL}/auth/me`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    console.log('✓ Dados carregados do perfil');
    console.log('  - Nome:', meRes.data.data.name);
    console.log('  - Telefone:', meRes.data.data.telefone);
    console.log('  - Endereço:', meRes.data.data.endereco);
    console.log('  - Cidade:', meRes.data.data.cidade);
    console.log('  - Estado:', meRes.data.data.estado);
    console.log('  - CEP:', meRes.data.data.cep);

    // Validar persistência
    console.log('\n[6] Validando persistência...');
    const userData = meRes.data.data;
    const isValid = 
      userData.name === 'Updated User Name' &&
      userData.telefone === '(21) 99999-8888' &&
      userData.endereco === 'Av. Paulista, 1000' &&
      userData.cidade === 'São Paulo' &&
      userData.estado === 'SP' &&
      userData.cep === '01310-150';

    if (isValid) {
      console.log('✅ TODOS OS DADOS PERSISTIRAM CORRETAMENTE!');
      process.exit(0);
    } else {
      console.log('❌ DADOS NÃO PERSISTIRAM CORRETAMENTE');
      console.log('Esperado:', {
        name: 'Updated User Name',
        telefone: '(21) 99999-8888',
        endereco: 'Av. Paulista, 1000',
        cidade: 'São Paulo',
        estado: 'SP',
        cep: '01310-150'
      });
      console.log('Recebido:', userData);
      process.exit(1);
    }
  } catch (error) {
    console.error('❌ ERRO:', error.response?.data || error.message);
    process.exit(1);
  }
}

testProfilePersistence();
