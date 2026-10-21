---
title: PHP Package Development (Part-3)
date: '2024-02-29'
description: >-
  PHP နဲ့ Laravel Package တွေ ဖန်တီးတာကို knowledge sharing လုပ်ချင်ပါတယ်။
  ဒီအပိုင်းမှာတော့ package development အတွက် အသုံးဝင်တဲ့ tool တွေကို
  ပြောပြသွားပါမယ်။
image: 'https://og.pyaesoneaung.dev/og?title=PHP Package Development (Part-3)'
---
PHP နဲ့ Laravel Package တွေ ဖန်တီးတာကို knowledge sharing လုပ်ချင်ပါတယ်။ ဒီအပိုင်းမှာတော့ package development အတွက် အသုံးဝင်တဲ့ tool တွေကို ပြောပြသွားပါမယ်။

## Requirements

- [PHP Package Development (Part-1)](/posts/php-package-development-part-1)
- [Laravel Package Development (Part-2)](/posts/php-package-development-part-2)

## Documentation

ကျတော်အတွက် documentation က package တစ်ခုအတွက် အရေးကြီးဆုံးအပိုင်းလို့ ခံယူထားပါတယ်။ ကိုယ်ရေးတဲ့ package က ရိုးရိုးရှင်းရှင်းပဲဆိုရင် `README.md` file မှာ installation နဲ့ usage လောက်ရေးရုံနဲ့ အဆင်ပြေပါတယ်။ တကယ်လို့ ကိုယ်ရေးတဲ့ package က feature တွေအများကြီးပါတယ်ဆိုရင် static site generator တစ်ခုခုကိုသုံးပြီး ရေးသင့်ပါတယ်။

- [VitePress](https://vitepress.dev/)
- [Docsify](https://docsify.js.org/#/)
- [VuePress](https://vuepress.vuejs.org/)
- [JIGSAW](https://jigsaw.tighten.com/)

ဒါတွေကတော့ ကျတော်ကိုယ်တိုင်သုံးဖူးပြီး အဆင်ပြေတဲ့ static site generator တွေပါ။ Documentation site တစ်ခုဖန်တီးတဲ့ အကြာင်းကို [Build a Modern Documentation Site](/posts/build-a-modern-documentation-site) မှာ ကျတော် အသေးစိတ်ရေးထားပါတယ်။

## Package Skeleton

Package တစ်ခုရေးမယ်ဆိုရင် `composer init` လုပ်တာတွေ၊ `src` folder တွေ၊ `composer.json` တွေကို အစအဆုံး create လုပ်နေတာထက် package skeleton ကိုသုံးလိုက်တာက ပိုပြီး အလုပ်တွင်ပါတယ်။ Package skeleton တွေမှာက development တွေလိုအပ်တဲ့ tests တွေ၊ folder structure တွေ၊ project setup အတွက်လိုတာတွေ ပါပြီးသားဖြစ်တဲ့အတွက် business logic ကိုတန်းရေးလို့ ရပါတယ်။

- [package-skeleton-php](https://github.com/spatie/package-skeleton-php)
- [package-skeleton-laravel](https://github.com/spatie/package-skeleton-laravel)

## Laravel Package Tools

[spatie/laravel-package-tools](https://github.com/spatie/laravel-package-tools) က Laravel package ရေးတဲ့အခါမှာ migration တို့၊​ config တို့၊ view တို့ လိုအပ်ရင် ServiceProvider ကနေ အလွယ်တကူချိတ်လို့ရအောင် ဖန်တီးထားတဲ့ package တစ်ခုပါ။

## Laravel News

ကျတော်တို့ ရေးထားတဲ့ package တွေကို [Laravel News](https://laravel-news.com/) မှာ အကောင့်ဖွင့်ပြီး submit လုပ်လို့ရပါတယ်။​ သူတို့ approve ပေးလိုက်ရင် scoial platoform အမျိုးမျိုးမှာ ကိုယ့် package ကို share ပေးသွားမှာပါ။

[Made With Laravel](https://madewithlaravel.com/) မှာလည်း submit လုပ်လို့ရတယ်။

## Learning Resources

[Spatie](https://github.com/spatie) ကရေးတဲ့ package တွေရဲ့ source code တွေကို လေ့လာထားရင်ကို package development အတွက် တော်တော် များများကို သိနေမှာပါ။

[Package Development](https://laravel.com/docs/10.x/packages) - ဒါကတော့ package development အတွက် Laravel ရဲ့ official documentation ပါ။

[Strategies for making Laravel packages customizable](https://freek.dev/2442-strategies-for-making-laravel-packages-customizable) - ဒါကတော့ package တွေကို customizable ဖြစ်အောင် ဘယ်လိုရေးရမလဲဆိုတာကို ရှင်းပြထားတဲ့ article တစ်ခုပါ။
