#!/bin/bash
# Script para testar email e registrar novo usuário

echo "=== TESTE RÁPIDO DE EMAIL ==="
echo ""

# Teste 1: Verificar configuração
echo "1️⃣  Testando conectividade SMTP..."
node test-email.js

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Email configurado com sucesso!"
    echo ""
    echo "2️⃣  Agora você pode:"
    echo "   - Ir para http://localhost:8080/registrar"
    echo "   - Registrar com um email @gmail.com"
    echo "   - Verifique seu inbox para o link de confirmação"
else
    echo ""
    echo "❌ Erro na configuração de email"
    echo ""
    echo "Corrija o arquivo .env e tente novamente"
fi
