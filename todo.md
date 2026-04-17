# DJ Móveis App - TODO

## Banco de Dados e Backend
- [x] Criar tabela de categorias no schema (Sala de Estar, Quarto, Cozinha, Sala de Jantar, Colchões, Decoração)
- [x] Criar tabela de produtos (nome, foto, categoria, descrição, preço, ativo)
- [x] Criar tabela de usuários admin com login/senha (email + hash de senha)
- [x] Gerar e aplicar migration SQL
- [x] Criar helpers de DB para produtos e categorias
- [x] Criar procedure de login com email/senha (JWT)
- [x] Criar procedures CRUD de produtos (listar, criar, editar, remover)
- [x] Criar procedure de upload de imagem de produto (S3)
- [x] Criar procedure de listagem de categorias

## Frontend - Catálogo Público
- [x] Página de login com email e senha (identidade visual DJ Móveis)
- [x] Página inicial com banner da loja e categorias em destaque
- [x] Página de catálogo com filtro por categoria
- [x] Página de detalhes do produto (nome, foto, categoria, descrição)
- [x] Seção/página de informações da loja (endereço, WhatsApp, redes sociais)
- [x] Botão de contato via WhatsApp

## Frontend - Painel Administrativo
- [x] Rota protegida /admin acessível apenas para admins
- [x] Listagem de produtos com opções de editar e remover
- [x] Formulário de criação de produto (nome, foto, categoria, descrição)
- [x] Formulário de edição de produto
- [x] Upload de foto de produto com preview
- [x] Confirmação de exclusão de produto

## Identidade Visual
- [x] Paleta de cores: azul marinho (#0D1B3E), dourado (#D4A017), branco (#FFFFFF)
- [x] Logo DJ Móveis presente no header
- [x] Gerar/fazer upload do logo como asset
- [x] Tipografia e estilo visual fiel à marca
- [x] Favicon com logo da loja

## Testes
- [x] Teste de login com credenciais válidas e inválidas
- [x] Teste de listagem de produtos
- [x] Teste de criação de produto (admin)

## Ajustes Solicitados
- [x] Adicionar número de contato (34) 99113-3526 em toda a interface
- [x] Atualizar números de contato: (34) 99181-8080 (WhatsApp), (34) 99113-3526, (34) 99680-7663
