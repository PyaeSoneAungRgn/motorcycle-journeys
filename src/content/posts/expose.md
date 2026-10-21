---
title: Expose
date: '2021-11-03'
description: >-
  Expose ဆိုတာကတော့ ngrok alternative ပါပဲ။ ပြီးတော့ expose ရဲ့ UI က ngrok ထက်
  ပိုကောင်းပါတယ်။
image: 'https://og.pyaesoneaung.dev/og?title=Expose'
---
ကျွန်တော် facebook messenger chatbot ရေးတော့ ကိုယ့် localhost ကို facebook က လာခေါ်ဖို့ public url ထုတ်ပြီး share ဖို့လိုလာတယ်။ ပုံမှန်ဆို [ngrok](https://ngrok.com/) နဲ့ အဆင်ပြေပေမယ့် နောက်ပိုင်း ngrok url ကို facebook က verify လုပ်လို့ မရတာမျိုးတွေဖြစ်လာတယ်။ အဲ့တာနဲ့ ngrok လိုမျိုး တခြား app တွေရှာရင်း expose ကိုသုံးကြည့်လိုက်တာ ပိုပြီး အဆင်ပြေတာ တွေ့ရတယ်။

[Expose](https://expose.dev/) ဆိုတာကတော့ ngrok alternative ပါပဲ။ ပြီးတော့ expose ရဲ့ UI က ngrok ထက် ပိုကောင်းပါတယ်။

### Installation

[https://expose.dev](https://expose.dev) မှာ account ဖွင့်ဖို့လိုပါတယ်။
ပြီးရင် terminal ကနေ

```sh
composer global require beyondcode/expose
expose token <your expose token>
```

ဒါဆိုရင် ရပါပြီ။

### Usage

terminal ကနေ

```sh
expose share http://localhost:8000
```

run လိုက်ရင် အခုလိုရပါတယ်။

![Screen Shot 2021-11-03 at 22.21.07.png](https://cdn.hashnode.com/res/hashnode/image/upload/v1635954681096/u9vW-JHkz.png)

Dashboard URL ကို သွားလိုက်ရင်

![Screen Shot 2021-11-03 at 22.23.10.png](https://cdn.hashnode.com/res/hashnode/image/upload/v1635954855804/eCOmGKJmS.png)

Expose URL ကိုလာခေါ်တဲ့ request တွေ၊ request တစ်ခုဆီရဲ့ header, payload နဲ့ response တွေကို အသေးစိတ်ကြည့်လို့ ရပါတယ်။

Expose အကြောင်းကို [ဒီမှာ](https://expose.dev/docs/introduction) အသေးစိတ် လေ့လာလို့ရပါတယ်။
