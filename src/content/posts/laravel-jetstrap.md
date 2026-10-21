---
title: Laravel Jetstrap
date: '2021-02-28'
description: >-
  Laravel Jetstream ကို Bootstrap နဲ့ တွဲသုံးမယ်။ Laravel Jetstream မှာတော့ ui
  အတွက် Tailwind Css ကို default အနေနဲ့သုံးထားပါတယ်။ Tailwind Css ဆိုတာ
  utility-first framework ဖြစ်ပြီး တော်တော်ရေးလို့ကောင်းတာမို့ tailwind ကို
  သုံးစေချင်ပါတယ်။
image: 'https://og.pyaesoneaung.dev/og?title=Laravel Jetstrap'
---
> Laravel Jetstream ကို Bootstrap နဲ့ တွဲသုံးမယ်။

Laravel Jetstream မှာတော့ ui အတွက် [Tailwind Css](https://tailwindcss.com) ကို default အနေနဲ့သုံးထားပါတယ်။ [Tailwind Css](https://tailwindcss.com) ဆိုတာ utility-first framework ဖြစ်ပြီး တော်တော်ရေးလို့ကောင်းတာမို့ tailwind ကို သုံးစေချင်ပါတယ်။

Bootstrap ရဲ့ အသင့်သုံး components တွေ၊ ရိုးရှင်းတဲ့ layouts တွေ သုံးပြီး Admin Panel တည်ဆောက်ဖို့ ကျွန်တော်အသုံးပြုတဲ့ နည်းလမ်းကို ပြောချင်ပါတယ်။

အရင်ဆုံး laravel 8 project တစ်ခု create လုပ်ပါမယ်။

```bash
composer create-project --prefer-dist laravel/laravel blog
```

Jetstream ကို install လုပ်ပါမယ်။ Jetstream မှာ livewire နဲ့ inertia.js ဆိုပြီး frontend stack နှစ်ခုရှိပါတယ်။ ကျွန်တော်ကတော့ အခုပြမယ့် နမူနာမှာ inertia ကိုပဲသုံးပါမယ်။

```bash
composer require laravel/jetstream
php artisan jetstream:install inertia
```

Jetstream မှာ bootstrap ကိုသုံးဖို့အတွက် [Jetstrap](https://github.com/nascent-africa/jetstrap) ဆိုတဲ့ package ကိုသုံးပါမယ်။

```bash
composer require nascent-africa/jetstrap --dev
```

Jetstrap ရဲ့ အလုပ်လုပ်ပုံက jetstream သွင်းကတည်းက အသင့်ပါလာတဲ့ tailwind နဲ့ရေးထားတဲ့ class တွေကို bootstrap ရဲ့ class တွေနဲ့ အစားထိုးလိုက်တာပါ။

အခု tailwind ရဲ့ class တွေကို bootstrap ရဲ့ class တွေနဲ့ အစားထိုးပါမယ်။

```bash
php artisan jetstrap:swap inertia
npm install
npm run dev
php artisan migrate
```

ဒါဆို Laravel Jetstream ကို bootstrap နဲ့သုံးလို့ရပါပြီ။

Jetstream [Documentation](https://jetstream.laravel.com/1.x/introduction.html) နဲ့ [Jetstrap Documentation](https://github.com/nascent-africa/jetstrap) မှာ ထပ်မံ လေ့လာဖို့ အကြုံပြုလိုပါတယ်။
