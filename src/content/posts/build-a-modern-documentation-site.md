---
title: Build a Modern Documentation Site
date: '2023-08-19'
description: >-
  Laravel ရဲ့ Forge၊ Envoyer၊ Vapor၊ Jetstream နဲ့ Spark တို့လို့ modern
  documentation site တစ်ခု ဘယ်လိုတည်ဆောက်လို့ရလဲဆိုတာကို knowledge sharing
  လုပ်ချင်ပါတယ်။
image: 'https://og.pyaesoneaung.dev/og?title=Build a Modern Documentation Site'
---
ကိုယ်တိုင်က opensource package ဒါမှမဟုတ် project တစ်ခုခုကို လုပ်ထားပြီးရင် အဲ့ project ရဲ့ feature တွေ အကုန်လုံးကို လူတိုင်း အလွယ်တကူ သုံးနိုင်ဖို့ documentation ကောင်းကောင်းတစ်ခု လိုပါတယ်။ Documentation ရဲ့ UI ကလည်း ရှင်းရှင်းလင်းလင်းနဲ့ သပ်သပ်ရပ်ရပ် ဖြစ်ဖို့က အရေးကြီးပါတယ်။

ဒီနေရာမှာ ကျွန်တော့်ရဲ့ package တစ်ခုဖြစ်တဲ့ [Laravel Myanmar Tools](https://www.laravel-myanmar-tools.com) ရဲ့ documentation ကို VitePress နဲ့ ဘယ်လိုဖန်တီးထားတယ်ဆိုတာ knowledge sharing လုပ်ချင်ပါတယ်။

![build-a-modern-documentation-site-img-1](/assets/img/blog/build-a-modern-documentation-site-img-1.png)

### VitePress

VitePress ဆိုတာကတော့ static site generator တစ်ခုပါ။ အလွယ်ပြောရရင် markdown နဲ့ ရေးထားတဲ့ file တွေကို html ထုတ်ပေးတာပါ။ Documentation နဲ့ blog ရေးတဲ့နေရာမှာ အသုံးများပါတယ်။

### @hempworks/pilgrim

ဒီ package က တော့ VitePress ရဲ့ theme ပါ။ Pilgrim theme ကို Laravel ရဲ့ [Forge](https://forge.laravel.com/docs/introduction.html)၊ [Envoyer](https://docs.envoyer.io/introduction.html)၊ [Vapor](https://docs.vapor.build/introduction.html)၊ [Jetstream](https://jetstream.laravel.com/introduction.html) နဲ့ [Spark](https://spark.laravel.com/docs/introduction.html) တို့မှာ သုံးထားပါတယ်။

### vitepress-pilgrim-starter

ပုံမှန်ဆိုရင် ဆိုရင် VitePress နဲ့ project တစ်ခုအရင်လုပ်၊ TailwindCSS setup လုပ်ပြီး pilgrim theme ကိုသွင်းရပါတယ်။ ကျွန်တော်မှာလည်း documentation ရေးစရာတွေ အများကြီးရှိတာနဲ့ အဲ့ step တွေ ခနခန မလုပ်ချင်တာကြောင့် [vitepress-pilgrim-starter](https://github.com/PyaeSoneAungRgn/vitepress-pilgrim-starter) ဆိုပြီး VitePress starter project တစ်ခုလုပ်ထားပါတယ်။

### Installation

အရင်ဆုံး vitepress-pilgrim-starter ကို install လုပ်ပါမယ်။

```bash
git clone https://github.com/PyaeSoneAungRgn/vitepress-pilgrim-starter.git
cd vitepress-pilgrim-starter
npm install
npm run docs:dev
```

Project structure မှာ `src` folder နဲ့ `.vitepress/config.ts` ၂ ခုပဲ အဓိကကြည့်ပါမယ်။ `src` folder မှာတော့ သက်ဆိုင်ရာ documentation တွေကို markdown file နဲ့ ရေးပါမယ်။ `.vitepress/config.ts` မှာတော့ website ရဲ့ navigation တွေ၊ side bar တွေ၊ setting တွေ configure လုပ်ပါမယ်။

```js
import { defineConfigWithTheme } from 'vitepress'
import type { ThemeConfig } from '@hempworks/pilgrim'
import config from '@hempworks/pilgrim/config'

export default defineConfigWithTheme <
  ThemeConfig >
  {
    extends: config,
    title: 'Virepress Pilgrim Starter',
    description:
      'Documentation template styled like Forge, Envoyer, Vapor, Jetstream, and Spark',
    base: '/',
    cleanUrls: false,
    srcDir: 'src',

    themeConfig: {
      logo: {
        light: '/logo.png',
        dark: '/logo-dark.png'
      },
      nav: [{ text: 'Home', link: '/markdown-examples' }],
      sidebar: [
        {
          text: 'Examples',
          items: [
            { text: 'Markdown Examples', link: '/markdown-examples' },
            { text: 'Runtime API Examples', link: '/api-examples' }
          ]
        }
      ],
      search: {
        provider: 'local',
        options: {
          placeholder: 'Search...'
        }
      },
      githubUrl: 'https://github.com/PyaeSoneAungRgn/vitepress-pilgrim-starter'
    }
  }
```

`sidebar` section မှာတော့ ကျွန်တော်တို့ markdown နဲ့ ရေးထားတဲ့ documention တွေကို link ချိတ်ပေးရမှာပါ။ Configuration အပြည့်စုံကိုတော့ [ဒီမှာ](https://www.npmjs.com/package/@hempworks/pilgrim) ကြည့်လို့ရပါတယ်။

### Deploy

Deploy လုပ်ဖို့ အရင်ဆုံး stastic site generate လုပ်ပါမယ်။

```bash
npm run docs:build
```

ဒါဆိုရင်တော့ `.vitepress/dist` ဆိုတဲ့ folder မှာ html file တွေ generate ထုတ်သွားမှာပါ။ အဲ့ folder တစ်ခုလုံးကို ရိုးရိုး html project တစ်ခုလို ကြိုက်သလို deploy လုပ်လို့ရပါတယ်။ တခြား [Vercel](https://vercel.com/dashboard)၊ [Netlify](https://www.netlify.com) နဲ့ [Github Pages](https://pages.github.com) တို့မှာလည်း အလွယ်တကူ deploy လို့ရပါတယ်။ အသေးစိတ်ကိုတော့ [ဒီမှာ](https://vitepress.dev/guide/deploy) ကြည့်လို့ရပါတယ်။

နမူနာအနေနဲ့ [https://laravel-myanmar-tools.com](https://www.laravel-myanmar-tools.com) မှာ VitePress ကိုသုံးပြီးရေးထားပါတယ်။ Documentation ရဲ့ source code ကိုတော့ [ဒီမှာ](https://github.com/Laravel-Myanmar-Tools/docs) ကြည့်လို့ရပါတယ်။

ဒါဆိုရင်တော့ modern ducumentation site တစ်ခုကို အလွယ်တကူ ဖန်တီးလို့ ရမယ်လို့ ယုံကြည်ပါတယ်။ သိချင်တာရှိရင်လည်း မေးလို့ရပါတယ်။
