import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

async function testProfileUpdate() {
  try {
    console.log('[TEST] Iniciando teste de atualização de perfil...\n');

    // 1. Registrar usuário
    console.log('[1] Registrando novo usuário...');
    const registerRes = await axios.post(`${API_URL}/auth/register`, {
      email: `testprofile${Date.now()}@example.com`,
      password: 'Test123456!',
      name: 'Test Profile User'
    });
    console.log('✓ Usuário registrado:', registerRes.data.data);
    const userId = registerRes.data.data.id;

    // 2. Verificar email manualmente (simular verificação)
    console.log('\n[2] Simulando verificação de email...');
    const { dbs } = await import('./src/database/sqlite.js');
    dbs.cliente.prepare(`UPDATE users SET email_verified = 1 WHERE id = ?`).run(userId);
    console.log('✓ Email marcado como verificado');

    // 3. Fazer login
    console.log('\n[3] Fazendo login...');
    const loginRes = await axios.post(`${API_URL}/auth/login`, {
      email: registerRes.data.data.email,
      password: 'Test123456!'
    });
    const token = loginRes.data.data.token;
    console.log('✓ Login realizado');
    console.log('Token:', token.substring(0, 50) + '...');

    // 4. Atualizar perfil
    console.log('\n[4] Atualizando perfil com novos dados...');
    const updateRes = await axios.put(
      `${API_URL}/auth/user/profile`,
      {
        name: 'Test Profile Updated',
        telefone: '(11) 98765-4321',
        endereco: 'Rua das Flores, 123',
        cidade: 'São Paulo',
        estado: 'SP',
        cep: '01310-100'
      },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    console.log('✓ Perfil atualizado com sucesso!');
    console.log('Dados retornados:', JSON.stringify(updateRes.data.user, null, 2));

    console.log('\n✅ TESTE COMPLETO - API funcionando corretamente!');
    process.exit(0);
  } catch (error) {
    console.error('❌ ERRO:', error.response?.data || error.message);
    process.exit(1);
  }
}

testProfileUpdate();
