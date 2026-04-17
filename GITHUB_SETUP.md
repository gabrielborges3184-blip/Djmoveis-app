# Setup GitHub Actions para Gerar APK e .ipa

Este guia mostra como usar GitHub Actions para gerar automaticamente os arquivos APK (Android) e .ipa (iOS) do app DJ Móveis.

## Passo 1: Criar um Repositório no GitHub

1. Acesse https://github.com/new
2. Crie um novo repositório chamado `djmoveis-app`
3. Escolha "Public" (para usar GitHub Actions gratuito)
4. Clique em "Create repository"

## Passo 2: Fazer Push do Projeto

No seu computador, abra o terminal e execute:

```bash
cd djmoveis-app
git init
git add .
git commit -m "Initial commit: DJ Móveis app with Capacitor"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/djmoveis-app.git
git push -u origin main
```

Substitua `SEU_USUARIO` pelo seu usuário do GitHub.

## Passo 3: Ativar GitHub Actions

1. Acesse seu repositório no GitHub
2. Clique na aba **"Actions"**
3. Você verá dois workflows:
   - **Build Android APK** - Gera APK automaticamente
   - **Build iOS IPA** - Gera .ipa automaticamente

## Passo 4: Gerar os Apps

### Para Android (APK):

1. Vá para a aba **"Actions"**
2. Clique em **"Build Android APK"** na esquerda
3. Clique em **"Run workflow"** → **"Run workflow"**
4. Aguarde 5-10 minutos
5. Quando terminar, vá para **"Releases"** e baixe o `djmoveis-app.apk`

### Para iOS (.ipa):

1. Vá para a aba **"Actions"**
2. Clique em **"Build iOS IPA"** na esquerda
3. Clique em **"Run workflow"** → **"Run workflow"**
4. Aguarde 15-20 minutos (iOS leva mais tempo)
5. Quando terminar, vá para **"Releases"** e baixe o `djmoveis-app.ipa`

## Passo 5: Baixar os Apps

Após o build terminar:

1. Acesse a aba **"Releases"** do seu repositório
2. Você verá releases como:
   - `Android APK Build 1` - Contém `djmoveis-app.apk`
   - `iOS IPA Build 1` - Contém `djmoveis-app.ipa`
3. Clique em cada um para baixar

## Instalando o APK no Android

1. Transfira o arquivo `djmoveis-app.apk` para seu celular Android
2. Abra o arquivo no celular
3. Clique em "Instalar"
4. Pronto! O app está instalado

## Instalando o .ipa no iOS

Para instalar o .ipa no iPhone, você precisa de:

**Opção 1: Usar Testflight (Recomendado)**
1. Acesse https://appstoreconnect.apple.com
2. Faça login com sua conta Apple
3. Siga as instruções para fazer upload do .ipa
4. Convide testadores via email
5. Eles recebem um link para instalar via Testflight

**Opção 2: Usar Altstore**
1. Baixe Altstore em seu Mac/Windows
2. Conecte seu iPhone
3. Arraste o arquivo `.ipa` para o Altstore
4. O app será instalado no seu iPhone

**Opção 3: Usar Xcode (em um Mac)**
1. Abra Xcode
2. Vá para Window → Devices and Simulators
3. Selecione seu iPhone
4. Arraste o arquivo `.ipa` para a janela
5. O app será instalado

## Troubleshooting

### Build falha no Android
- Verifique se Java 17 está instalado
- Verifique se o arquivo `capacitor.config.ts` está correto

### Build falha no iOS
- Verifique se o arquivo `exportOptions.plist` está correto
- Verifique se o Xcode está atualizado
- Pode ser necessário configurar certificados de assinatura (veja documentação Apple)

## Próximas Atualizações

Sempre que você fazer push de mudanças para o GitHub:

```bash
git add .
git commit -m "Descrição das mudanças"
git push
```

Os workflows rodarão automaticamente e gerarão novos APK e .ipa!

## Mais Informações

- Documentação Capacitor: https://capacitorjs.com/docs
- GitHub Actions: https://docs.github.com/en/actions
- Testflight: https://developer.apple.com/testflight/
