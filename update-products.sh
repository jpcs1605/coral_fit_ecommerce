#!/bin/bash

# Script para atualizar products.json no repositório
# Uso: ./update-products.sh

echo "🔄 Atualizador de Produtos - Coral Fit"
echo "======================================"
echo ""

# Verificar se existe arquivo products.json em Downloads
DOWNLOADS_FILE="$HOME/Downloads/products.json"

if [ -f "$DOWNLOADS_FILE" ]; then
    echo "✓ Arquivo encontrado em Downloads"
    
    # Copiar para public/
    cp "$DOWNLOADS_FILE" public/products.json
    echo "✓ Arquivo copiado para public/products.json"
    
    # Mostrar preview
    echo ""
    echo "📊 Preview dos produtos:"
    PRODUCT_COUNT=$(jq '. | length' public/products.json)
    echo "Total de produtos: $PRODUCT_COUNT"
    echo ""
    
    # Git add
    git add public/products.json
    echo "✓ Arquivo adicionado ao git"
    
    # Prompt para mensagem de commit
    echo ""
    read -p "📝 Mensagem do commit (Enter para usar padrão): " COMMIT_MSG
    
    if [ -z "$COMMIT_MSG" ]; then
        COMMIT_MSG="Atualizar catálogo de produtos - $(date +%Y-%m-%d\ %H:%M)"
    fi
    
    # Commit
    git commit -m "$COMMIT_MSG"
    echo "✓ Commit realizado"
    
    # Push
    echo ""
    read -p "🚀 Fazer push para GitHub? (s/n): " DO_PUSH
    
    if [ "$DO_PUSH" = "s" ] || [ "$DO_PUSH" = "S" ]; then
        git push origin main
        echo "✓ Push realizado com sucesso!"
        echo ""
        echo "✅ Deploy automático iniciado no GitHub Pages"
        echo "⏱️  Aguarde ~2 minutos para o site atualizar"
        echo ""
        echo "🌐 URLs:"
        echo "   Admin: https://jpcs1605.github.io/coral_fit_ecommerce/admin.html"
        echo "   Site:  https://jpcs1605.github.io/coral_fit_ecommerce/"
    else
        echo "ℹ️  Push cancelado. Execute 'git push origin main' quando estiver pronto."
    fi
    
    # Limpar arquivo de downloads
    echo ""
    read -p "🗑️  Remover products.json de Downloads? (s/n): " DO_CLEAN
    if [ "$DO_CLEAN" = "s" ] || [ "$DO_CLEAN" = "S" ]; then
        rm "$DOWNLOADS_FILE"
        echo "✓ Arquivo removido"
    fi
    
else
    echo "❌ Arquivo products.json não encontrado em Downloads"
    echo ""
    echo "📝 Instruções:"
    echo "1. Acesse o Admin: http://localhost:3001/coral_fit_ecommerce/admin.html"
    echo "2. Clique em 'Salvar no Projeto' (botão verde)"
    echo "3. Execute este script novamente"
fi

echo ""
echo "✨ Concluído!"
