## 📊 Indicadores Selecionados e Justificativa de Produto

O **Pulse FX** tem como objetivo central fornecer um painel coeso para acompanhamento do câmbio (BRL/USD) e dos principais vetores macroeconômicos de pressão cambial entre Brasil e Estados Unidos. A escolha dos 4 indicadores abrange o tripé fundamental de Câmbio, Juros e Inflação:

### 1. Dólar Comercial PTAX (BCB)
* **Fonte:** Banco Central do Brasil (SGS) | **Código da Série:** `1` | **Periodicidade:** Diária (dias úteis)
* **Documentação/Referência:** [BCB Dados Abertos](https://dadosabertos.bcb.gov.br/) / [SGS BCB](https://www3.bcb.gov.br/sgspub/)
* **Justificativa:** Cotação oficial de fechamento do câmbio BRL/USD calculada pelo Banco Central do Brasil. Como indicador principal da aplicação, fornece a referência diária exata do preço da moeda e permite ao usuário acompanhar a variação percentual do Real em relação ao mercado no último dia útil.

### 2. Taxa Selic Meta (BCB)
* **Fonte:** Banco Central do Brasil (SGS) | **Código da Série:** `432` | **Periodicidade:** Diária (Decisão do COPOM)
* **Documentação/Referência:** [SGS BCB](https://www3.bcb.gov.br/sgspub/)
* **Justificativa:** Taxa básica de juros da economia brasileira definida pelo Banco Central. É o principal instrumento de política monetária nacional e dita o rendimento da renda fixa local. Alterações na Selic afetam diretamente a atratividade do Real para investidores estrangeiros e o fluxo de capitais no país.

### 3. Federal Funds Effective Rate (FRED)
* **Fonte:** Federal Reserve Economic Data | **Series ID:** `FEDFUNDS` | **Periodicidade:** Mensal
* **Documentação/Referência:** [FRED FEDFUNDS](https://fred.stlouisfed.org/series/FEDFUNDS)
* **Justificativa:** Taxa básica de juros estabelecida pelo Federal Reserve nos Estados Unidos. Como os títulos americanos são a referência de menor risco no mundo, aumentos nessa taxa atraem liquidez global para os EUA, fortalecendo o Dólar em relação a moedas de países emergentes como o Brasil.

### 4. Consumer Price Index - CPI (FRED)
* **Fonte:** Federal Reserve Economic Data | **Series ID:** `CPIAUCSL` | **Periodicidade:** Mensal
* **Documentação/Referência:** [FRED CPIAUCSL](https://fred.stlouisfed.org/series/CPIAUCSL)
* **Justificativa:** Principal indicador de inflação dos Estados Unidos, mensurando a variação dos preços ao consumidor. Funciona como o termômetro fundamental para antecipar movimentos do Federal Reserve sobre a taxa de juros (`FEDFUNDS`), conectando as pressões inflacionárias americanas com as oscilações globais do câmbio.

## 🗄️ Modelagem de Dados & Decisões de Arquitetura (PostgreSQL + Prisma)

### 1. Estrutura e Diagrama do Banco de Dados

Para garantir **normalização**, **alta performance em consultas** e **idempotência na sincronização de dados**, a base PostgreSQL foi estruturada em três tabelas fundamentais:

| Tabela | Função no Domínio | Chave Primária | Relacionamentos |
| :--- | :--- | :--- | :--- |
| **`indicators`** | Catálogo fixo de séries temporais suportadas (metadados como código externo, provedor, unidade e periodicidade). | `id` (VARCHAR) | Possui $N$ observações (`observations`) e $0..1$ registro em favoritos (`favorites`). |
| **`observations`** | Série temporal de leituras históricas coletadas das APIs externas (BCB e FRED)[cite: 1]. | `id` (UUID) | Pertence a $1$ indicador (`indicators`). |
| **`favorites`** | Persistência real da funcionalidade "Meus Indicadores"[cite: 1]. | `indicator_id` (FK/PK) | Aponta para $1$ indicador (`indicators`). |

#### Destaques de Engenharia na Modelagem:
* **Desacoplamento de Metadados (`indicators` vs `observations`):** Evita redundância massiva de strings na base (nomes, unidades, provedores) a cada leitura diária. A listagem de cartões no frontend consome diretamente a tabela `indicators`, eliminando a necessidade de varreduras computacionalmente custosas (`SELECT DISTINCT`) sobre o histórico de dados.
* **Idempotência e Integridade (`observations`):** A restrição única `UNIQUE(indicator_id, reference_date)` garante que re-execuções da rotina de sincronização não dupliquem registros, utilizando a estratégia `ON CONFLICT DO NOTHING`.
* **Persistência de Favoritos Sem Overengineering (`favorites`):** Como o escopo do MVP não exige autenticação de usuários, a tabela de favoritos funciona em modelo *single-tenant* global, persistindo preferências com chave primária e estrangeira vinculada à tabela `indicators` e remoção em cascata (`ON DELETE CASCADE`).

---

### 2. Escolha do ORM: Prisma ORM

Para a camada de persistência e gerenciamento do esquema PostgreSQL, foi selecionado o **Prisma ORM**.

#### Justificativa da Escolha & Trade-offs:
1. **Produtividade no Prazo do MVP:** A sintaxe declarativa no `schema.prisma` e a geração automática de rotinas de migração via `prisma migrate` viabilizam entregas rápidas e confiáveis dentro do prazo de 3 dias estipulado no desafio.
2. **Type-Safety End-to-End:** O Prisma gera automaticamente definições de tipos TypeScript a partir do esquema do banco de dados, reduzindo falhas em tempo de compilação na comunicação entre a API e a persistência.
3. **Migrations Versionadas:** Atende diretamente ao requisito de entregar *migrations* PostgreSQL versionadas.

#### Estratégia de Desacoplamento (Repository Pattern & SOLID):
Para evitar que as regras de negócio fiquem dependentes do cliente do Prisma, aplicou-se o princípio da **Inversão de Dependência (D do SOLID)**:
* **Entidades e Contratos puros no Domínio:** As entidades de negócio e as interfaces dos repositórios (`IIndicatorRepository`, `IObservationRepository`) residem no coração da aplicação (camada de *Domain*), sem nenhuma importação do pacote `@prisma/client`.
* **Adapters na Infraestrutura:** A implementação concreta (`PrismaIndicatorRepository`, etc.) fica isolada na camada de *Infrastructure*, atuando apenas como um adaptador que converte os dados do banco para os objetos puros de domínio da aplicação.