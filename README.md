# DeskFit

Expo / React Native app in the AAA portfolio.

## Install

```bash
npm install
```

For iOS native builds, install CocoaPods dependencies:

```bash
cd ios && pod install && cd ..
```

## Local development

```bash
npx expo start
```

## Environment variables

Create a local `.env` file for secrets and API keys. **Do not commit `.env`** — it must stay local and should remain in `.gitignore`.

If a `.env.example` file exists, copy it as a starting point:

```bash
cp .env.example .env
```

## EAS builds

```bash
# iOS production
eas build --platform ios --profile production

# Android production
eas build --platform android --profile production
```

## AI / Git workflow

- Create a **feature branch** for each change (`git checkout -b feature/short-description`).
- Keep `main` deployable; merge after review.
- Never commit `.env`, keystores, `.ipa`, `.p8`, or other credentials.
