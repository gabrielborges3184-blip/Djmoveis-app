# Guia para Gerar APK e .ipa - DJ Móveis App

Seu projeto foi configurado com **Capacitor** para gerar aplicativos nativos para Android e iOS. Siga as instruções abaixo para gerar os arquivos APK e .ipa.

## Opção 1: Usar Apptician (Recomendado - Gratuito)

**Apptician** é um serviço online gratuito que converte projetos Capacitor em APK e .ipa.

### Passo 1: Preparar o projeto

1. Faça download do projeto completo
2. Compacte a pasta `/home/ubuntu/djmoveis-app` em um arquivo ZIP
3. Acesse https://apptician.com

### Passo 2: Fazer upload e gerar

1. Clique em "Upload Project"
2. Selecione o arquivo ZIP
3. Escolha as plataformas: Android (APK) e iOS (.ipa)
4. Clique em "Build"
5. Aguarde a conclusão (geralmente 10-20 minutos)
6. Faça download dos arquivos gerados

## Opção 2: Usar Capacitor CLI Localmente (em um Mac)

Se você tiver acesso a um Mac com Xcode:

```bash
# 1. Instale as dependências
cd djmoveis-app
npm install

# 2. Gere o APK (em qualquer máquina com Java 17+)
cd android
./gradlew assembleRelease
# O APK estará em: android/app/build/outputs/apk/release/app-release.apk

# 3. Gere o .ipa (apenas em Mac)
cd ../ios
xcodebuild -workspace App/App.xcworkspace -scheme App -configuration Release -derivedDataPath build
# O .ipa estará em: build/Release-iphoneos/App.ipa
```

## Opção 3: Usar GitHub Actions (Gratuito - Automático)

1. Faça push do projeto para um repositório GitHub
2. Crie um arquivo `.github/workflows/build.yml` com:

```yaml
name: Build Mobile Apps

on:
  push:
    branches: [main]

jobs:
  build-android:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-java@v3
        with:
          java-version: '17'
      - run: cd android && ./gradlew assembleRelease
      - uses: actions/upload-artifact@v3
        with:
          name: android-apk
          path: android/app/build/outputs/apk/release/
```

3. Os APKs serão gerados automaticamente a cada push

## Arquivos Importantes

- **capacitor.config.ts** - Configuração do Capacitor
- **eas.json** - Configuração para EAS Build (opcional)
- **android/** - Projeto Android nativo
- **ios/** - Projeto iOS nativo

## Informações do App

- **App ID**: com.djmoveis.app
- **App Name**: DJ Móveis
- **Web Directory**: dist/public

## Suporte

Para mais informações, consulte:
- Documentação Capacitor: https://capacitorjs.com/docs
- Apptician: https://apptician.com
- EAS Build: https://docs.expo.dev/build/introduction/
