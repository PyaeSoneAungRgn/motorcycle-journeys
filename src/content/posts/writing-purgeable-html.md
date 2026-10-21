---
title: Writing purgeable HTML
date: '2021-10-24'
description: >-
  Purge အကြောင်း မပြောခင် production CSS build လုပ်တဲ့ အကြောင်း ပြောပါမယ်။
  Production ကို build လုပ်ပြီဆိုတာနဲ့ code တွေကို ယေဘူယျအားဖြင့် spaces၊
  quotes၊ angle brackets နဲ့ အောက်ကပုံအတိုင်း အပိုင်းပိုင်း ဖြတ်ပါတယ်။
image: 'https://og.pyaesoneaung.dev/og?title=Writing purgeable HTML'
---
Purge အကြောင်း မပြောခင် production CSS build လုပ်တဲ့ အကြောင်း ပြောပါမယ်။ Production ကို build လုပ်ပြီဆိုတာနဲ့ code တွေကို ယေဘူယျအားဖြင့် spaces၊ quotes၊ angle brackets နဲ့ အောက်ကပုံအတိုင်း အပိုင်းပိုင်း ဖြတ်ပါတယ်။

![https://tailwindcss.com/docs/optimizing-for-production#writing-purgeable-html](https://cdn.hashnode.com/res/hashnode/image/upload/v1635048451254/Y0Yap9pvI.png)

Purge လုပ်တယ်ဆိုတာကတော့ code မှာမပါတဲ့ class တွေကို production မှာ ဖြုတ်ပစ်တာကို ဆိုလိုတာပါ။

အဲ့လိုဖြုတ်တဲ့အခါ ကိုယ့်ရဲ့ တကယ့် code တွေ မပါသွားဖို့ အတွက် pudgeable html ဖြစ်အောင် ရေးဖို့လိုပါတယ်။

ပိုနားလည်အောင် နမူနာနဲ့ ရှင်းပြပါမယ်။

```html
<div class="text-{{  error  ?  'red'  :  'green'  }}-600"></div>
```

အပေါ်က code အတိုင်း production build ရင် အခုလို ပိုင်းသွားမှာပါ။

![https://tailwindcss.com/docs/optimizing-for-production#writing-purgeable-html](https://cdn.hashnode.com/res/hashnode/image/upload/v1635049358681/wOCvg8qDM.png)

အပေါ်က code ကို render လုပ်ပြီး ရမယ့် class က **text-red-600** or **text-green-600** ပါ။ ၂ ခုလုံး ပိုင်းတဲ့ထဲ မှာ မပါတဲ့ အတွက် purge လုပ်ရင် ကျန်ခဲ့မှာပါ။ အဲ့ဒီတော့ production မှာ အရောင် မပြတော့ပါဘူး။
(It's work on my machine လုပ်လို့ရပါပြီ 😜)

စောန နမူနာကိုပဲ pudgeable HTML ဖြစ်အောင် ဒီလိုရေးလို့ ရပါတယ်။

```html
<div class="{{  error  ?  'text-red-600'  :  'text-green-600'  }}"></div>
```

အဲ့တာကို ပိုင်းရင်
![https://tailwindcss.com/docs/optimizing-for-production#writing-purgeable-html](https://cdn.hashnode.com/res/hashnode/image/upload/v1635049973263/KY98e6JwP.png)

ဒီလိုရမှာ ဖြစ်ပြီး purge လုပ်ရင်လည်း ကျန်ခဲ့မှာ မဟုတ်တဲ့အတွက် production မှာလည်း အဆင်ပြေသွားမှာပါ။

Ref: [https://tailwindcss.com/docs/optimizing-for-production#writing-purgeable-html](https://tailwindcss.com/docs/optimizing-for-production#writing-purgeable-html)
