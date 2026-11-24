# Verificação de integração do Jev / System One

Data da verificação: 2026-11-03. Base do protocolo: `https://api.typesafe.ai/openapi.json` oficial do TypeSafe (OpenAPI 3.1.0, API schema 0.2.0).

## Requisição e configuração

- Usa Bearer API Key, enviando `model`, `state` e `questions` nomeadas via `POST /v1/systemone`. A decisão de interceptação usa a pergunta `choice` e os critérios `allow / ask / deny`.
- `GET /v1/models` retorna `models[].name`, e não `data[].id` como no OpenAI. A página de gerenciamento de modelos pode carregar os modelos disponíveis na conta; o alias padrão é `jev-latest`.
- O Base URL pode ser o endereço raiz do serviço, `/v1` ou o endereço completo `/v1/systemone`; aceita apenas HTTP(S), sem parâmetros de consulta nem fragmentos.
- Usa um proxy independente definido na configuração; proxy vazio significa conexão direta, sem herdar as variáveis de ambiente de proxy do processo. A configuração do Jev só pode ser usada para o juiz de interceptação, não podendo ser definida como modelo de chat ou de tarefas.

## Decisão e tratamento de falhas

- Valida o tipo de `answers.decision`, o valor da decisão, a confiança obrigatória e os três campos de probabilidade. A confiança e as probabilidades devem ser números finitos entre 0 e 1; respostas inválidas entram na política existente de retry/falha e não são tratadas como resultado válido de liberação.
- Resultados abaixo do limite configurado são encaminhados para aprovação manual; quando as evidências estão incompletas ou truncadas, o `allow` do Jev é convertido em `ask`.
- Erros HTTP, erros de formato e cancelamento/timeout são tratados como falha de chamada; as chamadas em produção seguem a configuração de timeout único e retry do juiz. O teste de conexão e a consulta da lista de modelos têm limite de 30 segundos.
- A contabilização usa `usage.input_tokens / output_tokens` oficiais; os registros de auditoria mantêm a entrada e o resumo da configuração.

## Escopo de validação

Os testes automatizados cobrem o protocolo nativo da lista de modelos, proxy, normalização de URL, decisão normal, respostas anômalas, baixa confiança, truncamento de evidências, uso e integração da interface de gerenciamento; a verificação de tipos do frontend, a exportação estática e os testes de regressão da API existente do frontend também fazem parte da validação de release.

**Não foram feitas chamadas ao serviço de produção com uma API Key real do Jev.** A máquina virtual não possui um perfil Jev salvo, e o juiz atualmente habilitado é outro modelo. Testes de protocolo e com serviço simulado não comprovam permissões reais da conta, saldo, acessibilidade do serviço ou precisão das decisões do modelo; antes do uso em produção, ainda é necessário salvar a configuração do Jev e executar o teste de conexão e a aceitação com amostras de negócio.

Esta nova versão inclui a funcionalidade do Jev e as correções acima. A versão histórica `v0.3.25` não contém a integração do Jev; restaurar a máquina virtual para essa versão não implantará a funcionalidade do Jev.