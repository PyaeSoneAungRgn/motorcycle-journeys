---
title: Handling Webhooks
date: '2022-03-13'
description: >-
  Webhooks တွေကို handle လုပ်တဲ့အခါ ကျွန်တော် အသုံးပြုတဲ့ နည်းလမ်းတွေကို
  knowledge sharing လုပ်ပေးချင်ပါတယ်။
image: 'https://og.pyaesoneaung.dev/og?title=Handling Webhooks'
---
Webhooks တွေကို handle လုပ်တဲ့အခါ ကျွန်တော် အသုံးပြုတဲ့ နည်းလမ်းတွေကို knowledge sharing လုပ်ပေးချင်ပါတယ်။

### Hash Check

ကိုယ်က MPU, WavePay စတဲ့ payment integrations တွေ လုပ်ပြီဆိုရင် မဖြစ်မနေ hash check လုပ်သင့်ပါတယ်။ Hash check ဆိုတာကတော့ payload မှာပါလာတဲ့ hash key နဲ့ ကိုယ် integration လုပ်နေတဲ့ service ရဲ့ documentation က algorithm အတိုင်း hash လုပ်ပြီး ရလာတဲ့ hash key နဲ့ တူ မတူ hash check လုပ်တာပါ။ အဲ့ဒါမှ တစ်စုံတစ်ယောက်(webhook url ကိုသိတဲ့သူ၊ documentation ကိုသိပြီးသားသူ) က payment success လိုမျိုး အရေးကြီးတဲ့ request တွေပို့ပြီး အလွဲသုံးစား လုပ်တာမျိုးကို ကာကွယ်နိုင်မှာပါ။

### Prevent Duplicate Events

Webhook တွေက တစ်ခါထဲပဲ လာခေါ်မယ်လို့ အာမ မခံ ပါဘူး။ ဉပမာ customer က bill တစ်ခါထဲ့ ဖြည့်ပေမယ့် webhook ကို event တစ်ခါထက် ပိုပြီး လာခေါ်နိုင်ပါတယ်။ အဲ့လိုလာခေါ်တိုင်း ပိုက်ဆံထည့် မပေးရအောင် ဘယ် transaction no နဲ့ ခေါ်တာကို process ပြီးပြီ နောက်တစ်ခါခေါ်ရင် skip မယ် စသည်ဖြင့် စစ်ထားဖို့လိုပါတယ်။

### Handle Super Fast Duplicate Events

ဒါကတော့ နည်းနည်းခေါင်းစား ပါတယ်။ 1 millisecond အတွင်းမှာ duplicate events တွေလာခေါ်ရင် အပေါ်ကနည်းအတိုင်း handle လုပ်ဖို့က database performance လို limit မျိုးတွေရှိတဲ့ အတွက် သုံးလို့မရပါဘူး။ အဲ့တာမျိုးဆို [Laravel Job](https://laravel.com/docs/9.x/queues) ကိုသုံးပြီး handle လုပ်ပါတယ်။ Webhook ပေါ်မူတည်ပြီး လုပ်ရမယ့် process တွေကို job အဖြစ်ပြောင်းပြီး job တွေကို တစ်ခု ပြီးမှ တစ်ခု လုပ်စေတာပါ။ တခြားသက်ဆိုင်ရာ framwork မှာလည်း Laravel Job လို feature မျိုးရှိမယ်ထင်ပါတယ်။ မရှိလည်း database (သို့) redis မှာ အရင်သိမ်းပြီး cron (သို့) supervisor တစ်ခုခု သုံးပြီး opreation system ကနေ run ရင် ရမယ်ထင်ပါတယ်။

ဒါဆိုရင်တော့ webhook တွေ handle လုပ်ရင် အဆင်ပြေမယ်လို့ မျှော်လင့်ပါတယ်။ နောက်ထပ်အကြံပေးချင်တာက တော့ request တစ်ခုလုံးကို json encode လုပ်ပြီး database မှာ ဖြစ်ဖြစ် text file မှာ ဖြစ်ဖြစ် သိမ်းထားတာက request ကိုရင် simulation လုပ်ဖို့လိုရင် အထောက်ကူ ဖြစ်မှာပါ။
