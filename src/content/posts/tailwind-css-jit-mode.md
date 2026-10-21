---
title: Tailwind CSS JIT Mode
date: '2021-09-19'
description: >-
  Tailwind CSS v2.1 မှာ Just-in-Time compiler ပါဝင်လာပါတယ်။ Just-in-Time
  compiler ဆိုတာကတော့ build time မှာ ကိုယ်ရေးတဲ့ Code မှာပါတဲ့ class တွေရဲ့
  styles တွေကိုသာ generate လုပ်ပေးတာပါ။
image: 'https://og.pyaesoneaung.dev/og?title=Tailwind CSS JIT Mode'
---
Tailwind CSS v2.1 မှာ Just-in-Time compiler ပါဝင်လာပါတယ်။

Just-in-Time compiler ဆိုတာကတော့ build time မှာ ကိုယ်ရေးတဲ့ Code မှာပါတဲ့ class တွေရဲ့ styles တွေကိုသာ generate လုပ်ပေးတာပါ။

သူ့ရဲ့အားသာချက်တွေကတော့

- Build time အရမ်းမြန်ပါတယ်။

- Variant တွေ အကုန်လုံးနဲ့ အလုပ်လုပ် ပါတယ်။

- Custom CSS တွေ ရေးစရာ မလိုတော့ပါဘူး။

- Development build နဲ့ Production build ၂ခု အတူတူ ပါပဲ။

- Development မှာ browser performance ပိုကောင်းလာပါတယ်။

### Enabling JIT mode

JIT mode ကို enable လုပ်ဖို့ဆိုရင် `tailwind.config.js` file မှာ `mode` ကို `'jit'` ဆိုပြီးထားပေးရမှာပါ။

```js
// tailwind.config.js
module.exports = {
  mode: 'jit',
  purge: [
    // ...
  ],
  theme: {
    // ...
  }
  // ...
}
```

JIT mode မှာ ကျွန်တော် အကြိုက်ဆုံးကတော့ custom CSS ရေးစရာ မလိုတာပါ။

ဉပမာ width 100px ဆို Tailwind ရဲ့ default class မှာ မရှိပါဘူး။ 100px လိုချင်ရင် `tailwind.config.js` file မှာ အခုလို configure လုပ်ရပါတယ်။

```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      spacing: {
        25: '6.25rem'
      }
    }
  }
}
```

ဒါဆို `class="w-25"` ဆိုရင် 100px ရှိတဲ့ width ကိုရပါပြီ။ ဒီနေရာမှာ ဘာလို့ `25` လဲဆိုရင် tailwind css အတွက် width ကိုတွက်တဲ့ နည်းကို သုံးလိုက်လို့ပါ။ တွက်နည်းက ရှင်းပါတယ် `100/4 = 25` 25 ဆိုတာ class name အတွက်ပါ။ `25/4 = 6.25` 6.25rem ရပါတယ်။ ကိုယ်တိုင် မတွက်ချင်ရင် [Tailwind CSS Calculator](https://tailwindcss-calculator.com/) မှာတွက်လို့ရပါတယ်။ အဲ့လိုမတွက်ဘဲ ကိုယ်ဟာကိုယ်ပေးချင်တာပေးလည်းရပါတယ်။ တွက်ပြီးပေးတာက ရှိပြီးသား class တွေနဲ့ အဆင်ပြေပြီး ရေးလို့ပိုကောင်းပါတယ်။

ဒါတွေက JIT မရှိခင်က သုံးတဲ့နည်းတွေပါ။

JIT mode နဲ့ရေးမယ်ဆိုရင် `class="w-[100px]"` ဆိုရပါပြီ။ တော်တော်ကြိုက်ပါတယ်။

တခြား background color တို့ grid တို့ကိုလည်း JIT ရေးလို့ ရပါတယ်။ အသေးစိတ်ကို [ဒီမှာ](https://tailwindcss.com/docs/just-in-time-mode) ဖတ်လို့ရပါတယ်။
