# Changelog

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

## [1.1.0] - 2025-09-14

### Adicionado
- Funcionalidade de ordenação na coluna "Dias" (dias de ativação)
- Funcionalidade de ordenação na coluna "Dias" (dias de desconexão)
- Indicadores visuais de direção de ordenação (setas) nas colunas ordenáveis
- Suporte para ordenação ascendente e descendente em ambas as colunas de dias

### Modificado
- Atualizado o tipo TypeScript `sortColumn` para incluir `"dias_ativacao"` e `"dias_desconexao"`
- Expandida a função `handleSort` para aceitar os novos parâmetros de ordenação
- Melhorada a lógica de ordenação no `filteredData` para calcular dias usando `differenceInDays`
- Atualizados os cabeçalhos das colunas "Dias" para incluir funcionalidade de clique e indicadores visuais

### Técnico
- Implementada ordenação robusta com tratamento de erros para datas inválidas
- Mantida compatibilidade com diferentes formatos de data (ISO e com timezone)
- Preservada funcionalidade existente do botão "Limpar filtros"

---

## Formato

Este changelog segue o formato [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),
e este projeto adere ao [Versionamento Semântico](https://semver.org/lang/pt-BR/).

### Tipos de Mudanças
- **Adicionado** para novas funcionalidades
- **Modificado** para mudanças em funcionalidades existentes
- **Descontinuado** para funcionalidades que serão removidas em breve
- **Removido** para funcionalidades removidas
- **Corrigido** para correções de bugs
- **Segurança** para vulnerabilidades corrigidas